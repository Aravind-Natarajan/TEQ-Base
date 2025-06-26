import React, { useState } from 'react';
import axios from 'axios';
import { FaUpload } from 'react-icons/fa'; 
import { AiOutlineLoading } from 'react-icons/ai'; 
import './uploadphoto.css'; 

const UploadImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [personName, setPersonName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);  // State to store uploaded image URL

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setSelectedFile(file);
      setMessage(''); // Reset message
      setUploadedImageUrl(URL.createObjectURL(file)); // Generate object URL for the selected file
    } else {
      setMessage('Only JPEG, JPG, or PNG files are allowed!');
    }
  };

  const handleNameChange = (e) => {
    setPersonName(e.target.value);
  };

  const handleUpload = async () => {
    if (!personName || !selectedFile) {
      setMessage('Please provide your name and select a file to upload.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('name', personName);
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message);
      setSelectedFile(null);
      setPersonName('');
      setUploadedImageUrl(null);  // Reset uploaded image URL after a successful upload

      // Optionally, you can store the filename returned by the server if needed
      // setUploadedImageUrl(response.data.data.filename);
    } catch (error) {
      setMessage('Error uploading file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Your Image</h2>
      <div className="input-container">
        <input
          type="text"
          onChange={handleNameChange}
          value={personName}
          className="input"
          placeholder="Enter Your Name"
        />
      </div>
      <div className="file-input-container">
        <input
          type="file"
          onChange={handleFileChange}
          id="file-input"
          className="file-input"
        />
        <label htmlFor="file-input" className="file-input-label">
          Choose File
        </label>
      </div>

      {selectedFile && <p className="file-name">{selectedFile.name}</p>}

      {/* Display the image preview after selecting a file */}
      {uploadedImageUrl && (
        <div className="image-preview">
          <h3>Image Preview:</h3>
          <img src={uploadedImageUrl} alt="Selected" className="uploaded-image" />
        </div>
      )}

      <div>
        <button
          onClick={handleUpload}
          className={`upload-btn ${uploading ? 'uploading' : ''}`}
          disabled={uploading}
        >
          {uploading ? (
            <AiOutlineLoading className="spin" />
          ) : (
            <FaUpload />
          )}
          Upload
        </button>
      </div>

      <div className="message-container">
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default UploadImage;
