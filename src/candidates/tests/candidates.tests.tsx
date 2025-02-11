import React from "react";
import { render, screen } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CandidateList } from "../components/candidate-list";
import CreateProfile from "../components/create-profile";
import { CandidatesService } from "../services/candidates-services";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

jest.mock("../services/candidates-services");
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  Bounce: jest.fn(),
  ToastContainer: jest.fn(),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithClient = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>
      {ui}
      <ToastContainer />
    </QueryClientProvider>
  );
};

describe("Candidates Features", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Create Profile", () => {
    it("should create a new profile successfully", async () => {
      // Mock the createProfile service call
      (CandidatesService.createProfile as jest.Mock).mockResolvedValueOnce({
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        description: "Test description",
        yearsOfExperience: 5,
        tags: ["react", "typescript"],
        tagline: "Senior Developer",
      });

      renderWithClient(
        <CreateProfile
          isCreateProfileOpen={true}
          setIsCreateProfileOpen={() => {}}
        />
      );

      // Fill out the form using test IDs
      await userEvent.type(screen.getByTestId("name-input"), "John Doe");
      await userEvent.type(
        screen.getByTestId("email-input"),
        "john@example.com"
      );
      await userEvent.type(
        screen.getByTestId("description-input"),
        "Test description"
      );
      await userEvent.type(
        screen.getByTestId("tagline-input"),
        "Senior Developer"
      );

      // Mock the select inputs
      const yearsSelect = screen.getByLabelText(/years of experience/i);
      const skillsSelect = screen.getByLabelText(/skills/i);

      await userEvent.click(yearsSelect);
      await userEvent.click(screen.getByText("5 years"));

      await userEvent.click(skillsSelect);
      await userEvent.click(screen.getByText("React"));

      // Submit form
      await userEvent.click(screen.getByTestId("submit-button"));

      // Check if createProfile was called with correct data
      expect(CandidatesService.createProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "John Doe",
          email: "john@example.com",
          description: "Test description",
          yearsOfExperience: 5,
          tags: ["react"],
          tagline: "Senior Developer",
        })
      );

      // Check if toast.success was called
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "🎉 New profile has been created successfully!",
          expect.any(Object)
        );
      });
    });

    it("should show validation errors for invalid inputs", async () => {
      renderWithClient(
        <CreateProfile
          isCreateProfileOpen={true}
          setIsCreateProfileOpen={() => {}}
        />
      );

      // Submit form without filling fields
      await userEvent.click(screen.getByTestId("submit-button"));

      // Verify validation messages
      await waitFor(() => {
        expect(
          screen.getByText(/name must be at least 2 characters/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/description must be at least 10 characters/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/please enter a valid email address/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Delete Profile", () => {
    it("should delete a profile successfully", async () => {
      // Mock the initial profiles data
      (CandidatesService.getProfiles as jest.Mock).mockResolvedValueOnce([
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          description: "Test description",
          yearsOfExperience: 5,
          tags: ["react", "typescript"],
          tagline: "Senior Developer",
          image: "test.jpg",
        },
      ]);

      // Mock the delete service call
      (CandidatesService.deleteProfile as jest.Mock).mockResolvedValueOnce({
        success: true,
        message: "Profile deleted successfully",
      });

      renderWithClient(<CandidateList />);

      // Wait for the profile to be displayed
      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
      });

      // Click delete button
      const deleteButton = screen.getByLabelText(/delete profile/i);
      await userEvent.click(deleteButton);

      // Verify the delete service was called
      expect(CandidatesService.deleteProfile).toHaveBeenCalledWith(1);

      // Check if toast.success was called
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          expect.stringMatching(/profile deleted successfully/i),
          expect.any(Object)
        );
      });
    });
  });
});
