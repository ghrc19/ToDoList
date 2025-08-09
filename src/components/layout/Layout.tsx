import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import { HomeIcon, SettingsIcon, LogOutIcon, MoonIcon, SunIcon, UserIcon } from 'lucide-react';
interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, logout, user, authLoading } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <span className="text-lg text-gray-600 dark:text-gray-300">Cargando...</span>
      </div>
    );
  }

  return <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <div className="flex flex-1">
        <aside className="w-16 md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 h-screen fixed top-0 left-0 z-30">
          <div className="p-4 h-full flex flex-col">
            <div className="flex flex-col items-center justify-center mb-6 w-56 h-32">
              <img src="/logo.png" alt="Logo To-Do" className="w-full h-full object-contain mx-auto my-auto" />
            </div>
            <nav className="space-y-1 flex-1">
              <button onClick={() => navigate('/')} className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg w-full">
                <HomeIcon className="h-5 w-5 mr-2" />
                <span className="hidden md:inline">Panel de Tareas</span>
              </button>
              <button onClick={() => navigate('/settings')} className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg w-full">
                <SettingsIcon className="h-5 w-5 mr-2" />
                <span className="hidden md:inline">Configuración</span>
              </button>
            </nav>
            <div className="mt-6 flex flex-col items-center w-full">
              <div className="flex flex-col gap-2 w-full">
                <button onClick={toggleTheme} className="flex items-center gap-2 px-4 py-3 w-full justify-center rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}>
                  {theme === 'light' ? <MoonIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" /> : <SunIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
                  </span>
                </button>
                {user && (
                  <div className="flex items-center gap-2 px-4 py-3 w-full justify-center bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <UserIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 break-words max-w-full">{user.name}</span>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-4 py-3 w-full rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-md hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-150"
                  title="Cerrar sesión"
                >
                  <LogOutIcon className="h-5 w-5" />
                  <span className="hidden md:inline">Cerrar sesión</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
  <main className="flex-1 p-4 md:p-8 min-h-screen ml-16 md:ml-64">{children}</main>
      </div>
    </div>;
};
export default Layout;