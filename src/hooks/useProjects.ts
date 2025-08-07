import { useState, useCallback, useEffect } from "react";
import {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectType,
} from "@/types/project";
import { projectsAPI } from "@/services/api";
import { toast } from "@/hooks/use-toast";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Load all projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = useCallback(async () => {
    try {
      setInitialLoading(true);
      const data = await projectsAPI.getAll();
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  }, []);

  const createProject = useCallback(
    async (data: CreateProjectRequest): Promise<void> => {
      setLoading(true);
      try {
        const newProject = await projectsAPI.create(data);
        setProjects((prev) => [newProject, ...prev]);
        toast({
          title: "Success",
          description: "Project created successfully",
          variant: "default",
        });
      } catch (error: any) {
        console.error("Failed to create project:", error);
        const errorMessage =
          error.response?.data?.errors?.[0]?.message ||
          "Failed to create project";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateProject = useCallback(
    async (data: UpdateProjectRequest): Promise<void> => {
      setLoading(true);
      try {
        const updated = await projectsAPI.update(data.id, data);
        setProjects((prev) =>
          prev.map((project) => (project.id === data.id ? updated : project))
        );
        toast({
          title: "Success",
          description: "Project updated successfully",
          variant: "default",
        });
      } catch (error: any) {
        console.error("Failed to update project:", error);
        const errorMessage =
          error.response?.data?.errors?.[0]?.message ||
          "Failed to update project";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteProject = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    try {
      await projectsAPI.delete(id);
      setProjects((prev) => prev.filter((project) => project.id !== id));
      toast({
        title: "Success",
        description: "Project deleted successfully",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Failed to delete project:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to delete project";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProjectsByType = useCallback(
    (type: ProjectType) => {
      return projects.filter((project) => project.category === type);
    },
    [projects]
  );

  return {
    projects,
    loading,
    initialLoading,
    createProject,
    updateProject,
    deleteProject,
    getProjectsByType,
    refreshProjects: loadProjects,
  };
};
