import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import UploadVideoModal from "./UploadVideoModal";
const API_URL = import.meta.env.VITE_API_URL;

function DashBoard() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState();
  const [userVideos, setUserVideos] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const user = await axios.get(`${API_URL}/users/current-user`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(user.data.data);
        setUserData(user.data.data);
        console.log("userData:", userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    const getChannelStats = async () => {
      try {
        setLoading(true);
        const userStats = await axios.get(`${API_URL}/dashboard/stats`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(userStats.data.data);
        setStats(userStats.data.data);
        console.log("stats:", stats);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    const getChannelVideos = async () => {
      try {
        setLoading(true);
        const userVideos = await axios.get(`${API_URL}/dashboard/videos`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(userVideos.data.data);
        setUserVideos(userVideos.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getChannelStats();
    getChannelVideos();
    fetchUser();
  }, []);
  return (
    <div className="text-white">
        {showModal && (
            <UploadVideoModal
                setShowModal={setShowModal}
                userData={userData}
            />
            )}
        {/* loading */}
        

      {/* show coverImage if present */}
      {userData && userData.coverImage && (
        <img
          src={userData.coverImage}
          alt="cover"
          className="w-full h-auto min-h-32 object-cover"
        />
      )}
      {/* stats */}
      <div className="flex flex-col justify-between items-start gap-2 p-8">
        {/* avatar */}
        {/* <img src={userData?.avatar} alt="user" className='w-32 h-32 rounded-full'/> */}
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-3xl font-bold">{userData?.fullName}</h1>
            <p className="text-lg text-gray-500">@{userData?.username}</p>
          </div>
          <div>
            {/* upload video button */}
            <button
              id="upload"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              onClick={() => setShowModal(true)}
            >
              Upload Video
            </button>
          </div>
        </div>
        <div className="flex gap-3 flex-col md:flex-row items-center justify-around w-full mt-5">
          <div className="py-4 px-5 mx-2 w-full md:w-1/3 bg-gray-700 rounded-xl">
            <p className="text-lg text-gray-200 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              Total Views
            </p>
            {/* total views from stats */}
            <p className="text-2xl font-bold">{stats?.totalViews}</p>
          </div>
          <div className="py-4 px-5 mx-2 w-full md:w-1/3 bg-gray-700 rounded-xl">
            <p className="text-lg text-gray-200 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                />
              </svg>
              Total Subscribers
            </p>
            {/* total views from stats */}
            <p className="text-2xl font-bold">{stats?.totalSubscribers}</p>
          </div>
          <div className="py-4 px-5 w-full mx-2 md:w-1/3 bg-gray-700 rounded-xl">
            <p className="text-lg text-gray-200 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              Total Likes
            </p>
            {/* total views from stats */}

            <p className="text-2xl font-bold">{stats?.totalLikes}</p>
          </div>
        </div>
        {/* will display all the videos in a table later after implementing upload video feature*/}
      </div>
    </div>
  );
}

export default DashBoard;
