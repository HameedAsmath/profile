import { Profile } from "../types/types";

export const API_BASE_URL = "http://localhost:3001";

export type CreateProfileData = {
  name: string;
  description: string;
  yearsOfExperience: number;
  tags: string[];
  tagline: string;
  email: string;
};

export const CandidatesService = {
  async getProfiles(): Promise<Profile[]> {
    const response = await fetch(`${API_BASE_URL}/profiles`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  },

  async deleteProfile(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/profiles/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete profile");
    }
  },

  async createProfile(data: CreateProfileData): Promise<Profile> {
    const response = await fetch(`${API_BASE_URL}/profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        id: crypto.randomUUID(),
        age: Math.floor(Math.random() * 30) + 20,
        image: `https://randomuser.me/api/portraits/${
          Math.random() > 0.5 ? "men" : "women"
        }/${Math.floor(Math.random() * 100)}.jpg`,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create profile");
    }

    return response.json();
  },
};
