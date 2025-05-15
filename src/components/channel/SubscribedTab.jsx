import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams, useOutletContext } from 'react-router-dom';

const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

function SubscribedTab() {

    const [ channelList, setChannelList ] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { channelname } = useParams();
    const {userId} = useOutletContext();
    useEffect(() => {
        const fetchSubscribedChannels = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${VITE_API_URL}/subscriptions/c/${userId}`, {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                console.log("subscribed channels", response);
                setChannelList(response.data.data);
            } catch (error) {
                console.error("Error fetching subscribed channels:", error);
                setError(error.response.data.message);
            }
            finally {
                setLoading(false);
            }
        }
        fetchSubscribedChannels();
    },[])
  return (
    <>
        {loading && (
        <div className="flex justify-center items-center h-screen w-full bg-black opacity-50 fixed top-0 left-0 z-50">
          Loading...
        </div>
      )}
      {/* {error && (
        <div className="flex justify-center items-center h-screen w-full fixed top-0 left-0 z-50">
          <h1 className="text-3xl text-white">{error}</h1>
        </div>
      )} */}
        <div>
        {channelList.length === 0 ?
        <div className='flex justify-center items-center h-48 w-full '>
            No channels subscribed yet
        </div> :
        <div className='flex flex-col gap-4 px-5 md:px-24'>
            {channelList.map((channel) => (
                <div key={channel.id} className="channel flex flex-row justify-start items-center gap-8 p-4">
                    <img src={channel.avatar} alt={channel.name} className="w-24 h-24 rounded-full " />
                    <div className="channel-info">
                        <h2 className="text-xl text-white">{channel.fullName}</h2>
                        <p className="text-base text-gray-400">@{channel.username}</p>
                    </div>
                </div>
            ))}
        </div>
        }
        </div>
    </>
  )
}

export default SubscribedTab
