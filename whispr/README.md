# Whispr - Web3 Audio Call

Whispr is a Web3 audio streaming platform that enables secure, end-to-end encrypted voice communication, built with Next.js and WebRTC. It ensures privacy and decentralization using a node (mesh) network between peers. Only relying for centralized parties for establishing the initialization of the peers, after which calls are fully peer-to-peer and protected. Whispr empowers users to communicate confidently in a trustless environment, making it a pioneering solution outside of traditional centralized platforms.

## Team Information

**Project Members**

- Name: Anderson Lottermann Thome
  - Discord Username: andersonlthome
  - Devfolio Username: andersonlthome
  - Github Username: andersonlthome
  - Role: Full Stack Developer

- Name: Guilherme Heilmann Costa Neves
  - Discord Username: 0xneves
  - Devfolio Username: 0xneves
  - Github Username: 0xneves
  - Role: Full Stack Developer

## Technical Approach

- **Components** (Select all that apply)
  - [x] Frontend
  - [x] Backend
  - [ ] Smart Contracts
  - [ ] ZK Circuits
  - [ ] Machine Learning (ML)

Next.js was used for the frontend, and WebRTC for the audio streaming.

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
- [x] Vitalik

## What do you plan to achieve with your project?

- Enhance the UI/UX. Allow users to point to their own signaling server. Show call stability, data and network information. Keep it simple, server-less and decentralized. Create our own signaling server.

## Lessons Learned (For Submission)

- We tried to re-create the wheel at first but realized that WebRTC is already the most used tool for audio and video streaming, validated by the most powerful tech companies in the world. 
- The signaling server is very hard to decentralize and cannot be used with ZKP because we actually need to share the entire data between the peers (like a connection url) instead of prooving it. The most secure signaling server would use assymetrical encryption to share the connection url (signal) between the peers, being only decryptable by the peers on their own devices.

## Project Links (For Submission)

- [Project Repository](https://github.com/ZKPhone/whispr)
- [Vitalik's Tweet](https://x.com/VitalikButerin/status/1841754432154874142)

## Video Demo (For Submission)

- Will make it available soon...
