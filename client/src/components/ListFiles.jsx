// client/src/components/ListFiles.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:8000/files');
      setFiles(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch files:', error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);



  const handleDownload = (filename) => {
    // Make a GET request to download endpoint
    fetch(`http://localhost:8000/download/${filename}`)
      .then(response => {
        // Start downloading the file by creating a temporary anchor element
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
      })
      .catch(error => {
        console.error('Failed to download file:', error);
      });
  };

  const handleDelete = async (filename) => {
    try {
      await axios.delete(`http://localhost:8000/delete/${filename}`);
      // Remove the file from the list after successful deletion
      setFiles(files.filter(file => file !== filename));
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/search/${searchQuery}`);
      setSearchResults(response.data.files);
    } catch (error) {
      console.error('Failed to search files:', error);
    }
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="table-container mt-8">
      <h2 className="text-2xl">List Files</h2>

      {/* Search input */}
      <div className="mt-4 mb-4">
        <input
          type="text"
          className="border border-gray-300 px-4 py-2 rounded-md mr-2"
          placeholder="Search files..."
          value={searchQuery}
          onChange={handleInputChange}
        />
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={handleSearch}>Search</button>
      </div>

      {/* Display search results or all files */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="file-table w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Filename</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {searchQuery !== '' ? (
              // Display search results
              searchResults.map((file, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{file}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {/* Action buttons */}
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => handleDownload(file)}>Download</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={() => handleDelete(file)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              // Display all files if no search query
              files.map((file, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{file}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {/* Action buttons */}
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => handleDownload(file)}>Download</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={() => handleDelete(file)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListFiles;
