use std::error::Error;
use std::ops::Mul;

use icicle_bn254::curve::{
    G1Affine, G1Projective,
    G2Projective, G2Affine,
    ScalarField as Fr
};

use icicle_runtime::memory::{DeviceVec, HostSlice};
use icicle_core::vec_ops::VecOpsConfig;

use crate::utils::{div, mul, evaluate, interpolate};
use crate::setup::GPUContext;

pub struct KZG {
    pub g1: G1Projective,
    pub g2: G2Projective,
    pub g2_tau: G2Projective,
    pub degree: usize,
    pub crs_g1: Vec<G1Projective>,
    pub crs_g2: Vec<G2Projective>,
    gpu_ctx: GPUContext,
}

impl KZG {
    pub fn new(
        g1: G1Projective,
        g2: G2Projective,
        degree: usize,
        backend_path: &str,
        device_id: i32
    ) -> Result<Self, Box<dyn Error>> {
        Ok(Self {
            g1,
            g2,
            g2_tau: g2.mul(Fr::zero()),
            degree,
            crs_g1: Vec::with_capacity(degree + 1),
            crs_g2: Vec::with_capacity(degree + 1),
            gpu_ctx: GPUContext::new(backend_path, device_id)?,
        })
    }

    pub fn setup(&mut self, secret: Fr) -> Result<(), Box<dyn Error>> {
        let mut cfg = VecOpsConfig::default();
        cfg.stream_handle = *self.gpu_ctx.stream();

        self.crs_g1.push(self.g1);
        let mut current = self.g1;
        
        for i in 1..=self.degree {
            let power = secret.pow(&[i as u64]);
            current = current.mul(power);
            self.crs_g1.push(current);
        }

        self.crs_g2.push(self.g2);
        let mut current = self.g2;
        
        for i in 1..=self.degree {
            let power = secret.pow(&[i as u64]);
            current = current.mul(power);
            self.crs_g2.push(current);
        }

        self.g2_tau = self.g2.mul(secret);
        self.gpu_ctx.stream().synchronize()?;
        
        Ok(())
    }

    pub fn commit(&self, poly: &[Fr]) -> Result<G1Projective, Box<dyn Error>> {
        if poly.len() > self.degree + 1 {
            return Err("Polynomial degree too high".into());
        }

        // Compute commitment using GPU for large polynomials
        let mut cfg = VecOpsConfig::default();
        cfg.stream_handle = *self.gpu_ctx.stream();

        let mut commitment = G1Projective::zero();
        
        // Process in batches for better GPU utilization
        const BATCH_SIZE: usize = 128;
        for chunk in poly.chunks(BATCH_SIZE) {
            let n = chunk.len();
            let mut result = DeviceVec::<G1Projective>::device_malloc(n)?;
            
            for i in 0..n {
                result[i] = self.crs_g1[i].mul(chunk[i]);
            }
            
            let mut host_result = vec![G1Projective::zero(); n];
            result.copy_to_host(HostSlice::from_mut_slice(&mut host_result))?;
            
            for point in host_result {
                commitment += point;
            }
        }

        self.gpu_ctx.stream().synchronize()?;
        Ok(commitment)
    }

    /// Generate proof for evaluation at a point
    pub fn open(&self, poly: &[Fr], point: Fr) -> Result<(G1Projective, Fr), Box<dyn Error>> {
        // Evaluate polynomial at point
        let value = evaluate(poly, point, &self.gpu_ctx)?;

        // Compute quotient polynomial q(x) = (p(x) - y)/(x - z)
        let denominator = vec![-point, Fr::one()];
        let mut temp = poly.to_vec();
        temp[0] -= value;
        let quotient = div(&temp, &denominator)?;

        // Create proof by committing to quotient
        let mut pi = self.g1.mul(Fr::zero());
        for i in 0..quotient.len() {
            pi += self.crs_g1[i].mul(quotient[i]);
        }

        Ok((pi, value))
    }

    pub fn verify(
        &self,
        point: Fr,
        value: Fr,
        commitment: G1Projective,
        proof: G1Projective
    ) -> bool {
        let lhs = icicle_bn254::pairing::pairing(
            &G1Affine::from(proof),
            &G2Affine::from(self.g2_tau - self.g2.mul(point))
        );
        let rhs = icicle_bn254::pairing::pairing(
            &G1Affine::from(commitment - self.g1.mul(value)),
            &G2Affine::from(self.g2)
        );
        lhs == rhs
    }

    pub fn multi_open(
        &self,
        poly: &[Fr],
        points: &[Fr]
    ) -> Result<G1Projective, Box<dyn Error>> {
        let mut zero_poly = vec![-points[0], Fr::one()];
        for i in 1..points.len() {
            zero_poly = mul(&zero_poly, &[-points[i], Fr::one()], &self.gpu_ctx)?;
        }

        let mut values = Vec::new();
        for point in points {
            values.push(evaluate(poly, *point, &self.gpu_ctx)?);
        }

        let mut lagrange_poly = interpolate(points, &values, &self.gpu_ctx)?;
        lagrange_poly.resize(poly.len(), Fr::zero());

        let mut numerator = Vec::with_capacity(poly.len());
        for (coeff1, coeff2) in poly.iter().zip(lagrange_poly.iter()) {
            numerator.push(*coeff1 - *coeff2);
        }

        let quotient = div(&numerator, &zero_poly)?;

        let mut pi = self.g1.mul(Fr::zero());
        for i in 0..quotient.len() {
            pi += self.crs_g1[i].mul(quotient[i]);
        }

        Ok(pi)
    }

    pub fn verify_multi(
        &self,
        points: &[Fr],
        values: &[Fr],
        commitment: G1Projective,
        proof: G1Projective
    ) -> Result<bool, Box<dyn Error>> {
        let mut zero_poly = vec![-points[0], Fr::one()];
        for i in 1..points.len() {
            zero_poly = mul(&zero_poly, &[-points[i], Fr::one()], &self.gpu_ctx)?;
        }

        let mut zero_commitment = self.g2.mul(Fr::zero());
        for i in 0..zero_poly.len() {
            zero_commitment += self.crs_g2[i].mul(zero_poly[i]);
        }

        let lagrange_poly = interpolate(points, values, &self.gpu_ctx)?;

        let mut lagrange_commitment = self.g1.mul(Fr::zero());
        for i in 0..lagrange_poly.len() {
            lagrange_commitment += self.crs_g1[i].mul(lagrange_poly[i]);
        }

        // Verify proof via pairing
        let lhs = icicle_bn254::pairing::pairing(
            &G1Affine::from(proof), 
            &G2Affine::from(zero_commitment)
        );
        let rhs = icicle_bn254::pairing::pairing(
            &G1Affine::from(commitment - lagrange_commitment),
            &G2Affine::from(self.g2)
        );

        Ok(lhs == rhs)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use icicle_core::traits::GenerateRandom;

    const GPU_BACKEND_PATH: &str = ""; // path to backend
    const GPU_DEVICE_ID: i32 = 0;

    #[test]
    fn test_kzg_basic_operations() -> Result<(), Box<dyn Error>> {
        let mut kzg = KZG::new(
            G1Projective::generator(),
            G2Projective::generator(),
            8,  // degree
            GPU_BACKEND_PATH,
            GPU_DEVICE_ID
        )?;

        let tau = Fr::generate_random(1)[0];
        kzg.setup(tau)?;

        // Create test polynomial: p(x) = 1 + 2x + 3x² + 4x³
        let poly = vec![
            Fr::from(1u64),
            Fr::from(2u64),
            Fr::from(3u64),
            Fr::from(4u64),
        ];

        let commitment = kzg.commit(&poly)?;

        let point = Fr::from(2u64);
        let (proof, value) = kzg.open(&poly, point)?;
        assert!(kzg.verify(point, value, commitment, proof));

        let points = vec![Fr::from(2u64), Fr::from(3u64)];
        let proof = kzg.multi_open(&poly, &points)?;
        let values = vec![
            evaluate(&poly, points[0], &kzg.gpu_ctx)?,
            evaluate(&poly, points[1], &kzg.gpu_ctx)?
        ];
        assert!(kzg.verify_multi(&points, &values, commitment, proof)?);

        Ok(())
    
}
