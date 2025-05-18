import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";

function VideoPage() {
  const { videoId } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
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
      if (response.data.data.isPublished === false) {
        setError("This video is not published yet");
        return;
      }
      setVideo(response.data.data);
      // console.log("video", response.data.data);
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
      // console.log("channel", response.data.data);
      setChannel(response.data.data);
    } catch (error) {
      setError(error.response.data.message || "Something went wrong");
      console.error("Error fetching channel:", error);
    }
  };
  const checkLike = async (videoId) => {
    if(!user) {
      console.log("User not logged in for like check");
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/likes/video/${videoId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("like", response.data.data);
      setLiked(response.data.data);
      
    } catch (error) {
      setError(error.response.data.message || "Something went wrong");
      console.error("Error fetching channel:", error);
    }
  };
  const toggleLike = async (videoId) => {
    if (!user) {
      alert("Please login to like the video");
      return;
    }  
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/likes/toggle/v/${videoId}`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        })
      // console.log("like", response.data.data);
      setLiked((prev) => !prev);
      setVideo((prev) => ({
        ...prev,
        likes: prev.likes + (liked ? -1 : 1),
      }));
    } catch (error) {
      setError(error.response.data.message || "Something went wrong");
      console.error("Error fetching channel:", error);
    }
    finally {
      setLoading(false);
    }
  }
  const toggleSubscription = async () => {
    if (!user) {
      navigate("/login");
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
        }
      );
      setChannel((prev) => ({
        ...prev,
        isSubscribed: !prev.isSubscribed,
        subscriberCount: prev.isSubscribed
          ? prev.subscriberCount - 1
          : prev.subscriberCount + 1,
      }));
    } catch (error) {
      setError(error.response.data.message || "Something went wrong");
      console.error("Error fetching channel:", error);
    } finally {
      setLoading(false);
    }
  };
  const addtoWatchHistory = async () => {
    if (!user) {
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/users/history`,
        { videoId: videoId },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Watch history updated", response.data);
    } catch (error) {
      console.error("Error updating watch history:", error);
    }
  };

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
  addtoWatchHistory();
}, []);

// Second useEffect for channel fetch
useEffect(() => {
  if (video) {
    fetchChannel(video.owner.username);
  }
}, [video]);
  useEffect(() => {
    checkLike(videoId);
  }, [user]);
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
            <div className="flex flex-row justify-center items-center gap-2">
              <div onClick={() => {toggleLike(video?._id)}} className="flex flex-col justify-center items-center ">
                {
                  liked
                  ?
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 cursor-pointer">
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
                  :
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                }
                {video?.likes} Likes
              </div>
            
            {user?.username === channel?.username ? (
              <button
                className="bg-[#4d4d4d] text-white rounded-full px-4 py-2 hover:bg-[#343434]"
                onClick={() => {
                  navigate(`/dashboard`);
                }}
              >
                Manage Videos
              </button>
            ) : (
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
