import { Profile } from "../types";
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
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900"
        style={{ color: "var(--text-secondary)" }}
        aria-label="Delete profile"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
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
