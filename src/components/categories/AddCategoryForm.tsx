import React, { useState } from 'react';
import { useTask } from '../../context/TaskContext';
import { XIcon } from 'lucide-react';
interface AddCategoryFormProps {
  onClose: () => void;
}
const AddCategoryForm: React.FC<AddCategoryFormProps> = ({
  onClose
}) => {
  const {
    addCategory
  } = useTask();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#4f46e5');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addCategory({
      name: name.trim(),
      color
    });
    onClose();
  };
  const predefinedColors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316' // orange
  ];
  return <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Nueva categoría
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
          <XIcon className="w-5 h-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre
            </label>
            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="Nombre de la categoría" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-3">
              {predefinedColors.map(clr => <button key={clr} type="button" onClick={() => setColor(clr)} className={`w-8 h-8 rounded-full ${color === clr ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500' : ''}`} style={{
              backgroundColor: clr
            }} aria-label={`Color ${clr}`} />)}
              <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-8 h-8 p-0 border-0 rounded-full cursor-pointer" aria-label="Color personalizado" />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium">
            Guardar categoría
          </button>
        </div>
      </form>
    </div>;
};
export default AddCategoryForm;