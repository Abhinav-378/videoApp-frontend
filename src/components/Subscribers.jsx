import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";

function Subscribers() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

  const [subscribersList, setSubscribersList] = useState([]);
  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      console.log("user: ", user);
      const response = await axios.get(
        `${API_URL}/subscriptions/u/${user._id}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("response: ", response.data.data);
      setSubscribersList(response.data.data);
    } catch (error) {
      console.error("Error fetching list:", error);
      setError(error.response.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) {
      fetchSubscribers();
    }
  }, [user]);
  return (
    <div className="text-white p-4">
        {!user && (
          <div className="flex justify-center items-center w-full my-80 text-white text-2xl">
            Please login to view your subscribers
          </div>
        )}
        {user && (
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl my-5">Subscribers List</h1>
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
                {!loading && !error && subscribersList.length === 0 && (
                <div className="flex justify-center items-center w-full my-80 text-white text-2xl">
                    No subscribers found
                </div>
                )}
                {!loading && !error && subscribersList.length > 0 && (
                <ul className="space-y-4">
                    {subscribersList.map((subscriber) => (
                    <li key={subscriber._id} className="flex items-center gap-4">
                        <Link to={`/channel/${subscriber.username}`} className="flex items-center gap-4">
                        <img
                        src={subscriber.avatar}
                        alt={subscriber.fullName}
                        className="w-12 h-12 rounded-full"
                        />
                        <p className="text-white text-lg">
                            {subscriber.fullName}
                        </p>
                        </Link>
                    </li>
                    ))}
                </ul>
                )}
            </div>
            )}
    </div>
  );
}

export default Subscribers;
