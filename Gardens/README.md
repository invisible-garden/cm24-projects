# Gardens

Gardens is a bottom-up governance framework for web3 ecosystems. We provide coordination infrastructure and funding mechanisms that help grow networks of public goods, run by the individuals and communities that understand them best.

Our emphasis is on a community experience that's healthy, fun, intuitive, secure, and open.

All of our code is open-source. Always has been and always will be. 🌱

## Team Information

**Project Members**

- [Paul Glavin](https://x.com/Paul_Glavin) - Project Lead
- [Felipe Novaez Rocha](https://github.com/kamikazebr) - Smart Contracts Lead
- [Corantin Gossman](https://github.com/Corantin) - Front-end Lead
- [Matias Manta](https://github.com/Mati0x) - Front-end UI/UX
- [Luciano Scaminaci](https://github.com/Lucianosc) - Front-end UI/UX
- [Rodrigo Perez](https://github.com/rperez89) - Full-stack Dev
- [Kevin Mansour](https://github.com/kafann) - Full-stack Dev
- [Thiago Rossi](https://www.linkedin.com/in/thiago-rossi/) - Growth

**Project Members at Invisible Garden**

- Name: Luciano Scaminaci
  - Discord Username: LuchoSca
  - Devfolio Username: LuchoSca
  - Github Username: Lucianosc
  - Role: Front-end dev & UX/UI

## Technical Approach

- **Components** (Select all that apply)
  - [x] Frontend
  - [x] Backend
  - [x] Smart Contracts
  - [ ] ZK Circuits
  - [ ] Machine Learning (ML)

## Architecture Overview

The Noble funding distribution platform is built as a modern Web3 application using a robust tech stack that prioritizes type safety, performance, and developer experience. The project follows a monorepo structure using Turborepo for efficient workspace management.

## Tech Stack

### Frontend

- **Next.js 14**: Server-side rendering and modern React features
  - App Router for enhanced routing capabilities
  - Server Components for optimal performance
  - Server Actions for secure data mutations
- **TypeScript**: End-to-end type safety
- **TailwindCSS**: Utility-first styling with custom configuration
- **Viem**: Type-safe Ethereum interactions
- **Wagmi**: React Hooks for Ethereum
- **IPFS Integration**: For decentralized content storage

### Smart Contract Integration

- **Ethereum Interaction**: Via viem/wagmi
- **Contract Management**: Using Foundry for development and testing
- **The Graph**: For efficient blockchain data indexing
  - Custom subgraphs for event tracking
  - Local Graph Node for development

### Development Environment

- **Turborepo**: Monorepo management
- **pnpm**: Package management
- **ESLint & Prettier**: Code quality and formatting
- **Docker**: Local development services

## Key Technical Approaches

### 1. Decentralized Governance

- Implementation of multi-signature wallets for Council and Tribunal safes
- IPFS integration for Covenant storage and retrieval
- On-chain voting mechanisms with off-chain data storage

### 2. Performance Optimization

- Server Components for reduced client-side JavaScript
- Incremental Static Regeneration for dynamic content
- Efficient caching strategies using Turborepo

### 3. Security Measures

- Type-safe blockchain interactions
- Server-side validation
- Secure wallet connections
- Multi-signature requirements for critical operations

### 4. Data Management

- The Graph for efficient blockchain data querying
- Hybrid storage approach (on-chain/off-chain)
- Real-time updates using GraphQL subscriptions

### 5. User Experience

- Progressive Web App capabilities
- Responsive design using Tailwind
- Optimistic updates for blockchain transactions
- Comprehensive error handling

## Scalability Considerations

- Modular architecture for easy feature additions
- Efficient caching strategies
- Optimized blockchain interactions
- Subgraph pagination and filtering
- Remote caching for build optimization

## Security Features

- Strict TypeScript configurations
- Smart contract audit preparations
- Protected API routes
- Secure environment variable handling
- Multi-signature governance implementation

## Deployment Strategy

- Vercel for frontend deployment
- The Graph hosted service for subgraphs
- IPFS pinning services for decentralized storage
- Multi-network smart contract deployment support

## Sponsors

If you are applying for a sponsor project idea or grant, select the sponsors below.

- [ ] Push Protocol
- [x] Polygon
- [ ] Chainlink
- [ ] Brevis
- [ ] Orbiter
- [ ] ZKM
- [ ] Nethermind
- [ ] PSE
- [ ] AltLayer

## What do you plan to achieve with your project?

We recently launched or pre-beta and deployed in Arbitrum, Optimism, Polygon and Gnosis.
Next step is to finish our contracts diamond pattern and conduct a security audit (any help with the lattest would be greatly appreciated)

## Lessons Learned

### Key Takeaways

1. **Technical Wins**

- Next.js 14 Server Components significantly improved performance
- Wagmi/Viem combination provided excellent developer experience
- The Graph simplified blockchain data queries

2. **Best Practices**

- Type safety is crucial for Web3 development
- Separate blockchain logic from UI components
- Implement proper loading and error states for transactions

3. **Future Improvements**

- Enhance mobile responsiveness
- Add comprehensive error handling
- Improve transaction status tracking

### Main Insights

- Early TypeScript adoption prevented many bugs
- Regular testing is essential for Web3 apps
- Using established libraries saved development time

## Project Links

- **Website**: [gardens.fund](https://www.gardens.fund/)
- **Documentation**: [docs.gardens.fund](https://docs.gardens.fund/)
- **GitHub**: [1Hive/gardens-v2](https://github.com/1Hive/gardens-v2)

## Video Demo

Please provide a link to a video demo of your project. The demo should be no longer than 5 minutes.
