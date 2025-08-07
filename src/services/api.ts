import axios from "axios";
import {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectType,
} from "@/types/project";

// Remote API endpoint (ngrok or production)
const API_BASE_URL = "https://camel-sweet-lionfish.ngrok-free.app/api";

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

// Intercept requests and attach Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const projectsAPI = {
  // Get all projects (public)
  getAll: async (): Promise<Project[]> => {
    const response = await api.get("/projects");
    return response.data;
  },

  // Get projects by category (public)
  getByCategory: async (category: ProjectType): Promise<Project[]> => {
    const response = await api.get(`/projects/categories/${category}`);
    return response.data;
  },

  // Create a new project (admin only)
  create: async (data: CreateProjectRequest): Promise<Project> => {
    const formData = new FormData();
    formData.append("client", data.client);
    formData.append("location", data.location);
    formData.append("service", data.service);
    formData.append("year", data.year.toString());
    formData.append("category", data.category);
    data.images.forEach((image) => formData.append("images", image));

    const response = await api.post("/projects", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update an existing project (admin only)
  update: async (id: number, data: UpdateProjectRequest): Promise<Project> => {
    const formData = new FormData();
    formData.append("client", data.client);
    formData.append("location", data.location);
    formData.append("service", data.service);
    formData.append("year", data.year.toString());
    formData.append("category", data.category);
    data.images.forEach((image) => formData.append("images", image));

    const response = await api.put(`/projects/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete a project (admin only)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};

export const authAPI = {
  login: async (
    username: string,
    password: string
  ): Promise<{ token: string }> => {
    const response = await api.post("/auth/login", { username, password });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};
