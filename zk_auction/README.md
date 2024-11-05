# Zk Auction

**Zk Auction** is a [**Sealed-Bid Auction**](https://www.investopedia.com/terms/s/sealed-bid-auction.asp) platform designed to facilitate secure and private auctions. By leveraging **zero-knowledge proofs (ZKPs)**, the platform identifies the highest bidder without revealing individual bid amounts, ensuring both privacy and fairness in the bidding process.
Furthermore, this project serves as a **reference model** for developers interested in building decentralized applications (dApps) using **SP1** or **Plonky3**.

## Team Information

**Project Members**

- Name: Steve Nguyen
    - Discord Username: zk_steve
    - Devfolio Username: steve_zk
    - Github Username: zk-steve
    - Role: Leader

- Name: Vanhger Pham
    - Discord Username: vanhg
    - Devfolio Username: vanhger
    - Github Username: VanhGer
    - Role: Dev

- Name: Draply Do
    - Discord Username: draply
    - Devfolio Username: draply
    - Github Username: Draply
    - Role: Researcher

- Name: Andrew Tran
    - Discord Username: Andrew Tran
    - Devfolio Username: Andrew Tran
    - Github Username: andrew2003
    - Role: Dev

- Name: Duoc Bui
    - Discord Username: hduoc2003
    - Devfolio Username: hduoc2003
    - Github Username: hduoc2003
    - Role: Dev

- Name: Hai(Ægir) Trieu
    - Discord Username: 0x5ea000000
    - Devfolio Username: 0x5ea000000
    - Gihub Username: 0x5ea000000
    - Role: Reseacher

## Technical Approach

- **Components** (Select all that apply)
    - [ ] Frontend
    - [x] Backend
    - [x] Smart Contracts
    - [x] ZK Circuits
    - [ ] Machine Learning (ML)

- **Core idea**: Bidders submit encrypted bids to a smart contract, which only the auction owner can decrypt using their secret key. At the conclusion of the auction, the owner publishes the winner. **ZKPs** ensure that the auction owner reads all bids and selects the highest one without revealing their private key or any bid details.

- **Key components of the project include**:
    - **Proving Service**: Powered by **SP1**, this service generates a **zero-knowledge proof** from the execution trace of a program that decrypts bids and computes the winner, while preserving the confidentiality of each bid amount.
    - A simplified version of the **Proving Service** has also been developed, using **Plonky3** directly.
    - **Smart Contract**: The smart contract verifies the ZK proof and manages the entire auction lifecycle, including setup, bidding, and settlement.

- **Technology Stack:**
    - **Smart Contract**: Solidity
    - **Circuit**: Rust, SP1, Plonky3
    - **Encryption scheme**: secp256k1, AES-256-GCM, HKDF-SHA256
    - **Verifier**: Aligned layer

## Sponsors (if applicable)

- [ ] Push Protocol
- [x] Polygon
- [ ] Chainlink
- [ ] Brevis
- [ ] Orbiter
- [ ] ZKM
- [ ] Nethermind
- [ ] PSE
- [ ] AltLayer

## What do you plan to achieve with your project?

Our primary goal is to complete **ZkAuction** as soon as possible. After that, we plan to improve its performance, with a specific focus on speeding up the proof generation process. Generating the proof for the decryption process is currently our main bottleneck, as it is relatively slow. To address this, we are seeking guidance from mentors who understand **SP1**'s inner workings to help optimize this aspect.

## Lessons Learned (For Submission)

Our project brings an effective approach to using **SP1** and **Plonky 3** for generating proofs of execution for Rust program. It also serves as a valuable reference model fordevelopers interested in building dApps with **SP1** and **Plonky3**.

Through this project, we learned how to generate execution traces and define the AIR (Algebraic Intermediate Representation) constraints, which are used to generate STARK proofs. This knowledge has been incredibly useful, as we now understand how to design circuits suitable for the STARK proof system. This understanding enables us to develop circuits for a variety of other projects with different business requirements.

In the **Plonky3** version of our project, we aimed to improve code readability when working with arbitrary elements in each row. Rather than referencing elements by their index (e.g., `local[3]`, `local[17]`), which can make code difficult to follow, we converted each row into a struct with descriptive column names. For example, instead of remembering that the first byte of an address is at position `34` or the final value is at position `30`, we can reference `local.final_value` or `local.address_bytes[0]`. This makes the code clearer and easier to maintain.
To achieve this, we implemented the `Borrow` trait on our struct, allowing for seamless conversion. We established a pattern for this with the following code:

```rust
impl<T> Borrow<BidCols<T>> for [T] {  
    fn borrow(&self) -> &BidCols<T> {  
        debug_assert_eq!(self.len(), NUM_BID_COLS);  
        let (prefix, shorts, suffix) = unsafe { self.align_to::<BidCols<T>>() };  
        debug_assert!(prefix.is_empty(), "Alignment should match");  
        debug_assert!(suffix.is_empty(), "Alignment should match");  
        debug_assert_eq!(shorts.len(), 1);  
        &shorts[0]  
    }  
}
```

This code can be reused by anyone, with minor modifications to the struct name and number of columns. Within the AIR constraints function, developers can convert a row into a struct as follows:

```rust
let a = main.row_slice(0);
let local: &BidCols<AB::Var> = (*a).borrow();
```

This approach not only simplifies our project but also serves as a reusable pattern for other applications requiring structured access to row elements.

## Project Links (For Submission)

- ZkAuction (use SP1): https://github.com/sota-zk-labs/tahm-kench
- ZkAuction (use Plonky 3): https://github.com/sota-zk-labs/silent-bid

## Video Demo (For Submission)

Here is our demo: https://drive.google.com/file/d/1AOkczkHPqGUtaeFfBGTimFDcWW60d8CP/view?usp=sharing

