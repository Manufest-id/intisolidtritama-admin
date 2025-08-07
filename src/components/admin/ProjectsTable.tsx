import { useState } from "react";
import {
  Project,
  ProjectType,
  PROJECT_TYPES,
  PROJECT_TYPE_DISPLAY,
} from "@/types/project";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Trash2, Eye, Plus } from "lucide-react";

interface ProjectsTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
  onView: (project: Project) => void;
  onCreate: () => void;
  loading?: boolean;
  activeTab: ProjectType | "all";
  onTabChange: (tab: ProjectType | "all") => void;
}

export const ProjectsTable = ({
  projects,
  onEdit,
  onDelete,
  onView,
  onCreate,
  loading,
  activeTab,
  onTabChange,
}: ProjectsTableProps) => {
  const getProjectsByType = (type: ProjectType | "all") => {
    if (type === "all") return projects;
    return projects.filter((project) => project.category === type);
  };

  const getTypeColor = (type: ProjectType) => {
    const colors = {
      cinema: "bg-red-100 text-red-800",
      civil: "bg-blue-100 text-blue-800",
      homeliving: "bg-green-100 text-green-800",
      hotel: "bg-purple-100 text-purple-800",
      office: "bg-yellow-100 text-yellow-800",
      restaurant: "bg-orange-100 text-orange-800",
      showroom: "bg-pink-100 text-pink-800",
    };
    return colors[type];
  };

  const ProjectRow = ({ project }: { project: Project }) => (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="font-medium">{project.client}</TableCell>
      <TableCell>
        <Badge className={getTypeColor(project.category)}>
          {PROJECT_TYPE_DISPLAY[project.category]}
        </Badge>
      </TableCell>
      <TableCell>{project.location}</TableCell>
      <TableCell>{project.service}</TableCell>
      <TableCell>{project.year}</TableCell>
      <TableCell>{project.images.length}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(project)}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(project)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{project.client}"? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(project.id)}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );

  const filteredProjects = getProjectsByType(activeTab);

  return (
    <Card className="shadow-elevated">
      <CardHeader className="bg-gradient-to-r from-admin-header to-admin-accent text-white">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">
            Projects Management
          </CardTitle>
          <Button
            onClick={onCreate}
            className="bg-white text-admin-header hover:bg-gray-100"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs
          value={activeTab}
          onValueChange={(value) => onTabChange(value as ProjectType | "all")}
        >
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 mb-6">
            <TabsTrigger value="all">All ({projects.length})</TabsTrigger>
            {PROJECT_TYPES.map((type) => (
              <TabsTrigger key={type} value={type}>
                {PROJECT_TYPE_DISPLAY[type]} ({getProjectsByType(type).length})
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {activeTab === "all"
                    ? "No projects found"
                    : `No ${PROJECT_TYPE_DISPLAY[activeTab]} projects found`}
                </p>
                <Button onClick={onCreate} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Project
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Images</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((project) => (
                      <ProjectRow key={project.id} project={project} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
