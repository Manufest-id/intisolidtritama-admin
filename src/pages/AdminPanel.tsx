import { useState } from "react";
import { Project, ProjectType } from "@/types/project";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { ProjectsTable } from "@/components/admin/ProjectsTable";
import { ProjectViewer } from "@/components/admin/ProjectViewer";
import { useProjects } from "@/hooks/useProjects";
import { ProjectFormData } from "@/lib/validations/project";

type ViewMode = "list" | "create" | "edit";

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewerProject, setViewerProject] = useState<Project | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ProjectType | "all">("all");

  const {
    projects,
    loading,
    initialLoading,
    createProject,
    updateProject,
    deleteProject,
  } = useProjects();

  const handleCreate = () => {
    setSelectedProject(null);
    setViewMode("create");
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setViewMode("edit");
  };

  const handleView = (project: Project) => {
    setViewerProject(project);
    setIsViewerOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteProject(id);
  };

  const handleFormSubmit = async (data: ProjectFormData) => {
    if (viewMode === "create") {
      await createProject(data as any);
    } else if (viewMode === "edit" && selectedProject) {
      await updateProject({ ...data, id: selectedProject.id } as any);
    }
    setViewMode("list");
    setSelectedProject(null);
  };

  const handleCancel = () => {
    setViewMode("list");
    setSelectedProject(null);
  };

  const handleViewerClose = () => {
    setIsViewerOpen(false);
    setViewerProject(null);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-admin-header mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">
            Loading projects...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-admin-header text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Project Admin Panel</h1>
          <div className="flex items-center gap-6">
            <div className="text-sm opacity-90">
              Total Projects: {projects.length}
            </div>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {viewMode === "list" ? (
          <ProjectsTable
            projects={projects}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onCreate={handleCreate}
            loading={loading}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        ) : (
          <ProjectForm
            project={selectedProject}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            loading={loading}
            preselectedType={
              viewMode === "create" && activeTab !== "all"
                ? activeTab
                : undefined
            }
            lockType={viewMode === "create" && activeTab !== "all"}
          />
        )}
      </main>

      {/* Project Viewer Modal */}
      <ProjectViewer
        project={viewerProject}
        open={isViewerOpen}
        onClose={handleViewerClose}
      />
    </div>
  );
}
