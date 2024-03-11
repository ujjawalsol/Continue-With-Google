// App.js (Frontend)
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import Landing from './Components/Landing';
import Dashboard from './Components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Function to check if the user is authenticated
  const checkAuth = async () => {
    try {
      const response = await axios.get('http://localhost:9000/api/user');
      return response.data;
    } catch (error) {
      throw new Error('User not authenticated');
    }
  };

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard checkAuth={checkAuth} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
    </Routes>
  </Router>
  );
}

export default App;
