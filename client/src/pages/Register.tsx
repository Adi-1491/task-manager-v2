import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and Password are required");
      return;
    }
    try {
      await axios.post("http://localhost:8000/api/users/register", {
        email,
        password,
      });
      toast.success("Registration successful. Please login.");
      navigate("/login");
    } catch (error: any) {
      const msg = error.response?.data?.message;
      if (msg === "User Exists") {
        toast.error("User already exists. Please login.");
      } else {
        toast.error(msg || "Server error.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-3xl px-10 py-12 w-full max-w-md text-white"
      >
        <h2 className="text-3xl font-extrabold text-center mb-8 tracking-wide">
          Register 🚀
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-white/80">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-white/80">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-2.5 rounded-xl shadow-md hover:shadow-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-white/70">
          Already have an account?{" "}
          <a href="/login" className="text-purple-400 hover:underline">
            Login here
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
