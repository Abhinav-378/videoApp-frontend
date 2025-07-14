import React, { use } from "react";
import { Link, useParams, NavLink, Outlet, useOutletContext, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";

const VITE_API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
function ChannelPage() {
  //extract the channelId from the URL
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { userid } = useParams();
  const navigate = useNavigate();
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
        setError(error.response.data.message);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userid]);
  const checkSubscription = async (channelId) => {
    if (!user) {
      return;
    }
    try {
      const response = await axios.get(
        `${VITE_API_URL}/subscriptions/c/checkSubscription/${channelId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setUserData((prev) => ({
        ...prev,
        isSubscribed: response.data.data,
      }));
      console.log("subscription check", userData);
    } catch (error) {
      setError(error?.response?.data?.message || "Something went wrong");
      console.error("Error fetching channel:", error);
    }
  };

  const toggleSubscription = async (userId) => {
    if(!user) {
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${VITE_API_URL}/subscriptions/c/${userId}`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setUserData((prev) => ({
        ...prev,
        isSubscribed: !prev.isSubscribed,
        subscriberCount: prev.isSubscribed
          ? prev.subscriberCount - 1
          : prev.subscriberCount + 1,
      }));
      console.log(response);
      
    } catch (error) {
      console.log("Error toggling subscription:", error);
      setError(error.response.data.message);
    }
    finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (user && userData?._id) {
      checkSubscription(userData?._id);
    }
  }, [userData?._id, user]);

  return (
    <div className="text-white">
      {/* loading */}
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
      {/* show userdata if present */}
      {userData && (
        <>
          {/* show coverImage if present */}
          {userData.coverImage && (
            <img
              src={userData.coverImage}
              alt="cover"
              className="w-full h-auto min-h-32 object-cover"
            />
          )}
          <div className="flex flex-col md:flex-row items-center justify-between w-full">
            <div className="flex flex-wrap  items-center w-full p-5 gap-5">
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
            <div className="pr-5">
              {user?.username !== userData?.username ? (
                <div onClick={() => {toggleSubscription(userData?._id)}}>
                  {userData?.isSubscribed ? 
                    <button className="bg-[#4d4d4d] text-white rounded-lg px-4 py-2 hover:bg-[#343434]" >
                      Unsubscribe
                    </button>
                   : 
                    <button className="bg-[#9147ff] text-white rounded-lg px-4 py-2 hover:bg-[#7a3fdb]" >
                      Subscribe
                    </button>
                   
                   }
                </div>
                
              ) : (
                <Link to={`/dashboard`}>
                  <button className="bg-[#9147ff] text-white min-w-40 rounded-lg px-4 py-3 hover:bg-[#7a3fdb]">
                    Manage Channel
                  </button>
                </Link>
              )}
            </div>
          </div>
          <div>
            <div className="flex justify-start items-center gap-5 p-5">
              <NavLink
                to=""
                end
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg ${isActive ? "bg-[#9147ff]" : "bg-gray-700"} text-white`
                }
              >
                Videos
              </NavLink>
              <NavLink
                to="playlists"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg ${isActive ? "bg-[#9147ff]" : "bg-gray-700"} text-white`
                }
              >
                Playlists
              </NavLink>
              <NavLink
                to="tweets"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg ${isActive ? "bg-[#9147ff]" : "bg-gray-700"} text-white`
                }
              >
                Tweets
              </NavLink>
              <NavLink
                to="subscribed"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg ${isActive ? "bg-[#9147ff]" : "bg-gray-700"} text-white`
                }
              >
                Subscribed
              </NavLink>
            </div>
            <Outlet context={{userId: userData?._id, currUser:user, channelUser: userData}} />


          </div>
        </>
      )}
    </div>
  );
}

export default ChannelPage;
