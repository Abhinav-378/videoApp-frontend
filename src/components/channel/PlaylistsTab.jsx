import React from 'react'
import { useEffect, useState } from 'react'
import { useOutletContext, Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../AuthContext'

function PlaylistsTab() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [playlists, setPlaylists] = useState([])
  const [thumbnailsLoaded, setThumbnailsLoaded] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [playlistToDelete, setPlaylistToDelete] = useState(null)
  const { userId } = useOutletContext();
  
  const { user } = useAuth();
  const { channelusername } = useParams()

  console.log("user: ", user);
  console.log("username: ", channelusername);
  const API_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
  const defaultThumbnail = "https://res.cloudinary.com/dwpegmm0x/image/upload/v1747997594/bwrzblj0soanjfrdjopn.jpg"

  const fetchPlaylists = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${API_URL}/playlists/user/${userId}`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      console.log('response playlists: ', response.data.data)
      const playlistsData = response.data.data
      setPlaylists(playlistsData)
      
      // Fetch thumbnails after getting playlists
      if (playlistsData && playlistsData.length > 0) {
        await fetchPlaylistThumbnails(playlistsData)
      }
    } catch (error) {
      console.error('Error fetching playlists:', error)
      setError(error?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const fetchPlaylistThumbnails = async (playlistData) => {
    if (!playlistData || playlistData.length === 0) return

    try {
      const updatedPlaylists = await Promise.all(
        playlistData.map(async (playlist) => {
          let thumbnail = defaultThumbnail
          
          if (playlist.videos && playlist.videos.length > 0) {
            // Handle both cases: video ID directly or video object with _id
            const videoId = typeof playlist.videos[0] === 'string' 
              ? playlist.videos[0] 
              : playlist.videos[0]._id || playlist.videos[0]

            try {
              const response = await axios.get(`${API_URL}/videos/${videoId}`, {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json',
                },
              })
              thumbnail = response.data.data?.thumbnail || defaultThumbnail
            } catch (error) {
              console.error(`Error fetching thumbnail for video ${videoId}:`, error)
              // Keep default thumbnail on error
            }
          }
          
          return {
            ...playlist,
            thumbnail
          }
        })
      )
      
      setPlaylists(updatedPlaylists)
      setThumbnailsLoaded(true)
    } catch (error) {
      console.error('Error fetching playlist thumbnails:', error)
      setError(error?.response?.data?.message || 'Something went wrong')
    }
  }

  const handleDeleteClick = (playlist) => {
    setPlaylistToDelete(playlist)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!playlistToDelete) return

    try {
      await axios.delete(`${API_URL}/playlists/${playlistToDelete._id}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      setPlaylists((prev) => prev.filter((playlist) => playlist._id !== playlistToDelete._id))
      setShowDeleteModal(false)
      setPlaylistToDelete(null)
    } catch (error) {
      console.error('Error deleting playlist:', error)
      setError(error?.response?.data?.message || 'Something went wrong')
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setPlaylistToDelete(null)
  }

  useEffect(() => {
    if (userId) {
      fetchPlaylists()
    }
  }, [userId])

  return (
    <div>
      {loading && (
        <div className="flex justify-center items-center w-full my-80 text-white text-2xl">
          Loading...
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center w-full my-80 text-white text-2xl">
          {error}
        </div>
      )}
      {!loading && !error && playlists.length === 0 && (
        <div className="flex justify-center items-center w-full my-24 text-white text-2xl">
          No playlists found
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              Delete Playlist
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete "{playlistToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && playlists.length > 0 && (
        <div className="flex flex-col gap-4 p-4">
          <h1 className="text-2xl text-white">Playlists</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {playlists.map((playlist) => (
              <div key={playlist._id} className="text-white justify-start items-start p-3">
                <Link to={`/playlist/${playlist._id}`}>
                  <div className='relative w-full aspect-video'>
                    <img
                      src={playlist.thumbnail || defaultThumbnail}
                      alt={playlist.name}
                      className="rounded-lg w-full h-full object-cover object-center"
                      onError={(e) => {
                        e.target.src = defaultThumbnail
                      }}
                    />
                    <p className='absolute bottom-2 right-2 rounded-md bg-black/70 text-white px-2 py-1 text-sm flex items-center gap-1'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811Z" />
                      </svg>
                      {playlist.videos?.length || 0} videos
                    </p>
                  </div>                  
                </Link>
                <div className='flex flex-row justify-between items-center mt-2'>
                  <Link to={`/playlist/${playlist._id}`}>
                    <div className='font-semibold text-lg my-2'>
                      {playlist.name}
                    </div>
                    </Link>
                    {
                      channelusername === user?.username && (
                        <div 
                          onClick={() => handleDeleteClick(playlist)} 
                          className='text-red-500 text-sm cursor-pointer hover:text-red-400 transition-colors'
                        >
                          Delete
                        </div>
                      )
                    }
                  </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PlaylistsTab