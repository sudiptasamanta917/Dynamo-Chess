import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const AuthenticationSuccess = () => {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) {
          navigate('/login');
          return;
        }
        
        // Save token (just as string, not JSON string)

        // Call backend profile endpoint
        const url = `${import.meta.env.VITE_URL}${import.meta.env.VITE_PROFILE}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: token, // Already includes "Bearer"
          },
        });
        localStorage.setItem("User Detail", JSON.stringify(response.data));
        localStorage.setItem("chess-user-token",JSON.stringify(response.data.token));
        // Redirect user
        // navigate('/');
      } catch (err) {
        console.error('Error fetching profile:', err);
        navigate('/login');
      }
    };
    fetchProfile();
  }, [navigate, token]);
  return <p>Logging you in...</p>;
};
export default AuthenticationSuccess;