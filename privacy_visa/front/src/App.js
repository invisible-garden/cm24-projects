import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Grid, Paper } from '@mui/material';
const snarkjs = require('snarkjs')

const User = () => {
  const [publicSignalsSetUp, setPublicSignalsSetUp] = useState(require('./setup_publicSignals.json'));
  const [nonce, setNonce] = useState('');

  useEffect(() => {
    const fetchNonce = async () => {
      try {
        const resNonce = await axios.get('http://localhost:4000/generate-nonce/' + publicSignalsSetUp[1]);
        setNonce(resNonce.data.nonce);
      } catch (error) {
        console.error("Error fetching nonce:", error);
      }
    };

    fetchNonce();
  }, [publicSignalsSetUp]);


  const [formData, setFormData] = useState({
    cardNumber: '',
    cvc: '',
    salt: '',
    txHashed: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const saltHashed = hashStringToBigInt(formData.salt);
    // const cvcHashed = hashStringToBigInt(formData.cvc);

    const input =
    {
      cardNumber: formData.cardNumber,
      pi2: publicSignalsSetUp[0],
      pi3: publicSignalsSetUp[1],
      cvc: formData.cvc,
      salt: formData.salt,
      transaction: formData.txHashed,
      nonce: nonce
    }
    console.log(input);
    // const proof = "s"
    const zkey = '/circuit/cardVerification_0000.zkey'; // Path relative to public folder
    const wasm = '/circuit/cardVerification.wasm';     // Path relative to public folder

    // snarkJS: using the compiled circuit and proving key to generate the proof
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(input, wasm, zkey);
    console.log(proof);
    console.log(publicSignals);

    const dataPost = {
      proof: proof, publicSignals: publicSignals, transaction: formData.txHashed, nonce: formData.nonceHashed
    }
    // sent post request to the bank
    const response = await fetch('http://localhost:4000/verify-transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataPost),
    });
    const data = await response.json();
    if(response.status === 200){
      alert("Transaction Verified");
    }else{
      alert("Transaction Failed");
    }
    console.log(data);
    // redirect to the shop page ex. http://localhost:6000/order-confirmed/:transactionId
    // window.location.href = "http://google.com";
  }
  
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '30px' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Credit Card Verification
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Card Number"
                variant="outlined"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="CVC"
                variant="outlined"
                name="cvc"
                value={formData.cvc}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Salt"
                variant="outlined"
                name="salt"
                value={formData.salt}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="TX Hashed"
                variant="outlined"
                name="txHashed"
                value={formData.txHashed}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nonce Hashed"
                disabled={true}
                variant="outlined"
                name="nonceHashed"
                value={nonce}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                value={publicSignalsSetUp[0]}
                disabled
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                value={publicSignalsSetUp[1]}
                disabled
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default User;