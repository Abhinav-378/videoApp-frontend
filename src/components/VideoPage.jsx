import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";

function VideoPage() {
  const { videoId } = useParams();
  const {user} = useAuth();
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
  const fetchVideo = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/videos/${videoId}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      setVideo(response.data.data);
      console.log("video", response.data.data);
    } catch (error) {
      setError(error.response.data.message || "Something went wrong");
      console.error("Error fetching video:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchChannel = async (channelName) => {
    try {
      const response = await axios.get(
        `${API_URL}/users/channel/${channelName}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("channel", response.data.data);
      setChannel(response.data.data);
    } catch (error) {
      setError(error.response.data.message || "Something went wrong");
      console.error("Error fetching channel:", error);
    }
  };
  const toggleSubscription = async() => {
    if(!user){
        navigate('/login');
        return;
    }
    try {
      setLoading(true);
        const response = await axios.post(
        `${API_URL}/subscriptions/c/${channel?._id}`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        setChannel((prev)=>({
           ...prev,
           isSubscribed : !prev.isSubscribed,
           subscriberCount: prev.isSubscribed?
            prev.subscriberCount-1 : prev.subscriberCount+1
        }))
      
    } catch (error) {
        setError(error.response.data.message || "Something went wrong");
        console.error("Error fetching channel:", error);
    }
    finally {
      setLoading(false);
    }
  }
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
  useEffect(() => {
    fetchVideo();
  }, [videoId]);
  useEffect(() => {
    if (video) {
      fetchChannel(video.owner.username);
    }
  }, [video]);
  return (
    <div className="text-white">
      {loading && (
        <div className="flex justify-center items-center h-screen w-full bg-black opacity-50 fixed top-0 left-0 z-50">
          Loading...
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center h-screen w-full fixed top-0 left-0 z-50">
          <h1 className="text-3xl text-white">{error}</h1>
        </div>
      )}
      {video && (
        <div className="flex flex-col items-start justify-center gap-2 w-full md:w-[80%] ">
          <video controls className="w-full mt-4 rounded-lg">
            <source src={video.videoFile} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <h1 className="text-white text-xl my-2 font-semibold">
            {video.title}
          </h1>
          <div className="flex flex-row justify-between items-center w-full px-5">
            <div className="flex flex-row justify-center items-center gap-2">
              <img
                src={channel?.avatar}
                alt={channel?.username}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex flex-col justify-center items-start">
                <h1 className="text-lg font-semibold">{channel?.username}</h1>
                <p className="text-sm font-semibold text-gray-300 ">
                  {channel?.subscriberCount} subscribers
                </p>
              </div>
            </div>
            
            <div
            onClick={() => {
                toggleSubscription(channel?._id);
            }}
            >
            {channel?.isSubscribed ? (
                <button className="bg-[#4d4d4d] text-white rounded-full px-4 py-2 hover:bg-[#343434]">
                Unsubscribe
                </button>
            ) : (
                <button className="bg-[#9147ff] text-white rounded-full px-4 py-2 hover:bg-[#7a3fdb]">
                Subscribe
                </button>
            )}
            </div>
            
          </div>
          <div className="w-full bg-[#303030] p-3 rounded-2xl my-3">
            <p className="text-base font-semibold text-gray-300 ">
              {video.views} views • {timeAgo(video.createdAt)}
            </p>
            <p>{video.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPage;
