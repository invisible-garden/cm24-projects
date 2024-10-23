pragma circom 2.0.0;

include "node_modules/circomlib/circuits/poseidon.circom"; // Import Poseidon hash function

template CardVerification() {
    // Inputs (public)
    signal input cardNumber; // CN from setup

    // Inputs (private)
    signal input pi2;       // Setup phase output (known)
    signal input pi3;       // Setup phase output (known)
    signal input cvc;
    signal input salt;
    signal input transaction; // Tx data (e.g., tx no. + amount)
    signal input nonce;       // Unique nonce to prevent replay attacks

    // Outputs (public)
    signal output pia;      // Verification phase intermediate output
    signal output pib;      // Final verification proof

    var pi1;
    var pip2;

    component poseidon1 = Poseidon(2); 
    poseidon1.inputs[0] <== pi2;
    poseidon1.inputs[1] <== cvc;
    pia <== poseidon1.out;

    component poseidon0 = Poseidon(1); // Input size is 1 for single value
    poseidon0.inputs[0] <== cardNumber;
    pi1 = poseidon0.out;

    component hash1 = Poseidon(2);
    hash1.inputs[0] <== pi1;
    hash1.inputs[1] <== salt;
    pip2 = hash1.out;

    pi2 === pip2;

    component poseidon2 = Poseidon(3); 
    poseidon2.inputs[0] <== pia;
    poseidon2.inputs[1] <== transaction;
    poseidon2.inputs[2] <== nonce;
    pib <== poseidon2.out;
}

component main = CardVerification();