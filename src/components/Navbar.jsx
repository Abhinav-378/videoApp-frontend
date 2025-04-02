import React from 'react'

function Navbar() {
  return (
    <>
      <div className='flex justify-around items-center bg-[#141414] text-white p-4 h-16 fixed top-0 left-0 w-full z-10'>
        <div>VideoTube</div>
        <div>
            {/* //search bar */}
            <input type="text" placeholder="Search" className="p-2 rounded-lg border-2 border-gray-500" />
        </div>
        <div>
            <button className='bg-gray-700  text-white px-4 py-2 mx-2 rounded-sm  '>
                Login
            </button>
            <button className='bg-[#9147ff] text-white px-4 py-2 mx-2 rounded-sm'>
                Signup
            </button>
        </div>
      </div>
    </>
  )
}

export default Navbar
