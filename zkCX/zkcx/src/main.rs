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
