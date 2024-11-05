# ZKCX Rust Implementation

## Project Structure

zkcx/
├── src/
│ ├── certificate.rs # Parses X.509 certificates
│ ├── grothproof.rs # Manages Groth16 proof generation and verification
│ ├── hashCert.rs # Hashes certificate fields (e.g., serial numbers)
│ ├── main.rs # Entry point for the application
│ ├── proofCache.rs # Caches proofs to avoid redundant computations
│ └── zk_proof.rs # ZK proof orchestration, combining hashing, proof generation, and verification
├── target/ # Compiled binaries
├── verifier_contract//
│ ├── contracts/ContractRegistry.sol # Registry Contract
│ ├── scripts/deploy.js # Script to deploy contract
│ ├── test/CertificateRegistry.js # Test Script
│ ├── ...
├── cargo.lock
├── cargo.toml
└── readme.md

## Getting Started

1. Install Rust: [https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install)
2. Clone this repository.
3. Run `cargo build` to compile the project.
4. Use `cargo run` to load certificate , parsing a certificate and generate a ZKP is work (in-progress).

# Usage

Place an X.509 certificate in DER format at the specified path and modify `main.rs` to reflect the file location.

## Output

`cargo build` :

```
Compiling zkcx v0.1.0 (/Users/dungeon/Desktop/InvGrdn/cm24-projects/zkCX/zkcx)
    Finished dev [unoptimized + debuginfo] target(s) in 0.84s
```

`cargo run`

```
Finished dev [unoptimized + debuginfo] target(s) in 0.13s
     Running `target/debug/zkcx`
Certificate successfully loaded: CertificateInner { tbs_certificate: TbsCertificateInner { version: V3, serial_number: SerialNumber { inner: Int { inner: BytesOwned { length: Length(20), inner: [34, 243, 89, 111, 95, 219, 132, 225, 71, 211, 225, 240, 131, 101, 131, 230, 37, 58, 252, 147] } }, _profile: PhantomData<x509_cert::certificate::Rfc5280> }, signature: AlgorithmIdentifier { oid: ObjectIdentifier(1.2.840.113549.1.1.11), parameters: Some(Any { tag: Tag(0x05: NULL), value: BytesOwned { length: Length(0), inner: [] } }) }, issuer: RdnSequence([RelativeDistinguishedName(SetOfVec { inner: [AttributeTypeAndValue { oid: ObjectIdentifier(2.5.4.6), value: Any { tag: Tag(0x13: PrintableString), value: BytesOwned { length: Length(2), inner: [73, 78] } } }] }), RelativeDistinguishedName(SetOfVec { inner: [AttributeTypeAndValue { oid: ObjectIdentifier(2.5.4.8), value: Any { tag: Tag(0x0c: UTF8String), value: BytesOwned { length: Length(3), inner: [66, 76, 82] } } }] }), RelativeDistinguishedName(SetOfVec { inner: [AttributeTypeAndValue { oid: ObjectIdentifier(2.5.4.7), value: Any { tag: Tag(0x0c: UTF8String), value: BytesOwned { length: Length(4), inner: [71, 77, 77, 83] } } }] }), RelativeDistinguishedName(SetOfVec { inner: [AttributeTypeAndValue { oid: ObjectIdentifier(2.5.4.10), value: Any { tag: Tag(0x0c: UTF8String), value: BytesOwned { length: Length(17), inner: [71, 77, 77, 83, 32, 76, 97, 98, 115, 32, 80, 118, 116, 32, 76, 116, 100] } } }] }), RelativeDistinguishedName(SetOfVec { inner: [AttributeTypeAndValue { oid: ObjectIdentifier(2.5.4.11), value: Any { tag: Tag(0x0c: UTF8String), value: BytesOwned { length: Length(3), inner: [82, 110, 68] } } }] }), RelativeDistinguishedName(SetOfVec { inner: [AttributeTypeAndValue { oid: ObjectIdentifier(2.5.4.3), value: Any { tag: Tag(0x0c: UTF8String), value: BytesOwned { length: Length(7), inner: [100, 117, 110, 103, 101, 111, 110] } } }] }), RelativeDistinguishedName(SetOfVec { inner: [AttributeTypeAndValue { oid: ObjectIdentifier(1.2.840.113549.1.9.1), value: Any { tag: Tag(0x16: IA5String), value: BytesOwned { length: Length(16), inner: [100, 117, 110, 103, 101, 111, 110, 64, 103, 109, 109, 115, 46, 120, 121, 122] } } }] })]), validity: Validity { not_before: UtcTime(UtcTime(DateTime { year: 2024, month: 11, day: 5, hour: 15, minutes: 37, seconds: 25, unix_duration: 1730821045s })), not_after: UtcTime(UtcTime(DateTime { year: 2025, month: 11, day: 5, hour: 15, minutes: 37, seconds: 25, unix_duration: 1762357045s })) }, subject: RdnSequence([RelativeDistinguishedName(SetOfVec { inner: [AttributeTypeAndValue { oid: ObjectIdentifier(2.5.4.6), value: Any { tag: Tag(0x13: PrintableString), value: BytesOwned { length: Length(2), inner: [73, 78] } } }] }), RelativeDistinguishedName(SetOfVec { inner: [AttributeTypeAndValue { oid: ObjectIdentifier(2.5.4.8), value: Any { tag: Tag(0x0c: UTF8String), value: BytesOwned { length: Length(3), inner: [66, 76, 82] } } }] }), RelativeDistinguishedName(SetOfVec { inner: [AttributeTypeAndValue { oid: ObjectIdentifier(2.5.4.7), value: Any { tag: Tag(0x0c: UTF8String), value: BytesOwned { length: Length(4), inner: [71, 77, 77, 83] } } }] }), RelativeDistinguishedName(SetOfVec { inner: [AttributeTypeAndValue { oid: ObjectIdentifier(2.5.4.10), value: Any { tag: Tag(0x0c: UTF8String), value: BytesOwned { length: Length(17), inner: [71, 77, 77, 83, 32, 76, 97, 98, 115, 32, 80, 118, 116, 32, 76, 116, 100] } } }] }), RelativeDistinguishedName(SetOfVec { inner: [AttributeTypeAndValue { oid: ObjectIdentifier(2.5.4.11), value: Any { tag: Tag(0x0c: UTF8String), value: BytesOwned { length: Length(3), inner: [82, 110, 68] } } }] }), RelativeDistinguishedName(SetOfVec { inner: [AttributeTypeAndValue { oid: ObjectIdentifier(2.5.4.3), value: Any { tag: Tag(0x0c: UTF8String), value: BytesOwned { length: Length(7), inner: [100, 117, 110, 103, 101, 111, 110] } } }] }), RelativeDistinguishedName(SetOfVec { inner: [AttributeTypeAndValue { oid: ObjectIdentifier(1.2.840.113549.1.9.1), value: Any { tag: Tag(0x16: IA5String), value: BytesOwned { length: Length(16), inner: [100, 117, 110, 103, 101, 111, 110, 64, 103, 109, 109, 115, 46, 120, 121, 122] } } }] })]), subject_public_key_info: SubjectPublicKeyInfo { algorithm: AlgorithmIdentifier { oid: ObjectIdentifier(1.2.840.113549.1.1.1), parameters: Some(Any { tag: Tag(0x05: NULL), value: BytesOwned { length: Length(0), inner: [] } }) }, subject_public_key: BitString { unused_bits: 0, bit_length: 2160, inner: [48, 130, 1, 10, 2, 130, 1, 1, 0, 193, 99, 142, 88, 118, 107, 97, 159, 127, 178, 164, 76, 207, 248, 136, 151, 239, 68, 222, 31, 66, 161, 237, 65, 139, 103, 101, 52, 193, 91, 114, 100, 141, 255, 119, 123, 223, 29, 200, 101, 62, 78, 133, 19, 73, 140, 243, 69, 152, 100, 24, 170, 56, 221, 87, 131, 174, 225, 138, 222, 141, 65, 255, 48, 126, 127, 162, 136, 157, 211, 223, 201, 188, 237, 123, 98, 98, 233, 54, 204, 226, 219, 51, 123, 0, 202, 121, 35, 147, 73, 60, 133, 222, 115, 28, 156, 11, 241, 226, 77, 38, 155, 14, 38, 236, 23, 114, 220, 81, 21, 247, 226, 58, 103, 132, 240, 193, 87, 98, 53, 51, 183, 100, 238, 11, 194, 6, 18, 244, 3, 129, 161, 73, 199, 223, 46, 253, 99, 63, 81, 9, 47, 76, 146, 80, 104, 229, 182, 253, 102, 232, 95, 202, 119, 22, 192, 212, 11, 228, 21, 30, 255, 143, 162, 117, 241, 70, 83, 251, 166, 26, 192, 79, 77, 149, 81, 90, 109, 72, 16, 12, 24, 168, 235, 106, 57, 191, 80, 29, 31, 59, 105, 255, 14, 23, 117, 19, 112, 174, 0, 229, 191, 196, 201, 59, 106, 82, 95, 52, 196, 186, 86, 183, 184, 70, 237, 82, 36, 167, 26, 233, 241, 147, 237, 147, 52, 26, 89, 92, 19, 186, 150, 177, 77, 26, 87, 31, 182, 161, 148, 228, 79, 217, 30, 226, 102, 251, 39, 44, 139, 188, 166, 189, 155, 10, 69, 2, 3, 1, 0, 1] } }, issuer_unique_id: None, subject_unique_id: None, extensions: Some([Extension { extn_id: ObjectIdentifier(2.5.29.14), critical: false, extn_value: OctetString { inner: [4, 20, 108, 15, 237, 38, 27, 231, 46, 227, 223, 186, 111, 205, 69, 83, 91, 170, 205, 13, 43, 234] } }, Extension { extn_id: ObjectIdentifier(2.5.29.35), critical: false, extn_value: OctetString { inner: [48, 22, 128, 20, 108, 15, 237, 38, 27, 231, 46, 227, 223, 186, 111, 205, 69, 83, 91, 170, 205, 13, 43, 234] } }, Extension { extn_id: ObjectIdentifier(2.5.29.19), critical: true, extn_value: OctetString { inner: [48, 3, 1, 1, 255] } }]) }, signature_algorithm: AlgorithmIdentifier { oid: ObjectIdentifier(1.2.840.113549.1.1.11), parameters: Some(Any { tag: Tag(0x05: NULL), value: BytesOwned { length: Length(0), inner: [] } }) }, signature: BitString { unused_bits: 0, bit_length: 2048, inner: [31, 88, 40, 134, 199, 234, 32, 223, 105, 67, 49, 35, 188, 153, 179, 255, 104, 204, 215, 1, 133, 204, 167, 199, 253, 25, 233, 131, 216, 220, 254, 186, 169, 44, 49, 50, 175, 231, 8, 202, 112, 25, 2, 161, 152, 165, 140, 107, 157, 18, 76, 171, 224, 139, 212, 23, 215, 197, 84, 44, 27, 223, 244, 211, 67, 190, 28, 179, 142, 38, 73, 94, 127, 165, 124, 127, 41, 154, 140, 35, 105, 28, 196, 243, 155, 159, 178, 212, 66, 158, 64, 194, 22, 146, 168, 71, 128, 147, 130, 250, 30, 91, 207, 47, 125, 58, 5, 16, 183, 18, 22, 93, 120, 48, 119, 17, 106, 165, 232, 3, 49, 127, 97, 3, 35, 94, 8, 232, 30, 149, 194, 197, 164, 149, 172, 83, 126, 53, 73, 151, 234, 221, 76, 159, 152, 27, 145, 97, 8, 136, 244, 54, 180, 208, 43, 5, 160, 95, 253, 153, 79, 188, 64, 159, 230, 208, 163, 217, 217, 30, 88, 207, 104, 107, 227, 97, 183, 108, 5, 247, 160, 225, 240, 16, 242, 207, 111, 105, 214, 203, 247, 136, 117, 118, 107, 239, 199, 74, 248, 155, 248, 39, 54, 20, 186, 209, 237, 180, 63, 60, 102, 87, 167, 71, 190, 252, 33, 145, 206, 110, 59, 103, 135, 124, 51, 23, 250, 56, 104, 94, 234, 111, 118, 255, 196, 206, 53, 55, 195, 129, 175, 154, 21, 100, 117, 231, 191, 144, 187, 4, 112, 152, 192, 19, 233, 249] } }
```

## Components

1. src/certificate.rs: X.509 Certificate Parsing
   This module handles reading and parsing X.509 certificates, extracting necessary fields like the serial number and issuer.

```rust
use x509_cert::{Certificate, parse_der};
use std::fs;

pub fn parse_certificate(path: &str) -> Result<(String, String, String), String> {
    let cert_der = fs::read(path).map_err(|e| e.to_string())?;
    let cert = parse_der(&cert_der).map_err(|e| e.to_string())?;

    let serial_number = cert.serial_number.to_string();
    let issuer = cert.issuer.to_string();
    let validity = format!("{} - {}", cert.validity.not_before, cert.validity.not_after);

    Ok((serial_number, issuer, validity))
}
```

2. src/grothproof.rs: Groth16 Proof Generation and Verification
   This file contains the logic for generating and verifying Groth16 zero-knowledge proofs. It defines a circuit struct and implements constraints based on hashed certificate fields.

```rust
use ark_ff::UniformRand;
use ark_bls12_381::Bls12_381;
use ark_groth16::{generate_random_parameters, create_random_proof, verify_proof, Proof, PreparedVerifyingKey};
use ark_relations::r1cs::{ConstraintSynthesizer, ConstraintSystemRef, SynthesisError};
use rand::rngs::OsRng;

pub struct CertificateCircuit {
    pub hashed_serial: String,
    pub hashed_issuer: String,
}

impl ConstraintSynthesizer<F> for CertificateCircuit {
    fn generate_constraints(self, cs: ConstraintSystemRef<F>) -> Result<(), SynthesisError> {
        // Define constraints based on hashed fields
        Ok(())
    }
}

pub fn generate_proof(circuit: CertificateCircuit) -> Result<Proof<Bls12_381>, SynthesisError> {
    let mut rng = OsRng;
    let params = generate_random_parameters::<Bls12_381, _, _>(circuit.clone(), &mut rng)?;
    let proof = create_random_proof(circuit, &params, &mut rng)?;

    Ok(proof)
}
```

3. src/hashCert.rs: Hashing Certificate Fields
   This module handles hashing sensitive fields from the X.509 certificate, like the serial number and issuer, using SHA-256.

```rust
use sha2::{Sha256, Digest};

pub fn hash_serial_number(serial_number: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(serial_number.as_bytes());
    format!("{:x}", hasher.finalize())
}

pub fn hash_issuer(issuer: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(issuer.as_bytes());
    format!("{:x}", hasher.finalize())
}
```

4. src/proofCache.rs: Proof Caching
   This module stores and retrieves cached proofs, which can save computation time by avoiding redundant proof generation.

```rust
use std::collections::HashMap;
use ark_groth16::Proof;

pub struct ProofCache {
    cache: HashMap<String, Proof<Bls12_381>>,
}

impl ProofCache {
    pub fn new() -> Self {
        Self { cache: HashMap::new() }
    }

    pub fn insert(&mut self, key: String, proof: Proof<Bls12_381>) {
        self.cache.insert(key, proof);
    }

    pub fn get(&self, key: &str) -> Option<&Proof<Bls12_381>> {
        self.cache.get(key)
    }
}
```

5. src/zk_proof.rs: ZK Proof Orchestration
   This file brings together certificate parsing, hashing, and proof generation functions. It creates a proof based on the hashed fields and caches it for reuse.

```rust
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
```

6. src/main.rs: Main Entry Point
   The main file loads certificate for now.

```rust
use std::fs;
use x509_cert::Certificate;
use x509_cert::der::Decode;

fn main() {
    let cert_path = "certificates/certificate.der";

    // Read the DER data from file
    let der_data = fs::read(cert_path).expect("Failed to read DER file");

    // Decode the DER data into a Certificate
    let certificate = Certificate::from_der(&der_data).expect("Failed to parse DER certificate");

    println!("Certificate successfully loaded: {:?}", certificate);
}
```

## Summary

- Get Certificates
- Hash the Certificate Fields: Create a concise representation of the certificate data.
- Set Up the Circuit :Design a ZKP circuit that verifies the hash.
- Generate and Verify Proofs :Use ark-groth16 to create a proof from the circuit and verify it.
- Integrate On-Chain Verifier : Serialize and submit the proof to an on-chain verifier.

## Next Steps

#### hash specific fields in the certificate.

Hashing allows you to represent the certificate’s critical data as a succinct commitment, which can then be proved without revealing the actual data, in src/hashCert.rs:

```rust
use sha2::{Sha256, Digest};
use x509_cert::Certificate;

pub fn hash_certificate(cert: &Certificate) -> Vec<u8> {
let mut hasher = Sha256::new();

    // For example, hash the issuer and subject fields.
    hasher.update(cert.tbs_certificate.issuer.to_string().as_bytes());
    hasher.update(cert.tbs_certificate.subject.to_string().as_bytes());

    // Additional fields can be added here based on what your proof requires.

    hasher.finalize().to_vec()

}
```

#### Modify your main.rs to call this function and hash the certificate:

```
let cert_hash = hash_certificate(&certificate);
println!("Certificate Hash: {:?}", cert_hash); 2. Define the ZK Circuit
```

Now, we need a circuit that verifies the knowledge of the certificate’s hash without revealing it. Using arkworks, define a circuit that takes the hashed certificate data as an input and proves the validity.

#### Circuit setup in src/zk_proof.rs:

```rust
use ark_ff::Field;
use ark_r1cs_std::alloc::AllocVar;
use ark_r1cs_std::eq::EqGadget;
use ark_relations::r1cs::{ConstraintSynthesizer, ConstraintSystemRef, SynthesisError};
use ark_crypto_primitives::prf::blake2s::constraints::OutputVar;

#[derive(Clone)]
pub struct CertHashCircuit<F: Field> {
pub cert_hash: Vec<F>, // Public input
}

impl<F: Field> ConstraintSynthesizer<F> for CertHashCircuit<F> {
fn generate_constraints(self, cs: ConstraintSystemRef<F>) -> Result<(), SynthesisError> {
let hash_var = OutputVar::new_input(cs.clone(), || Ok(self.cert_hash))?;

        // Verify that the hash matches the expected value or perform other checks.
        // Add further constraints here if needed.

        Ok(())
    }

}
```

This setup is a simple example. Depending on the complexity of the certificate data you need to prove, the circuit might require additional fields or constraints.

3. Generate the ZKP Using Groth16
   With the circuit defined, use the ark-groth16 library to generate and verify proofs.

#### Add proof generation and verification functions in src/grothproof.rs:

```rust
use ark_groth16::{ProvingKey, Proof, Groth16, PreparedVerifyingKey, VerifierKey, create_random_proof, verify_proof};
use ark_std::rand::thread_rng;
use ark_bn254::Bn254; // Example curve

pub fn generate_proof(circuit: CertHashCircuit<Bn254>) -> Result<Proof<Bn254>, SynthesisError> {
let rng = &mut thread_rng();
let (pk, vk) = Groth16::<Bn254>::circuit_specific_setup(circuit.clone(), rng)?;
let proof = create_random_proof(circuit, &pk, rng)?;

    Ok(proof)

}

pub fn verify_proof(proof: &Proof<Bn254>, vk: &PreparedVerifyingKey<Bn254>, cert_hash: &[F]) -> bool {
verify_proof(vk, proof, cert_hash).is_ok()
}
```

#### Update main.rs to call these functions:

```rust
use zk_proof::CertHashCircuit;
use grothproof::{generate_proof, verify_proof};

// Hash the certificate and create the circuit.
let cert_hash_field = cert_hash.iter().map(|&b| Bn254::from(b as u64)).collect();
let circuit = CertHashCircuit { cert_hash: cert_hash_field };

// Generate the proof
let proof = generate_proof(circuit).expect("Failed to generate proof");

// Verification example (you would likely want to load or derive the vk from a trusted source)
let vk = ... // Load or define the verification key
let is_valid = verify_proof(&proof, &vk, &cert_hash_field);
println!("Proof is valid: {}", is_valid);
```

4. On-Chain Verifier
   If your verifier contract is on-chain, serialize the proof in a format (like JSON or a byte array) that your smart contract can parse. Then, submit it to the smart contract’s verify function.
