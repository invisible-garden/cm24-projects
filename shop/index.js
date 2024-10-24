const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');
const cron = require('node-cron');
const express = require('express');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 5050;

const shopCardNumber = "1234567890123457"

const transactionData = {
    TX: "84175951297507830678618146582828340768282764231523957308211132361639741515583",
    amount: "70",
    pi3: "4596163896820185360724586980114658921350506991309581883984297155629702595484",
    shopCardNumber: "1234567890123457"
};

const mockitems = {
    items: [
        {
            name: "item1",
            price: "10"
        },
        {
            name: "item2",
            price: "20"
        },
        {
            name: "item3",
            price: "40"
        }
    ]
}

const txs = [];


// run blackgroud process for check the status of the transaction with cron job
cron.schedule('*/5 * * * * *', () => {
    console.log('running a task every 5 seconds');
    // loop in txs and check the status of the transaction
    txs.forEach(async (tx) => {
        try {
            console.log("Checking transaction status:", tx.transaction);
            const response = await axios.get(`http://localhost:4000/check-transaction/${tx.transaction}`);
            if (response.data.transaction.status === 'approved') {
                tx.status = 'approved';
                console.log("Transaction approved:", response.data);
            } else {
                console.log("Transaction status:", response.data.transaction.status);
            }
        } catch (error) {
            console.error("Error fetching transaction status:", error.message);
        }
    });
}
);

// Endpoint to create a transaction order
app.post('/create-transaction', async (req, res) => {
    const { items, pi3 } = req.body;

    // check items are not empty
    if (!items || items.length === 0) {
        console.log("Items not found");
        res.status(400).json({ message: 'Items not found' });
        return;
    }
    // check the items in request body are the same as the items in the system
    items.forEach(item => {
        const itemFound = mockitems.items.find(i => i.name === item.name && i.price === item.price);
        if (!itemFound) {
            console.log("Item not found");
            res.status(400).json({ message: 'Item not found' });
            return;
        }
    }
    );

    // calculate the amount with the items
    const totalAmount = items.reduce((acc, item) => acc + parseInt(item.price), 0);
    const a = {
        pi3: pi3,
        amount: totalAmount,
        dt: new Date(),
        items: items,
    }

    const a_hashed =  hashObjectToBigInt(a);
    // // create a transaction object
    const tx = {
        transaction: a_hashed,
        a: a,
        amount: totalAmount,
        status: 'pending',
    };
    txs.push(tx);
    try {
        const response = await fetch('http://localhost:4000/create-transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transaction: tx.transaction, amount: tx.amount, pi3: pi3, shopCardNumber: shopCardNumber }),
        });
        if(!response.ok){
            throw new Error("Error creating transaction");
        }
        res.status(200).json({ message: 'Transaction order created', transaction: tx });
        return;

    } catch (error) {
        console.error("Error creating transaction:", error.message);
    }

})

// Endpoint to check the transaction status
app.get('/check-transaction/:tx', async (req, res) => {
    const { tx } = req.params;

    // check that the transaction is stored
    const transaction = txs.find(t => t.transaction === tx);
    if (!transaction) {
        console.log("Transaction not found");
        res.status(400).json({ message: 'Transaction not found' });
        return;
    }
    res.status(200).json({ message: 'Transaction found', transaction: transaction });
})

// Start the server
app.listen(PORT, () => {
    // createTransaction();
    console.log(`PrivacyVisa server is running on port ${PORT}`);
});

// Function to hash the Object using SHA-256 and convert it to a BigInt-compatible format
function hashObjectToBigInt(input) {
    const hash = crypto.createHash('sha256').update(JSON.stringify(input)).digest('hex');
    return BigInt('0x' + hash).toString();
}