import React, { useEffect } from "react";
// import { HomeIcon } from '@heroicons/react/outline'
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
function SideFullNavBar({ isOpen, onToggle }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && isOpen) {
        onToggle(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, onToggle]);

  const handleChannelClick = () => {
    if (!user) {
      alert("Please login to access this feature");
      return;
    }
    navigate(`/channel/${user.username}/playlists`);
  };
  const handleMyContentClick = () => {
    if (!user) {
      alert("Please login to access your content");
      navigate('/login');
      return;
    }
    navigate(`/channel/${user.username}`);
  };
  return (
    <div
      className={`sm:h-screen bg-[#141414] fixed left-0 sm:top-0 bottom-0
      transition-all duration-300 text-white ${isOpen ? "w-56" : "sm:w-20 w-full z-10"}`}
    >
      <nav className={`flex flex-row justify-around sm:flex-col sm:mt-16 ${isOpen ? "px-4" : "px-2"}`}>
        <Link to="/">
          <div
            className={`flex  ${isOpen ? "flex-row items-center gap-4" : "flex-col items-center gap-1 "} }  py-2 px-1 hover:bg-[#242424] rounded-xl ${!isOpen && "justify-center"
              }`}
          >
            {/* home logo */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>


            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? "w-auto ml-2" : "w-auto text-xs"
                }`}
            >
              Home
            </span>

          </div>
        </Link>
        <Link to="/liked">
          <div
            className={`flex ${isOpen ? "flex-row items-center gap-4" : "flex-col items-center gap-1 "} }  py-2 px-1 hover:bg-[#242424] rounded-xl ${!isOpen && "justify-center"
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
              />
            </svg>

            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? "w-auto ml-2" : "w-auto text-xs"
                }`}
            >
              Liked
            </span>

          </div>
        </Link>
        <Link to="/history">
          <div
            className={`flex ${isOpen ? "flex-row items-center gap-4" : "flex-col items-center gap-1 "} }  py-2 px-1 hover:bg-[#242424] rounded-xl ${!isOpen && "justify-center"
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>

            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? "w-auto ml-2" : "w-auto text-xs"
                }`}
            >
              History
            </span>
          </div>
        </Link>
        <div onClick={handleMyContentClick}>
          <div
            className={`flex ${isOpen ? "flex-row items-center gap-4" : "flex-col items-center gap-1 "} }  py-2 px-1 hover:bg-[#242424] rounded-xl ${!isOpen && "justify-center"
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>

            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? "w-auto ml-2" : "w-auto text-xs"
                }`}
            >
              My Content
            </span>
          </div>
        </div>
        <div
            className={`hidden cursor-pointer sm:flex ${isOpen ? "flex-row items-center gap-4" : "flex-col items-center gap-1 "} }  py-2 px-1 hover:bg-[#242424] rounded-xl ${!isOpen && "justify-center"
              }`}
          onClick={() => handleChannelClick()}

        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
            />
          </svg>

          <span
            className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? "w-auto ml-2" : "w-auto text-xs"
              }`}
          >
            Collections
          </span>
        </div>
        <Link to="/subscribers" >
        <div 
            className={`flex ${isOpen ? "flex-row items-center gap-4" : "flex-col items-center gap-1 "} }  py-2 px-1 hover:bg-[#242424] rounded-xl ${!isOpen && "justify-center"
              }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>

          <span
            className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? "w-auto ml-2" : "w-auto text-xs"
              }`}
          >
            Subscribers
          </span>
        </div>
        </Link>
      </nav>
    </div>
  );
}

export default SideFullNavBar;
