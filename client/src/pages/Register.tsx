import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register: React.FC = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      if(!email || !password)
      {
        toast.error("Email and Password are required");
        return;
      }
      await axios.post("http://localhost:8000/api/users/register",
      { email, password }
      );
      toast.success("Registration successful. Please login.")
      navigate("/login");
    }
    catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        if (errorMessage === "User Exists") {
          toast.error("User already exists. Please login.");
        } else {
          toast.error(errorMessage || "Something went wrong on the server.");
        }
      } else {
        toast.error("Network error. Please try again.");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Create an Account</h2>

        <form onSubmit = {handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
