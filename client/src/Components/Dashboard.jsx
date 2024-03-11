import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = ({ setIsAuthenticated }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/current_user', { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // The request was unauthorized. Redirect the user to the login page.
          setIsAuthenticated(false);
          window.location.href = '/';
        } else {
          console.error('Failed to fetch user', error);
        }
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      // Sign out from server session
      await axios.get('http://localhost:9000/api/logout', { withCredentials: true });
      setIsAuthenticated(false);

      // Sign out from Google session
      if (window.gapi) {
        const auth2 = window.gapi.auth2.getAuthInstance();
        await auth2.signOut();
      }

      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <>
         <h2>Welcome, {user.displayName}</h2>
          <img src={user.profilePic} alt="Profile" />
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
};

export default Dashboard;