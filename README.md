# Moodle Web3

Moodle Web 3 is a "key on hand" learning management system (LMS) that integrates one of the most LMS used around the world (Moodle) and web3 tools, including an Ethereum wallet where users can receive their certifications as NFTs, as well as POAPs (Proof of Attendance Protocol tokens) and other digital assets. With Push Protocol notifications, this innovative platform offers a user-friendly introduction to the web3 ecosystem, enabling educators and learners to interact with decentralized applications, manage digital assets securely, and receive real-time updates—all within an intuitive interface. By bridging traditional education with cutting-edge technology, Moodle Web 3 enhances the learning experience and prepares users for the Web3 Ecosystem.

## Team Information

**Project Members**

- Name: Alex Padilla (@padimaster)

  - Discord Username: padimasterec
  - Devfolio Username: padimasterec
  - Role: CEO

- Name: Paul Rodas

  - Github username: 0xarcano
  - Discord Username: 0xarcano
  - Devfolio Username: _arkno_
  - Role: Senior Developer / DevOps
  - Contributions: 
    - Moodle PHP plugin to integrate with Push Protocol 
      - Course event observer
        - User enrollment event
        - Course completion event
        - Quiz submission event
      - Course creation integration to trigger Push group creation
    - Docker to automatize Moodle deployment

- Name: Carlos Jimenez (@padimaster)
  - Discord Username: padimasterec
  - Devfolio Username: padimasterec
  - Role: CEO

## Technical Approach

- **Components** (Select all that apply)

  - [x] Frontend
  - [x] Backend
  - [ ] Smart Contracts
  - [ ] ZK Circuits
  - [ ] Machine Learning (ML)


### **High-Level Outline**
Moodle Web 3 merges the robust capabilities of the Moodle LMS with web3 technologies to create a decentralized, user-friendly educational platform. This architecture integrates with tools like Ethereum wallets and Push Protocol to support blockchain adoption and massification around the world.

- **Moodle Components**:
These components are part of the moodle architecture, this projects as a personalized version that integrates with the Middleware Server
  - **Moodle Server**: Manages course delivery, user engagement, and educational content within a familiar LMS framework.
  - **Moodle Database**: Stores all course, user, and event data securely, serving as the foundation for all LMS activities.

- **Middleware Web Server**:
  - **Event-Driven Middleware**: The middleware server acts as the communication bridge between Moodle and Push Protocol. It captures essential events from Moodle, such as user enrollment and course creation, and sends triggers to the middleware server.
  - **Push Protocol Integration:**: Push Protocol enhances course engagement by providing real-time notifications for updates like new content releases and assignment deadlines. Each course has a dedicated group within Push Protocol, and event-driven notifications are sent directly to students, offering a seamless introduction to blockchain-powered communications.
- **Ethereum Wallet Integration:** 
  - **Web3 Login:** Students can log in using their Ethereum wallets, providing a secure and decentralized access method that also familiarizes them with using web3 technologies.
  - **Certifications and POAPs:** Upon course completion, students receive certifications as NFTs directly to their wallets. Additionally, they can earn POAPs (Proof of Attendance Protocol tokens) and other NFTs, marking their engagement and achievements in a verifiable, blockchain-based format.

### **Advancing Blockchain Adoption with Push Protocol and Wallet Integration**
Moodle Web 3’s integration of Push Protocol and Ethereum wallets supports its mission to make blockchain accessible and drive adoption globally. The platform not only introduces blockchain tools in a real-world educational setting but also demonstrates the utility of web3 for both learners and institutions.

**Key benefits of the integration:**
- **Real-Time Course Engagement:** Push notifications keep students engaged and informed by delivering important updates directly to their devices, enhancing both accessibility and retention.
- **Secure and Decentralized Access:** Wallet-based logins provide an additional layer of security and familiarize users with using blockchain credentials in their learning journey.
- **Digital Credentials and Engagement Proof:** By receiving certificates as NFTs and POAPs in their wallets, students have verifiable proof of their learning achievements that they can showcase and use beyond the platform.

### Transforming Education with Web3
Moodle Web 3 reimagines the LMS by integrating web3 tools that make blockchain practical and accessible. By allowing students to engage with blockchain features like wallet logins, NFT certifications, and decentralized notifications, Moodle Web 3 empowers learners to experience and appreciate the potential of blockchain technology firsthand, paving the way for widespread adoption globally.


## Sponsors (if applicable)

If you are applying for a sponsor project idea or grant, select the sponsors below.

- [x] Push Protocol
- [ ] Polygon
- [ ] Chainlink
- [ ] Brevis
- [ ] Orbiter
- [ ] ZKM
- [ ] Nethermind
- [ ] PSE
- [ ] AltLayer

## What do you plan to achieve with your project?
- Moodle Web 3 aims to revolutionize educational platforms by creating a fully immersive web3 experience for both teachers and students. The goal is to develop a robust plugin and integration suite that extends the current features, allowing educators and learners to seamlessly engage with blockchain technology. This includes enhancing functionalities for decentralized identity, credentialing, and real-time, blockchain-powered notifications.

- The long-term plan is to continue refining and expanding the platform to showcase web3’s potential within education. By integrating more features and use cases, we aim to empower educational institutions to adopt blockchain technology, improving transparency, engagement, and verifiability in online learning.

- We welcome collaboration to help drive this vision forward. Support in terms of technical development, feedback on integration, or sponsorship could significantly accelerate our progress. Assistance with promoting the project or building strategic partnerships with educational institutions and blockchain organizations would also be highly valuable.

## Lessons Learned (For Submission)

- What are the most important takeaways from your project?
- Are there any patterns or best practices that you've learned that would be useful for other projects?
- Highlight reusable code patterns, key code snippets, and best practices - what are some of the ‘lego bricks’ you’ve built, and how could someone else best use them?

## Project Links (For Submission)

Please provide links to any relevant documentation, code, or other resources that you've used in your project.

## Video Demo (For Submission)

Please provide a link to a video demo of your project. The demo should be no longer than 5 minutes and should include a brief intro to your team and your project.
