# Moodle Web3
Moodle Web3 is a ready-to-deploy learning management system (LMS) that seamlessly combines Moodle, one of the world’s most popular LMS platforms, with innovative web3 tools. This integration allows users to experience decentralized applications, manage digital assets securely, and stay informed through real-time notifications. Key features include an Ethereum wallet, enabling users to receive certifications as NFTs, POAPs (Proof of Attendance Protocol tokens), and other digital assets. Through Push Protocol notifications, Moodle Web3 enhances learning, bridging traditional education with the decentralized web to prepare users for the next generation of the internet.

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
    - [Ethereum Wallet Integration](#ethereum-wallet-integration)
  - [🌐 Web3 Integration Benefits](#-web3-integration-benefits)
    - [Key Benefits:](#key-benefits)
  - [🌟 Transforming Education with Web3](#-transforming-education-with-web3)
  - [🏆 Sponsors](#-sponsors)
  - [🎯 Project Goals](#-project-goals)
  - [📚 Lessons Learned](#-lessons-learned)
  - [🔗 Project Links](#-project-links)
  - [🎥 Video Demo](#-video-demo)

## 👥 Team Information
### Project Members
**Name:** Alex Padilla (@padimaster)  
**GitHub:** [padimaster](https://github.com/padimaster)  
**Discord:** padimasterec  
**Role:** Project Lead / Fullstack Developer  
**Contributions:**
- Developed the API Middleware to connect Moodle with Push Protocol for event-based notifications (e.g., user enrollments, course completions).
- Created Smart Contract Factory to issue NFT certifications directly to students' Ethereum wallets.
- Integrated Push Protocol with automated group creation and real-time notifications per course.
- Configured a scalable Docker-based server for deployment.

**Name:** Paul Rodas  
**GitHub:** [0xarcano](https://github.com/0xarcano)  
**Discord:** 0xarcano  
**Role:** Senior Developer / DevOps  
**Contributions:**
- Developed a Moodle PHP plugin for Push Protocol, enabling event-driven notifications for actions like course enrollments, completions, and quiz submissions.
- Set up Docker configurations for streamlined Moodle deployment.

**Name:** Carlos Jimenez  
**GitHub:** [cijimenez](https://github.com/cijimenez)  
**Discord:** carlos_israelj  
**Role:** Developer  
**Contributions:**
- Integrated Moodle with MetaMask for secure Web3 Login and user creation with wallet connections in Moodle’s database.

## 🛠 Technical Approach
### Components
- Frontend: ✅
- Backend: ✅
- Smart Contracts: ✅
- ZK Circuits: ❌
- Machine Learning (ML): ❌

## 🗺 High-Level Outline
Moodle Web3 combines Moodle LMS functionalities with blockchain technology, delivering a user-friendly, decentralized educational platform. It integrates Ethereum wallets and Push Protocol to promote blockchain adoption through interactive educational use cases.

### Moodle Components
- Custom Moodle LMS: Manages courses, students, and data within a decentralized framework.
- Moodle Database: Stores user, course, and event information, with modifications to support web3 functionalities.

### Middleware Web Server
- Event-Driven Middleware: Links Moodle with Push Protocol to capture events (e.g., enrollments, course completions) and trigger notifications.
- Push Protocol Integration: Enables real-time notifications for new content, deadlines, and updates, engaging students through blockchain-enabled messaging.

### Ethereum Wallet Integration
- Web3 Login: Allows students to log in using their Ethereum wallets, improving security and introducing blockchain credentials.
- NFT Certifications & POAPs: Students receive NFTs as proof of course completions, creating verifiable, tamper-proof digital credentials.
- Smart Contract for Certifications: Deploys an ERC721 smart contract, issuing unique NFTs as certifications, accessible within students' Ethereum wallets.

## 🌐 Web3 Integration Benefits
Moodle Web3 leverages blockchain technology to enhance educational accessibility, engagement, and credential security. This integration exemplifies the tangible benefits of blockchain in real-world scenarios.

### Key Benefits:
- Increased Engagement: Real-time notifications through Push Protocol keep students updated, fostering higher engagement and retention.
- Decentralized, Secure Access: Wallet-based logins enhance security while familiarizing users with blockchain-based identity management.
- Verifiable Credentials: NFT-based certifications offer students an authenticated, tamper-proof record of their achievements.

## 🌟 Transforming Education with Web3
By integrating web3 elements like wallet logins, NFT certifications, and decentralized notifications, Moodle Web3 empowers students and educators to explore blockchain technology in a practical setting, promoting understanding and widespread adoption.

## 🏆 Sponsors
These organizations support the Moodle Web3 project:
- Push Protocol ✅
- PSE ✅

## 🎯 Project Goals
- **Objective:** Develop a comprehensive plugin and integration suite connecting Moodle LMS with blockchain tools to offer decentralized identity and credentialing.
- **Functionality Expansion:** Integrate real-time, blockchain-based notifications for a modernized learning experience.
- **Long-Term Vision:** Expand Moodle Web3 into an educational tool that demonstrates the potential of web3, encouraging adoption by educational institutions seeking enhanced transparency and verifiability.

**Collaboration Opportunities:** Support for development, feedback, or sponsorship is encouraged to drive project growth and foster partnerships.

## 📚 Lessons Learned
- **Best Practices:** Include reusable code patterns to aid other developers in similar projects.
- **Integration**: Web3 Tools integrations with Web2 Robust platforms
- **Notable Code Snippets:** Share examples to showcase key insights for building decentralized applications in educational contexts.

## 🔗 Project Links

Provide links to:
- [Moodle Web3 Repository](https://github.com/Privacy-Lab-Latam-Builders/moodle-web3)
- [Source Code - Custom Moodle](https://github.com/Privacy-Lab-Latam-Builders/moodle)
- [Source Code - Certifications Smart Contract](https://github.com/padimaster/certifications-smart-contract)
- [Source Code - Middleware Webserver and DB](https://github.com/padimaster/moodle-web3)
- [Docker Image - Middleware Webserver and DB](https://hub.docker.com/repository/docker/padimaster/moodle-push/general)
- [Source Code - Moodle Wallet Integration]()

---

## 🎥 Video Demo

Include a link to a brief demo video (maximum 5 minutes) showcasing your team and project.
