
# Syur

(reads "sure", using Malaysian spelling just for more fun)

This is current snapshot of my very early core research on ZK-ML verification. My belief is all current somewhat functional tech that can provide verified ML inference is limited and uses a wrong approach. Plonkish proof systems and similar are just not suitable for intense compute-heavy tasks with many non-arithmetic parts that machine learning needs, plus ML usually happens with GPU acceleration and while there is some research on accelerating ZK proving with GPU or ASICs those attempts usually don't take into account the realities of how ML inference actually happens.

I've taken a task to read, review and test everything currently available for two specific novel proof systems: LogUp+GKR and zkMatrix - while still new, they both show promise for this type of computations.

Lookup Arguments in general are very good for heavy non-arithmetic computation, show good results in practice (Jolt ZKVM is based on Lasso which inspired LogUp+GKR), there are a few implementations of it in development (winterfell and stwo both have PRs, I ran winterfell's benchmarks although adapting that to run on GPU and prove some ML operations would require much more time than I have on my hands), I looked into additional improvements that can be done (power circuits) and it shows promise.

zkMatrix is also special, it's a SNARK specifically designed for matrix multiplication, it has better prover complexity that Thaler's protocol and performs well with batch multiplication. The only code available was provided by the authors but I successfully ran benchmarks after some tweaking and proof generation time on large enough matrices was below a minute which is already not bad. Given that we can reconstruct many arithmetic tensor operation in ML into series of multiplications (using tract, probably, but essentially Einstein's notation) this approach could be viable.

If there were a team with time and resources to explore this combination and potentially other similar proof systems (plus potentially something more specialized, like the protocol from zkLLM for self-attention) for proving inference of real-world ML models it could dwarf all current early ZKML attempts (which are largely impractical, I researched many potential applications this year resulting in a soft-negative answer to the tune of "existing ZK-ML tech cannot do this thing X"). I don't have a team or personal resources to support myself, I cannot explore this (my optimistic estimate, very optimistic, is team of five, about a year to develop a working runtime plus initially team of three, three to six months just to attempt a PoC in code), I'm just leaving all my ideas and notes as detailed as I could for the next brave soul who thinks it's promising. I'm a little bit sad to hit a pause button understanding that I'll most likely never return, but thanks to Invisible Garden and Antalpha Hacker House I managed to look into the darker corners of the theory and practice here, to get some overview of the current landscape where ZK theory meets practice, and figured out the exact complexity of the task at hand and resources required.

## Team Information

**Project Members**

- Name: Ivan Anishchuk
  - Discord Username: ivananishchuk
  - Devfolio Username: ivananishchuk
  - Github Username: IvanAnishchuk
  - Role: myself

## Technical Approach

- **Components**
  - [ ] Frontend
  - [x] Backend
  - [ ] Smart Contracts
  - [x] ZK Circuits
  - [x] Machine Learning (ML)

There are no technical components, this is all early research.

## Sponsors

I don't expect sponsor support, there's no clear plan or timeline I can commit to. Even possible deliverables are unclear at this point, further research might easily hit a soft-negative dead-end and the need to pivot and find a new proof protocol or approach. Maybe someone will offer me internship or fellowship or some other minimal wage contract situation with less strings attached in terms of deliverables, I'm open to such offers. I don't think I'll get any, I'm too weird and hard to understand.

- [ ] Push Protocol
- [ ] Polygon
- [ ] Chainlink
- [ ] Brevis
- [ ] Orbiter
- [ ] ZKM
- [x] Nethermind
- [x] PSE
- [ ] AltLayer

Ingonyama might also be interested since they are focused on acceleration and this requires it. Exact ways to apply acceleration require more research though.

## What do you plan to achieve with your project?

I'd be very happy to have a situation where I have basic support for a short period of time (three to six months) and some team to work with to test this approach in code and maybe provide a PoC (or a detailed negative answer if that fails). Several teams attempted similar approaches to ZKML and none so far reported a failure, I heard only of budget cuts, hard stops, and of one team just stopping posting news a few months ago (I'll avoid naming anyone here, but in some cases I have first-hand knowledge that core research was stopped before it could progress anywhere for business reasons or otherwise without actually failing research tasks). I don't believe I have enough of a plan, enough specialized knowledge and skills personally (despite being one of the few people with the right math training and development experience for this) or a good team to make good promises sponsors or investors would like.

I don't like making promises on a maybe myself, there is a high probability of a failure which together with me having zero savings doesn't make for a good grant application. So I plan to stop, to switch to my previous line of work, and maybe continue exploring this as a hobby once I have free time and some support system (if anybody wants to convince me otherwise please start with explaining my survival budget till end of year, grant applications typically take longer till any money change hands). I met some people who might be interested to discuss these topics occasionally. With a few more man-weeks poured into this the plan might clarify and become realistic, who knows. But if we are being realistic this is probably the end of it for me, better researchers will figure out the proof systems and some other developers will code it once the world is more ready and everyone understands how to do it. I'll make a living in the world where I can deliver quick results with my expert knowledge and this all will become a moment of history to be remembered among other fun research topics I abandoned in my long life (who even cares about range-3 hyperclones and their properties now? Well, I'm still a bit sad that I had to find a job and abandoned them without getting many results fifteen years ago or so when I decisively left the academia to become a technical wage slave.)


## Lessons Learned (For Submission)

- ZKML is complex and heavy in ways hard to understand even for researchers.
- ZK research is very disconnected from ML practice and vice versa.
- The world is not ready and relevant projects (like DeSoc) are not currently looking for anything similar.
- It could be possible with more core research but only a few people are even looking in the right places.
- Investors are not interested in funding core research with long and unclear timeline to practical results.
- Even research organizations doing something in this area are hesitant.
- Academia is probably the place but I'm very far from that world and don't want back.


## Project Links (For Submission)

My modest page explaining ideas I'm having and potential approaches. It's not much but all I have to show essentially.

https://syur.my/

Here are links to code examples I reviewed and tested:

https://github.com/starkware-libs/stwo/pull/623/

https://github.com/facebook/winterfell/pull/302

https://github.com/mirandaprivate/zkMatrix

Relevant research articles that I read and presented short notes on Alntalpha presentation days:

(LogUp+GKR) https://eprint.iacr.org/2023/1284

(Power Circuits) https://eprint.iacr.org/2023/1611

(zkMatrix) https://eprint.iacr.org/2024/161

## Video Demo (For Submission)

I had issues recording video and since it's CLI anyway I decided log is better. Proof generation time within tens of seconds is actually pretty good, given that no clever acceleration or optimization was aapplied.

```
user@g94 ~/src/zkxp/zkMatrix $ cargo bench
    Finished bench [optimized] target(s) in 0.07s
     Running unittests src/lib.rs (target/release/deps/zkmatrix-1f83f2ba1985b4c0)

running 23 tests
test commit_mat::tests::test_commit ... ignored
test experiment_data::tests::test_experiment_data ... ignored
test mat::tests::test_mat ... ignored
test protocols::ip_gt::tests::test_ipgt ... ignored
test protocols::left_proj::tests::test_left_proj ... ignored
test protocols::mat_mul::tests::test_matmul ... ignored
test protocols::pip::tests::test_pip ... ignored
test protocols::right_proj::tests::test_right_proj ... ignored
test protocols::scalar_proj::tests::test_scalar_proj ... ignored
test protocols::vec_com::tests::test_vec_com ... ignored
test setup::tests::test_srs ... ignored
test utils::curve::tests::test_curve ... ignored
test utils::dirac::tests::test_dirac ... ignored
test utils::dirac::tests::test_opt ... ignored
test utils::fiat_shamir::tests::test_fiat_shamir ... ignored
test utils::test_data::tests::test_gen_mat ... ignored
test utils::xi::tests::test_xi ... ignored
test zkprotocols::zk_ip_gt::tests::test_zk_ipgt ... ignored
test zkprotocols::zk_left_proj::tests::test_zk_left_proj ... ignored
test zkprotocols::zk_matmul::tests::test_zk_matmul ... ignored
test zkprotocols::zk_right_proj::tests::test_zk_right_proj ... ignored
test zkprotocols::zk_scalar_proj::tests::test_zk_scalar_proj ... ignored
test zkprotocols::zk_scalars::tests::test_zk_scalar ... ignored

test result: ok. 0 passed; 0 failed; 23 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running benches/bench_25519.rs (target/release/deps/bench_25519-cee28e997a886531)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running benches/bench_ark.rs (target/release/deps/bench_ark-6b37abe2113546cd)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running benches/bench_bls12_381.rs (target/release/deps/bench_bls12_381-85480725b8498ac9)

running 16 tests
test bench_g1_add_g1         ... ignored, only for testing bls12_381
test bench_g1_double         ... ignored, only for testing bls12_381
test bench_g1_mul_g2         ... ignored, only for testing bls12_381
test bench_g1_mul_scalar     ... ignored, only for testing bls12_381
test bench_g2_add_g2         ... ignored, only for testing bls12_381
test bench_g2_double         ... ignored, only for testing bls12_381
test bench_g2_mul_scalar     ... ignored, only for testing bls12_381
test bench_gt_add_gt         ... ignored, only for testing bls12_381
test bench_gt_double         ... ignored, only for testing bls12_381
test bench_gt_mul_scalar     ... ignored, only for testing bls12_381
test bench_scalar_add_scalar ... ignored, only for testing bls12_381
test bench_scalar_double     ... ignored, only for testing bls12_381
test bench_scalar_mac_scalar ... ignored, only for testing bls12_381
test bench_scalar_mul_scalar ... ignored, only for testing bls12_381
test bench_u64_add_u64       ... ignored, only for testing bls12_381
test bench_u64_mul_u64       ... ignored, only for testing bls12_381

test result: ok. 0 passed; 0 failed; 16 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running benches/experiment.rs (target/release/deps/experiment-867a2cf6b91288be)
 ** Experiment for zkMatrix, Matrix Dim 2e10 times 2e10; Number of non-zero elements: 2e20 ** 
 ===== File data/public/srs_2e10.srs written; Size 361608 Bytes 
 -----------------------------------------------------  
 ** SRS generation time: 2.289359261s
 *** Compute dense matrix mulitplication time: 972.008189ms
 ** Matrix generation time: 1.082665702s
 ** Time for matrix commitment: 28.662744582s
 ===== File data/private/a_dense_i64_2e10_rp.cache written; Size 114696 Bytes 
 -----------------------------------------------------  
 ** Time for matrix commitment: 11.987841197s
 ===== File data/private/b_dense_i64_2e10_lp.cache written; Size 65544 Bytes 
 -----------------------------------------------------  
 ** Time for matrix commitment: 29.659253169s
 ===== File data/private/c_dense_i128_2e10_lp.cache written; Size 65544 Bytes 
 -----------------------------------------------------  
 * Time for computing bra_zp: 33.414045ms
 * Time for Computing ket_zp: 37.355492ms
 * Time for bra_zp: 40.749355ms
 * Time for ket_zp: 35.754127ms
 ** Prover time of zkMatMul: 25.600329446s
 ===== File data/public/tr_2e10.tr written; Size 131136 Bytes 
 -----------------------------------------------------  
 * Verification of zkMatMul result: true
 ** Verifier time of zkMatMul : 517.5806921
     Running benches/experiment2.rs (target/release/deps/experiment2-5a392405da793589)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

```
