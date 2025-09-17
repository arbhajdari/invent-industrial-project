import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { fetchClients, deleteClient } from "../../utils/api";
import Header from "../../components/Header/Header";
import UploadClientModal from "../../components/UploadClientModal/UploadClientModal";
import "./Client.css";

Modal.setAppElement("#root");

const Client = ({ user }) => {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const clientId = params.get("id");
    if (clientId && clients.length > 0) {
      const client = clients.find((c) => c.id === parseInt(clientId));
      if (client) {
        setSelectedClient(client);
        setModalIsOpen(true);
      }
    }
  }, [location.search, clients]);

  const loadClients = async () => {
    try {
      const response = await fetchClients();
      if (response && response.data) {
        setClients(response.data);
      }
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError("Failed to load clients.");
    }
  };

  const handleDeleteClient = async (documentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client?"
    );
    if (!confirmDelete) return;

    try {
      await deleteClient(documentId);
      const updatedClients = clients.filter(
        (client) => client.documentId !== documentId
      );
      setClients(updatedClients);
      alert("Client deleted successfully.");
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("Failed to delete client.");
    }
  };

  const handleClientAdded = (newClient) => {
    setClients((prevClients) => [...prevClients, newClient.data]);
    loadClients();
  };

  const handleClientClick = (client) => {
    setSelectedClient(client);
    setModalIsOpen(true);

    navigate(`/clients?id=${client.id}`, { replace: true });
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setSelectedClient(null);

    navigate("/clients", { replace: true });
  };

  return (
    <div className="client-page">
      <Header
        user={user}
        onLogout={() => {
          localStorage.removeItem("jwt");
          localStorage.removeItem("user");
          navigate("/");
        }}
        onLoginClick={() => navigate("/")}
      />
      <div className="client-container">
        <h1 className="client-header">Meet Our Clients</h1>
        {error && <p className="error-message">{error}</p>}

        {user && (
          <button
            className="upload-button"
            onClick={() => setShowUploadModal(true)}
          >
            Upload New Client
          </button>
        )}

        <div className="client-grid">
          {clients.length > 0 ? (
            clients.map((client) => (
              <div
                key={client.id}
                className="client-card"
                onClick={() => handleClientClick(client)}
              >
                <div className="client-image-container">
                  {client.Picture && client.Picture.length > 0 ? (
                    <img
                      src={`http://localhost:1337${client.Picture[0].url}`}
                      alt={client.Name}
                      className="client-image"
                    />
                  ) : (
                    <div className="client-placeholder">No Image Available</div>
                  )}
                </div>
                <div className="client-info">
                  <h2 className="client-name">{client.Name}</h2>
                  <p className="client-projects-count">
                    {client.projects
                      ? `${client.projects.length} Projects`
                      : "No Projects"}
                  </p>
                  {user && (
                    <button
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClient(client.documentId);
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No clients available.</p>
          )}
        </div>
      </div>

      {showUploadModal && (
        <UploadClientModal
          onClose={() => setShowUploadModal(false)}
          onClientAdded={handleClientAdded}
        />
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        {selectedClient && (
          <div className="modal-container">
            <button className="close-modal" onClick={handleCloseModal}>
              ✖
            </button>

            {selectedClient.Picture && selectedClient.Picture.length > 0 && (
              <img
                src={`http://localhost:1337${selectedClient.Picture[0].url}`}
                alt={selectedClient.Name}
                className="modal-thumbnail"
              />
            )}

            <h2 className="modal-title">{selectedClient.Name}</h2>

            <div className="client-projects-section">
              <h3>Projects</h3>
              {selectedClient.projects && selectedClient.projects.length > 0 ? (
                <div className="modal-projects-list">
                  {selectedClient.projects.map((project) => (
                    <div key={project.id} className="modal-project-item">
                      <h4>{project.title}</h4>
                      <p>{project.description}</p>
                      <span className="project-year">Year: {project.year}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-projects">
                  No projects available for this client.
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Client;
