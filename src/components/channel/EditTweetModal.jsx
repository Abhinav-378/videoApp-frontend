import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

function EditTweetModal({setShowEditModal, editTweetData, setEditTweetData, fetchTweets }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL;
    const [editData, setEditData] = useState(editTweetData.content);
    const handleChange = (e) => {
        setEditData(e.target.value);
    }
    const handleSubmit = async () => {
        setUploading(true);
        try {
            const response = await axios.patch(
                `${API_URL}/tweets/${editTweetData._id}`,
                {
                    content: editData,
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(response.data);

            setSuccess("Tweet updated successfully");
            fetchTweets();
            setTimeout(() => {
                setEditTweetData(null);
                setShowEditModal(false);
            }, 2000);
        } catch (error) {
            console.error("Error updating tweet:", error);
            setError(error.response.data.message || error.message || "Something went wrong");
        } finally {
            setUploading(false);
        }
    }
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-white mb-4">Edit Tweet</h2>
            <form>
            <textarea
                className="w-full h-24 p-2 bg-gray-700 text-white rounded-lg"
                value={editData}
                onChange={handleChange}
            />
            <div className="flex justify-end mt-4">
                <button
                type="button"
                className="bg-[#9147ff] text-white px-4 py-2 rounded-lg mr-2"
                onClick={() => {
                    handleSubmit();
                }}
                >
                {uploading ? "Saving..." : "Save"}
                </button>
                <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setShowEditModal(false)}
                >
                Cancel
                </button>
            </div>
            {error && (
                <div className="w-fit px-3 py-1 rounded-md bg-red-500/10  text-red-500">
                    {error}
                </div>
            )}
            {success && (
                <div className="w-fit px-3 py-1 rounded-md bg-green-500/10  text-green-500">
                    {success}
                </div>
            )}
            </form>
        </div>
      
    </div>
  )
}

export default EditTweetModal
