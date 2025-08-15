import React, { useState } from 'react';
import { ListIcon } from 'lucide-react';
import TaskItem from './TaskItem';
import AddExistingTaskModal from './AddExistingTaskModal';
import { useTask } from '../../context/TaskContext';
import { getTasksForDate } from '../../utils/getTasksForDate';
import MonthCalendar from '../calendar/MonthCalendar';



const TaskList: React.FC = () => {
  const { tasks, categories } = useTask();
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [filterEstado, setFilterEstado] = useState<'Todas' | 'Pendientes' | 'Completadas'>('Todas');
  const [filterCategoria, setFilterCategoria] = useState<string>('Todas');
  const [showAddExistingTask, setShowAddExistingTask] = useState(false);
  function formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  const selectedDayStr = selectedDate ? formatDateLocal(selectedDate) : formatDateLocal(new Date());
  let dayTasks = getTasksForDate(tasks, selectedDayStr);
  if (filterEstado !== 'Todas') {
    dayTasks = dayTasks.filter(task => {
      const completed = task.completed && task.completed[selectedDayStr];
      if (filterEstado === 'Pendientes') return !completed;
      if (filterEstado === 'Completadas') return !!completed;
      return true;
    });
  }
  if (filterCategoria !== 'Todas') {
    const catObj = categories.find(cat => cat.name === filterCategoria);
    if (catObj) {
      dayTasks = dayTasks.filter(task => task.categoryId === catObj.id);
    }
  }
  const prioridadOrden = { high: 0, medium: 1, low: 2 };
  dayTasks = [...dayTasks].sort((a, b) => (prioridadOrden[a.priority] ?? 3) - (prioridadOrden[b.priority] ?? 3));

  return (
    <div className="max-w-7xl mx-auto py-10 px-2 md:px-0">
      <div className="relative mb-10 flex items-center justify-between gap-4">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <svg className="w-[320px] h-[120px] text-indigo-500 dark:text-indigo-900 opacity-30 dark:opacity-20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="4" /><path d="M8 2v4M16 2v4M2 10h20" /></svg>
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <span className="inline-flex items-center justify-center rounded-full bg-white/20 shadow w-12 h-12">
            <svg className="w-7 h-7 text-indigo-900 dark:text-white animate-fade-in" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-indigo-900 dark:text-white drop-shadow">Panel de tareas</h1>
        </div>
  <div className="flex gap-4 items-center relative z-10">
          <div className="w-36 md:w-48">
            <label className="block text-xs font-semibold text-indigo-700 dark:text-white mb-1">Estado</label>
            <select
              className="w-full rounded-xl border-2 border-indigo-300 dark:border-indigo-600 bg-white/80 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-lg font-medium"
              value={filterEstado}
              onChange={e => setFilterEstado(e.target.value as 'Todas' | 'Pendientes' | 'Completadas')}
            >
              <option value="Todas">Todas</option>
              <option value="Pendientes">Pendientes</option>
              <option value="Completadas">Completadas</option>
            </select>
          </div>
          <div className="w-36 md:w-48">
            <label className="block text-xs font-semibold text-indigo-700 dark:text-white mb-1">Categoría</label>
            <select
              className="w-full rounded-xl border-2 border-indigo-300 dark:border-indigo-600 bg-white/80 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-lg font-medium"
              value={filterCategoria}
              onChange={e => setFilterCategoria(e.target.value)}
            >
              <option value="Todas">Todas</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  <div className="bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl shadow-xl p-8 flex flex-col justify-between min-h-[480px]">
    <div>
      <h2 className="text-2xl font-bold mb-6 text-indigo-700 dark:text-indigo-200 flex items-center gap-2">
        <svg className="w-6 h-6 text-indigo-500 dark:text-indigo-300 animate-spin-slow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3v4M8 3v4" /></svg>
        Tareas del día
      </h2>
      {(() => {
        if (dayTasks.length === 0) {
          return <div className="text-center text-gray-500 dark:text-gray-400 py-8">No hay tareas para este día</div>;
        }
        const completed = dayTasks.filter(task => task.completed && task.completed[selectedDayStr]);
        const pending = dayTasks.filter(task => !task.completed || !task.completed[selectedDayStr]);
        return (
          <div className="flex flex-col gap-1 max-h-[420px] overflow-y-auto text-sm task-list-scroll-hidden">
            {pending.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                categories={categories}
                selectedDate={selectedDayStr}
                compact
              />
            ))}
            {completed.length > 0 && (
              <>
                <div className="my-1 border-t border-dashed border-gray-300 dark:border-gray-700 text-xs text-center text-gray-400 dark:text-gray-500 select-none">Completadas</div>
                {completed.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    categories={categories}
                    selectedDate={selectedDayStr}
                    compact
                  />
                ))}
              </>
            )}
          </div>
        );
      })()}
    </div>
    <div className="flex gap-2 justify-end mt-4">
  <button 
    onClick={() => setShowAddExistingTask(true)}
    className="w-fit px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow transition-all text-sm flex items-center gap-2 transform hover:scale-105 active:scale-95 duration-150">
        <ListIcon className="w-4 h-4" />
        Agregar existente
      </button>
      {showAddExistingTask && (
        <AddExistingTaskModal
          onClose={() => setShowAddExistingTask(false)}
          selectedDate={selectedDayStr}
        />
      )}
    </div>
  </div>
  <div className="bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-indigo-700 dark:text-indigo-200 flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-500 dark:text-indigo-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
            Calendario
          </h2>
          <MonthCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </div>
      </div>
    </div>
  );
};

export default TaskList;