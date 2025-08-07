import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PROJECT_TYPES, ProjectType } from "@/types/project";
import {
  projectSchema,
  ProjectFormData,
  updateProjectSchema,
  UpdateProjectFormData,
} from "@/lib/validations/project";
import { Project } from "@/types/project";
import { useState } from "react";

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: ProjectFormData | UpdateProjectFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  preselectedType?: ProjectType;
  lockType?: boolean;
}

export const ProjectForm = ({
  project,
  onSubmit,
  onCancel,
  loading,
  preselectedType,
  lockType,
}: ProjectFormProps) => {
  const MAX_IMAGES = 6;
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const isEditMode = !!project;

  const formSchema = isEditMode ? updateProjectSchema : projectSchema;

  const form = useForm<ProjectFormData | UpdateProjectFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: project?.client || "",
      category: project?.category || preselectedType || undefined,
      location: project?.location || "",
      service: project?.service || "",
      year: project?.year || new Date().getFullYear(),
      images: [],
    },
  });

  const handleSubmit = async (
    data: ProjectFormData | UpdateProjectFormData
  ) => {
    await onSubmit({ ...data, images: imageFiles });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0];
    if (!newFile) return;

    if (imageFiles.length >= MAX_IMAGES) {
      alert(`Maximum of ${MAX_IMAGES} images allowed.`);
      return;
    }

    const updatedFiles = [...imageFiles, newFile];
    setImageFiles(updatedFiles);
    form.setValue("images", updatedFiles);
  };

  const removeImage = (index: number) => {
    const updated = imageFiles.filter((_, i) => i !== index);
    setImageFiles(updated);
    form.setValue("images", updated);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-elevated">
      <CardHeader className="bg-gradient-to-r from-admin-header to-admin-accent text-white">
        <CardTitle className="text-xl font-semibold">
          {isEditMode ? "Edit Project" : "Create New Project"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Client Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter client name"
                        className="focus:ring-admin-accent"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Project Category
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={lockType}
                    >
                      <FormControl>
                        <SelectTrigger
                          className="focus:ring-admin-accent"
                          disabled={lockType}
                        >
                          <SelectValue
                            placeholder={
                              lockType
                                ? preselectedType || "Category locked"
                                : "Select project category"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROJECT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Location
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter location"
                        className="focus:ring-admin-accent"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Service
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter service type"
                        className="focus:ring-admin-accent"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter project year"
                      className="focus:ring-admin-accent"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={() => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Project Images
                  </FormLabel>
                  <FormControl>
                    <>
                      <label className="block w-full cursor-pointer border border-dashed border-gray-300 rounded-md p-3 text-center hover:border-blue-500 hover:bg-blue-50 transition duration-200 text-sm font-medium text-gray-700">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={imageFiles.length >= MAX_IMAGES}
                        />
                        {imageFiles.length >= MAX_IMAGES
                          ? `Maximum ${MAX_IMAGES} images reached`
                          : `Click to upload (1 at a time)`}
                      </label>
                      {imageFiles.length >= MAX_IMAGES && (
                        <p className="text-sm text-red-500 mt-1">
                          You can't upload more than {MAX_IMAGES} images.
                        </p>
                      )}
                    </>
                  </FormControl>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {imageFiles.map((file, index) => (
                      <div
                        key={index}
                        className="relative border rounded overflow-hidden"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`preview-${index}`}
                          className="w-full h-24 object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
                          onClick={() => removeImage(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-admin-header hover:bg-admin-accent"
              >
                {loading
                  ? "Saving..."
                  : isEditMode
                  ? "Update Project"
                  : "Create Project"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
