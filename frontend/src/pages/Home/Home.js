import React, { useState, useEffect } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import Sidebar from "../../components/Sidebar/SideBar";
import UploadProjectModal from "../../components/UploadProjectModal";
import { fetchProjects, deleteProject, fetchClients } from "../../utils/api";
import "./Home.css";


const Home = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    loadProjects();
    loadClients();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetchProjects();
      if (response && response.data) {
        setProjects(response.data);
        setFilteredProjects(response.data);
      } else {
        setError("No projects data received");
      }
    } catch (err) {
      console.error("Error loading projects:", err);
      setError("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const response = await fetchClients();
      if (response && response.data) {
        setClients(response.data);
      } else {
        console.error("No clients data received");
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleYearChange = (years) => {
    setSelectedYears(years);
    if (years.length === 0) {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((project) => years.includes(project.year))
      );
    }
  };

  const handleDeleteProject = async (documentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    try {
      await deleteProject(documentId);
      const updatedProjects = projects.filter(
        (project) => project.documentId !== documentId
      );
      setProjects(updatedProjects);
      setFilteredProjects(updatedProjects);
      alert("Project deleted successfully.");
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project.");
    }
  };

  const getDescription = (project) => {
    if (
      project.description &&
      project.description.length > 0 &&
      project.description[0].children &&
      project.description[0].children.length > 0
    ) {
      return project.description[0].children[0].text;
    }
    return "No description available";
  };

  const handleSearch = (query) => {
    if (!projects.length) return;

    const filtered = projects.filter((project) => {
      const title = project.title || "";
      const description = getDescription(project);
      const searchTerm = query.toLowerCase();

      return (
        title.toLowerCase().includes(searchTerm) ||
        description.toLowerCase().includes(searchTerm)
      );
    });

    setFilteredProjects(filtered);
  };

  const handleUploadProject = async () => {
    await loadProjects();
    setShowUploadModal(false);
  };

  if (isLoading) {
    return <div className="loading">Loading projects...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home">
      <Sidebar onYearChange={handleYearChange} />
      <div className="hero-container">
        <img
          src={`${process.env.PUBLIC_URL}/city.jpg`}
          alt="Hero Banner"
          className="hero-image"
        />
      </div>
      <div className="content">
        <div className="search-and-upload">
          <SearchBar onSearch={handleSearch} />
          {user && (
            <button
              className="upload-button"
              onClick={() => setShowUploadModal(true)}
            >
              Upload New Project
            </button>
          )}
        </div>

        <div className="projects-grid">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard
                key={project.documentId}
                title={project.title || "Untitled"}
                description={project.description}
                thumbnail={
                  project.thumbnail?.formats?.thumbnail?.url ||
                  project.thumbnail?.url
                }
                year={project.year}
                pdfUrl={project.pdf?.[0]?.url}
                isAdmin={!!user}
                client={project.client}
                students={project.students}
                onView={() => {
                  if (project.pdf?.[0]?.url) {
                    window.open(
                      `http://localhost:1337${project.pdf[0].url}`,
                      "_blank"
                    );
                  }
                }}
                onDelete={() => handleDeleteProject(project.documentId)}
              />
            ))
          ) : (
            <div className="no-projects">
              No projects found for the selected year(s).
            </div>
          )}
        </div>
      </div>

      <UploadProjectModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUploadProject}
      />
    </div>
  );
};

export default Home;
