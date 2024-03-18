import axios from 'axios';
import React, { useState } from 'react';

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      setUploading(true);
      await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setUploadMessage('File uploaded successfully.');

      // Call indexing function in backend after file upload
      await axios.get('http://localhost:8000/index');

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Failed to upload file:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border-gray-300 rounded ">
      <h2 className="text-xl mb-4">Upload File</h2>
      <form onSubmit={handleSubmit} className="flex justify-center items-center space-x-4">
        <input type="file" onChange={handleFileChange} className="border border-gray-300 py-2 px-4 rounded" />
        <button type="submit" disabled={!file || uploading} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-300 disabled:pointer-events-none">Upload</button>
      </form>
      {uploadMessage && <p className="mt-4">{uploadMessage}</p>}
    </div>
  );
};

export default UploadFile;
