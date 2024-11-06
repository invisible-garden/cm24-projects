# PrivacyVisa

PrivacyVisa is a secure payment solution that utilizes zero-knowledge proofs (ZKPs) to protect cardholder privacy. By enabling transactions without exposing sensitive information such as card numbers and CVV codes, PrivacyVisa ensures that merchants can process payments without accessing or storing critical cardholder details. This innovative approach minimizes fraud risk and enhances privacy, offering a safer alternative for secure transactions.

## Team Information

**Project Members**

- Name: ployhold
  - Discord Username: ployhold
  - Devfolio Username: ________
  - Github Username: lunafangg
  - Role: Dev

- Name: Kriz
  - Discord Username: Kriz
  - Devfolio Username: Kriz
  - Github Username: KritzHeng
  - Role: Dev

- Name: wtchaidev
  - Discord Username: WTCHAI
  - Devfolio Username: WTCHAI
  - Github Username: WTCHAI
  - Role: Dev

- Name: kongphop
  - Discord Username: JFKongphop
  - Devfolio Username: JFKongphop
  - Github Username: JFKongphop
  - Role: Dev


## Technical Approach

- **Components** (Select all that apply)
  - [X] Frontend
  - [X] Backend
  - [ ] Smart Contracts
  - [X] ZK Circuits
  - [ ] Machine Learning (ML)

- High-level outline of the main technical components, tech you used and approaches used in the project.

## Sponsors (if applicable)

If you are applying for a sponsor project idea or grant, select the sponsors below.

- [ ] Push Protocol
- [ ] Polygon
- [ ] Chainlink
- [ ] Brevis
- [ ] Orbiter
- [ ] ZKM
- [ ] Nethermind
- [ ] PSE
- [ ] AltLayer

## What do you plan to achieve with your project?
### Project Goals
PrivacyVisa aims to protect cardholders’ data by allowing secure payments without exposing sensitive information like card numbers or CVVs. By using Zero-Knowledge Proofs (ZKPs), PrivacyVisa verifies transactions safely and reduces fraud risk.
we plan to continue developing PrivacyVisa, focusing on:
### Future Plans
we plan to continue developing PrivacyVisa, focusing on:

PrivacyVisa Wallet to store data securely.
On-Chain Verifier for transparent, decentralized payment checks.
zkVM Support for more complex, scalable transactions.
Trusted Setup-Free Proofs using RISC0 to increase flexibility.
Help with optimizing the on-chain verifier or zkVM integration would be beneficial.

## Lessons Learned (For Submission)

* Privacy-First Payments: PrivacyVisa shows how ZKPs can keep card details safe and private.
* Trust-Minimized Architecture: The project emphasizes keeping sensitive data within user control, preventing unauthorized merchant access, which is valuable for high-security applications.
Reusable Code Patterns and Best Practices

Some reusable components include:

* ZKP Circuit Design (Circom & SnarkJS): The setup and verification circuits can be adapted for other financial applications where ZKPs can secure sensitive data. This pattern of "public inputs without disclosing sensitive information" could apply broadly to other identity and financial systems.
* Nonce-Based Verification Mechanism: Using nonces for each transaction enhances security against replay attacks. This pattern could be used in various financial or verification applications.
* Hash-Based Proof Generation: Generating proofs through hash combinations ensures data integrity while preventing data leakage. This approach can benefit projects involving sensitive data verification.
* Layered Proof Generation & Validation: The project’s approach of layering different hash combinations to validate transactions securely can be repurposed in identity and credential verification contexts.

## Project Links (For Submission)

Github Link: https://github.com/PrivacyVisa/PrivacyVisa-POC

## Video Demo (For Submission)

Youtube: https://www.youtube.com/watch?v=5u7ukwcUM7s

