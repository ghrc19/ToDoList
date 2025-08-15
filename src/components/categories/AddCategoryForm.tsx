import React, { useState } from 'react';
import { useTask } from '../../context/TaskContext';
import { XIcon, FolderPlusIcon, FolderIcon } from 'lucide-react';
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
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-indigo-400 dark:border-indigo-700 p-0 w-full max-w-md max-h-[90vh] flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <FolderIcon className="w-[300px] h-[300px] text-indigo-100 dark:text-indigo-900 opacity-10" />
      </div>
      <div className="flex items-center gap-3 justify-between px-8 py-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl relative z-10">
        <div className="flex items-center gap-3">
          <FolderPlusIcon className="w-7 h-7 text-white drop-shadow" />
          <h3 className="text-2xl font-bold text-white tracking-tight">Nueva categoría</h3>
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-white">
          <XIcon className="w-7 h-7" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6 bg-white dark:bg-gray-900 rounded-b-2xl min-h-[200px] custom-scrollbar relative z-10">
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
        <div className="mt-8 flex gap-3 justify-end">
          <button type="button" onClick={onClose} className="w-1/2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl py-3 font-semibold transition">Cancelar</button>
          <button type="submit" className="w-1/2 bg-indigo-600 text-white font-semibold hover:bg-indigo-700 rounded-xl py-3 transition">Guardar categoría</button>
        </div>
      </form>
    </div>
  );
};
export default AddCategoryForm;