pragma circom 2.0.0;

include "node_modules/circomlib/circuits/poseidon.circom"; // Import Poseidon hash function

template CardSetup() {
    // Inputs (private)
    signal input cvc;        // CVC
    signal input salt;       // Random salt

    // Input (public)
    signal input cardNumber; // CN

    // Output (public)
    signal output pi2; // Second hash output
    signal output pi3; // Third hash output

    // variable
    var pi1; // First hash output

    // Step 1: Create Poseidon component for cardNumber
    component poseidon1 = Poseidon(1); // Input size is 1 for single value
    poseidon1.inputs[0] <== cardNumber;
    pi1 = poseidon1.out;

    // Step 2: Create Poseidon component for pi1 + salt
    component poseidon2 = Poseidon(2); // Input size is 2 for two values
    poseidon2.inputs[0] <== pi1;
    poseidon2.inputs[1] <== salt;
    pi2 <== poseidon2.out;

    // Step 3: Create Poseidon component for pi2 + CVC
    component poseidon3 = Poseidon(2); // Input size is 2 for two values
    poseidon3.inputs[0] <== pi2;
    poseidon3.inputs[1] <== cvc;
    pi3 <== poseidon3.out;
}

component main = CardSetup();