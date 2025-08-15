type SidebarMenuProps = {
  icon: React.ReactNode;
  label: string;
  color: string;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
  onClick?: () => void;
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({ icon, label, color, open, setOpen, children, onClick }) => {
  const base = `flex items-center px-4 py-3 w-full rounded-lg font-semibold gap-2 transition-colors bg-transparent`;
  const active = `bg-purple-100 dark:bg-blue-900 text-purple-700 dark:text-blue-200`;
  const hover = `hover:bg-purple-100 dark:hover:bg-blue-900`;
  const text = `text-purple-700 dark:text-blue-200`;
  if (typeof open === 'boolean' && setOpen) {
    return (
      <div className="relative">
        <button
          onClick={() => setOpen(v => !v)}
          className={`${base} ${text} ${hover} ${open ? active : ''}`}
          style={{ transition: 'background 0.2s, color 0.2s' }}
        >
          {icon}
          <span className="hidden md:inline">{label}</span>
          <svg className={`ml-auto w-4 h-4 transition-transform ${open ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'} pl-4`}
             style={{ transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s cubic-bezier(0.4,0,0.2,1)' }}>
          <div className={`flex flex-col gap-1 py-1 ${open ? 'animate-fade-in' : ''}`}>{open && children}</div>
        </div>
      </div>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`${base} ${text} ${hover}`}
      style={{ transition: 'background 0.2s, color 0.2s' }}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </button>
  );
};
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import { HomeIcon, SettingsIcon, LogOutIcon, MoonIcon, SunIcon, UserIcon, PlusIcon, FolderPlusIcon, ListTodoIcon, FolderIcon } from 'lucide-react';
import AddTaskForm from '../tasks/AddTaskForm';
import DuplicateTemplateModal from '../tasks/DuplicateTemplateModal';
import EditTemplateModal from '../tasks/EditTemplateModal';
import AddCategoryForm from '../categories/AddCategoryForm';
import TaskListManageModal from '../tasks/TaskListManageModal';
import CategoryListManageModal from '../categories/CategoryListManageModal';
interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, logout, user, authLoading } = useAuth();
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showManageTasks, setShowManageTasks] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showManageCategories, setShowManageCategories] = useState(false);
  const [openTaskMenu, setOpenTaskMenu] = useState(false);
  const [openCategoryMenu, setOpenCategoryMenu] = useState(false);
  const [duplicateTask, setDuplicateTask] = useState(null as any);
  const [editTask, setEditTask] = useState(null as any);
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
            <nav className="space-y-1 flex-1 flex flex-col">
              <SidebarMenu
                icon={<HomeIcon className="h-5 w-5" />}
                label="Panel de tareas"
                color="blue"
                onClick={() => navigate('/')}
              />
              <SidebarMenu
                icon={<ListTodoIcon className="h-5 w-5" />}
                label="Tareas"
                color="blue"
                open={openTaskMenu}
                setOpen={setOpenTaskMenu}
              >
                <button
                  onClick={() => setShowTaskDialog(true)}
                  className="flex items-center px-4 py-2 text-purple-700 dark:text-blue-200 hover:bg-purple-100 dark:hover:bg-blue-800 rounded-lg w-full gap-2 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span className="hidden md:inline">Crear tarea</span>
                </button>
                <button
                  onClick={() => setShowManageTasks(true)}
                  className="flex items-center px-4 py-2 text-purple-700 dark:text-blue-200 hover:bg-purple-100 dark:hover:bg-blue-800 rounded-lg w-full gap-2 transition-colors"
                >
                  <ListTodoIcon className="h-4 w-4" />
                  <span className="hidden md:inline">Gestionar plantillas</span>
                </button>
              </SidebarMenu>
              <SidebarMenu
                icon={<FolderIcon className="h-5 w-5" />}
                label="Categorías"
                color="blue"
                open={openCategoryMenu}
                setOpen={setOpenCategoryMenu}
              >
                <button
                  onClick={() => setShowCategoryDialog(true)}
                  className="flex items-center px-4 py-2 text-purple-700 dark:text-blue-200 hover:bg-purple-100 dark:hover:bg-blue-800 rounded-lg w-full gap-2 transition-colors"
                >
                  <FolderPlusIcon className="h-4 w-4" />
                  <span className="hidden md:inline">Crear categoría</span>
                </button>
                <button
                  onClick={() => setShowManageCategories(true)}
                  className="flex items-center px-4 py-2 text-purple-700 dark:text-blue-200 hover:bg-purple-100 dark:hover:bg-blue-800 rounded-lg w-full gap-2 transition-colors"
                >
                  <FolderIcon className="h-4 w-4" />
                  <span className="hidden md:inline">Gestionar categorías</span>
                </button>
              </SidebarMenu>
              <div className="flex-1" />
              <SidebarMenu
                icon={<SettingsIcon className="h-5 w-5" />}
                label="Configuración"
                color="blue"
                onClick={() => navigate('/settings')}
              />
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
  {showTaskDialog && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
      <div className="w-full max-w-lg mx-auto">
        <AddTaskForm onClose={() => setShowTaskDialog(false)} />
      </div>
    </div>
  )}
  {showManageTasks && (
    <TaskListManageModal 
      onClose={() => setShowManageTasks(false)}
      onDuplicate={(task) => setDuplicateTask(task)}
      onEdit={(task) => setEditTask(task)}
    />
  )}
  {duplicateTask && (
    <DuplicateTemplateModal 
      template={duplicateTask}
      onClose={() => setDuplicateTask(null)}
    />
  )}
  {editTask && (
    <EditTemplateModal 
      template={editTask}
      onClose={() => setEditTask(null)}
    />
  )}
  {showCategoryDialog && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
      <div className="w-full max-w-md mx-auto">
        <AddCategoryForm onClose={() => setShowCategoryDialog(false)} />
      </div>
    </div>
  )}
  {showManageCategories && (
    <CategoryListManageModal onClose={() => setShowManageCategories(false)} />
  )}
      </div>
    </div>;
};
export default Layout;