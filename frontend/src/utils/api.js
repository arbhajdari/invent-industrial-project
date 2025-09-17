import axios from "axios";

const API_URL = "http://localhost:1337";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const deleteClient = async (documentId) => {
  try {
    const response = await api.delete(`/api/clients/${documentId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
};

export const fetchProjects = async () => {
  try {
    const response = await api.get("/api/projects", {
      params: {
        populate: "*",
      },
    });
    console.log("Projects data from API:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const deleteProject = async (projectId) => {
  try {
    const response = await api.delete(`/api/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

export const fetchClients = async () => {
  try {
    const response = await api.get("/api/clients", {
      params: {
        populate: "*",
      },
    });
    console.log("Raw clients response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

export const uploadProject = async (data) => {
  try {
    const token = localStorage.getItem("jwt");
    if (!token) throw new Error("Authentication required");

    let thumbnailId = null;
    if (data.thumbnail) {
      const thumbnailFormData = new FormData();
      thumbnailFormData.append("files", data.thumbnail);

      const uploadResponse = await axios.post(
        `${API_URL}/api/upload`,
        thumbnailFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (uploadResponse.data && uploadResponse.data[0]) {
        thumbnailId = uploadResponse.data[0].id;
      }
    }

    const projectData = {
      data: {
        title: data.title,
        year: parseInt(data.year),
        description: data.description,
        client: data.documentId,
        students: data.students || "",
        thumbnail: thumbnailId,
      },
    };

    console.log("Sending project data to Strapi:", projectData);

    const response = await api.post("/api/projects", projectData);
    return response.data;
  } catch (error) {
    console.error("Error in uploadProject:", error.response?.data || error);
    throw error;
  }
};

export const uploadClient = async (data) => {
  try {
    const token = localStorage.getItem("jwt");
    if (!token) throw new Error("Authentication required");

    let pictureId = null;
    if (data.picture) {
      const pictureFormData = new FormData();
      pictureFormData.append("files", data.picture);

      const uploadResponse = await axios.post(
        `${API_URL}/api/upload`,
        pictureFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (uploadResponse.data && uploadResponse.data[0]) {
        pictureId = uploadResponse.data[0].id;
      }
    }

    const clientData = {
      data: {
        Name: data.name,
        Picture: pictureId,
      },
    };

    console.log("Sending to Strapi:", clientData);

    const response = await axios.post(`${API_URL}/api/clients`, clientData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      console.error("Error status:", error.response.status);
    }
    throw error;
  }
};

export default api;
