// Landing.js (Frontend)
import React from 'react';

function Landing() {
  const handleLogin = async () => {
    try {
      // Redirect to Google OAuth login endpoint
      window.location.href = 'http://localhost:9000/auth/google';
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div>
      <h1>Welcome to Our Website</h1>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
}

export default Landing;
