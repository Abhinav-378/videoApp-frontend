import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import axios from 'axios'
function Navbar({ onToggle}) {
  const navigate = useNavigate()
  const {user, login, logoutUser} = useAuth();
  const [showDropdown, setShowDropdown] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL
  // Check auth status on mount and when localStorage changes

  async function handleLogout() {
    try {
      await axios.post(`${API_URL}/users/logout`, {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      logoutUser();
      setShowDropdown(false)
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  return (
    <>
      <div className='flex justify-around items-center bg-[#141414] text-white p-4 h-16 fixed top-0 left-0 w-full z-10'>
      <button
        onClick={onToggle}
        className="fixed left-1 top-4 transform translate-x-1/2 
          bg-[#9147ff] rounded-full p-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 9h16.5m-16.5 6.75h16.5"
          />
        </svg>
      </button>
        <div className='' id='logo'>VideoTube</div>
        <div>
          {/* //search bar */}
          <input type="text" placeholder="Search" className="p-2 rounded-lg border-2 border-gray-500" />
        </div>
        {/* // if user is logged in, show profile picture and username else login and signup buttons */}
        {login ? (
          <div className='relative'>
            <img src={user?.avatar} alt="user" className='w-10 h-10 rounded-full shadow-md shadow-purple-500/30 cursor-pointer'
              onClick={handleDropdown}
            />
            {showDropdown && (
              <div id='details' className='absolute bg-[#141414] text-white p-4 rounded-md shadow-md shadow-purple-300/30 top-12 w-40 right-0 flex flex-col gap-1'>
                <Link to={'dashboard'}>
                <div className='text-lg px-3 py-1 hover:bg-[#303030] rounded-md cursor-pointer transition-all duration-300'>
                  View Profile
                </div>
                </Link>
                <div className='text-lg px-3 py-1 hover:bg-[#7f3eff] rounded-md cursor-pointer transition-all duration-300' onClick={handleLogout}>
                  Log out
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <Link to={'/login'}>
              <button className='bg-gray-700 text-white px-4 py-2 mx-2 rounded-sm cursor-pointer'>
                Login
              </button>
            </Link>
            <Link to={'/signup'}>
              <button className='bg-[#9147ff] text-white px-4 py-2 mx-2 rounded-sm cursor-pointer'>
                Signup
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

export default Navbar
