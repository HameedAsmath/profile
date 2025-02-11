import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileCard } from "./profile-card";
import { Profile } from "../types/types";
import { AnimatePresence } from "framer-motion";
import { CandidatesService } from "../services/candidates-services";

export const CandidateList = () => {
  const queryClient = useQueryClient();

  const {
    data: profiles,
    isLoading,
    error,
  } = useQuery<Profile[]>({
    queryKey: ["profiles"],
    queryFn: CandidatesService.getProfiles,
  });

  const deleteProfileMutation = useMutation({
    mutationFn: CandidatesService.deleteProfile,
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["profiles"] });

      // Snapshot the previous value
      const previousProfiles = queryClient.getQueryData<Profile[]>([
        "profiles",
      ]);

      // Optimistically update to the new value
      if (previousProfiles) {
        queryClient.setQueryData<Profile[]>(
          ["profiles"],
          previousProfiles.filter((profile) => profile.id !== deletedId)
        );
      }

      // Return a context object with the snapshotted value
      return { previousProfiles };
    },
    onError: (err, newTodo, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousProfiles) {
        queryClient.setQueryData<Profile[]>(
          ["profiles"],
          context.previousProfiles
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success to make sure our optimistic update is correct
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
  });

  const handleDelete = (id: number) => {
    deleteProfileMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div
          className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: "var(--text-secondary)" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div
          className="text-center p-4 rounded-lg"
          style={{ color: "var(--text-secondary)" }}
        >
          Error loading profiles: {error.message}
        </div>
      </div>
    );
  }

  return (
    <main className="container py-8">
      <h1
        className="text-3xl font-bold mb-8"
        style={{ color: "var(--text-primary)" }}
      >
        Candidate Profiles
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {profiles?.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onDelete={handleDelete}
            />
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
};
