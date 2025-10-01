

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
const  backendurl=import.meta.env.VITE_BACKEND_URL;

const Login = ({ isSignup = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we're on /home with a token in the query
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    // console.log('Login.js: Location:', location); // Debug
    // console.log('Login.js: Token from URL:', token); // Debug
    if (token) {
      localStorage.setItem('token', token);
      console.log('Login.js: Token stored in localStorage:', token); // Debug
      navigate('/home', { replace: true }); // Replace to avoid query string in URL
    }else{
      console.log("Token is not  exits");
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl mb-4">{isSignup ? 'Signup' : 'Login'}</h2>
        <a href={`${backendurl}/auth/google`} className="bg-blue-500 text-white px-4 py-2 rounded">
          {isSignup ? 'Signup' : 'Login'} with Google
        </a>
      </div>
    </div>
  );
};

export default Login;