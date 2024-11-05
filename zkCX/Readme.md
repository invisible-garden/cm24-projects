# zkCX : Zero Knowledge Certificate Exchange in Remote SIM Provisioning(RSP) , an eSIM Protocol

>
>zkCX is an approach to remove the chain of trust from RSP,
>In the design of [OpenRSP](https://github.com/Blockchain-Powered-eSIM/OpenRSP)
>Introducing zero knowledge proofs for authentication by proving certificates to issuer who is also verifier.
>
---

## Team Information
Project Members

#### Name: {ARPIT KUMAR}
- Discord Username: {dungeon_master4227}
- Devfolio Username: {DungeoN}
- Github Username: {ArpitxGit}
- Role: {Developer}


#### Name: {Manul Singh Parihar}
- Discord Username: {jeremy_connor}
- Devfolio Username: {jeremy_connor}
- Github Username: {ManulParihar}
- Role: {Developer}

#### Name: `TANMAY GOEL`
- Discord Username: `guyphy`
- Devfolio Username: [`GuyPhy`](https://devfolio.co/@GuyPhy)
- Github Username: [`GuyPhy`](https://github.com/GuyPhy)
- Role: `Developer`
---

## Technical Approach
Components (Select all that apply)
- Backend
- Smart Contract
- ZK Circuits
---

## High-level outline of the main technical components, tech you used and approaches used in the project.

### Project Overview

The project focuses on enhancing the security and privacy of eSIM management in Remote SIM Provisioning (RSP) systems by implementing a zero-knowledge proof (ZKP) framework for the verification of X.509 certificates. This approach aims to establish a robust chain of trust while ensuring that sensitive certificate information remains confidential.

#### 1. Technical Components

##### a. Certificate Handling
- **X.509 Certificate Parsing**: Utilizes the `x509-cert` library to parse and manage X.509 certificates, which are essential for establishing a chain of trust in digital communications. Certificates validate the identity of entities involved in RSP.
- **Chain of Trust**: Implements a structure where each certificate in the chain validates the identity of its issuer, ultimately leading back to a trusted root authority.

##### b. eSIM and Remote SIM Provisioning (RSP)
- **eSIM Management**: The project touches the trust management of embedded SIMs (eSIMs) used in modern devices, which require secure provisioning and identity verification.
- **RSP Architecture**: Focuses on the framework that allows eSIM profiles to be remotely downloaded and managed securely. The integration of ZKP into RSP enhances the security of certificate verification during eSIM provisioning.

##### c. Cryptographic Operations
- **Hashing**: Uses the `sha2` library to hash certificate fields. This hashed representation serves as a commitment in the ZKP framework, which enables proof generation without revealing the certificate's sensitive data.

##### d. Zero-Knowledge Proof System
- **Groth16 Proof System**: Leverages the `ark-groth16` library from the Arkworks suite to implement a Groth16 ZKP for generating and verifying proofs related to certificate validity.
- **Field Arithmetic**: Utilizes `ark-ff` and `ark-bn254` for finite field operations necessary for ZKP computations, especially those involving elliptic curves.

##### e. Circuit Definition and Proof Generation
- **Custom Circuit Design**: Defines a circuit (`CertHashCircuit`) that verifies the hash of the X.509 certificate, ensuring that it adheres to the necessary conditions for trust within the RSP framework.
- **Proof Generation**: Implements functions to create ZKP proofs that validate the knowledge of the certificate hash without revealing the hash itself, thus maintaining confidentiality.

##### f. On-Chain Verification
- **Smart Contracts**: Integration with smart contracts to store and verify ZKP proofs on-chain, which enhances transparency and establishes a tamper-proof verification process.

#### 2. Technologies Used
- **Rust**: The project is implemented in Rust, providing safety, concurrency, and performance advantages.
- **Arkworks**: A comprehensive suite for ZKP development that includes libraries for proof systems and cryptographic primitives.
- **SHA-2**: A cryptographic hashing algorithm used to create hashes of certificate data.
- **X.509 Standard**: Compliance with the X.509 standard for digital certificates ensures interoperability and security in certificate management.
- **eSIM and RSP Standards**: Incorporates standards related to eSIM technology and remote provisioning processes to ensure compatibility with industry practices.

#### 3. Approaches Used

##### a. Decentralization of Trust
- The project aims to eliminate reliance on centralized authorities (e.g., GSMA CI) for certificate verification. Using ZKP allows entities to independently verify the validity of certificates in the eSIM provisioning process.

##### b. Privacy-Preserving Techniques
- ZKP enables entities to authenticate the validity of certificates without revealing sensitive information, thereby protecting user privacy and maintaining confidentiality in the RSP ecosystem.

##### c. Establishing a Chain of Trust
- The project reinforces the chain of trust within the RSP by ensuring that each entity can prove its compliance with the trust requirements of the system without exposing the underlying certificate data.

##### d. Modular Design
- The application is structured into modular components (e.g., certificate handling, proof generation, eSIM management), facilitating easier maintenance and extensibility.

##### e. Extensibility
- The design allows for future enhancements, such as more complex circuit definitions, integration with additional cryptographic techniques, and expanding the verification mechanisms for eSIM profiles.

#### 4. Potential Future Directions
- **Enhanced Circuit Complexity**: Future development may include more complex circuits to verify additional properties of X.509 certificates or eSIM profiles.
- **Integration with Smart Contracts**: Expanding the on-chain verification component to include smart contracts will further enhance trust and transparency in the RSP process.
- **User Interface Development**: Building a user-friendly interface for managing eSIM profiles, certificates, and interactions with the ZKP system may improve usability and adoption.

#### Summary
This high-level outline captures the key technical components, technologies, and approaches utilized in your project that integrates zero-knowledge proofs with eSIM management and Remote SIM Provisioning. The focus on decentralization, privacy, and establishing a robust chain of trust positions this project as a significant advancement in secure digital certificate management within modern telecommunications.
---

# Sponsors (if applicable)
If you are applying for a sponsor project idea or grant, select the sponsors below.

#### PSE

## What do you plan to achieve with your project?
- What is the plan for this project from now on?
  > This project is the first work on OpenRSP specifically for removing or improving the chain of trust in Remote SIM Provisioning Protocol.
- Do you plan to continue to work on it?
  > Yes, we'll contniue working on it.
- Do you want some help? How could we help you?
  > We need guidance in improving the codebase, experts for guidance and development to succesfully achieve trustlessness in RSP.

## Lessons Learned (For Submission)
What are the most important takeaways from your project?

## Are there any patterns or best practices that you've learned that would be useful for other projects?
Highlight reusable code patterns, key code snippets, and best practices - what are some of the ‘lego bricks’ you’ve built, and how could someone else best use them?
> Every piece of code is broken down in good manner with right guidance as lego bricks, easy to use by anyone.

## Project Links (For Submission)
Please provide links for the project repo and to any relevant documentation, code, or other resources that you've used in your project.
> [zkCX](https://github.com/GMMS-Labs/cm24-projects/tree/main/zkCX)
> [openRSP](https://github.com/Blockchain-Powered-eSIM/OpenRSP/commits/main/?since=2024-09-30&until=2024-11-05)

## Video Demo (For Submission)
Please provide a link to a video demo of your project. The demo should be no longer than 5 minutes.
