

import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc"; // Google icon

const backendurl = import.meta.env.VITE_BACKEND_URL;

const Login = ({ isSignup = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/home", { replace: true });
    } else {
      console.log("Token does not exist");
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {isSignup ? "Create an Account" : "Welcome Back"}
        </h2>
        <p className="text-center text-gray-500 mb-8">
          {isSignup ? "Sign up to continue" : "Login to your account"}
        </p>

        <a
          href={`${backendurl}/auth/google`}
          className="flex items-center justify-center gap-3 w-full bg-white border border-gray-300 rounded-lg px-5 py-3 text-gray-700 font-medium shadow-md hover:shadow-lg transition duration-300 ease-in-out hover:bg-gray-50"
        >
          <FcGoogle className="text-2xl" />
          {isSignup ? "Sign up" : "Login"} with Google
        </a>

        <div className="mt-6 text-center text-gray-500 text-sm">
         
        </div>
      </div>
    </div>
  );
};

export default Login;
