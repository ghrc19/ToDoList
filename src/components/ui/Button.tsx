import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', ...props }) => {
  let base = 'w-full flex justify-center items-center py-2 px-5 rounded-xl font-semibold shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60';
  let styles = '';
  switch (variant) {
    case 'secondary':
      styles = 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-400';
      break;
    case 'danger':
      styles = 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 focus:ring-red-400';
      break;
    default:
      styles = 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:from-indigo-600 hover:to-blue-600 focus:ring-indigo-400';
  }
  return (
    <button
      {...props}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
