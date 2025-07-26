import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import logo from '../assets/logo.png'
import axios from 'axios'

function Navbar({ onToggle }) {
  const navigate = useNavigate()
  const { user, login, logoutUser } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL
  const [searchQuery, setSearchQuery] = useState("");

  // Add refs and timer state
  const dropdownRef = useRef(null)
  const timeoutRef = useRef(null)
  const mobileSearchRef = useRef(null)

  // Auto-close dropdown functionality
  useEffect(() => {
    if (showDropdown) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      // Set new timeout to close dropdown after 2 seconds
      timeoutRef.current = setTimeout(() => {
        setShowDropdown(false)
      }, 2000)
    }

    // Cleanup timeout on unmount or when dropdown closes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [showDropdown])

  // Focus on mobile search input when it opens
  useEffect(() => {
    if (showMobileSearch && mobileSearchRef.current) {
      mobileSearchRef.current.focus()
    }
  }, [showMobileSearch])

  // Handle mouse enter - cancel auto-close
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  // Handle mouse leave - restart auto-close timer
  const handleMouseLeave = () => {
    if (showDropdown) {
      timeoutRef.current = setTimeout(() => {
        setShowDropdown(false)
      }, 1000)
    }
  }

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault(); 
    
    if (searchQuery.trim() === '') {
      navigate('/');
    } else {
      navigate(`/search/${searchQuery.trim()}`);
    }
    setSearchQuery(""); 
    setShowMobileSearch(false); // Close mobile search after submitting
  };

  const handleMobileSearchToggle = () => {
    setShowMobileSearch(!showMobileSearch)
    if (showMobileSearch) {
      setSearchQuery("") // Clear search query when closing
    }
  }

  const handleMobileSearchClose = () => {
    setShowMobileSearch(false)
    setSearchQuery("")
  }
  
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
      // logout locally
      logoutUser();
      navigate('/login')
    }
  }

  const handleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  return (
    <>
      <div className='flex justify-around items-center bg-[#141414] text-white p-4 h-16 fixed top-0 left-0 w-full z-50 md:ml-5'>
        {/* Mobile Search Overlay */}
        {showMobileSearch && (
          <div className='absolute inset-0 bg-[#141414] flex items-center px-4 z-60 sm:hidden'>
            <button
              onClick={handleMobileSearchClose}
              className='mr-3 p-1'
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
            <form onSubmit={handleSearch} className='flex-1'>
              <input 
                ref={mobileSearchRef}
                type="text" 
                placeholder="Search videos..." 
                className="w-full py-2 px-4 rounded-full border-2 border-gray-500 bg-[#1a1a1a] focus:outline-none focus:border-purple-500 text-white" 
                onChange={handleChange}
                value={searchQuery}
              />
            </form>
            <button
              type="submit"
              onClick={handleSearch}
              className='ml-3 p-2 bg-[#9147ff] rounded-full hover:bg-[#7f3eff] transition-colors'
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </div>
        )}

        {/* Regular Navbar Content */}
        <button
          onClick={onToggle}
          className="hidden md:block fixed left-1 top-4 transform translate-x-1/2 
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
        
        <div className='' id='logo'>
         <Link to="/">
         <img src={logo} alt="VideoTube" className='h-10' />
         </Link>  
        </div>
        
        <div>
          {/* Desktop search bar */}
          <form onSubmit={handleSearch}>
            <input 
            type="text" 
            placeholder="Search" 
            className="hidden sm:block py-2 px-4 rounded-full w-80 border-2 border-gray-500 bg-[#1a1a1a] focus:outline-none focus:border-purple-500" 
            onChange={handleChange}
            value={searchQuery}
            />
          </form>
          
          {/* Mobile search icon */}
          <div 
            className='block sm:hidden relative cursor-pointer p-2'
            onClick={handleMobileSearchToggle}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
        </div>
        
        {/* User profile or login buttons */}
        {login ? (
          <div className='relative hidden sm:block' ref={dropdownRef}>
            <img 
              src={user?.avatar} 
              alt="user" 
              className='w-10 h-10 rounded-full shadow-md shadow-purple-500/30 cursor-pointer'
              onClick={handleDropdown}
            />
            {showDropdown && (
              <div 
                id='details' 
                className='absolute bg-[#141414] text-white p-4 rounded-md shadow-md shadow-purple-300/30 top-12 w-40 right-0 flex flex-col gap-1'
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link to={'dashboard'}>
                  <div className='text-lg px-3 py-1 hover:bg-[#303030] rounded-md cursor-pointer transition-all duration-300'>
                    View Profile
                  </div>
                </Link>
                <div 
                  className='text-lg px-3 py-1 hover:bg-[#7f3eff] rounded-md cursor-pointer transition-all duration-300' 
                  onClick={handleLogout}
                >
                  Log out
                </div>
              </div>
            )}  
          </div>
        ) : (
          <div className='sm:flex items-center hidden '>
            <Link to={'/login'} >
              <button className='bg-gray-700 text-white px-4 py-2 mx-2 rounded-sm cursor-pointer'>
                Login
              </button>
            </Link>
            <Link to={'/signup'} >
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
