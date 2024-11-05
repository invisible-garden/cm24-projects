# Moodle Web3

**Moodle Web3** is a "key on hand" learning management system (LMS) that seamlessly integrates Moodle, one of the most widely used LMS platforms, with cutting-edge web3 tools. This includes an Ethereum wallet where users can receive certifications as NFTs, POAPs (Proof of Attendance Protocol tokens), and other digital assets. Utilizing Push Protocol notifications, Moodle Web3 offers an intuitive introduction to the web3 ecosystem, empowering educators and learners to interact with decentralized applications, manage digital assets securely, and stay informed with real-time updates. This platform bridges traditional education with web3 technology, enriching the learning experience and preparing users for the decentralized web.

![Project Logo](./assets/imagen.jpg)

---

## 📋 Table of Contents
- [Moodle Web3](#moodle-web3)
  - [📋 Table of Contents](#-table-of-contents)
  - [👥 Team Information](#-team-information)
    - [Project Members](#project-members)
  - [🛠 Technical Approach](#-technical-approach)
    - [Components](#components)
  - [🗺 High-Level Outline](#-high-level-outline)
    - [Moodle Components](#moodle-components)
    - [Middleware Web Server](#middleware-web-server)
    - [Middleware Web Server](#middleware-web-server-1)
    - [Ethereum Wallet Integration](#ethereum-wallet-integration)
  - [🌐 Web3 Integration Benefits](#-web3-integration-benefits)
  - [🌟 Transforming Education with Web3](#-transforming-education-with-web3)
  - [🏆 Sponsors](#-sponsors)
  - [🎯 Project Goals](#-project-goals)
  - [📚 Lessons Learned](#-lessons-learned)
    - [Key Takeaways:](#key-takeaways)
  - [🔗 Project Links](#-project-links)
  - [🎥 Video Demo](#-video-demo)

---

## 👥 Team Information

### Project Members
- **Name:** Alex Padilla (@padimaster)
  - **Discord:** [padimaster](https://github.com/padimaster)
  - **Discord:** padimasterec
  - **Devfolio:** padimasterec
  - **Role:** Project Lead / Fullstack Developer
  - **Contributions**
    - **API Middleware**: Developed API to connect Moodle with Push Protocol for automated, event-based notifications (e.g., user enrollments, course completions).
    - **Smart Contract Factory**: Created contracts to issue NFT certifications directly to students' Ethereum wallets.
    - **Push Protocol Integration**: Set up automatic group creation and event-driven notifications for each course.
    - **Scalable Server Configuration**: Configured a Docker-based setup for seamless deployment.

- **Name:** Paul Rodas
  - **GitHub:** [0xarcano](https://github.com/0xarcano)
  - **Discord:** 0xarcano
  - **Devfolio:** _arkno_
  - **Role:** Senior Developer / DevOps
  - **Contributions:**
    - Developed Moodle PHP plugin integrating with Push Protocol:
      - Course event observer for user enrollment, course completion, and quiz submission
      - Automated group creation for courses using Push Protocol
    - Created Docker configuration for Moodle deployment automation

- **Name:** Carlos Jimenez
  - **GitHub:** [cijimenez](https://github.com/cijimenez)
  - **Discord:** carlos_israelj
  - **Devfolio:** carlos_israelj
  - **Role:** Developer
  - **Contributions:**
    - Integrated Moodle with MetaMask:
      - Login functionality using MetaMask
      - User creation with wallet connection to Moodle's MariaDB database

---

## 🛠 Technical Approach

### Components
- **Frontend:** ✅
- **Backend:** ✅
- **Smart Contracts:** ✅
- **ZK Circuits:** ❌
- **Machine Learning (ML):** ❌

---

## 🗺 High-Level Outline

**Moodle Web3** combines the strengths of Moodle LMS with blockchain technology to build a user-friendly, decentralized educational platform. This includes integration with Ethereum wallets and Push Protocol to facilitate global blockchain adoption.

### Moodle Components
- **Moodle Server**: Facilitates course management and user engagement.
- **Moodle Database**: Stores user, course, and event data securely.

### Middleware Web Server
- **Event-Driven Middleware**: Bridges Moodle and Push Protocol, capturing and triggering events such as course enrollments and completions.
- **Push Protocol Integration**: Delivers real-time notifications for new content, assignment deadlines, and other updates, engaging students with blockchain-enabled communication.
### Middleware Web Server
- **Event-Driven Middleware**: Acts as a bridge between Moodle and Push Protocol, capturing key events like course enrollments and completions and triggering notifications accordingly.
- **Push Protocol Integration**: Sends real-time notifications for content updates, assignment deadlines, and other important alerts, keeping students engaged through blockchain-enabled communication.
- **Custom ERC721 Certification System**: Implements a Smart Contract Factory that generates a unique ERC721 contract for each course. This allows verified students to receive a custom NFT certification upon course completion, creating a verifiable, blockchain-secured record of their achievements. Each certificate is unique, securely stored on the blockchain, and accessible in the students' Ethereum wallets, showcasing their accomplishments in a tamper-proof, digital format.


### Ethereum Wallet Integration
- **Web3 Login**: Secure login using Ethereum wallets.
- **Certifications and POAPs**: Course completions rewarded with NFT certifications and POAPs directly in student wallets.



---

## 🌐 Web3 Integration Benefits

**Moodle Web3**’s integration with Push Protocol and Ethereum wallets supports blockchain adoption through real-world educational use cases.

**Key Benefits:**
- **Enhanced Course Engagement**: Real-time notifications improve accessibility and retention.
- **Secure, Decentralized Access**: Wallet-based logins offer additional security and introduce blockchain credentials.
- **Verifiable Digital Credentials**: Students receive certificates as NFTs and POAPs, showcasing their achievements beyond the platform.

---

## 🌟 Transforming Education with Web3

**Moodle Web3** revolutionizes the LMS landscape by integrating web3 functionalities like wallet logins, NFT-based certifications, and decentralized notifications. This platform empowers students to explore and understand blockchain technology, fostering broader adoption.

---

## 🏆 Sponsors

If applicable, select the sponsors involved in supporting the project.

- [x] Push Protocol
- [X] PSE

---

## 🎯 Project Goals

- Develop a comprehensive plugin and integration suite to connect educators and learners with blockchain tools.
- Expand functionalities to support decentralized identity and credentialing.
- Enable real-time notifications using blockchain technology for a modernized learning experience.

**Long-Term Vision:**
Refine and expand the platform to showcase the potential of web3 in education, encouraging adoption by educational institutions for enhanced transparency and verifiability.

**Collaborative Opportunities:**
Support through technical development, feedback, or sponsorship is welcomed to accelerate progress and build partnerships.

---

## 📚 Lessons Learned

### Key Takeaways:
- **Patterns and Best Practices**: Include reusable code patterns and best practices for other projects.
- **Notable Code Snippets**: Share examples and insights to help others leverage these 'lego bricks' in their projects.

---

## 🔗 Project Links

Provide links to:
- [Moodle Web3 Repository](https://github.com/Privacy-Lab-Latam-Builders/moodle-web3)
- [Source Code - Certifications Smart Contract](https://github.com/padimaster/certifications-smart-contract)
- [Source Code - Middleware Webserver and DB](https://github.com/padimaster/moodle-web3)
- [Docker Image - Middleware Webserver and DB](https://hub.docker.com/repository/docker/padimaster/moodle-push/general)

---

## 🎥 Video Demo

Include a link to a brief demo video (maximum 5 minutes) showcasing your team and project.
