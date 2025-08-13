import React from "react";

interface AlertProps {
  type?: "success" | "error" | "info";
  children: React.ReactNode;
  className?: string;
}

const typeStyles: Record<string, string> = {
  success: "bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300",
  error: "bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300",
  info: "bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300",
};

const Alert: React.FC<AlertProps> = ({ type = "info", children, className = "" }) => (
  <div className={`mb-4 p-3 rounded-lg text-sm ${typeStyles[type]} ${className}`}>
    {children}
  </div>
);

export default Alert;
