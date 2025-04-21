import React, { use } from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const VITE_API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
function ChannelPage() {
  //extract the channelId from the URL
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userVideos, setUserVideos] = useState(null);
  const { userid } = useParams();
  // console.log(userid);
  //fetch the channel data from the server using the channelId
  //use useEffect to fetch the data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${VITE_API_URL}/users/channel/${userid}`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data.data);
        setUserData(response.data.data);
        // setUserVideos(response.data.userVideos);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userid]);
  return (
    <div className="text-white">
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
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center w-full p-5 gap-5">
          <div>
            {/* avatar */}
            <img
              src={userData?.avatar}
              alt="user"
              className="w-32 h-32 rounded-full border-1 border-[#e6d7fd]"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{userData?.fullName}</h1>
            <p className="text-lg text-gray-400">@{userData?.username}</p>
            <p className="text-sm text-gray-400 ">
              {userData?.subscriberCount} Subscribers |{" "}
              {userData?.channelsSubscribedToCount} Subscribed{" "}
            </p>
          </div>
        </div>
        <div>
          {/* subscibe button */}
          <button className="bg-[#9147ff] text-white rounded-lg px-4 py-2 hover:bg-[#7a3fdb]">
            {userData?.isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
          {/* to implement toggle subscribe */}
        </div>
      </div>
    </div>
  );
}

export default ChannelPage;
