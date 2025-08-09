import React from 'react'
import signupimg from '../assets/signupImg.png'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL;

function SignUp() {
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
    coverImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post(
        `${API_URL}/users/register`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Registration successful:', response.data);
      setIsRegistered(true);
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row just items-center  text-white px-4 w-full overflow-y-auto ">
      {/* Registration Form Section */}
      <div className="flex flex-col justify-center items-center gap-3 w-full md:w-1/2 py-4 sm:px-4">
        <h1 className="text-3xl md:text-4xl font-bold">Register</h1>
        <p className="text-sm text-gray-400 py-1">
          Before we start, please create your account
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
          {/* Full Name */}
          <div className="flex flex-col">
            <label className="text-sm mb-1" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              onChange={handleInputChange}
              value={formData.fullName}
              placeholder="Enter your full name"
              required
              className="bg-[#141414] text-white border-2 border-gray-700 rounded-md p-3 focus:border-[#9147ff] focus:outline-none"
            />
          </div>

          {/* Username */}
          <div className="flex flex-col">
            <label className="text-sm mb-1" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
              placeholder="Enter your username"
              required
              className="bg-[#141414] text-white border-2 border-gray-700 rounded-md p-3 focus:border-[#9147ff] focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
              placeholder="Enter your email"
              required
              className="bg-[#141414] text-white border-2 border-gray-700 rounded-md p-3 focus:border-[#9147ff] focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-sm mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
              placeholder="Enter your password"
              required
              className="bg-[#141414] text-white border-2 border-gray-700 rounded-md p-3 focus:border-[#9147ff] focus:outline-none"
            />
          </div>

          {/* Avatar Image */}
          <div className="flex flex-col">
            <label className="text-sm mb-1" htmlFor="avatar">
              Avatar Image
            </label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              name="avatar"
              onChange={handleFileChange}
              className="bg-[#141414] text-white border-2 border-gray-700 rounded-md p-2 focus:border-[#9147ff] focus:outline-none"
            />
          </div>

          {/* Cover Image */}
          <div className="flex flex-col">
            <label className="text-sm mb-1" htmlFor="coverImage">
              Cover Image
            </label>
            <input
              id="coverImage"
              type="file"
              accept="image/*"
              name="coverImage"
              onChange={handleFileChange}
              className="bg-[#141414] text-white border-2 border-gray-700 rounded-md p-2 focus:border-[#9147ff] focus:outline-none"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className={`bg-[#9147ff] text-white rounded-md p-3 mt-2 
                        ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#7f3eff]'} 
                        transition-colors`}
          >
            {loading ? 'Registering...' : isRegistered ? 'Registered' : 'Register'}
          </button>

          <p className="text-sm ">
            Already have an account?{' '}
            <a href="/login" className="text-[#9147ff]">
              Login
            </a>
          </p>
        </form>
      </div>

      {/* Image Section */}
      <div className="hidden md:flex flex-col justify-center items-center w-full md:w-1/2 p-4">
        <img src={signupimg} alt="Sign Up" className="max-w-full h-auto" />
      </div>
    </div>
  );
}

export default SignUp;
