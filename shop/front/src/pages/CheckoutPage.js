import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function CheckoutPage() {
  const [payer, setPayer] = useState("");

  const orderDetails = [
    { name: "item1", price: "10" },
    { name: "item2", price: "20" },
    { name: "item3", price: "40" },
  ];

  const totalPrice = orderDetails.reduce(
    (sum, item) => sum + parseFloat(item.price.replace("$", "")),
    0
  );

  const handleCheckout = async () => {
    try {
      const data = {
        items: orderDetails,
        pi3: payer,
      };
      console.log(data);

      const res = await fetch("http://localhost:5050/create-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json(); // Parse JSON response

      console.log("Transaction created:", result.transaction);

      // Redirect to confirmation page
      window.location.href =
        "http://localhost:3000/" +
        `?txHashed=${encodeURIComponent(
          result.transaction.transaction
        )}&amount=${encodeURIComponent(totalPrice)}`;
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Shop
          </Typography>
          <Button color="inherit">John Doe</Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
          <Typography variant="h4" gutterBottom align="center">
            Checkout
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          <List>
            {orderDetails.map((item, index) => (
              <ListItem key={index} sx={{ py: 0 }}>
                <ListItemText primary={item.name} />
                <Typography variant="body1">{"$ " + item.price}</Typography>
              </ListItem>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListItem sx={{ py: 1 }}>
              <ListItemText
                primary="Total"
                primaryTypographyProps={{ fontWeight: "bold" }}
              />
              <Typography variant="body1" fontWeight="bold">
                ${totalPrice.toFixed(2)}
              </Typography>
            </ListItem>
          </List>
          <Typography variant="h6" gutterBottom>
            Payment Details
          </Typography>
          <TextField
            label="Payer's proof (generated from mobile)"
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            value={payer}
            onChange={(e) => setPayer(e.target.value)}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleCheckout}
            disabled={!payer}
          >
            Proceed to Payment
          </Button>
        </Paper>
      </Box>
    </>
  );
}
