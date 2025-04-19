import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

useEffect(() => {
    // Cleanup thumbnail preview URL when component unmounts
    return () => {
      if (videoData.thumbnail) {
        URL.revokeObjectURL(URL.createObjectURL(videoData.thumbnail));
      }
    };
  }, [videoData.thumbnail]);

function EditVideoModal({ setShowEditModal, editVideoData, setEditVideoData }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const [videoData, setVideoData] = useState({
    title: editVideoData.title,
    description: editVideoData.description,
    thumbnail: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVideoData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideoData(prev => ({
      ...prev,
      thumbnail: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    const formData = new FormData();
    if (videoData.title !== editVideoData.title) {
      formData.append('title', videoData.title);
    }
    if (videoData.description !== editVideoData.description) {
      formData.append('description', videoData.description);
    }
    if (videoData.thumbnail) {
      formData.append('thumbnail', videoData.thumbnail);
    }

    try {
      const response = await axios.patch(
        `${API_URL}/videos/${editVideoData._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setSuccess('Video updated successfully!');
      setEditVideoData(response.data.data);
      setTimeout(() => setShowEditModal(false), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating video');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-[#242424] rounded-lg p-6 w-96 shadow-lg text-white relative">
        <button
          onClick={() => setShowEditModal(false)}
          className="absolute top-2 right-2 text-gray-300 hover:text-gray-500 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-xl font-bold mb-4">Edit Video</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={videoData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-[#333] rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={videoData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-[#333] rounded-lg"
              rows="4"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Thumbnail</label>
            <div 
              className="relative w-full aspect-video rounded-lg overflow-hidden group cursor-pointer"
              onClick={() => document.getElementById('thumbnailInput').click()}
            >
              {/* Preview Image */}
              <img 
                src={videoData.thumbnail ? URL.createObjectURL(videoData.thumbnail) : editVideoData.thumbnail}
                alt="Video thumbnail" 
                className="w-full h-full object-cover"
              />
              
              {/* Overlay with Upload Icon */}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-10 h-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                  />
                </svg>
                <span className="ml-2">Change Thumbnail</span>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                id="thumbnailInput"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {success && (
            <p className="text-green-500 text-sm">{success}</p>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
              disabled={uploading}
            >
              {uploading ? 'Updating...' : 'Update Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditVideoModal;
