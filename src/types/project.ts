export type ProjectType =
  | "cinema"
  | "civil"
  | "homeliving"
  | "hotel"
  | "office"
  | "restaurant"
  | "showroom";

export interface ProjectImage {
  id: number;
  url: string;
  projectId: number;
}

export interface Project {
  id: number;
  client: string;
  location: string;
  service: string;
  year: number;
  category: ProjectType;
  images: ProjectImage[];
}

export interface CreateProjectRequest {
  client: string;
  location: string;
  service: string;
  year: number;
  category: ProjectType;
  images: File[];
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {
  id: number;
}

export const PROJECT_TYPES: ProjectType[] = [
  "cinema",
  "civil",
  "homeliving",
  "hotel",
  "office",
  "restaurant",
  "showroom",
];

export const PROJECT_TYPE_DISPLAY: Record<ProjectType, string> = {
  cinema: "Cinema",
  civil: "Civil",
  homeliving: "Homeliving",
  hotel: "Hotel",
  office: "Office",
  restaurant: "Restaurant",
  showroom: "Showroom",
};
