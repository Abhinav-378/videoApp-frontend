import React, { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext'
import axios from 'axios'
import { useParams } from 'react-router-dom'
function PlaylistModal({setShowPlaylistModal, setLoading}) {
    const { user } = useAuth()
    const { videoId } = useParams()
    const [playlist, setPlaylist] = useState([])
    const API_URL =
        import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
    const fetchPlaylist = async () => {
        try {
            setLoading(true)
            console.log('user: ', user)
            const response = await axios.get(
                `${API_URL}/playlists/user/${user._id}`,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
            console.log('response: ', response.data.data)
            setPlaylist(response.data.data)
        } catch (error) {
            console.error('Error fetching playlists:', error)
        } finally {
            setLoading(false)
        }
    }
    const addPlaylist = async () => {
        try {
            setLoading(true)
            const playlistName = document.querySelector('#playlistInputBox').value
            console.log('playlistName: ', playlistName)
            if(!playlistName.trim()){
                alert('Please enter a playlist name')
                return;
            }
            console.log('playlistName: ', playlistName)
            const response = await axios.post(
                `${API_URL}/playlists`,
                {
                    name: playlistName,
                    owner: user._id,
                },
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
            document.querySelector('#playlistInputBox').value = ''
            console.log('response: ', response.data.data)
            setPlaylist((prev) => [...prev, response.data.data])
        } catch (error) {
            console.error('Error creating playlist:', error)
        } finally {
            setLoading(false)
        }
    }
    
    const togglePlaylistStatus = async (playlist) => {
        try {
            setLoading(true)
            const isVideoInPlaylist = playlist.videos.includes(videoId)
            const endPoint = isVideoInPlaylist?'remove' : 'add';

            const response = await axios.patch(
                `${API_URL}/playlists/${endPoint}/${videoId}/${playlist._id}/`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
            console.log('response: ', response.data.data)
            setPlaylist(prevPlaylists => 
            prevPlaylists.map(p => {
                if (p._id === playlist._id) {
                    return {
                        ...p,
                        videos: isVideoInPlaylist 
                            ? p.videos.filter(id => id !== videoId)
                            : [...p.videos, videoId]
                    };
                }
                return p;
            })
        );
        } catch (error) {
            console.error('Error updating playlist:', error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchPlaylist()
    }, [user])
  return (
    <>
      <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-50 text-white'>
        <div className="bg-[#242424] rounded-lg p-6 w-full max-w-96 shadow-lg text-white relative">
        {/* Close Button */}
        <button
          onClick={() => setShowPlaylistModal(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          &times;
        </button>
        <div className='flex flex-col gap-4'>
            Playlists
            <div className='flex flex-col gap-2'>
                {playlist?.map((item) => (
                    <div key={item._id} className='bg-[#111111] p-2 rounded-lg flex flex-row gap-5 items-center justify-start'>
                        <input type="checkbox" name="" id={item._id} className='accent-purple-500 w-5 h-5 '
                        checked={item.videos.includes(videoId)} onChange={()=> togglePlaylistStatus(item)}
                         />
                        <h1 className='text-white'>{item.name}</h1>
                    </div>
                ))}
            </div>
            <div className='flex flex-row gap-2 justify-around items-center'>
                <input id="playlistInputBox" type="text" placeholder='Enter playlist name' className='w-full max-w-40 bg-[#11111] text-white border-gray-600 border-1 rounded-lg px-3 py-2 '/>
                <button className='bg-[#7f3eff] text-white rounded-lg py-2 px-3' onClick={() => {addPlaylist()}}>
                    Create Playlist
                </button>
            </div>
        </div>

        </div>
      </div>
    </>
  )
}

export default PlaylistModal
