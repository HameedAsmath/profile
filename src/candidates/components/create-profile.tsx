import React from "react";
import { Dialog } from "@headlessui/react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CandidatesService } from "../services/candidates-services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Profile } from "../types/types";
import { Bounce, toast } from "react-toastify";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  yearsOfExperience: z.object({
    value: z.number(),
    label: z.string(),
  }),
  tags: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .min(1, "Select at least one tag"),
  tagline: z.string().min(2, "Tagline must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const skillOptions = [
  { value: "react", label: "React" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "node", label: "Node.js" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
];

const CreateProfile = ({
  isCreateProfileOpen,
  setIsCreateProfileOpen,
}: {
  isCreateProfileOpen: boolean;
  setIsCreateProfileOpen: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      description: "",
      yearsOfExperience: undefined,
      tags: [],
      tagline: "",
      email: "",
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: (data: ProfileFormData) =>
      CandidatesService.createProfile({
        ...data,
        tags: data.tags.map((tag) => tag.value),
        yearsOfExperience: data.yearsOfExperience.value,
      }),
    onMutate: async (newProfile) => {
      await queryClient.cancelQueries({ queryKey: ["profiles"] });

      const previousProfiles = queryClient.getQueryData<Profile[]>([
        "profiles",
      ]);

      if (previousProfiles) {
        queryClient.setQueryData<Profile[]>(
          ["profiles"],
          [
            ...previousProfiles,
            {
              ...newProfile,
              id: crypto.randomUUID(),
              tags: newProfile.tags.map((tag) => tag.value),
              yearsOfExperience: newProfile.yearsOfExperience.value,
              image: `https://randomuser.me/api/portraits/${
                Math.random() > 0.5 ? "men" : "women"
              }/${Math.floor(Math.random() * 100)}.jpg`,
              age: Math.floor(Math.random() * 30) + 20,
            } as any,
          ]
        );
      }

      // Return a context object with the snapshotted value
      return { previousProfiles };
    },
    onError: (err, newProfile, context) => {
      if (context?.previousProfiles) {
        queryClient.setQueryData(["profiles"], context.previousProfiles);
      }
      toast.error("Failed to create profile. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    },
    onSuccess: () => {
      toast.success("🎉 New profile has been created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: document.documentElement.classList.contains("dark")
          ? "dark"
          : "light",
        transition: Bounce,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await createProfileMutation.mutateAsync(data);
      setIsCreateProfileOpen(false);
      reset();
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  return (
    <Dialog
      open={isCreateProfileOpen}
      onClose={() => setIsCreateProfileOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className="mx-auto w-full max-w-md rounded-lg p-6"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          <Dialog.Title
            className="text-lg font-medium mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Create New Profile
          </Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                {...register("name")}
                data-testid="name-input"
                className="w-full p-2 rounded-lg"
                style={{ backgroundColor: "var(--bg-primary)" }}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                data-testid="description-input"
                className="w-full p-2 rounded-lg"
                style={{ backgroundColor: "var(--bg-primary)" }}
                rows={4}
              />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Years of Experience
              </label>
              <Controller
                name="yearsOfExperience"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={Array.from({ length: 51 }, (_, i) => ({
                      value: i,
                      label: `${i} ${i === 1 ? "year" : "years"}`,
                    }))}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                )}
              />
              {errors.yearsOfExperience && (
                <span className="text-red-500 text-sm">
                  {errors.yearsOfExperience.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Skills</label>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={skillOptions}
                    isMulti
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: "var(--bg-primary)",
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: "var(--text-primary)",
                      }),
                      multiValueRemove: (base) => ({
                        ...base,
                        color: "var(--text-primary)",
                        ":hover": {
                          backgroundColor: "var(--bg-secondary)",
                          color: "var(--text-primary)",
                        },
                      }),
                    }}
                  />
                )}
              />
              {errors.tags && (
                <span className="text-red-500 text-sm">
                  {errors.tags.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tagline</label>
              <input
                {...register("tagline")}
                data-testid="tagline-input"
                className="w-full p-2 rounded-lg"
                style={{ backgroundColor: "var(--bg-primary)" }}
                placeholder="e.g. Frontend Developer"
              />
              {errors.tagline && (
                <span className="text-red-500 text-sm">
                  {errors.tagline.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                {...register("email")}
                data-testid="email-input"
                type="email"
                className="w-full p-2 rounded-lg"
                style={{ backgroundColor: "var(--bg-primary)" }}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="p-2 rounded-lg hover:opacity-80 transition-opacity duration-200"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                }}
                onClick={() => setIsCreateProfileOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                data-testid="submit-button"
                className="p-2 rounded-lg hover:opacity-80 transition-opacity duration-200"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                }}
              >
                Create
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CreateProfile;
