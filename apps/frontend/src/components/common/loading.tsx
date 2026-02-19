import React from "react";

type LoadingProps = {
  message?: string;          // Optional custom message
  fullScreen?: boolean;      // Optional fullscreen mode
  size?: number;             // Optional spinner size
};

const LoadingComponent: React.FC<LoadingProps> = ({
  message = "Please wait...",
  fullScreen = false,
  size = 40,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${
        fullScreen ? "fixed inset-0 bg-black/40 z-50" : "w-full py-10"
      }`}
    >
      <div
        style={{ width: size, height: size }}
        className="animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"
      />
      {message && (
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingComponent;
