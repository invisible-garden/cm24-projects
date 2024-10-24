import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CheckoutPage from './pages/CheckoutPage';
import CheckoutConfirmation from './pages/CheckoutConfirmation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CheckoutPage />} />
        <Route path="/confirmation/:tx" element={<CheckoutConfirmation />} />
      </Routes>
    </Router>
  );
}

export default App;
