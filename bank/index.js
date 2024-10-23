const express = require('express');
const snarkjs = require('snarkjs');
const fs = require('fs');
const { execSync } = require('child_process');
const circomlibjs = require("circomlibjs");
const crypto = require('crypto');
const app = express();
const PORT = 4000;
// add cors
const cors = require('cors');
const { verify } = require('crypto');
app.use(cors());

// let poseidon; // Declare poseidon variable globally

// // Initialize Poseidon hash function
// (async () => {
//     poseidon = await circomlibjs.buildPoseidon();
// })();


// mock card with the balance 
let cardsBalances = [{
    // user
    card_number: '1234567890123456',
    balance: 100,
    nonce: 0
},
{
    // shop
    card_number: '1234567890123457',
    balance: 0
},
];

let cards = [];

let TXs = [];

// Middleware to parse JSON requests
app.use(express.json());

// hash the string using SHA-256 and convert it to a BigInt-compatible format
function hashStringToBigInt(input) {
    const hash = crypto.createHash('sha256').
        update(input).digest('hex');
    return BigInt('0x' + hash).toString();
}

// hash the number using SHA-256 and convert it to a BigInt-compatible format
function hashNumberToBigInt(input) {
    const hash = crypto.createHash('sha256').
        update(input.toString()).digest('hex');
    return BigInt('0x' + hash).toString();
}


// Generate Nonce for the transaction
// function generateNonce() {
//     return Math.floor(Math.random() * 1000000);
// }

// Endpoint to receive TX request from shop and generate nonce
app.get('/generate-nonce/:pi3', (req, res) => {
    // const nonce = generateNonce();
    // res.status(200).json({ nonce: nonce });
    const { pi3 } = req.params;
    // find nonce of the card
    const card = cards.find(c => c.pi3 === pi3);
    console.log("card:", card);
    const cardBalance = cardsBalances.find(c => c.card_number === card.card_number);
    if (!cardBalance) {
        console.log("Card not found");
        res.status(400).json({ message: 'Card not found' });
        return;
    }
    const nonceHashed = hashNumberToBigInt(cardBalance.nonce);
    res.status(200).json({ nonce: nonceHashed });
    return;
});

// endpoint to send cardSetup.wasm and cardSetup_0000.zkey to the user
app.get('/card-setup', (req, res) => {
    res.zip([
        { path: './cardSetup_0000.zkey', name: 'cardSetup_0000.zkey' },
        { path: './cardSetup_js/cardSetup.wasm', name: 'cardSetup.wasm' }
    ]);

});

// Endpoint to receive and verify the setup proof from PrivacyVisa
app.post('/store-setup', async (req, res) => {
    const { proof, publicSignals, card_number } = req.body;

    // check that the card number is not already stored
    if (cards.find(c => c.card_number === card_number)) {
        console.log("Card already stored");
        res.status(400).json({ message: 'Card already stored' });
        return;
    }
    try {
        const verificationKey = JSON.parse(fs.readFileSync("cardSetup_verification_key.json"));

        // Verify proof
        const isValid = await snarkjs.groth16.verify(verificationKey, publicSignals, proof);
        if (isValid) {
            console.log("Setup proof verification successful");

            cards.push({ card_number: card_number, pi3: publicSignals[1] });

            console.log("Setup data stored:", cards);
            res.status(200).json({ message: 'Proof verified and setup data stored' });
        } else {
            console.log("Setup proof verification failed");
            res.status(400).json({ message: 'Invalid proof' });
        }

    } catch (error) {
        console.error("Error during setup verification:", error);
        res.status(500).json({ message: 'Error during setup verification', error: error.toString() });
    }
});

// endpoint to send cardVerification.wasm and cardVerification_0000.zkey to the user
app.get('/card-verification', (req, res) => {
    res.zip([
        { path: './cardVerification_0000.zkey', name: 'cardVerification_0000.zkey' },
        { path: './cardVerification_js/cardVerification.wasm', name: 'cardVerification.wasm' }
    ]);
});

// Endpoint to create a transaction order
app.post('/create-transaction', async (req, res) => {
    const { transaction, amount, pi3, shopCardNumber } = req.body;

    // check that the card number is stored
    const card = cards.find(c => c.pi3 === pi3);
    if (!card) {
        console.log("Card not found");
        res.status(400).json({ message: 'Card not found' });
        return;
    }

    const tx = {
        pi3: card.pi3,
        transaction: transaction,
        amount: amount,
        shopCardNumber: shopCardNumber,
        status: 'pending',
        // nonce: nonce,
        nonce: 0,
    };
    TXs.push(tx);

    console.log("Transaction order created:", tx);
    res.status(200).json({ message: 'Transaction order created', transaction: tx.transaction });
    return;
});

// Endpoint to check the transaction status
app.get('/check-transaction/:tx', async (req, res) => {
    const { tx } = req.params;

    // check that the transaction is stored
    const transaction = TXs.find(t => t.transaction === tx);
    if (!transaction) {
        console.log("Transaction not found");
        res.status(400).json({ message: 'Transaction not found' });
        return;
    }
    if (transaction.status === 'approved') {
        console.log("Transaction approved:", transaction);
        const shopCard = cardsBalances.find(c => c.card_number === transaction.shopCardNumber);
        res.status(200).json({ message: 'Transaction approved', transaction: transaction, receive: transaction.amount, shopCard: shopCard });
        return;
    }

    console.log("Transaction found:", transaction);
    res.status(200).json({ message: 'Transaction found', transaction: transaction });
});

// Endpoint to verify the transaction proof
// app.post('/verify-transaction', async (req, res) => {
//     const { proof, publicSignals } = req.body;
//     //  **** bug when user create many transaction
//     try {
//         const verificationKey = JSON.parse(fs.readFileSync("cardVerification_verification_key.json"));
//         const PIA = publicSignals[0];
//         console.log("PIA:", PIA);
//         console.log("cards:", cards);
//         // Verify proof
//         const isValid = await snarkjs.groth16.verify(verificationKey, publicSignals, proof);
//         if (isValid) {
//             const card = cards.find(c => c.pi3 === PIA);

//             if (!card) {
//                 console.log("Card not found");
//                 res.status(400).json({ message: 'Card not found' });
//                 return;
//             }
//             // check that the transaction is not already stored
//             const tx = TXs.find(t => t.pi3 === PIA);
//             console.log("Transaction found:", tx);
//             if (!tx) {
//                 console.log("Transaction not found");
//                 res.status(400).json({ message: 'Transaction not found' });
//                 return;
//             }
//             tx.status = 'approved';
//             const card_number = cards.find(c => c.pi3 === PIA).card_number;
//             console.log("Card found:", card_number);

//             // transfer the amount from the user card to the shop card
//             const userCard = cardsBalances.find(c => c.card_number === card_number);
//             const shopCard = cardsBalances.find(c => c.card_number === tx.shopCardNumber);

//             console.log("userCard:", userCard);
//             console.log("shopCard:", shopCard);

//             if (userCard.balance < tx.amount) {
//                 console.log("Insufficient balance");
//                 res.status(400).json({ message: 'Insufficient balance' });
//                 return;
//             }

//             userCard.balance = Number(userCard.balance) - Number(tx.amount);
//             shopCard.balance = Number(shopCard.balance) + Number(tx.amount);

//             console.log("Transaction proof verification successful");
//             console.log("card:", card);
//             // res.status(200).json({ message: 'Proof verified successfully' });
//             res.status(200).json({ message: 'Proof verified successfully', card_number: card_number, transaction: tx.transaction, amount: tx.amount });
//         } else {
//             console.log("Transaction proof verification failed");
//             res.status(400).json({ message: 'Invalid proof' });
//         }
//     } catch (error) {
//         console.error("Error during transaction verification:", error);
//         res.status(500).json({ message: 'Error during transaction verification', error: error.toString() });
//     }
// });
app.post('/verify-transaction', async (req, res) => {
    const { proof, publicSignals, transaction, nonce } = req.body;
    const pia = publicSignals[0];
    const pib = publicSignals[1];
    // Step 1: Recompute X using the Bank's stored values and received inputs
    try {
        const isApproved = TXs.find(t => t.transaction === transaction && t.status === 'approved');
        if(isApproved){
            console.log("Transaction already exists");
            res.status(400).json({ message: 'Transaction already exists' });
            return;
        }
        const verificationKey = JSON.parse(fs.readFileSync("cardVerification_verification_key.json"));

        const tx = TXs.find(t => t.transaction === transaction).transaction;
        if (!tx) {
            console.log("Transaction not found");
            res.status(400).json({ message: 'Transaction not found' });
            return;
        }
        const n = cardsBalances.find(c => c.card_number === cards.find(c => c.pi3 === pia).card_number).nonce;
        console.log("n:", n);
        console.log("tx:", tx);
        // Assume `pia` was derived from the verification setup (h(pi2 + CVC))
        const generatedX = await computeVerificationHash(pia, tx, hashNumberToBigInt(n));

        const isValid = await snarkjs.groth16.verify(verificationKey, publicSignals, proof);
        // Step 2: Compare the received `pib` against the generated X
        if (pib === generatedX && isValid) {
            const tx = TXs.find(t => t.transaction === transaction);
            if (!tx) {
                console.log("Transaction not found");
                res.status(400).json({ message: 'Transaction not found' });
                return;
            }
            tx.status = 'approved';//I not know is it correct for updating????
            const card_number = cards.find(c => c.pi3 === pia).card_number;
            console.log("Card found:", card_number);

            // transfer the amount from the user card to the shop card
            const userCard = cardsBalances.find(c => c.card_number === card_number);
            const shopCard = cardsBalances.find(c => c.card_number === tx.shopCardNumber);


            console.log("userCard:", userCard);
            console.log("shopCard:", shopCard);

            if (userCard.balance < tx.amount) {
                console.log("Insufficient balance");
                res.status(400).json({ message: 'Insufficient balance' });
                return;
            }

            userCard.balance = Number(userCard.balance) - Number(tx.amount);
            shopCard.balance = Number(shopCard.balance) + Number(tx.amount);

            userCard.nonce = nonce + 1;

            console.log("Transaction proof verification successful");
            console.log("cardsBalances:", cardsBalances);
            res.status(200).json({ message: 'Proof verified successfully', transaction: tx.transaction, amount: tx.amount });
            return;

        } else {
            console.log("Invalid proof. Transaction verification failed.");
            res.status(400).json({ message: "Transaction verification failed. Invalid proof." });
        }
    } catch (error) {
        console.error("Error verifying transaction:", error);
        res.status(500).json({ message: "Error verifying transaction", error: error.toString() });
    }
});

// Function to recompute X using stored `pi3`, `tx`, and `nonce`
async function computeVerificationHash(pia, tx, nonce) {

    // Prepare inputs for Poseidon hashing
    const inputArray = [
        // BigInt(pia),
        // BigInt(tx),
        // BigInt(nonce)
        pia,
        tx,
        nonce
    ];
    console.log("inputArray:", inputArray);

    // Perform the Poseidon hash
    // const hashResult = poseidon(inputArray);

    // Convert the hash result to a hexadecimal string
    // const generatedX = poseidon.F.toString(hashResult);
    // const generatedX = circomlibjs.poseidon(inputArray).toString();
    const poseidon = await circomlibjs.buildPoseidon();
    const generatedX = poseidon.F.toString(poseidon(inputArray));
    console.log(generatedX);

    return generatedX;


    // return generatedX;
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

// Start the server
app.listen(PORT, () => {
    compileAndSetupCircuits();
    console.log(`Bank server is running on port ${PORT}`);
});