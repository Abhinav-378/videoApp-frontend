import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function UploadVideoModal({ setShowModal, userData, onSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [videoData, setVideoData] = useState({
    title: '',
    description: '',
    videoFile: null,
    thumbnail: null,
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVideoData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setVideoData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setUploading(true);
    setError(null);

    // Validate form data
    if (!videoData.title || !videoData.description || !videoData.videoFile || !videoData.thumbnail) {
      setError('Please fill all required fields');
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', videoData.title);
    formData.append('description', videoData.description);
    formData.append('videoFile', videoData.videoFile);
    formData.append('thumbnail', videoData.thumbnail);

    try {
      console.log("formdata: ", formData);
      console.log("videoData: ", videoData);
      console.log('Uploading video...');

      const response = await axios.post(
        `${API_URL}/videos`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      setSuccess('Video uploaded successfully!');
      await onSuccess()
      setShowModal(false)
      // setTimeout(() => setShowModal(false), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error uploading video');
    } finally {
      setUploading(false);
    }
  }
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      
      <div className="bg-[#242424] rounded-lg p-6 w-96 shadow-lg text-white relative">
        {/* Close Button */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4">Upload Your Video</h2>

        {/* Display User Info (optional) */}
        {userData && (
          <div className="mb-4">
            <p className="font-semibold">{userData.fullName} (@{userData.username})</p>
          </div>
        )}

        {/* Video Upload Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            {/* upload video */}
            <label className="block text-sm font-medium mb-1" htmlFor="videoFile">Select Video</label>
            <input
              type="file"
              id="videoFile"
              accept="video/*"
              className="w-full border rounded px-3 py-2"
              required
              name="videoFile"
            onChange={handleFileChange}

            />
          </div>
          {/* upload thumbnail */}
          <label className="block text-sm font-medium mb-1" htmlFor="thumbnail">Select Thumbnail</label>
          <input
            type="file"
            id="thumbnail"
            accept="image/*"
            className="w-full border rounded px-3 py-2 mb-4"
            required
            name="thumbnail"
            onChange={handleFileChange}
          />
          {/* Video Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="videoTitle">Video Title</label>
            <input
              type="text"
              id="videoTitle"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter video title"
              required
              name='title'
              onChange={handleInputChange}
            />
          </div>
          {/* Video Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="videoDesc">Video Description</label>
            <textarea
              id="videoDesc"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter video description"
              rows="4"
              required
              name='description'
              onChange={handleInputChange}
            ></textarea>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              disabled={uploading}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

          {error && (
            <div className="mt-3 text-red-500 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-3 text-green-500 text-sm">
              {success}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default UploadVideoModal;
