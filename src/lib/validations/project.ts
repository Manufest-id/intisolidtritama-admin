import { z } from "zod";
import { PROJECT_TYPES } from "@/types/project";

// 🟢 Main schema for creating new project
export const projectSchema = z.object({
  client: z
    .string()
    .min(3, "Client name must be at least 3 characters")
    .max(100, "Client name must be less than 100 characters"),
  category: z.enum(PROJECT_TYPES as [string, ...string[]], {
    required_error: "Please select a project type",
  }),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be less than 100 characters"),
  service: z
    .string()
    .min(3, "Service must be at least 3 characters")
    .max(100, "Service must be less than 100 characters"),
  year: z
    .number()
    .min(1900, "Year must be after 1900")
    .max(
      new Date().getFullYear() + 5,
      "Year cannot be more than 5 years in the future"
    ),
  images: z
    .array(z.instanceof(File))
    .min(1, "At least one image is required")
    .max(10, "Maximum 10 images allowed"),
});

// 🔵 Schema for updating existing project
export const updateProjectSchema = z.object({
  client: z
    .string()
    .min(3, "Client name must be at least 3 characters")
    .max(100, "Client name must be less than 100 characters"),
  category: z.enum(PROJECT_TYPES as [string, ...string[]], {
    required_error: "Please select a project type",
  }),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be less than 100 characters"),
  service: z
    .string()
    .min(3, "Service must be at least 3 characters")
    .max(100, "Service must be less than 100 characters"),
  year: z
    .number()
    .min(1900, "Year must be after 1900")
    .max(
      new Date().getFullYear() + 5,
      "Year cannot be more than 5 years in the future"
    ),
  images: z.array(z.instanceof(File)).max(10).optional(), // 🟡 images optional on update
});

export type ProjectFormData = z.infer<typeof projectSchema>;
export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>;
