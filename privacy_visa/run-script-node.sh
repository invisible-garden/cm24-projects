#!/bin/bash

# Compile the Circom circuits into R1CS and Wasm files
echo "Compiling setup.circom..."
circom setup.circom --r1cs --wasm --sym

echo "Compiling verification.circom..."
circom verification.circom --r1cs --wasm --sym

# Download the Powers of Tau file for the trusted setup if not already downloaded
if [ ! -f powersOfTau28_hez_final_12.ptau ]; then
    echo "Downloading Powers of Tau file..."
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau
fi

# Perform the Groth16 trusted setup using the R1CS file and Powers of Tau
echo "Setting up Groth16 for the setup circuit..."
npx snarkjs groth16 setup setup.r1cs powersOfTau28_hez_final_12.ptau setup_0000.zkey

echo "Setting up Groth16 for the verification circuit..."
npx snarkjs groth16 setup verification.r1cs powersOfTau28_hez_final_12.ptau verification_0000.zkey

# Export the verification key from the generated zkey file for both circuits
echo "Exporting verification keys..."
npx snarkjs zkey export verificationkey setup_0000.zkey setup_verification_key.json
npx snarkjs zkey export verificationkey verification_0000.zkey verification_verification_key.json

# Optional: Run the Node.js script (index.js) to generate proofs
echo "Running Node.js script to generate proofs..."
node ./index.js

echo "All processes completed."
