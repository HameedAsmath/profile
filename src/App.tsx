import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { CandidateList } from "./components/candidate-list";

const queryClient = new QueryClient();

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      return savedTheme === "dark" || (!savedTheme && prefersDark);
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen transition-colors duration-200">
        <nav
          className="shadow-lg"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1
              className="text-xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Candidate Portal
            </h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:opacity-80 transition-opacity duration-200"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
              }}
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {darkMode ? "🌞 Light" : "🌙 Dark"}
            </button>
          </div>
        </nav>
        <CandidateList />
      </div>
    </QueryClientProvider>
  );
}

export default App;
