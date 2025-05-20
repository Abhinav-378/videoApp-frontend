import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import UploadVideoModal from "./UploadVideoModal";
import EditVideoModal from "./EditVideoModal";
const API_URL = import.meta.env.VITE_API_URL;

function DashBoard() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState();
  const [userVideos, setUserVideos] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editVideoData, setEditVideoData] = useState(null);
  const navigate = useNavigate();
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
        console.log("helooooo: ", user.data.data);
        setUserData(user.data.data);
        console.log("userData:", userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response.status === 401) {
          navigate("/login");
        }
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
    
    getChannelStats();
    getChannelVideos();
    fetchUser();
    // console.log("userData111:", userData);
  }, []);
  const togglePublish = async (videoId) => {
    try {
      setLoading(true);
      const res = await axios.patch(
        `${API_URL}/videos/toggle/publish/${videoId}`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data.data);
      setUserVideos((prevVideos) =>
        prevVideos.map((video) =>
          video._id === videoId
            ? { ...video, isPublished: !video.isPublished }
            : video
        )
      );
    } catch (error) {
      console.error("Error toggling publish status:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (videoId) => {
    try {
      setLoading(true);
      const res = await axios.delete(`${API_URL}/videos/${videoId}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res.data.data);
      setUserVideos((prevVideos) =>
        prevVideos.filter((video) => video._id !== videoId)
      );
    } catch (error) {
      console.error("Error deleting video:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (video) => {
    setEditVideoData(video);
    setShowEditModal(true);
  };
  return (
    <div className="text-white">
      {showModal && (
        <UploadVideoModal setShowModal={setShowModal} userData={userData} onSuccess={getChannelVideos} />
      )}
      {showEditModal && (
        <EditVideoModal setShowEditModal={setShowEditModal} editVideoData={editVideoData} setEditVideoData={setEditVideoData} />
      )}
      {/* loading */}
      {loading && (
        <div className="flex justify-center items-center h-screen w-full bg-black opacity-50 fixed top-0 left-0 z-50">
          Loading...
        </div>
      )}

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
        {/* TABLE consists of toggleStatus, status, uploaded(small thumbnail with title), uploaded on, likes and each row will contain its own delete and edit icon for updating a video */}
        <div className="w-full">
          <table className="w-full text-left border-collapse border border-gray-700 mt-5">
            <thead>
            <tr className="bg-gray-800 text-gray-200">
              <th className="border border-gray-700 px-4 py-2">Toggle</th>
              <th className="border border-gray-700 px-4 py-2">Status</th>
              <th className="border border-gray-700 px-4 py-2">Uploaded</th>
              <th className="border border-gray-700 px-4 py-2">Uploaded On</th>
              <th className="border border-gray-700 px-4 py-2">Likes</th>
              <th className="border border-gray-700 px-4 py-2">Actions</th>
            </tr>
            </thead>
            <tbody>
            {userVideos &&
              userVideos.map((video) => (
                <tr key={video._id} className="bg-gray-900 text-gray-200">
                  <td className="border border-gray-700 px-4 py-2">
                    {/* toggle switch */}
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        class="sr-only peer"
                        value=""
                        checked={video.isPublished}
                        onChange={() => togglePublish(video._id)}
                      />
                      <div
                        className="group peer bg-white rounded-full duration-300 w-10 h-5 ring-2 ring-red-500 after:duration-300 after:bg-red-500 peer-checked:after:bg-green-500 peer-checked:ring-green-500 after:rounded-full after:absolute after:h-4 after:w-4 after:top-[2px] after:left-[2px] after:flex after:justify-center after:items-center peer-checked:after:translate-x-5 peer-hover:after:scale-95"
                      ></div>
                    </label>
                  </td>
                  <td className="border border-gray-700 px-4 py-2">
                    {video.isPublished ? "Published" : "Unpublished"}
                  </td>
                  <td className="border border-gray-700 px-4 py-2 flex items-center gap-x-3">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-[100px] h-[50px] object-cover rounded-lg"
                    />
                    {video.title}
                  </td>
                  <td className="border border-gray-700 px-4 py-2">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-700 px-4 py-2">{0}</td>
                  <td className="border border-none py-2 px-4 ">
                    <div className="flex justify-around items-center gap-3">
                      {/* edit and delete icons */}
                      <div
                      className="cursor-pointer"
                      onClick={()=>handleEdit(video)}
                      >
                        {/* edit */}
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
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                          />
                        </svg>
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={() => handleDelete(video)}
                      >
                        {/* delete */}
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
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
