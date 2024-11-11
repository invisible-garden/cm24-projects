# Proof of Invisible

## Overview
Proof of Invisible is an automated attendance verification system, initially developed for the Invisible Garden project with potential applications for other events. The system addresses the following  scenario:

Verifying user attendance and workload (as Invisible Garden needs)

Our solution implements a proof system that cryptographically verifies three core elements:
- User identity
- Timestamp
- Location data

This creates an immutable record proving that a specific user was present at a particular location and time.

For detailed technical specifications and architectural decisions, please refer to our [technical documentation](./proof-of-invisible.pdf).

## Team Information
**Project Members**

- Name: shanshan
  - Discord Username: shanshan33
  - Devfolio Username: shanshan33
  - Github Username: fengshanshan
  - Role: developer

- Name: BILLSTA
  - Discord Username: BILLSTA
  - Devfolio Username: BILLSTA
  - Role: initiator (project idea, but got sick left from the invisible garden)
  
- Name: Yiko
  - Discord Username: Yiko
  - Devfolio Username: Yiko
  - Github Username: Yiko
  - Role: developer
  
## Technical Approach

- **Components** (Select all that apply)
  - [ ] Frontend
  - [x] Backend
  - [x] Smart Contracts
  - [x] ZK Circuits
  -[ ] Machine Learning (ML)


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
We already finish the zk-circuit and the whole process (proof generation and verification).
For the following, we plan to:
- implement with the real NFC device (right now we use the NFC simulator)
- optimize the zk-circuit and proof generation process (let it be faster and smaller and running on mobile devices)
- build an amazing frontend to let the user easy to use

## Lessons Learned
- What are the most important takeaways from your project?
The most important thing is we build up a real-world application of zk technology and already received some feedback from the people who are interested in the project and potential users.The project addresses the real-world needs.

- Are there any patterns or best practices that you've learned that would be useful for other projects?
We still try to find the best way to implement the zk-circuit and optimize the proof generation process. Right now we use the circom2 and snarkjs, but we also find some other teams work like [cursive.team](https://www.cursive.team/) may help us to complete the following plans we mentioned above.

- Highlight reusable code patterns, key code snippets, and best practices - what are some of the ‘lego bricks’ you’ve built, and how could someone else best use them?

## Project Links (For Submission)

Github repository: https://github.com/fengshanshan/proof-of-attendance
all things include:
code
- backend
- smart contracts
- zk circuits
usage


## Video Demo (For Submission)
https://www.loom.com/share/9202935487964b1d8819332fd9bf92ff?sid=9bc6c5d2-e0d7-4bfe-a159-bed29d7e2373

