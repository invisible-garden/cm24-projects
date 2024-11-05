//stores and retrieves cached proofs, which can save computation time by avoiding redundant proof generation.
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
