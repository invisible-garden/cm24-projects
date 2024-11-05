//reads a DER-formatted X.509 certificate file and extracts the serial number, issuer, and validity fields.
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

/*
USAGE
```
fn main() {
    match parse_x509_certificate("path/to/certificate.der") {
        Ok((serial, issuer, validity)) => {
            println!("Serial: {}", serial);
            println!("Issuer: {}", issuer);
            println!("Validity: {}", validity);
        }
        Err(e) => println!("Error: {}", e),
    }
}

```
*/
