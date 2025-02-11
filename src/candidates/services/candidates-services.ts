import { Profile } from "../types/types";

const API_BASE_URL = "http://localhost:3001";

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
};
