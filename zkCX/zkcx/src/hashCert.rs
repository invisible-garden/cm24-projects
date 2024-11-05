//hashing the serial number of the certificate using SHA-256, which can then be included in the ZKP circuit or proof data.
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
