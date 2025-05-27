import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

function PlaylistPage() {
  const [loading, setLoading] = useState(false);
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
  const { playlistId } = useParams()
  // console.log("playlistId: ", playlistId);
  const [playlist, setPlaylist] = useState([]);
  function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / 1000); // in secs

    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
    return `${Math.floor(diff / 31536000)} years ago`;
  }
  const fetchPlaylist = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/playlists/${playlistId}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("response: ", response.data.data);
      setPlaylist(response.data.data);
      if(response.data.data.videos.length === 0){
        setPlaylist((prev) => ({
          ...prev,
          thumbnail: "https://res.cloudinary.com/dwpegmm0x/image/upload/v1747997594/bwrzblj0soanjfrdjopn.jpg"
        }))
      }
      else{
        setPlaylist((prev) => ({
          ...prev,
          thumbnail: response.data.data.videos[0].thumbnail
        }))
      }
      console.log("playlist: ", playlist);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPlaylist();
  }, []);
  return (
    <div className='flex flex-col lg:flex-row gap-4 p-4'>
      <div className='flex flex-col sm:flex-row lg:flex-col  gap-8 lg:gap-4 w-full lg:w-96 justify-start items-center h-auto lg:h-screen lg:bg-[#242424a2] p-8 rounded-lg text-white'>      
        <img
          src={playlist.thumbnail}
          alt="Playlist Thumbnail"
          className="w-80 h-auto object-cover rounded-lg"
        />
        <div className='flex flex-col gap-4 justify-start items-start w-full'>
          <div className='flex flex-col gap-2 justify-start items-start w-full'>
          <h1 className='text-3xl font-bold text-white'>{playlist.name}</h1>
          {playlist.description && (
            <p className='text-gray-400'>{playlist.description}</p>
          )}
          {
            playlist && playlist.owner && (
              <Link to={`/channel/${playlist.owner.username}`} className='flex gap-2 items-center'>
                <img src={playlist.owner.avatar} alt="" className='w-8 h-8 rounded-full' />
                <p className='text-gray-200'>{playlist.owner.fullName}</p>
              </Link>
            )
          }
          <p className='text-gray-400 text-sm'>
            {playlist.videos && playlist.videos.length} videos • Last updated at {(playlist.updatedAt && new Date(playlist.updatedAt).toLocaleDateString()) || "N/A"}
          </p>
        </div>
        

        </div>
      </div>
      <div>
        {loading ? (
          <div className="flex justify-center items-center w-full my-80 text-white text-2xl">
            Loading...
          </div>
        ) : (
          <div className="flex flex-col gap-4 p-4">
            {playlist.videos && playlist.videos.length > 0 ? (
              playlist.videos.map((video) => (
                <Link to={`/watch/${video._id}`} key={video._id} className='flex gap-4 items-start'>
                  <div className='relative'>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-48 h-auto object-cover rounded-lg"
                  />
                  <div className='absolute bottom-2 right-2 rounded-md bg-black/70 text-white px-2 py-1 text-sm'>{video.duration}</div>
                  </div>
                  <div className='flex flex-col'>
                    <h2 className='text-lg font-medium text-white'>{video.title}</h2>
                    <div>
                      <p className='text-gray-400'>{video.description}</p>
                      <p className='text-gray-400 text-sm'>
                        {video.views} views • {timeAgo(video.createdAt)} 
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-white">No videos in this playlist</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PlaylistPage
