# HaaS Hook

Uniswap v4 introduces an innovative new feature called hooks, which allows external smart contract functions to be invoked at various points in a pool's core logic flow, such as before or after modifying liquidity, or before or after swap.

To enable this functionality, a Uniswap v4 pool must specify an external smart contract address at creation, which then becomes a part of the pool key (which derives pool ID). This permenant, one-to-one relationship ensures exact interactions at the bytecode level, and it is up to the users to select pools based on their desired hooks logic. However, this setup poses several challenges:

For Developers: while developers can create new innovations with hooks, they may struggle to attract liquidity and volume to make them successful, especially for token pairs with strong incumbent pools.

For Incentivizers: parties (e.g., token issurers, event organizers, etc.) may want to incentivize liquidity and/or volume according to their business needs. Existing pools/hooks may not provide this functionality, particularly for incentivizing liquidity, and it is impractical to deploy new pools solely for this purpose.

For Users: users are forced to choose between pools with deeper liquidity and whos with specific hooks logic.

Hooks as a Service (HaaS) Hook aims to solve these issues by decoupling pools from hooks logic, enabling multiple, ad hoc, and user specified hooks for each pool action.

## Team Information

**Project Members**

- Name: Jeff Huang
  - Discord Username: jeffishjeff
  - Devfolio Username: jeffishjeff
  - Github Username: jeffishjeff
  - Role: contributor

## Technical Approach

- **Components** (Select all that apply)

  - [ ] Frontend
  - [ ] Backend
  - [x] Smart Contracts
  - [ ] ZK Circuits
  - [ ] Machine Learning (ML)

- HaaS Hook is implemented in Solidity using a provider-subscribers pattern. It serves as an extension for Uniswap v4's pools, relies on its v4-core repo, and does not require a separate backend or UI component.

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

Currently unable to solve 2 griefing attack vectors, plan to consult with Uniswap Foundation at DevCon for possible solutions. Provided that the attack vectors can be prevented, then would probably need a grant for code audits.

## Lessons Learned (For Submission)

- Designing a protocol involving unknown third-party smart contracts is quite hard, trying to foresee/prevent all possible attack vectors while still providing enough flexibility for it to be useful.

- Deeper understanding of Uniswap v4 action lifecycles, particularly around re-entries and flash accounting.

- Few different data structures for tracking dynamic list of subscribers were explored before deciding on linked list.

- Different prioritization mechanisms were also explored, ended on using auction.

- HaaS Hook itself is a lego piece in the Uniswap v4 ecosystem but also intended to be used by other hooks in a provider/subscriber pattern.

## Project Links (For Submission)

https://github.com/jeffishjeff/HaaS-Hook

## Video Demo (For Submission)

https://drive.google.com/file/d/1o2kEBT-C_vGT3YFl2chN-s5_zWcdlJhW/view
