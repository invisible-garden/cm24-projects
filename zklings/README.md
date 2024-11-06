# zklings

**zklings** is a repository aims to educate developers about implementation around zero-knowledge proofs via dozen of small exercises. This repository is forked from Rust's [rustlings](https://github.com/rust-lang/rustlings).

Currently, we have included exercises in various topics in zero-knowledge proof implementation e.g. circom circuit, inner product arguments, finite fields, commitment schemes. We also improved circuit exercises checking workflow in order to make learner understands implementation flow of it too.

## Team Information

**Project Members**

- Name: Yuttakhan Baingen
  - Discord Username: b.bbbb
  - Devfolio Username: bierbbbb
  - Github Username: badgooooor
  - Role: Contributor

- Name: John Kaller
  - Discord Username: ownerofjk
  - Devfolio Username: ownerofjk
  - Github Username: OwnerOfJK
  - Role: Contributor

- Name: Qinghao Huang
  - Discord Username: perturbation_theory
  - Devfolio Username: wfnuser
  - Github Username: wfnuser
  - Role: Contributor

- Name: Alok Kumar
  - Discord Username: surfer_05
  - Devfolio Username: surfer_05
  - Github Username: surfer05
  - Role: Contributor

- Name: Harold Lee
  - Discord Username: haroldgin931
  - Devfolio Username: HaroldGin931
  - Github Username: HaroldGin931
  - Role: Contributor

- Name: Kenil Shah
  - Discord Username: kenilshahh
  - Devfolio Username: kenilshahh
  - Github Username: KENILSHAHH
  - Role: Contributor

## Technical Approach

- **Components** (Select all that apply)
  - [ ] Frontend
  - [ ] Backend
  - [ ] Smart Contracts
  - [x] ZK Circuits
  - [ ] Machine Learning (ML)
- Use Rust for implementing terminal GUI, controlling exercises and exercise checking process
- For exercises, we have exercises that use these languages/libraries:
  - Rust
  - circom
  - Plonky3
- Use commands from snarkjs for compiling, generating proof and verifying for checking circuit-related exercises

## Sponsors (if applicable)

If you are applying for a sponsor project idea or grant, select the sponsors below.

- [ ] Push Protocol
- [x] Polygon
- [ ] Chainlink
- [ ] Brevis
- [ ] Orbiter
- [ ] ZKM
- [x] Nethermind
- [ ] PSE
- [ ] AltLayer

## What do you plan to achieve with your project?

We would like for zklings to become the go to repository for anyone that intends to practically learn about ZKPs that is contributor-driven and open source. Moving forward we aim to:
Continuously add and curate more exercises to keep up with the latest development in the field of ZKPs, that include (but not exclusive to):
- Explore on designing exercises with other toolchain e.g. [plonky3](https://github.com/Plonky3/Plonky3)
- Improving user experience on exercises e.g. making CLI flow automatic running more usable, showing progress on checking (or test if some exercises requires)
- Explore on designing exercises with other toolchain e.g. [plonky3](https://github.com/Plonky3/Plonky3)

## Lessons Learned (For Submission)

**Exercises design**
- In general, We learned more on theory in order to design a good exercises
- Debugging protocols is challenging; it’s essential to print intermediate variables and use assertions to ensure the protocol behaves as expected.
- Learned different hash fields that we can use in plonky3 and make our own proof, created an example using mersenne31 hash field, along with keccak256. [(Reference)](https://github.com/rutefig/zklings/pull/11)

**Prove generation/verification process in exercise**
- Code patterns on checking circuit-related exercise, the pattern is actually able to adjust parameters e.g. power of tau in order to serve exercises that requires larger ceremony. Also good as base for exercise that use different implementation. [(Reference)](https://github.com/rutefig/zklings/blob/58971f54e113bc20dd1239dc5e47f6004cfe510a/src/exercise.rs)
- Learned on adjusting parameters used for proving circuit for right context. Current exercise circuits are more of smaller ones so using less power e.g. `9` to `10` which is good enough, this also benefits on feedback loop of exercise since proving process will be much faster. (currently it takes est. 10s compared to documentation which takes est. 40s.).
- The implementation in repository is lagged from forked repository and some functionality are not working e.g. watching files. We tried to update codebase on that part to catch up main repository and researched more on improving it.

## Project Links (For Submission)

Code repository : https://github.com/rutefig/zklings

## Video Demo (For Submission)

Youtube video : https://youtu.be/xNhUFourpII
