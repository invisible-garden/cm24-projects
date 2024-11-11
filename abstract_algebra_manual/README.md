# Abstract Algebra Manual

To understand algebraic structures in cryptography, knowledge of abstract algebra is essential. However, its mathematical language can be challenging for developers. At its core, abstract algebra uses abstract thinking to analyze and classify properties of mathematical objects, which becomes much simpler once this perspective is clear. Leveraging Rust's traits and generics, we can define these algebraic interfaces, using the compiler and tests to create an *introductory book on abstract algebra from a Rust perspective*.

## Team Information

**Project Members**

- Name: Harold
  - Discord Username: haroldlee
  - Devfolio Username: haroldlee
  - Github Username: haroldgin931
  - Role: Dev

## Technical Approach

- **Components** (Select all that apply)
  - [ ] Frontend
  - [x] Backend
  - [ ] Smart Contracts
  - [ ] ZK Circuits
  - [ ] Machine Learning (ML)

- No technical components, just pure native rust and abstract algebra axioms.

## Sponsors (if applicable)

If you are applying for a sponsor project idea or grant, select the sponsors below.

- [ ] Push Protocol
- [x] Polygon
- [ ] Chainlink
- [ ] Brevis
- [ ] Orbiter
- [ ] ZKM
- [ ] Nethermind
- [x] PSE
- [ ] AltLayer

## What do you plan to achieve with your project?

### Project Plan and Future Work

This project is still far from completion; we have only finished some basic group structures. In the future, I plan to implement additional operations related to algebra, rings, and fields. My goal is to complete the [entire roadmap](https://github.com/HaroldGin931/abstract_algebra_manual?tab=readme-ov-file#roadmap) by May 2025.

### About Assistance

One important aspect is to increase the project's visibility. This is crucial for serving more users and receiving valuable feedback from the community and developers, as there are likely many areas that need improvement or better implementations. Additionally, I intend to create introductory videos on abstract algebra based on this library.

## Lessons Learned (For Submission)

### key challenge Define target audience

the target audience differs from that of traditional cryptography libraries.

In traditional cryptographic libraries, the operations defined are derived and proven to satisfy the relevant algebraic structure axioms. These libraries primarily focus on implementing these operations/algorithms in code and optimizing them as much as possible.

However, the goal of this project is to provide a set of traits related to algebraic structures, along with instances implemented based on these traits. It also offers exercises for users to try implementing some simple algebraic structures.

### Trait-Based Abstraction

Defining algebraic structures as traits (e.g., Group, Monoid, Ring) promotes extensibility and reusability. This allows other developers to implement these structures with minimal overhead, focusing on specific properties while ensuring compliance with abstract algebra rules.

### lego bricks

https://github.com/HaroldGin931/abstract_algebra_manual/tree/dev/src/modules

For example, you can integrated it into ZKlings, to make more abstract algebra exercise

## Project Links (For Submission)

Repo: https://github.com/HaroldGin931/abstract_algebra_manual/tree/main

## Video Demo (For Submission)

Video: https://drive.google.com/file/d/1Fbtqz8PxI_S04eOF0y2fyvdMoBtLLq0s/view?usp=sharing

