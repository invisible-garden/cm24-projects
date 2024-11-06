# PUSH STAKING V3

In the current live version of the Push Protocol, staking for token holders is enabled within `PushCoreV2.sol`. The `PushCoreV2.sol` contract incorporates several streams of functionality: channel management, notifications management, fees collection as well as staking.
The new `Push Staking V3` feature will move staking into a dedicated contract and will extend staking capabilities to protocol integrator wallets alongside token holders. In the new `PushStaking.sol` contract, incoming staking rewards are separated into 2 pools, one for token holder rewards and one for wallet integrator rewards. Protocol integrator wallets are added / removed to the contract via governance votes.

## Team Information

**Project Members**

- Name: Mouzayan Delbourgo
  - Discord Username: 0x_flwr
  - Devfolio Username: Mouz
  - Github Username: Mouzayan
  - Role: Solidity Developer

## Technical Approach

- **Components** (Select all that apply)
  - [ ] Frontend
  - [ ] Backend
  - [X] Smart Contracts
  - [ ] ZK Circuits
  - [ ] Machine Learning (ML)

### Key Differences Between PushCoreV2 and PushCoreV3 + PushStaking
1. Separation of concerns: PushCoreV3 offloads staking and fee distribution to PushStaking.
2. New interface for fee transfer: PushCoreV3 allows PushStaking to pull protocol fees from it, which stakers earn as staking rewards.
3. The new PushStaking contract will not only manage staking for PUSH token holders but will also include staking for Wallets, meaning Wallets of projects that integrate Push Protocol features. Staking rewards are divided into two distinct pools: one for Token Holders and one for Integrator Wallets.
4. Integrator Wallets are added or removed by governance, and this action serves as the equivalent of staking or unstaking for those wallets.
5. Staking rewards are distributed proportionally between the Token Holder and Integrator Wallet pools. For example, 70% of the pool fees may go to token holders, while the remaining 30% is allocated to Wallet integrators.
For more details, please refer to the [Push Staking Specification](https://pushprotocol.notion.site/Push-Staking-v3-111188aea7f4806c94edd1d85d2eadbb#111188aea7f48024ba1fd6e26bbbaef5).

### PushStaking
PushStaking is a new contract that takes over some responsibilities from PushCoreV2/V3.
1.	Staking Management: Handles the core staking mechanics, including staking, unstaking, and calculating rewards for users.
2.	Fee Management: Implements `pullProtocolFees()` to retrieve fees from PushCoreV3 and divides them into separate pools: `WALLET_FEE_POOL` and `HOLDER_FEE_POOL`.
3.	Reward Distribution: Manages the distribution of rewards from the fee pools to stakers based on their stakes.
4.	Configurable Fee Distribution: Allows governance to adjust the percentages for fee distribution between the Token Holder and Wallet Integrator pools.

## Sponsors (if applicable)

- [X] Push Protocol
- [ ] Polygon
- [ ] Chainlink
- [ ] Brevis
- [ ] Orbiter
- [ ] ZKM
- [ ] Nethermind
- [ ] PSE
- [ ] AltLayer

## What do you plan to achieve with your project?

The success of my project is determined by meeting the detailed project specifications outlined in the Push team's project description [document](https://pushprotocol.notion.site/Push-Staking-v3-111188aea7f4806c94edd1d85d2eadbb#111188aea7f48024ba1fd6e26bbbaef5) and in ensuring the development of a fully operational staking protocol that is ready for on-chain deployment, enabling token holder and protocol integrator wallet participation, fostering added engagement in the protocol.

I plan to continue developing the test suite for the project and to make revisions to the code based on feedback from the Push team.

## Lessons Learned

I submitted a grant proposal to qualify for a bounty for developing this project. It was a good experience, as it was my first time participating in the grant process and in open-source and public-good work.
Link to my grant
[proposal](https://app.charmverse.io/push-dao/pushstakingv3-5437035867423043).

## Project Links

- To see a diff of the changes I made to the Push Protocol codebase, please look at the `Files changed` tab [here](https://github.com/Mouzayan/push-staking/compare/master...v3-staking).
- Push Staking specific [README](https://github.com/Mouzayan/push-staking/blob/v3-staking/README_V3STAKING.md) explaining the full scope of the project.
- Added files:
   -  [Push Staking README](https://github.com/Mouzayan/push-staking/blob/v3-staking/README_V3STAKING.md)
   -  [PushCoreStorageV3.sol](https://github.com/Mouzayan/push-staking/blob/v3-staking/contracts/PushCore/PushCoreStorageV3.sol)
   -  [PushCoreV3.sol](https://github.com/Mouzayan/push-staking/blob/v3-staking/contracts/PushCore/PushCoreV3.sol)
   -  [PushStaking.sol](https://github.com/Mouzayan/push-staking/blob/v3-staking/contracts/PushStaking/PushStaking.sol)
   -  [IPushStaking.sol](https://github.com/Mouzayan/push-staking/blob/v3-staking/contracts/interfaces/IPushStaking.sol)
    -  [EPNSCoreProxy.sol](https://github.com/Mouzayan/push-staking/blob/v3-staking/contracts/PushCore/EPNSCoreProxy.sol)
   -  [fixturesV3.js](https://github.com/Mouzayan/push-staking/blob/v3-staking/test/common/fixturesV3.js)
   - Tests are incomplete / in progress: [PushStaking.test.js](https://github.com/Mouzayan/push-staking/blob/v3-staking/test/v3/PushStaking.test.js). `npx hardhat test test/v3/PushStaking.test.js` to run.


## Video Demo (For Submission)

N/A