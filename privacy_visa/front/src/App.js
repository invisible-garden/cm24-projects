import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreditVerificationPage from './pages/CreditVerificationPage';
// import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreditVerificationPage />} />
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
