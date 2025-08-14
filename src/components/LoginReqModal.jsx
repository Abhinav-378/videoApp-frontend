import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function LoginReqModal({ onClose }) {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    onClose();
    navigate('/login');
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
        <div className="bg-gray-800 md:p-10 p-6 rounded-lg shadow-lg w-fit text-white text-center flex flex-col justify-center items-center gap-2 ">
          <h2 className="text-lg sm:text-2xl font-semibold ">Login Required!</h2>
          <p className="mt-2 sm:text-lg">Please log in to access this feature.</p>
          <div className='p-2 mt-5'>
              <button className="bg-[#9147ff] text-white px-4 py-2 rounded-xl cursor-pointer" onClick={handleLoginClick}>Login</button>
            <button onClick={onClose} className="bg-gray-700 text-white px-4 py-2 rounded-xl ml-2 cursor-pointer" >Cancel</button>
          </div>
        </div>
    </div>
  )
}

export default LoginReqModal
