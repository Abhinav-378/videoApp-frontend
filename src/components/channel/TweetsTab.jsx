import React, { use, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useOutletContext } from "react-router-dom";
import EditTweetModal from "./EditTweetModal";

const VITE_API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

function TweetsTab() {
  const [tweetsList, setTweetsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { channelname } = useParams();
  const [editTweetData, setEditTweetData ] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { userId, currUser, channelUser } = useOutletContext();
  const fetchTweets = async () => {
    setLoading(true);
      try {
        const response = await axios.get(
          `${VITE_API_URL}/tweets/user/${userId}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data.data);
        setTweetsList(response.data.data);
      } catch (error) {
        console.error("Error fetching tweets:", error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchTweets();
  }, []);

  const handleSubmitTweet = async () => {
    if (!currUser) {
      return;
    }
    setLoading(true);
    try {
      const content = document.querySelector("textarea").value;
      
      if (!content.trim()) {
        alert("Please enter a tweet");
        return;
      }
      const response = await axios.post(
        `${VITE_API_URL}/tweets`,
        {
          content: content,
          owner: currUser._id,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      document.querySelector("textarea").value = "";
      fetchTweets();
    } catch (error) {
      console.error("Error creating tweet:", error);
    } finally {
      setLoading(false);
    }
  }
  const handleDeleteTweet = async (tweetId) => {
    if (!currUser) {
      return;
    }
    setLoading(true);
    try {
      const response = await axios.delete(
        `${VITE_API_URL}/tweets/${tweetId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      fetchTweets();
    }
    catch (error) {
      console.error("Error deleting tweet:", error);
    } finally {
      setLoading(false);
    }
  }
  const handleEditTweet = async (tweet) => {
    setEditTweetData(tweet);
    setShowEditModal(true);
  }
  // func to format time ago
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

  return (
    <div>
      {loading && (
        <div className="flex justify-center items-center h-screen w-full bg-black opacity-50 fixed top-0 left-0 z-50">
          Loading...
        </div>
      )}
      {
        showEditModal && (
          <EditTweetModal setShowEditModal={setShowEditModal} editTweetData={editTweetData} setEditTweetData={setEditTweetData} fetchTweets={fetchTweets} />
        )
      }
      {currUser && channelUser && currUser._id === channelUser._id ? (
        <div>
          <div className="flex flex-col gap-4 px-5 md:px-24">
            <div className="relative w-full">
              <textarea
                placeholder="Write a tweet..."
                className="w-full h-24 bg-[#111111] text-white border border-gray-600 rounded-lg p-4 pr-10"
              />
              <button className="absolute bottom-3 right-2 md:right-3 text-white px-2 md:px-4 py-2 rounded-lg cursor-pointer hover:text-[#9147ff] transition duration-100" onClick={() => {
                handleSubmitTweet();
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      {tweetsList.length > 0 ? (
        <div className="flex flex-col gap-4 px-5 md:px-24  pt-4">
          {tweetsList.map((tweet) => (
            <div key={tweet._id} className="w-full p-4 rounded-lg border-1 border-gray-600">
              <div className="flex items-start gap-4">
                <img
                  src={tweet.owner.avatar}
                  alt="user"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col">
                  <p className="text-lg text-white font-semibold">@{tweet.owner.username} 
                    <span className="text-sm text-gray-500 font-medium "> &emsp; {timeAgo(tweet.updatedAt)} </span> 
                  </p>
                  <p>{tweet.content}</p>
                  
                </div>
              </div>
              {/* edit and delete option if curruser is equal to channeluser */}
              {currUser && channelUser && currUser._id === channelUser._id ? (
                <div className="flex justify-end gap-4 mt-2">
                  <button className="text-[#ae77ff] hover:text-[#9147ff]  hover:bg-gray-800 px-3 py-1 cursor-pointer rounded-lg  transition duration-100" onClick={() => handleEditTweet(tweet)} >
                    Edit
                  </button>
                  <button className="text-red-400 hover:text-red-600 hover:bg-gray-800 px-3 py-1 cursor-pointer rounded-lg transition duration-100" onClick={() => {handleDeleteTweet(tweet._id)}}>
                    Delete
                  </button>
                </div>
              ) : (
                <></>
              )}
              
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center w-full fixed top-0 left-0">
          <h1 className="text-3xl text-red">No tweets yet</h1>
        </div>
      )}
    </div>
  );
}

export default TweetsTab;
