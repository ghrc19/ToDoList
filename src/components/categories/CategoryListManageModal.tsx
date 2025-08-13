import React from 'react';
import { useTask } from '../../context/TaskContext';
import CategoryItem from './CategoryItem';
import { XIcon, FolderIcon, FolderPlusIcon } from 'lucide-react';

interface CategoryListManageModalProps {
  onClose: () => void;
}

const CategoryListManageModal: React.FC<CategoryListManageModalProps> = ({ onClose }) => {
  const { categories } = useTask();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-indigo-400 dark:border-indigo-700 p-0 w-full max-w-xl max-h-[90vh] flex flex-col relative overflow-hidden">
        {/* Icono de fondo decorativo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <FolderIcon className="w-[350px] h-[350px] text-indigo-100 dark:text-indigo-900 opacity-10" />
        </div>
        <div className="flex items-center gap-3 justify-between px-8 py-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl relative z-10">
          <div className="flex items-center gap-3">
            <FolderPlusIcon className="w-7 h-7 text-white drop-shadow" />
            <h3 className="text-2xl font-bold text-white tracking-tight">Gestionar categorías</h3>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-white">
            <XIcon className="w-7 h-7" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-white dark:bg-gray-900 rounded-b-2xl min-h-[200px] custom-scrollbar relative z-10">
          {categories.length > 0 ? (
            <div className="space-y-4">
              {categories.map(category => (
                <CategoryItem key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">No hay categorías</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryListManageModal;
