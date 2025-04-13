import React, { useState, useEffect } from 'react';
import { Avatar, Box, Typography, Paper, Button } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
const API_URL = process.env.REACT_APP_API_URL;
const UserProfile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('No token found');
          return;
        }

        const response = await axios.get(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const currentUser = response.data;
       console.log('User data:', currentUser); // Log the user data to the consol

        setUserData(currentUser);
      } catch (error) {
        console.error("Error fetching user data:", error.response || error.message);
        toast.error('Error fetching user data');
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return (
      <Paper
        elevation={3}
        sx={{
          position: 'fixed',
          right: 20,
          top: 80,
          zIndex: 1000,
          p: 3,
          borderRadius: 2,
          backdropFilter: 'blur(8px)',
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          minWidth: '200px',
          textAlign: 'center'
        }}
      >
        <Typography>Loading user profile...</Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        right: 20,
        top: 80,
        zIndex: 1000,
        p: 3,
        borderRadius: 2,
        backdropFilter: 'blur(8px)',
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        minWidth: '220px',
        textAlign: 'center'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Avatar
          src={userData.profileImage ? `${API_URL}${userData?.profileImage}`: ''}
          alt={userData.email}
          sx={{
            width: 100,
            height: 100,
            border: '4px solid #fff',
            boxShadow: 3,
          }}
        />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {userData.username || 'User'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userData.email}
          </Typography>
        </Box>

        <Button 
          variant="contained" 
          color="error" 
          size="small"
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login'; 
          }}
          sx={{ mt: 1 }}
        >
          Logout
        </Button>
      </Box>
    </Paper>
  );
};

export default UserProfile;
