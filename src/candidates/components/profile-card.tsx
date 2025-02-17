import DeleteIcon from "../icons/delete-icon";
import { Profile } from "../types/types";
import { motion } from "framer-motion";

interface ProfileCardProps {
  profile: Profile;
  onDelete: (id: number) => void;
}

export const ProfileCard = ({ profile, onDelete }: ProfileCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="card relative group"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <button
        onClick={() => onDelete(profile.id)}
        className="absolute top-4 right-4 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
        aria-label="Delete profile"
      >
        <DeleteIcon />
      </button>

      <div className="p-6">
        <div className="flex items-center space-x-4">
          <img
            src={profile.image}
            alt={profile.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <h3
              className="text-lg font-semibold truncate mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              {profile.name}
            </h3>
            <p
              className="text-sm truncate"
              style={{ color: "var(--text-secondary)" }}
            >
              {profile.tagline}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {profile.description}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {profile.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div
          className="mt-4 pt-4 flex justify-between items-center text-sm border-t"
          style={{ borderColor: "var(--border-color)" }}
        >
          <span style={{ color: "var(--text-secondary)" }}>
            {profile.yearsOfExperience} years experience
          </span>
          <span
            className="truncate ml-4"
            style={{ color: "var(--text-secondary)" }}
          >
            {profile.email}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
