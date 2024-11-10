# LuckyStar

Decentralized, transparent, and secure raffle game.
Proof of Rewards by Zero Knowledge

## Team Information

**Project Members**

- Name: Somboon Lim 
  - Discord Username: @protae2024
  - Devfolio Username: @protae
  - Role: Dev

## Technical Approach

- **Components** (Select all that apply)
  - [ ] Frontend
  - [ ] Backend
  - [X] Smart Contracts
  - [X] ZK Circuits
  - [ ] Machine Learning (ML)

- High-level outline of the main technical components, tech you used and approaches used in the project.

## Sponsors (if applicable)


## What do you plan to achieve with your project?
Objective:
The main goal of the LuckyStar is to create a transparent, decentralized raffle game that leverages blockchain and Zero Knowledge (ZK) Proofs to ensure fair, tamper-proof prize distribution. We aim to provide a secure, knowing that the prize status is verifiable but also private.

v1 is a version written as a smart contract raffles game that lacks security. Users can hack into the data to see which stars have which prizes, allowing them to cheat on buying raffles tickets.

v2zk is a circom circuit that hides the prize information, so no one can peek at the prize before buying the ticket.

Future Plans:
The next steps involve:
Optimizing ZK Proofs: Continuing to refine the efficiency and security of our ZK Proofs using frameworks like Circom and SnarkJS.
Testing and Security: Conducting thorough security audits and user testing to ensure robustness and usability.
Technical ZK: Optimizing ZK Proofs for scalability and gas efficiency.
User Interface Design: UI/UX design to create a user-friendly game interface.
Others: PUSH protocol, Chainlink (VRF)

## Lessons Learned (For Submission)
Key Takeaways:
Value of Transparency: Blockchain and ZK Proofs provide a robust framework for fair and verifiable games.
Efficiency Challenges in ZK Proofs: ZK Proofs add a layer of security but can be computationally heavy. 
Push Protocol Benefits: Real-time notifications (using Push Protocol) enhance user experience by keeping players updated on rewards and game status without compromising the game’s security.

Patterns and Best Practices:
Use of ZK Proofs: The use of Zero Knowledge Proofs to verify prize status without revealing details is applicable to any scenario where privacy and verification are essential.
Event-Driven Architecture: Using events to log key actions (such as a star being picked) allows for easy integration with external notification services and makes it easier to analyze in-game activity.

This project has shown how critical it is to balance transparency with user privacy in blockchain-based games. The key insights and code snippets from Lucky Star can serve as valuable building blocks for other decentralized projects focused on secure, trustless, and verifiable interactions.

## Project Links (For Submission)

https://github.com/0xta/LuckyStar

## Video Demo (For Submission)

Presentation file : https://docs.google.com/presentation/d/1yMi3bQBC-7uJmQL4BD5GX3hc_P6R5XCM