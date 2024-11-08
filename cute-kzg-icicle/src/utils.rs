//! Polynomial arithmetic utilities for KZG operations

use std::error::Error;
use icicle_bn254::curve::ScalarField as Fr;
use icicle_core::vec_ops::VecOpsConfig;
use icicle_runtime::memory::HostSlice;
use crate::setup::GPUContext;

/// Add two polynomials
pub fn add(p1: &[Fr], p2: &[Fr]) -> Vec<Fr> {
    let mut result = vec![Fr::zero(); std::cmp::max(p1.len(), p2.len())];

    for (i, &coeff) in p1.iter().enumerate() {
        result[i] += coeff;
    }
    for (i, &coeff) in p2.iter().enumerate() {
        result[i] += coeff;
    }

    result
}

/// Multiply polynomials with GPU acceleration where beneficial
pub fn mul(p1: &[Fr], p2: &[Fr], gpu_ctx: &GPUContext) -> Result<Vec<Fr>, Box<dyn Error>> {
    let mut result = vec![Fr::zero(); p1.len() + p2.len() - 1];
    
    // Configure GPU operations
    let mut cfg = VecOpsConfig::default();
    cfg.stream_handle = *gpu_ctx.stream;

    // For smaller polynomials, do direct multiplication
    if p1.len() < 64 || p2.len() < 64 {
        for (i, &coeff1) in p1.iter().enumerate() {
            for (j, &coeff2) in p2.iter().enumerate() {
                result[i + j] += coeff1 * coeff2;
            }
        }
    } else {
        // For larger polynomials, use GPU operations
        // This is a placeholder - you would implement proper GPU polynomial multiplication here
        // using Icicle's primitives
        unimplemented!("GPU polynomial multiplication not implemented");
    }

    Ok(result)
}

/// Polynomial division
pub fn div(p1: &[Fr], p2: &[Fr]) -> Result<Vec<Fr>, Box<dyn Error>> {
    if p2.is_empty() || p2.iter().all(|&x| x == Fr::zero()) {
        return Err("Cannot divide by zero polynomial".into());
    }

    if p1.len() < p2.len() {
        return Ok(vec![Fr::zero()]);
    }

    let mut quotient = vec![Fr::zero(); p1.len() - p2.len() + 1];
    let mut remainder: Vec<Fr> = p1.to_vec();

    while remainder.len() >= p2.len() {
        let coeff = *remainder.last().unwrap() / *p2.last().unwrap();
        let pos = remainder.len() - p2.len();

        quotient[pos] = coeff;

        for (i, &factor) in p2.iter().enumerate() {
            remainder[pos + i] -= factor * coeff;
        }

        while let Some(true) = remainder.last().map(|x| *x == Fr::zero()) {
            remainder.pop();
        }
    }

    Ok(quotient)
}

pub fn evaluate(poly: &[Fr], point: Fr, gpu_ctx: &GPUContext) -> Result<Fr, Box<dyn Error>> {
    let mut cfg = VecOpsConfig::default();
    cfg.stream_handle = *gpu_ctx.stream;

    let mut result = Fr::zero();
    let mut power = Fr::one();

    for coeff in poly {
        result += *coeff * power;
        power *= point;
    }

    Ok(result)
}

pub fn interpolate(
    points: &[Fr], 
    values: &[Fr],
    gpu_ctx: &GPUContext
) -> Result<Vec<Fr>, Box<dyn Error>> {
    if points.len() != values.len() {
        return Err("Number of points and values must match".into());
    }

    let mut result = vec![Fr::zero(); points.len()];

    for i in 0..points.len() {
        let mut numerator = vec![Fr::one()];
        let mut denominator = Fr::one();

        for j in 0..points.len() {
            if i == j {
                continue;
            }

            numerator = mul(&numerator, &[-points[j], Fr::one()], gpu_ctx)?;
            denominator *= points[i] - points[j];
        }

        let denominator_inv = denominator.inverse().ok_or("Division by zero in interpolation")?;
        let term: Vec<Fr> = numerator.iter()
            .map(|&x| x * values[i] * denominator_inv)
            .collect();

        result = add(&result, &term);
    }

    Ok(result)
}

/// Get n-th root of unity for the field
pub fn get_omega(coefficients: &[Fr]) -> Fr {
    // Implementation needed - for now returning placeholder
    Fr::one()
}

/// Scalar multiplication of polynomial
pub fn scalar_mul(poly: &[Fr], scalar: Fr) -> Vec<Fr> {
    poly.iter().map(|coeff| *coeff * scalar).collect()
}

#[cfg(test)]
mod tests {
    use super::*;
    use icicle_core::traits::GenerateRandom;

    #[test]
    fn test_polynomial_arithmetic() -> Result<(), Box<dyn Error>> {
        let gpu_ctx = GPUContext::new("/path/to/backend.so", 0)?;

        // Test polynomial addition
        let p1 = vec![Fr::from(1u64), Fr::from(2u64)]; // 1 + 2x
        let p2 = vec![Fr::from(3u64), Fr::from(4u64)]; // 3 + 4x
        let sum = add(&p1, &p2);
        assert_eq!(sum[0], Fr::from(4u64)); // 1 + 3
        assert_eq!(sum[1], Fr::from(6u64)); // 2 + 4

        // Test polynomial multiplication
        let prod = mul(&p1, &p2, &gpu_ctx)?;
        assert_eq!(prod[0], Fr::from(3u64));  // 1 * 3
        assert_eq!(prod[1], Fr::from(10u64)); // 1 * 4 + 2 * 3
        assert_eq!(prod[2], Fr::from(8u64));  // 2 * 4

        Ok(())
    }
}
