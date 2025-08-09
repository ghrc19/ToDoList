import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { SunIcon, MoonIcon, UserIcon } from 'lucide-react';
const Header: React.FC = () => {
  const {
    theme,
    toggleTheme
  } = useTheme();
  const {
    user
  } = useAuth();
  return <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <img src="/logo.png" alt="Logo To-Do" className="w-10 h-10 object-contain mr-3" />
        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
          TaskDaily
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}>
          {theme === 'light' ? <MoonIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" /> : <SunIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />}
        </button>
        {user && <div className="flex items-center">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-2 mr-2">
              <UserIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300">
              {user.name}
            </span>
          </div>}
      </div>
    </header>;
};
export default Header;