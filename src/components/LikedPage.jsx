import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";

function LikedPage() {
    const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

  const [likedVideos, setLikedVideos] = useState([]);
  const fetchLikedVideos = async () => {
    try {
      setLoading(true);
      console.log("user: ", user);
      const response = await axios.get(`${API_URL}/likes/videos`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const videos = response.data.data.filter((video) => video.isPublished);

      setLikedVideos(videos);

    } catch (error) {
        console.error("Error fetching likedVideos:", error);
      setError(error.response.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) {
      fetchLikedVideos();
    }
  }, [user]);
  return (
    <div>
        {!user && (
            <div className="flex justify-center items-center w-full my-80 text-white text-2xl">
              Please login to view your Liked Videos
            </div>
          )}
          {user && (
            <div className="flex flex-col gap-4 p-4">
              <h1 className="text-2xl text-white">Liked Videos</h1>
              {loading && (
                <div className="flex justify-center items-center w-full my-80 text-white text-2xl">
                  Loading...
                </div>
              )}
              {error && (
                <div className="flex justify-center items-center w-full my-80 text-white text-2xl">
                  {error}
                </div>
              )}
              {!loading && !error && likedVideos.length === 0 && (
                <div className="flex justify-center items-center w-full my-80 text-white text-2xl">
                  No liked videos found
                </div>
              )}
              {!loading && !error && likedVideos.length > 0 && (
                <div className="flex flex-col gap-4 w-[90%] md:w-[85%] lg:w-[80%] mx-auto text-white">
                  {likedVideos.map((video) => (
                    <div
                      className="bg-[#2b2b2b] p-4 rounded-lg flex flex-col md:flex-row gap-4"
                      key={video._id}
                    >
                      <Link
                        to={`/watch/${video._id}`}
                        className="w-full md:w-1/3 relative block"
                      >
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-auto object-cover rounded-lg"
                        />
                        <div className="absolute bottom-2 right-2 rounded-md bg-black/70 text-white px-2 py-1 text-sm">
                          {video.duration}
                        </div>
                      </Link>
    
                      <div className="w-full md:w-2/3 flex flex-col justify-start gap-2 pt-2">
                        <Link to={`/watch/${video._id}`}>
                          <h2 className="text-xl text-white line-clamp-1">
                            {video.title}
                          </h2>
                          <p className="text-gray-400 line-clamp-2">
                            {video.description}
                          </p>
                        </Link>
                        <p className="text-gray-400 text-sm">
                          <Link
                            to={`/channel/${video.owner.username}`}
                            className="hover:text-gray-200"
                          >
                            {video.owner.fullName}
                          </Link>{" "}
                          • {video.views} views
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
  )
}

export default LikedPage
