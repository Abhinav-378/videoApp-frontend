import React, { useEffect } from 'react'
import { useState } from 'react'
function Navbar() {
  
  const [login, setLogin] = useState(false)
  const [userData, setUserData] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const handleDropdown = () => {
    setShowDropdown(!showDropdown)
  }
  useEffect(()=>{
    const user = localStorage.getItem('user')
    if(user) {
      setLogin(true)
      setUserData(JSON.parse(user))
    }
  }, [])
  return (
    <>
      <div className='flex justify-around items-center bg-[#141414] text-white p-4 h-16 fixed top-0 left-0 w-full z-10'>
        <div className='' id = 'logo'>VideoTube</div>
        <div>
            {/* //search bar */}
            <input type="text" placeholder="Search" className="p-2 rounded-lg border-2 border-gray-500" />
        </div>
        {/* // if user is logged in, show profile picture and username else login and signup buttons */}
        {login ? (
          <div className='relative'>
            <img src={userData?.avatar} alt="user" className='w-10 h-10 rounded-full  shadow-md shadow-purple-500/30 cursor-pointer' 
            onClick={handleDropdown}
            />
            {showDropdown && (
              <div id='details' className='absolute bg-[#141414] text-white p-4 rounded-md shadow-md shadow-purple-300/30 top-12 w-40 right-0 flex flex-col gap-1'>
              <div className='text-lg px-3 py-1  hover:bg-[#303030] rounded-md cursor-pointer transition-all duration-300'>
                View Profile
              </div>
              <div className='text-lg px-3 py-1 hover:bg-[#7f3eff] rounded-md cursor-pointer transition-all duration-300'>
                Log out
              </div>
            </div>
            )}
            
          </div>
        ):(
          <div>
              <button className='bg-gray-700  text-white px-4 py-2 mx-2 rounded-sm  '>
                  Login
              </button>
              <button className='bg-[#9147ff] text-white px-4 py-2 mx-2 rounded-sm'>
                  Signup
              </button>
          </div>

        )}

      </div>
    </>
  )
}

export default Navbar
