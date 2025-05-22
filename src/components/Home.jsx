import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const API_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRandomVideos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/videos/random?limit=24`);
      setVideos(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching random videos:", error);
      throw error;
    }
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRandomVideos()
  }, [])
  return (
    <div className='bg-[#0f0f0f] w-full h-full p-4'>
      <div>
        {videos.length === 0 ?
        <div className='flex justify-center items-center h-48 w-full '>
            No videos uploaded yet
        </div> :
        <div className='flex flex-col md:flex-row flex-wrap items-start justify-start w-full mt-5'>
            {
                videos.map((video)=>(
                    <Link className='flex flex-col w-full md:w-1/3 justify-start items-start gap-4 p-4 ' to={`/watch/${video._id}`} key={video._id}>
                        <div className='relative'>
                            <img src={video.thumbnail} alt={video.title} className=" rounded-lg w-dvw h-auto  " />
                            <div className='absolute bottom-2 right-2 rounded-md bg-black/70 text-white px-2 py-1 text-sm'>{video.duration}</div>          
                        </div>
                        <div className="channel-info">
                            <h2 className="text-base text-white line-clamp-2">{video.title}</h2>
                            <p className='text-sm text-gray-400'>{video.views} views</p>
                        </div>
                    </Link>
                    )
                )
            }
        </div>
        }
        </div>
    </div>
  )
}

export default Home
