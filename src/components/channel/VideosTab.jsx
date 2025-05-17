import React, { use, useEffect, useState } from 'react'
import axios from 'axios';
import { useParams, useOutletContext, Link } from 'react-router-dom';

const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

function VideosTab() {
    const [ videosList, setvideosList ] = useState([])
    const [loading, setLoading] = useState(false);
    const { channelname } = useParams();
    const {userId} = useOutletContext();
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${VITE_API_URL}/videos/c/${userId}`, {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                console.log("videos", response);
                setvideosList(response.data.data);
            } catch (error) {
                console.error("Error fetching videos:", error);
            }
            finally {
                setLoading(false);
            }
        }
        fetchVideos();
    }, [])
  return (
    <>
        {loading && (
        <div className="flex justify-center items-center h-screen w-full bg-black opacity-50 fixed top-0 left-0 z-50">
          Loading...
        </div>
      )}
      
        <div>
        {videosList.length === 0 ?
        <div className='flex justify-center items-center h-48 w-full '>
            No videos uploaded yet
        </div> :
        <div className='flex gap-2 flex-col sm:flex-row items-start justify-start w-full mt-5'>
            {
                videosList.map((video)=>(
                    <Link className='flex flex-col w-full sm:w-1/2 md:w-1/3 justify-start items-start gap-4 p-4 ' to={`/watch/${video._id}`} key={video._id}>
                        <div className='relative'>
                            <img src={video.thumbnail} alt={video.title} className=" rounded-lg w-full h-auto " />
                            <div className='absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-1 text-sm'>{video.duration}</div>          
                        </div>
                        <div className="channel-info">
                            <h2 className="text-base text-white">{video.title}</h2>
                            <p className='text-sm text-gray-400'>{video.views} views</p>
                        </div>
                    </Link>
                    )
                )
            }
        </div>
        }
        </div>
    </>
  )
}

export default VideosTab
