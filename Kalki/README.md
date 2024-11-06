# Kalki

We present a new framework, called a key lattice, for managing keys in concurrent group messaging.
Our framework can be seen as a “key management” layer that enables concurrent group messaging
when secure pairwise channels are available. Security of group messaging protocols defined using the
key lattice incorporates both FS and PCS simply and naturally. Our framework combines both FS
and PCS into directional variants of the same abstraction, and additionally avoids dependence on
time-based epochs.

## Team Information

**Project Members**

- Name: Alok Kumar
  - Discord Username: surfer_05
  - Devfolio Username: surfer05
  - Github Username: surfer05
  - Role: Builder

## Technical Approach

- **Components** (Select all that apply)
  - [ ] Frontend
  - [✅] Backend
  - [ ] Smart Contracts
  - [ ] ZK Circuits
  - [ ] Machine Learning (ML)

- I mainly used Python and a lot of cryptographic libraries for building the implementation of the Lattice framework and Randomised architecture of the messaging protocol.

## Sponsors (if applicable)

If you are applying for a sponsor project idea or grant, select the sponsors below.

- [ ] Push Protocol
- [ ] Polygon
- [ ] Chainlink
- [ ] Brevis
- [ ] Orbiter
- [ ] ZKM
- [✅] Nethermind
- [✅] PSE
- [ ] AltLayer

## What do you plan to achieve with your project?

My future plan is to write a more optimized implementation so that the framework can handle any number of people who want to initiate the messaging. Apart from that, I have to add the functionality for dynamic addition and removal of participants from that group, so the process is seamless. My ultimate goal is to submit this implementation to the IETF team, and make it a standard that people can use for group messaging.

## Lessons Learned (For Submission)

- I learned a lot about how the cryptography involved in messaging works, I deep dived into lattice-based cryptography, and it was a great learning experience.
- The best practices learned are mainly the implementation techniques that we used in python. My whole project is on python, there are a lot of cryptography libraries that I have used as well.
- The project has four main components, including Utils, Keylattice, Participant, and a main file for running the simulation.

## Project Links (For Submission)

https://github.com/surfer05/standard-group-messaging

## Video Demo (For Submission)

https://youtu.be/tE6CJhQrWf0