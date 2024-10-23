const snarkjs = require('snarkjs');
const fs = require("fs");
const crypto = require('crypto');
const { execSync } = require('child_process');

// Function to hash the string using SHA-256 and convert it to a BigInt-compatible format
function hashStringToBigInt(input) {
    const hash = crypto.createHash('sha256').update(input).digest('hex');
    return BigInt('0x' + hash).toString();
}

// Function to run shell commands
function runCommand(command) {
    try {
        console.log(`Executing: ${command}`);
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Error executing command: ${command}`, error);
    }
}

// Step 1: Compile Circuits and Run Setup
function compileAndSetupCircuits() {
    runCommand('./removeFiles.sh');

    // Compile the circuits
    runCommand('circom cardSetup.circom --r1cs --wasm --sym');
    runCommand('circom cardVerification.circom --r1cs --wasm --sym');

    // Download the Powers of Tau file
    runCommand('wget -nc https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau');

    // Generate the trusted setup zkey for both circuits
    runCommand('npx snarkjs groth16 setup cardSetup.r1cs powersOfTau28_hez_final_12.ptau cardSetup_0000.zkey');
    runCommand('npx snarkjs groth16 setup cardVerification.r1cs powersOfTau28_hez_final_12.ptau cardVerification_0000.zkey');

    // Export the verification keys
    runCommand('npx snarkjs zkey export verificationkey cardSetup_0000.zkey cardSetup_verification_key.json');
    runCommand('npx snarkjs zkey export verificationkey cardVerification_0000.zkey cardVerification_verification_key.json');
}
// Function to run the setup phase and generate PI1, PI2, PI3
async function runSetup() {
    try {
        const salt = "1234";
        const cvc = "123";  // Example CVC
        const cn = "1234567890123456"; // Example card number

        // const saltHashed = hashStringToBigInt(salt);
        // const cvcHashed = hashStringToBigInt(cvc);
        const saltHashed = salt;
        const cvcHashed = cvc;
        console.log(
            {
                "cardNumber": cn,
                "salt": saltHashed,
                "cvc": cvcHashed
            }
        )
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            {
                "cardNumber": cn,
                "salt": saltHashed,
                "cvc": cvcHashed
            },
            "cardSetup_js/cardSetup.wasm",
            "cardSetup_0000.zkey"
            // "cardSetup.wasm",
            // "cardSetup_0000.zkey"
        );

        console.log("Setup Public Signals (PI2, PI3):", publicSignals);

        // Write outputs to a file for later use in verification
        fs.writeFileSync("setup_publicSignals.json", JSON.stringify(publicSignals));
        fs.writeFileSync("setup_proof.json", JSON.stringify(proof));
        console.log("Setup public signals saved.");
    } catch (error) {
        console.error("Error in Setup Phase:", error);
    }
}

// Function to run the verification phase using PI1, PI2, PI3
async function runVerification() {
    try {
        // Retrieve expected PI1, PI2, PI3 from setup phase
        const setupPublicSignals = JSON.parse(fs.readFileSync("setup_publicSignals.json"));
        const expected_PI2 = setupPublicSignals[0];
        const expected_PI3 = setupPublicSignals[1];
        const salt = "salt1234";
        const cvc = "123";  // Example CVC
        const cn = "1234567890123456"; // Example card number

        const saltHashed = hashStringToBigInt(salt);
        const cvcHashed = hashStringToBigInt(cvc);
        // const txHashed = hashStringToBigInt("order-001-amount-100");
        const txHashed = "86272462004121599836674880270895735843737330217577430144422793895300185664108"
        const nonceHashed = hashStringToBigInt("0");
        

        console.log(
            {
                "cardNumber": cn,
                // "pi1": expected_PI1,
                "pi2": expected_PI2,
                "pi3": expected_PI3,
                "cvc": cvcHashed,
                "salt": saltHashed,
                "transaction": txHashed,
                "nonce": nonceHashed,
            }
        )
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            {
                "cardNumber": cn,
                // "pi1": expected_PI1,
                "pi2": expected_PI2,
                "pi3": expected_PI3,
                "cvc": cvcHashed,
                "salt": saltHashed,
                "transaction": txHashed,
                "nonce": nonceHashed,
            },
            "cardVerification_js/cardVerification.wasm",
            "cardVerification_0000.zkey"
        );

        // input example
        // {
        //     "cardNumber": "1234567890123456",
        //     "pi2": "1234",
        //     "pi3": "1234",
        //     "cvc": "123",
        //     "salt": "1234",
        //     "transaction": "1234",
        //     "nonce": "1234"

        // }

        console.log("Verification Public Signals:", publicSignals);

        // Write outputs to a file for verification check
        // fs.writeFileSync("verification_proof.json", JSON.stringify(proof));
        // fs.writeFileSync("verification_publicSignals.json", JSON.stringify(publicSignals));
        console.log("Verification proof and public signals saved.");
    } catch (error) {
        console.error("Error in Verification Phase:", error);
    }
}

async function main() {
    console.log("Running Compile and Setup Circuit:");
    await compileAndSetupCircuits();

    console.log("Running Setup Phase:");
    await runSetup();

    // console.log("Running Verification Phase:");
    // await runVerification();
}

main().then(() => {
    process.exit(0);
});
