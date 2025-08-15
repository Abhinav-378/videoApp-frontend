import { use, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { useParams } from "react-router-dom";
import { useModal } from "../ModalContext";
function Comments({ videoOwnerId }) {
    const VITE_API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
  const [commentsList, setCommentsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const { videoId} = useParams()
    const { showModal } = useModal();
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
    const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${VITE_API_URL}/comments/${videoId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(response.data.data); // actual data consists of {totalComments: 1, page: 1, limit: 10, totalPages: 1, comments: Array(1)}, we will take just array for now
      setCommentsList(response.data.data.comments);
    } catch (error) {
        console.log("error", error);
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
    }
    const handleSubmitComment = async () => {
      if (!user) {
        return;
      }
      setLoading(true);
      try {
        const content = document.querySelector("textarea").value;

        if (!content.trim()) {
          alert("Please enter a comment");
          return;
        }
        const response = await axios.post(
          `${VITE_API_URL}/comments/${videoId}`,
          {
            content: content,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // console.log(response.data.data);
        fetchComments();
        document.querySelector("textarea").value = ""; 
      } catch (error) {
        console.error("Error submitting comment:", error);
      } finally {
        setLoading(false);
      }
    }
    const handleEditComment = async (comment) => {
      if (!user) {
        return;
      }
      // replace comment with a textarea and a save button
      const commentElement = document.getElementById(`comment-${comment._id}`);
      const cont = commentElement.getElementsByClassName("content")
      const textarea = document.createElement("textarea");
      textarea.value = comment.content;
      textarea.className = "w-full h-auto bg-[#111111] text-white border border-gray-600 rounded-lg p-4 pr-10";
      const saveButton = document.createElement("button");
      saveButton.innerText = "Save";
      saveButton.className = "absolute bottom-3 right-2 md:right-3 text-white px-2 md:px-4 py-2 rounded-lg cursor-pointer hover:text-[#9147ff] transition duration-100";
      // hide cont element and show input with save btn instead and on save show cont element with updated content
      if (cont[0]) {
        cont[0].style.display = "none";
      }
      // Insert textarea and save button after the content element
      cont[0].parentNode.insertBefore(textarea, cont[0].nextSibling);
      cont[0].parentNode.insertBefore(saveButton, textarea.nextSibling);

      saveButton.onclick = async () => {
        setLoading(true);
        try {
          const response = await axios.patch(
        `${VITE_API_URL}/comments/c/${comment._id}`,
        {
          content: textarea.value,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
          );
          // Update content and show it
          cont[0].textContent = textarea.value;
          cont[0].style.display = "";
          // Remove textarea and save button
          textarea.remove();
          saveButton.remove();
          fetchComments();
        } catch (error) {
          console.error("Error editing comment:", error);
        } finally {
          setLoading(false);
        }
      };
      
    }
    // toggle comment like
    const toggleCommentLike = async (comment) => {
      if(!user){
        showModal();
        return;
      }
      const commentId = comment._id;
      try {
        setLoading(true);
        const response = await axios.post(
          `${VITE_API_URL}/likes/toggle/c/${commentId}`,
          {},
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // console.log(response.data.data);
        // if like is added
        if(response.data.data){
          const updatedComment = response.data.data;
          const updatedCommentsList = commentsList.map((c) =>{
            if(c._id === updatedComment.comment){
              return {
                ...c,
                likesCount: c.likesCount+1,
                likesDetails: [...c.likesDetails, updatedComment]
              }
            }
            return c;
          });
          setCommentsList(updatedCommentsList);
        }else{ // like is removed
          const updatedCommentsList = commentsList.map((c) =>{
            if(c._id === commentId){
              return {
                ...c,
                likesCount: c.likesCount-1,
                likesDetails: c.likesDetails.filter(like => like.likedBy !== user._id)
              }
            }
            return c;
          });
          setCommentsList(updatedCommentsList);
        }
      } catch (error) {
        console.error("Error toggling comment like:", error);
      }
      finally{
        setLoading(false);
      }
    }

    const handleDeleteComment = async (commentId) => {
      if (!user) {
        return;
      }
      setLoading(true);
      try {
        const response = await axios.delete(
          `${VITE_API_URL}/comments/c/${commentId}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // console.log(response.data.data);
        setCommentsList((prevComments) =>
          prevComments.filter((comment) => comment._id !== commentId)
        );
      } catch (error) {
        console.error("Error deleting comment:", error);
      } finally {
        setLoading(false);
      }
    }
    useEffect(() => {
      fetchComments();
    }, [videoId]); 
  return (
    <div>
        {loading && (
        <div className="flex justify-center items-center h-screen w-full bg-black opacity-50 fixed top-0 left-0 z-50">
          Loading...
        </div>
      )}
    {user && (
        <div>

          <div className="flex flex-col gap-4 px-5 ">
            <div className="relative w-full">
              <textarea
                placeholder="Write a comment..."
                className="w-full h-auto bg-[#111111] text-white border border-gray-600 rounded-lg p-4 pr-10"
              />
              <button className="absolute bottom-3 right-2 md:right-3 text-white px-2 md:px-4 py-2 rounded-lg cursor-pointer hover:text-[#9147ff] transition duration-100" onClick={() => {
                handleSubmitComment();
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      {commentsList && commentsList.length > 0 ? (
        <div className="flex flex-col gap-4 px-5  pt-4">
          {commentsList.map((comment) => (
            <div key={comment._id} id={`comment-${comment._id}`} className="w-full p-4 ">
              <div className="flex items-start gap-4">
                <img
                  src={comment.ownerAvatar}
                  alt="user"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col relative w-full">
                  <p className="text-lg text-white font-semibold">@{comment.ownerName}
                    <span className="text-sm text-gray-500 font-medium "> &emsp; {timeAgo(comment.createdAt)} </span>
                  </p>
                  <p className="content">{comment.content}</p>
                  
                    {/* like button */}
                  <div onClick={() => toggleCommentLike(comment)} className="flex items-center gap-4 mt-2">
                    {
                      (user && comment.likesDetails && comment.likesDetails.some(like => like.likedBy === user._id)) ?
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 cursor-pointer text-rose-500">
                          <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer text-rose-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                    }
                    <p className="text-sm text-gray-500 font-medium">{comment.likesCount || 0} likes</p>

                  </div>

                </div>
              </div>
              {/* edit and delete option if curruser is equal to channeluser */}
              {user && comment?.ownerName && user.username==comment.ownerName ? (
                <div className="flex justify-end gap-4 mt-2">
                  <button className="text-[#ae77ff] hover:text-[#9147ff]  hover:bg-gray-800 px-3 py-1 cursor-pointer rounded-lg  transition duration-100" onClick={() => handleEditComment(comment)} >
                    Edit
                  </button>
                  <button className="text-red-400 hover:text-red-600 hover:bg-gray-800 px-3 py-1 cursor-pointer rounded-lg transition duration-100" onClick={() => { handleDeleteComment(comment._id) }}>
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
             <div className="w-full my-10">
          No comments yet...
        </div>
        )
    }
    </div>
  )
}

export default Comments