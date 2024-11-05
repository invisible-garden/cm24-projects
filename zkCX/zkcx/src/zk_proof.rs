//Defining strcut and proof generation
use crate::certificate::parse_certificate;
use crate::hashCert::{hash_serial_number, hash_issuer};
use crate::grothproof::{generate_proof, CertificateCircuit};
use crate::proofCache::ProofCache;

pub struct ZKProof {
    proof_cache: ProofCache,
}

impl ZKProof {
    pub fn new() -> Self {
        Self { proof_cache: ProofCache::new() }
    }

    pub fn create_and_cache_proof(&mut self, path: &str) -> Result<(), String> {
        let (serial, issuer, _) = parse_certificate(path)?;

        let hashed_serial = hash_serial_number(&serial);
        let hashed_issuer = hash_issuer(&issuer);

        let circuit = CertificateCircuit {
            hashed_serial: hashed_serial.clone(),
            hashed_issuer: hashed_issuer.clone(),
        };

        let proof = generate_proof(circuit).map_err(|e| e.to_string())?;

        let cache_key = format!("{}:{}", hashed_serial, hashed_issuer);
        self.proof_cache.insert(cache_key, proof);

        Ok(())
    }
}


/*
USAGE
```
fn main() {
    let serial_number = "123456";
    let issuer = "CA Authority";

    let zk_proof = ZKProof::new(serial_number, issuer);
    match zk_proof.generate_proof() {
        Ok(proof) => println!("Proof generated: {:?}", proof),
        Err(e) => println!("Error: {}", e),
    }
}

```
*/