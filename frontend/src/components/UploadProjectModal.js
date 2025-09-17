import React, { useState, useEffect } from "react";
import "./UploadProjectModal.css";
import { fetchClients, uploadProject } from "../utils/api";

const DESCRIPTION_CHAR_LIMIT = 500;

const UploadProjectModal = ({ isOpen, onClose, onUpload }) => {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailName, setThumbnailName] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [students, setStudents] = useState("");
  const [clients, setClients] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadClients();
    }
  }, [isOpen]);

  const loadClients = async () => {
    try {
      const response = await fetchClients();
      console.log("Raw clients response:", response);

      const clientsData = response.data || [];
      console.log("Clients data:", clientsData);

      setClients(clientsData);
    } catch (err) {
      console.error("Error loading clients:", err);
      setError("Failed to load clients");
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailName(file.name);
    }
  };

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    if (text.length <= DESCRIPTION_CHAR_LIMIT) {
      setDescription(text);
      setDescriptionError("");
    } else {
      setDescriptionError(
        `Description must be under ${DESCRIPTION_CHAR_LIMIT} characters (current: ${text.length})`
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !year || !description || !selectedClient || !students) {
      setError("Please fill in all required fields");
      return;
    }

    if (description.length > DESCRIPTION_CHAR_LIMIT) {
      setError(
        `Description must be under ${DESCRIPTION_CHAR_LIMIT} characters`
      );
      return;
    }

    if (!thumbnail) {
      setError("Please upload a thumbnail");
      return;
    }

    setIsUploading(true);

    try {
      await uploadProject({
        title,
        year,
        description,
        documentId: selectedClient,
        thumbnail,
        students,
      });

      alert("Project uploaded successfully!");
      if (onUpload) onUpload();
      onClose();
    } catch (error) {
      console.error("Error uploading project:", error);
      setError("Failed to upload project. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="upload-modal-overlay">
      <div className="upload-modal-card">
        <h2 className="upload-modal-title">Upload New Project</h2>

        {error && <div className="upload-modal-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="left-column">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="1900"
                max="2100"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={handleDescriptionChange}
                required
              />
              {descriptionError && (
                <div className="description-error">{descriptionError}</div>
              )}
              <div className="character-count">
                {description.length} / {DESCRIPTION_CHAR_LIMIT} characters
              </div>
            </div>

            <div className="form-group">
              <label>Thumbnail</label>
              <div className="file-input-container">
                <input
                  type="file"
                  id="thumbnail-input"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="file-input"
                />
                <label htmlFor="thumbnail-input" className="file-input-button">
                  Upload Thumbnail
                </label>
                {thumbnailName && (
                  <span className="file-name">{thumbnailName}</span>
                )}
              </div>
            </div>
          </div>

          <div className="right-column">
            <div className="form-group">
              <label>Students</label>
              <textarea
                value={students}
                onChange={(e) => setStudents(e.target.value)}
                placeholder="Enter student names (separate multiple names with commas)"
                required
              />
            </div>

            <div className="form-group">
              <label>Choose Client</label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                required
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.Name || "Unnamed Client"}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="upload-project-button"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Project"}
            </button>
          </div>
        </form>

        <button className="close-button" onClick={onClose}>
          ✖
        </button>
      </div>
    </div>
  );
};

export default UploadProjectModal;
