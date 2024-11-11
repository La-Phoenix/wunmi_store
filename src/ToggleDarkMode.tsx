// DarkModeToggle.tsx
import React from 'react';

interface DarkModeToggleProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ darkMode, toggleDarkMode }) => {
  return (
    <div
      onClick={toggleDarkMode}
      className="relative inline-flex items-center cursor-pointer"
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={darkMode}
          onChange={toggleDarkMode}
          className="sr-only"
        />
        <div
          className={`w-12 h-6 rounded-full transition-all duration-300 ease-in-out ${
            darkMode ? 'bg-blue-600' : 'bg-gray-300'
          }`}
        >
          <div
            className={`w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ease-in-out transform ${
              darkMode ? 'translate-x-6' : 'translate-x-0'
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default DarkModeToggle;
