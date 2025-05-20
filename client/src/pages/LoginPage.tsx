import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/users/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      toast.success("Login Successful");
      navigate("/dashboard");
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        if (errorMessage === "User Does not exist, Register first") {
          toast.error("User does not exist, Register first");
        } else if (errorMessage === "Email or Password is missing") {
          toast.error("Email or Password is missing");
        } else if (errorMessage === "Incorrect password") {
          toast.error("Invalid Credentials");
        }
      } else {
        toast.error("Server Error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl px-10 py-12 max-w-md w-full text-white"
      >
        <h2 className="text-3xl font-extrabold text-center mb-8 tracking-wide">
          🔐 Sign In to Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 font-semibold tracking-wide transition"
          >
            Login
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-200">
          Don’t have an account?{" "}
          <a href="/register" className="underline text-violet-300 hover:text-violet-500">
            Register
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
