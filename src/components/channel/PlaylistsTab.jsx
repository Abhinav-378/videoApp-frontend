import React from 'react'
import { useEffect, useState } from 'react'
import { useOutletContext, Link } from 'react-router-dom'
import axios from 'axios'


function PlaylistsTab() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [playlists, setPlaylists] = useState([])
  const { userId } = useOutletContext();
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
      // console.log('response: ', response.data.data)
      setPlaylists(response.data.data)
    } catch (error) {
      console.error('Error fetching playlists:', error)
      setError(error?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  const fetchPlaylistThumbnail = async () => {
    let i = 0;
    for (let playlist of playlists) {
      if (playlist.videos.length == 0) {
        playlists[i].thumbnail = defaultThumbnail
      } else {
        const videoId = playlist.videos[0]
        try {
          setLoading(true)
          const response = await axios.get(
            `${API_URL}/videos/${videoId}`,
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
          // console.log('response: ', response.data.data)
          playlists[i].thumbnail = response.data.data.thumbnail
        } catch (error) {
          console.error('Error fetching playlist thumbnail:', error)
          setError(error?.response?.data?.message || 'Something went wrong')
        }
        finally {
          setLoading(false)
        }

      }
      i++;
    }
  }
  useEffect(() => {
    fetchPlaylists()
  }, [])
  useEffect(() => {
    fetchPlaylistThumbnail()
  }, [playlists])
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

      {!loading && !error && playlists.length > 0 && (
        <div className="flex flex-col gap-4 p-4">
          <h1 className="text-2xl text-white">Playlists</h1>
          <div className="flex flex-col md:flex-row gap-4">
            {playlists.map((playlist) => (
              <div key={playlist._id} className="text-white w-full md:w-1/3 justify-start items-start p-3">
                <Link to={`/playlist/${playlist._id}`} key={playlist._id}>
                  <div className=' relative  w-full aspect-video'>
                    <img
                      src={playlist.thumbnail}
                      alt={playlist.name}
                      className=" rounded-lg w-full h-full object-cover object-center "
                    />
                    <p className='absolute bottom-2 right-2 rounded-md bg-black/70 text-white px-2 py-1 text-sm flex items-center gap-1'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811Z" />
                      </svg>
                      {playlist.videos.length} videos</p>
                  </div>
                  <div className='font-semibold text-lg my-2'>
                    {playlist.name}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PlaylistsTab