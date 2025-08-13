import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string | boolean;
  success?: boolean;
}


const Input: React.FC<InputProps> = ({ label, icon, error, success, className = '', ...props }) => {
  const errorMsg = typeof error === 'string' ? error : undefined;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={props.id} className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          {...props}
          className={`transition-all duration-200 ease-in-out appearance-none block w-full py-2 pr-3 ${icon ? 'pl-10' : 'pl-3'} rounded-xl border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm
            ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-200' : success ? 'border-green-400 focus:border-green-500 focus:ring-green-200' : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-200'}
            placeholder-gray-400 text-gray-900 dark:text-gray-100 
            ${(props.value && !error)
              ? '!bg-gray-200 !dark:bg-gray-900 !text-gray-900 !dark:text-gray-100'
              : 'bg-white dark:bg-gray-800 text-gray-100'}
            hover:border-indigo-400 dark:hover:border-indigo-400 ${className}`}
        />
        <span className={`absolute left-2 right-2 bottom-0 h-0.5 rounded transition-all duration-300 ${error ? 'bg-red-400' : success ? 'bg-green-400' : 'bg-indigo-400 group-focus-within:bg-indigo-500'} opacity-60`} />
      </div>
      {errorMsg && <p className="text-xs text-red-500 mt-1 font-medium">{errorMsg}</p>}
    </div>
  );
};

export default Input;
