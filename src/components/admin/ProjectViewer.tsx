import { Project, PROJECT_TYPE_DISPLAY } from "@/types/project";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Briefcase, Image as ImageIcon } from "lucide-react";

interface ProjectViewerProps {
  project: Project | null;
  open: boolean;
  onClose: () => void;
}

export const ProjectViewer = ({
  project,
  open,
  onClose,
}: ProjectViewerProps) => {
  if (!project) return null;

  const getTypeColor = (type: string) => {
    const colors = {
      cinema: "bg-red-100 text-red-800",
      civil: "bg-blue-100 text-blue-800",
      homeliving: "bg-green-100 text-green-800",
      hotel: "bg-purple-100 text-purple-800",
      office: "bg-yellow-100 text-yellow-800",
      restaurant: "bg-orange-100 text-orange-800",
      showroom: "bg-pink-100 text-pink-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-admin-header">
            {project.client}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Images */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Project Images ({project.images.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.images.map((image, index) => {
                console.log("Image URL:", image.url);
                return (
                  <Card key={image.id} className="overflow-hidden">
                    <img
                      src={`https://camel-sweet-lionfish.ngrok-free.app${
                        image.url.startsWith("/") ? image.url : "/" + image.url
                      }`}
                      alt={`${project.client} - Image ${index + 1}`}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(project.category)}>
                    {PROJECT_TYPE_DISPLAY[project.category]}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{project.location}</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>{project.service}</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{project.year}</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Project Info</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">Project ID:</span> #
                    {project.id}
                  </div>
                  <div>
                    <span className="font-medium">Client:</span>{" "}
                    {project.client}
                  </div>
                  <div>
                    <span className="font-medium">Total Images:</span>{" "}
                    {project.images.length}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
