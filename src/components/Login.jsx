import React from 'react'
import loginImg from '../assets/loginImg.png'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
const API_URL = import.meta.env.VITE_API_URL;

function Login() {
    const navigate = useNavigate();
    const { loginUser, fetchUser } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post(
                `${API_URL}/users/login`,
                formData,
                {
                    withCredentials: true, 
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            await fetchUser();
            navigate('/');
            
        } catch (error) {
            // Properly extract error message from axios error response
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               'Something went wrong';
                               
            setError(errorMessage);
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    }
  return (
    <>
      <div className='flex flex-col md:flex-row justify-center items-center bg-[#111111] text-white min-h-screen w-full'>
        <div className='flex flex-col justify-center items-center gap-3 bg-[#111111] text-white p-4 w-full md:w-1/2'>
            <h1 className='text-3xl md:text-4xl font-bold text-center'>Login</h1>
            <p className='text-sm text-center'>Welcome back! Please login to your account</p>
            {/* form */}
            <form className='mt-5 flex flex-col justify-center items-center gap-3 bg-[#111111] text-white p-4 rounded-md w-full max-w-md' onSubmit={handleSubmit}>
                <label className='text-sm'>Email</label>
                <input 
                    type="email"
                    placeholder='Enter your email'
                    required
                    onChange={handleInputChange}
                    value={formData.email}
                    name='email'
                    className='bg-[#111111] text-white border-2 border-gray-700 rounded-md p-3 focus:border-[#9147ff] focus:outline-none w-full max-w-96'/>
                <label className='text-sm'>Password</label>
                <input 
                    type="password" 
                    placeholder='Enter your password' 
                    required
                    onChange={handleInputChange}
                    value={formData.password}
                    name='password'
                    className='bg-[#111111] text-white border-2 border-gray-700 rounded-md p-3 focus:border-[#9147ff] focus:outline-none w-full max-w-96'/>
                
                {error && (
                    <div className="w-fit px-3 py-1 rounded-md bg-red-500/10  text-red-500">
                        {error}
                    </div>
                )}
                
                <button 
                    type='submit' 
                    disabled={loading}
                    className={`bg-[#9147ff] text-white rounded-md p-2 w-80 cursor-pointer
                        ${loading ? 'opacity-50' : 'hover:bg-[#7f3eff]'}`}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <p className='text-sm'>Don't have an account? <a href="/signup" className='text-[#9147ff]'>Sign Up</a></p>
            </form>
        </div>
        <div className='hidden md:flex justify-center items-center bg-[#111111] text-white p-4 w-full md:w-1/2'>
            {/* image with drop shadow of grey*/}
            <img src={loginImg} alt="login" style={{ filter: 'drop-shadow(2px 4px 6px rgba(214, 190, 255, 0.5))' }}  /> 
        </div>
      </div>
    </>
  )
}

export default Login
