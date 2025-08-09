import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import CategoryItem from '../components/categories/CategoryItem';
import AddCategoryForm from '../components/categories/AddCategoryForm';
import { PlusIcon } from 'lucide-react';
const Categories: React.FC = () => {
  const {
    categories
  } = useTask();
  const [showAddForm, setShowAddForm] = useState(false);
  return <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Categorías
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Organiza tus tareas por categorías
          </p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-sm flex items-center">
          <PlusIcon className="w-4 h-4 mr-2" />
          Nueva categoría
        </button>
      </div>
      {showAddForm && <AddCategoryForm onClose={() => setShowAddForm(false)} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.length > 0 ? categories.map(category => <CategoryItem key={category.id} category={category} />) : <div className="md:col-span-2 text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              No hay categorías para mostrar
            </p>
            <button onClick={() => setShowAddForm(true)} className="mt-3 text-indigo-600 dark:text-indigo-400 hover:underline text-sm">
              Crear una nueva categoría
            </button>
          </div>}
      </div>
    </div>;
};
export default Categories;