import React, { useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
//import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent)=>{
    e.preventDefault();

    try{
      const response = await axios.post("http://localhost:8000/api/users/login",{
          email,
          password
      });
      localStorage.setItem("token",response.data.token);
      toast.success('Login Successful');
      console.log("Login SuccessFull",response.data);
      navigate("/dashboard");
    }
    catch(error:any)
    {
      if(error.response)
        {

        const errorMessage = error.response.data.message;
        if(errorMessage === 'User Does not exist, Register first')
        {
          toast.error("User does not exist, Register first");
        }
        else if(errorMessage === 'Email or Password is missing')
        {
          toast.error("Email or Password is missing");
        }
        else if(errorMessage === 'Incorrect password')
        {
          toast.error("Invalid Credentials");
        }
        console.log("Login Error",error.response.data.message);
      }
      else{
        console.log("Server Error",error.message);
      }
    }
   
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
            <input 
                   type="email"
                   id="email"
                   value={email} 
                   onChange={(e) => setEmail(e.target.value) }
                   placeholder='Enter your Email'
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
            <input 
                  type="password" 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Enter your Password'
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
            Log In
          </button>

        </form>
      </div>
    </div>
  )
}

export default Login;