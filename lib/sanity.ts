import { createClient } from "@sanity/client";
import type { Project } from "@/lib/types";

const hasSanityConfig = () =>
  Boolean(process.env.SANITY_PROJECT_ID && process.env.SANITY_DATASET);

const getSanityClient = () => {
  if (!hasSanityConfig()) {
    throw new Error("Sanity is not configured");
  }

  return createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    apiVersion: process.env.SANITY_API_VERSION || "2024-01-01",
    token: process.env.SANITY_TOKEN,
    useCdn: false,
  });
};

const projectQuery = `*[_type == "project"] | order(_createdAt desc){
  _id,
  title,
  description,
  price,
  "image": image.asset->url,
  fileUrl,
  category
}`;

export const getAllProjects = async (): Promise<Project[]> => {
  if (!hasSanityConfig()) return [];
  return getSanityClient().fetch(projectQuery);
};

export const getProjectById = async (id: string): Promise<Project | null> => {
  if (!hasSanityConfig()) return null;

  return getSanityClient().fetch(
    `*[_type == "project" && _id == $id][0]{
      _id,
      title,
      description,
      price,
      "image": image.asset->url,
      fileUrl,
      category
    }`,
    { id },
  );
};
