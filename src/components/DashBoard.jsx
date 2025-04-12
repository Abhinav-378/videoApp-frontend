import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
const API_URL = import.meta.env.VITE_API_URL


function DashBoard() {
    
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(null);
    const [userVideos, setUserVideos] = useState(null);
    const [userData, setUserData] = useState(null)
    useEffect(()=>{
        const fetchUser = async () => {
            try{
                setLoading(true)
                const user = await axios.get(`${API_URL}/users/current-user`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                console.log(user.data.data)
                setUserData(user.data.data)
            }
            catch (error) {
                console.error('Error fetching user data:', error)
            }
            finally {
                setLoading(false)
            }
        }
        const getChannelStats = async()=>{
            try {
                setLoading(true)
                const userStats = await axios.get(`${API_URL}/dashboard/stats`,{
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                console.log(userStats.data.data)
                setStats(userStats.data.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        const getChannelVideos = async()=>{
            try {
                setLoading(true)
                const userVideos = await axios.get(`${API_URL}/dashboard/videos`,{
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                console.log(userVideos.data.data)
                setUserVideos(userVideos.data.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        getChannelStats()
        getChannelVideos()
        fetchUser()
    }, [])
  return (
    <div className='text-white'>
      {/* show coverImage if present */}
        {userData && userData.coverImage && (
            <img src={userData.coverImage} alt="cover" className='w-full h-auto min-h-32 object-cover' />
        )}
        {/* stats */}
        <div className='flex flex-col justify-between items-start gap-2 p-8'>
            {/* avatar */}
            <img src={userData?.avatar} alt="user" className='w-32 h-32 rounded-full'
            />
            <h1 className='text-3xl font-bold'>{userData?.fullName}</h1>
            <p className='text-lg text-gray-500'>@{userData?.username}</p>
            <div className='flex gap-1 items-center'>
                <p className='text-sm text-gray-200'>{stats?.totalSubscribers} Subscribers</p>
                <span className='text-sm text-gray-400'>|</span>
                <p className='text-sm text-gray-200'>{stats?.totalVideos} Videos</p>
            </div>
        </div>
    </div>
  )
}


export default DashBoard
