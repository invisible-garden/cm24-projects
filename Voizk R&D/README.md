# Voizk R&D

zk-Biometric Authentication using Voiceprint, an alternative to the not-private biometric authentication methods to analyze voice using zkML and generate a voiceprint for private authentication.

## Team Information

**Project Members**

- Name: Daniel Arroyo
  - Discord Username: daniel0ar
  - Devfolio Username: daniel0ar
  - Github Username: daniel0ar
  - Role: Business Use Case Research, Technical Writer

- Name: Nathalia Barreiros
  - Discord Username: nathbarreiros
  - Devfolio Username: nathbarreiros
  - Github Username: NathaliaBarreiros
  - Role: ML Research (Voice Pre-processing and Speaker Recognition models with EZKL integration)

- Name: Ruchida Pithaksiripan
  - Discord Username: Fai
  - Devfolio Username: Fai
  - Github Username: Fai
  - Role: ML Research (Voice Activity Detection models with EZKL integration)

- Name: Ivan Anishchuk
  - Discord Username: ivananishchuk
  - Devfolio Username: ivananishchuk
  - Github Username: ivananishchuk
  - Role: Architecture Design, Technical Writing

## Technical Approach

### **Components** (Select all that apply)
  - [ ] Frontend
  - [ ] Backend
  - [ ] Smart Contracts
  - [x] ZK Circuits
  - [x] Machine Learning (ML)

### High-level outline of the main technical components, tech you used and approaches used in the project.

1. Our first approach was including four components plus a couple side cars:

![First approach diagram](https://github.com/Privacy-Lab-Latam-Builders/voizk-ML/blob/docs/outline/img/firstapproach.jpg?raw=true)

1) Pre-processing of the raw data with feature extraction 
2) Two ML models to actually consume the pre-processed data and provide meaningful prediction
3) Post-processing with additional checks giving the final answer yes/no to the question "is the user authenticated?"

Turns out ZKVMs are still limited. We cannot process a large input there, most libraries cannot be compiled. Essentially the only thing we can run from the world of Rust is simple processing of short enough input strings plus simple computations (it can hash, it can verify proofs, it can operate on strings and numbers to some extent, but processig sound data for cleaning and extraction, even if there are libraries and algorithms, it's just hard to implement from scratch and overhead would be huge even then).

LSTM or RNN model that can consume such cleaned and condensed input can work but requires training on a large enough data set (not as good for a few-shots prediction on just a couple samples users typically provide for authentication purposes) and we cannot use pre-trained models good with few-shots prediction within ZKML frameworks like EZKL.

The first wall is hit on ZKVMs: If we cannot verify pre-processing we already cannot provide anything end-to-end verified.

2. Pretrained inference and proof

![Second approach diagram](https://github.com/Privacy-Lab-Latam-Builders/voizk-ML/blob/docs/outline/img/secondapproach.jpg?raw=true)

After our first approach failed we tried to find ML tools to process raw sound. There are networks trained on VoxCeleb dataset which could be used in our fun example, also some speech-to-text models. In our second approach we though of building a system with three main components:
1) A model for identifying the speaker (RawNet3)
2) A model for recognizing the words spoken (PENDING_MODEL)
3) The protocols for generating the proofs of computation on each of the outputs (EZKL for the ZKML framework, ZKM for a ZKVM).

We tried several of them just to see how inference works and what outputs will be there and the wall we hit was also close: EZKL and underlying tract doesn't suport tensor sequence operations and none of those models dealing with sound can be circuitized. The search for a weird workaround gave us nothing good.

Every piece of the diagram works as expected in a local execution environment, but does not work in a ZKVM or using a ZKML framework.

We building a system with three main components:
1. ML model for identifying the speaker (RawNet3)
2. ML model for recognizing the words spoken (Wave2Vec2)
3. The protocols for generating the proofs of computation on each of the outputs (EZKL for the ZKML framework, ZKM for a ZKVM).

## Sponsors (if applicable)

If you are applying for a sponsor project idea or grant, select the sponsors below.

- [ ] Push Protocol
- [ ] Polygon
- [ ] Chainlink
- [ ] Brevis
- [ ] Orbiter
- [ ] ZKM
- [x] Nethermind
- [x] PSE
- [ ] AltLayer

## What do you plan to achieve with your project?

- What is the plan for this project from now on? 

We aim to develop a privacy-preserving, zk-biometric authentication system using voiceprints to authenticate users securely without compromising biometric data. This involves refining our ML models for speaker identification and voice recognition, implementing proof generation, and optimizing for ZK compatibility.

- Do you plan to continue to work on it? 

Continuation: Yes, we plan to continue iterating on the system, particularly focusing on overcoming limitations in ZKML frameworks and ZKVM integration.

- Do you want some help? 

We welcome support, especially in integrating ML models into ZK environments and handling tensor sequence operations in circuitized formats.

- How could we help you?

Guidance on optimized ZK-compatible architectures, model adaptation within EZKL, and potential collaborations on datasets suitable for voice-based authentication.

## Lessons Learned (For Submission)
 
- What are the most important takeaways from your project?

We learned that current ZKVMs and ZKML frameworks have significant limitations when handling complex ML models and sequence data like voice. Overcoming these constraints requires creative architecture design and possibly custom ZK operations.

- Are there any patterns or best practices that you've learned that would be useful for other projects?

Ensuring clear modularization in our code allowed easier testing and swapping of models for voice pre-processing, speaker recognition, and proof generation, which facilitated experimentation in different ZK environments.

- Highlight reusable code patterns, key code snippets, and best practices - what are some of the ‘lego bricks’ you’ve built, and how could someone else best use them?

Key components include our model integration scripts for RawNet3 and Wave2Vec2, plus proof-generation protocols using EZKL. These elements are modularized to enable others to experiment with ZK-ML integrations in similar use cases.

## Project Links (For Submission)

Please provide links for the project repo and to any relevant documentation, code, or other resources that you've used in your project.

Our Repository
- https://github.com/Privacy-Lab-Latam-Builders/voizk-ML

Tools & Frameworks
- https://ezkl.xyz/
- https://librosa.org/doc/latest/index.html
- https://github.com/wiseman/py-webrtcvad

Models
- https://huggingface.co/pyannote/voice-activity-detection
- https://huggingface.co/openai/whisper-tiny
- https://github.com/snakers4/silero-vad
- https://huggingface.co/facebook/wav2vec2-base-960h

## Video Demo (For Submission)

Please provide a link to a video demo of your project. The demo should be no longer than 5 minutes.
