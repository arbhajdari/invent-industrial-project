import React, { useState } from 'react';
import Modal from 'react-modal';
import './ProjectCard.css';

Modal.setAppElement("#root");

const ProjectCard = ({
  title,
  description,
  thumbnail,
  year,
  client,
  students,
  isAdmin,
  onDelete
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="project-card" onClick={() => setShowModal(true)}>
        <div className="thumbnail-container">
          {thumbnail ? (
            <img
              src={`http://localhost:1337${thumbnail}`}
              alt={title}
              className="project-thumbnail"
            />
          ) : (
            <div className="thumbnail-placeholder">No image available</div>
          )}
        </div>
        <div className="project-info">
          <h3 className="project-title">{title}</h3>
          <p className="project-description">{description}</p>
          <div className="project-footer">
            <span className="project-year">{year}</span>
            <span className="project-students">{students}</span>
            {isAdmin && (
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowModal(false)}>
              &times;
            </button>
            
            {thumbnail && (
              <img
                src={`http://localhost:1337${thumbnail}`}
                alt={title}
                className="modal-thumbnail"
              />
            )}
            
            <h2 className="modal-title">{title}</h2>
            <div className="modal-year">{year}</div>
            
            <div className="modal-description">
              {description}
            </div>

            <div className="client-header">
              <div className="info-section">
                <span className="client-label">Client:</span>
                <span className="client-name">{client?.Name || "Unknown Client"}</span>
              </div>
              <div className="info-section">
                <span className="students-label">Students:</span>
                <span className="students-names">{students || "No students listed"}</span>
              </div>
            </div>

            <div className="buttons-container">
              {client && client.id && (
                <button 
                  className="modal-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/clients?id=${client.id}`;
                  }}
                >
                  About the Client
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectCard;