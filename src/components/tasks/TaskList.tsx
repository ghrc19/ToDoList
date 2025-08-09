import React, { useState } from 'react';
import TaskItem from './TaskItem';
import AddTaskForm from './AddTaskForm';
import AddCategoryForm from '../categories/AddCategoryForm';
import CategoryItem from '../categories/CategoryItem';
import { useTask } from '../../context/TaskContext';
import { getTasksForDate } from '../../utils/getTasksForDate';
import MonthCalendar from '../calendar/MonthCalendar';
import { PlusIcon, XIcon } from 'lucide-react';


const TaskList: React.FC = () => {
  const { tasks, categories } = useTask();
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [showManageTasks, setShowManageTasks] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showManageCategories, setShowManageCategories] = useState(false);
  const sortedTasks = [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed));
  const lastTasks = [...tasks].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  function formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  const selectedDayStr = selectedDate ? formatDateLocal(selectedDate) : formatDateLocal(new Date());
  const dayTasks = getTasksForDate(tasks, selectedDayStr);
  if (typeof window !== 'undefined') {
    console.log('[TaskList][DEBUG] selectedDate:', selectedDate, '| selectedDayStr:', selectedDayStr, '| dayTasks:', dayTasks);
  }

  return (
    <div className="max-w-7xl mx-auto py-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700 dark:text-indigo-200">Panel de tareas</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center">
          <h2 className="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-300">Filtros</h2>
          <div className="w-full mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
            <select className="w-full rounded border-2 border-indigo-400 dark:border-indigo-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm">
              <option>Todas</option>
              <option>Pendientes</option>
              <option>Completadas</option>
            </select>
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
            <select className="w-full rounded border-2 border-indigo-400 dark:border-indigo-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm">
              <option>Todas</option>
              {categories.map(cat => (
                <option key={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center w-full">
          <h2 className="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-300">Tareas</h2>
          <div className="flex flex-col w-full mb-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {lastTasks.map(task => (
                <span key={task.id} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 rounded text-xs font-semibold truncate max-w-[120px]">{task.title}</span>
              ))}
              {tasks.length > 4 && (
                <button className="text-xs text-indigo-600 underline ml-2" onClick={() => setShowManageTasks(true)}>Más</button>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAddTask(true)} className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold">
                <PlusIcon className="w-4 h-4" /> Crear tarea
              </button>
              <button onClick={() => setShowManageTasks(true)} className="flex items-center gap-1 px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 rounded font-semibold">
                Gestionar todas las tareas
              </button>
            </div>
          </div>
          {showAddTask && (
            <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg relative">
                <button onClick={() => setShowAddTask(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <XIcon className="w-6 h-6" />
                </button>
                <AddTaskForm onClose={() => setShowAddTask(false)} />
              </div>
            </div>
          )}
          {showManageTasks && (
            <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg relative">
                <button onClick={() => setShowManageTasks(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <XIcon className="w-6 h-6" />
                </button>
                <h3 className="text-xl font-bold mb-4">Todas las tareas</h3>
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
                  {tasks.length > 0 ? tasks.map(task => (
                    <TaskItem key={task.id} task={task} categories={categories} editable showDelete compact />
                  )) : <div className="text-center text-gray-500 dark:text-gray-400 py-8">No hay tareas</div>}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center w-full">
          <h2 className="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-300">Categorías</h2>
          <div className="flex gap-2 mb-4">
            <button onClick={() => setShowAddCategory(true)} className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded font-semibold">
              Crear categoría
            </button>
            <button onClick={() => setShowManageCategories(true)} className="flex items-center gap-1 px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 rounded font-semibold">
              Gestionar categorías
            </button>
          </div>
          {showAddCategory && (
            <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg relative">
                <button onClick={() => setShowAddCategory(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <XIcon className="w-6 h-6" />
                </button>
                <h3 className="text-xl font-bold mb-4">Crear nueva categoría</h3>
                <AddCategoryForm onClose={() => setShowAddCategory(false)} />
              </div>
            </div>
          )}
          {showManageCategories && (
            <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg relative">
                <button onClick={() => setShowManageCategories(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <XIcon className="w-6 h-6" />
                </button>
                <h3 className="text-xl font-bold mb-4">Gestionar categorías</h3>
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
                  {categories.length > 0 ? categories.map(cat => (
                    <CategoryItem key={cat.id} category={cat} />
                  )) : <div className="text-center text-gray-500 dark:text-gray-400 py-8">No hay categorías</div>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-300">Tareas del día</h2>
          {dayTasks.length > 0 ? dayTasks.map(task => (
            <TaskItem key={task.id} task={task} categories={categories} selectedDate={selectedDayStr} />
          )) : <div className="text-center text-gray-500 dark:text-gray-400 py-8">No hay tareas para este día</div>}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-bold mb-4 text-indigo-600 dark:text-indigo-300">Calendario</h2>
          <MonthCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </div>
      </div>
    </div>
  );
};

export default TaskList;