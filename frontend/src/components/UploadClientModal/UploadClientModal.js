import React, { useState } from "react";
import "./UploadClientModal.css";
import { uploadClient } from "../../utils/api";

const UploadClientModal = ({ onClose, onClientAdded }) => {
  const [name, setName] = useState("");
  const [picture, setPicture] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePictureChange = (event) => {
    setPicture(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      alert("Please enter a name.");
      return;
    }

    setIsUploading(true);

    try {
      const response = await uploadClient({
        name,
        picture
      });

      if (response.data) {
        alert("Client uploaded successfully!");
        onClientAdded(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Error uploading client:", error);
      alert("Failed to upload client. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Upload new Client</h2>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Enter client name" 
          />

          <label>Upload Picture</label>
          <input 
            type="file" 
            onChange={handlePictureChange} 
          />

          <button type="submit" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload Client"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadClientModal;
