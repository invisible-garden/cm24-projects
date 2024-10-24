import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useParams } from 'react-router-dom';

export default function CheckoutConfirmation() {
  const [status, setStatus] = useState('pending');
  const { tx } = useParams();

  useEffect(() => {
    // Simulate order approval after 3 seconds
    const timer = setTimeout(() => {
      setStatus('approved');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5050/check-transaction/${tx}`);
        const data = await res.json();
        setOrderDetails(data.transaction.a.items);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    }
    fetchOrderDetails();
  }, [tx]);

  const totalPrice = orderDetails.reduce(
    (sum, item) => sum + parseFloat(item.price.replace('$', '')),
    0
  );

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" gutterBottom align="center">
          Order Confirmation
        </Typography>
        <Divider sx={{ my: 2 }} />
        {status === 'pending' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Processing your order...
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60 }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Order Approved!
            </Typography>
          </Box>
        )}
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        <List>
          {orderDetails.map((item, index) => (
            <ListItem key={index} sx={{ py: 0 }}>
              <ListItemText primary={item.name} />
              <Typography variant="body1">{item.price}</Typography>
            </ListItem>
          ))}
          <Divider sx={{ my: 1 }} />
          <ListItem sx={{ py: 1 }}>
            <ListItemText primary="Total" primaryTypographyProps={{ fontWeight: 'bold' }} />
            <Typography variant="body1" fontWeight="bold">
              ${totalPrice.toFixed(2)}
            </Typography>
          </ListItem>
        </List>
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => console.log('Return to homepage')}
        >
          Return to Homepage
        </Button>
      </Paper>
    </Box>
  );
}
