import React, { useState } from 'react';
import { Category, useTask } from '../../context/TaskContext';
import { EditIcon, TrashIcon, CheckIcon, XIcon } from 'lucide-react';
import ConfirmationModal from '../ui/ConfirmationModal';
interface CategoryItemProps {
  category: Category;
}
const CategoryItem: React.FC<CategoryItemProps> = ({
  category
}) => {
  const {
    updateCategory,
    deleteCategory
  } = useTask();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [name, setName] = useState(category.name);
  const [color, setColor] = useState(category.color);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteCategory(category.id);
    setShowDeleteConfirm(false);
  };
  const handleSave = () => {
    if (name.trim()) {
      updateCategory(category.id, {
        name,
        color
      });
      setIsEditing(false);
    }
  };
  const handleCancel = () => {
    setName(category.name);
    setColor(category.color);
    setIsEditing(false);
  };
  const predefinedColors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316' // orange
  ];
  return (
    <>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between">
        {isEditing ? <div className="flex-1 space-y-3">
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="Nombre de la categoría" autoFocus />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color:
              </label>
              <div className="flex flex-wrap gap-2">
                {predefinedColors.map(clr => <button key={clr} type="button" onClick={() => setColor(clr)} className={`w-8 h-8 rounded-full ${color === clr ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500' : ''}`} style={{
              backgroundColor: clr
            }} aria-label={`Color ${clr}`} />)}
                <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-8 h-8 p-0 border-0 rounded-full cursor-pointer" />
              </div>
            </div>
            <div className="flex space-x-2 justify-end">
              <button onClick={handleCancel} className="flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                <XIcon className="w-4 h-4 mr-1" /> Cancelar
              </button>
              <button onClick={handleSave} className="flex items-center px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm">
                <CheckIcon className="w-4 h-4 mr-1" /> Guardar
              </button>
            </div>
          </div> : <>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full mr-3" style={{
            backgroundColor: category.color
          }} />
              <span className="text-gray-800 dark:text-gray-200 font-medium">
                {category.name}
              </span>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => setIsEditing(true)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <EditIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
              <button onClick={handleDelete} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <TrashIcon className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </>}
      </div>
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Eliminar Categoría"
        message="¿Estás seguro de que quieres eliminar esta categoría?"
        confirmText="Eliminar"
        type="danger"
        details={[
          `Se eliminará la categoría "${category.name}"`,
          'Las tareas asociadas a esta categoría mantendrán su contenido pero perderán la categoría',
          'Esta acción no se puede deshacer'
        ]}
      />
    </>
  );
};
export default CategoryItem;