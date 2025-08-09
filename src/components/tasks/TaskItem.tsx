import React, { useState, useEffect, useRef } from 'react';
import { Task, Category, useTask } from '../../context/TaskContext';
import { CheckIcon, EditIcon, TrashIcon, RepeatIcon, PlayIcon, RotateCwIcon } from 'lucide-react';
import beep from '../../utils/beep';
import notify from '../../utils/notify';
import finish from '../../utils/finish';
interface TaskItemProps {
  task: Task;
  categories: Category[];
  editable?: boolean;
  showDelete?: boolean;
  compact?: boolean;
  selectedDate?: string;
}
const TaskItem: React.FC<TaskItemProps> = ({
  task,
  categories,
  editable = false,
  showDelete = false,
  compact = false,
  selectedDate
}) => {
  const {
    updateTask,
    deleteTask
  } = useTask();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const category = categories.find(cat => cat.id === task.categoryId);

  const completedMap = task.completed || {};
  const dateKey = selectedDate || (new Date()).toISOString().slice(0, 10);
  const isCompleted = !!completedMap[dateKey];
  const handleToggleComplete = () => {
    updateTask(task.id, {
      completed: { ...completedMap, [dateKey]: !isCompleted }
    });
  };
  const handleSaveEdit = () => {
    if (title.trim()) {
      updateTask(task.id, {
        title
      });
      setIsEditing(false);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setTitle(task.title);
      setIsEditing(false);
    }
  };
  const handleDelete = () => {
    if (window.confirm('¿Eliminar esta tarea?')) {
      deleteTask(task.id);
    }
  };
  const priorityClasses = {
    low: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
  };

  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const notificationIcon = '/icono.png';

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  useEffect(() => {
    if (task.cronometrado && typeof task.duration === 'number') {
      setSecondsLeft(task.duration * 60);
      setTimerRunning(false);
    }
  }, [task.id, task.cronometrado, task.duration]);

  useEffect(() => {
    if (!timerRunning || task.completed || !task.cronometrado || typeof task.duration !== 'number') return;
    if (secondsLeft === null) return;
    if (secondsLeft > 0) {
      timerRef.current = setTimeout(() => setSecondsLeft(s => (s !== null ? s - 1 : null)), 1000);
    } else if (secondsLeft === 0) {
      setTimerRunning(false);
      finish.play();
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('¡Tarea completada!', { body: task.title, icon: notificationIcon });
      }
  updateTask(task.id, { completed: { ...completedMap, [dateKey]: true } });
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timerRunning, secondsLeft, task.completed, task.cronometrado, task.duration]);

  const handleStart = () => {
    if (secondsLeft === null && typeof task.duration === 'number') {
      setSecondsLeft(task.duration * 60);
    }
    setTimerRunning(true);
    beep.play();
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Temporizador iniciado', { body: task.title, icon: notificationIcon });
    }
  };
  const handlePause = () => {
    setTimerRunning(false);
    notify.play();
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Temporizador pausado', { body: task.title, icon: notificationIcon });
    }
  };
  const handleReset = () => {
    setTimerRunning(false);
    setSecondsLeft(typeof task.duration === 'number' ? task.duration * 60 : null);
    notify.play();
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Temporizador reiniciado', { body: task.title, icon: notificationIcon });
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (compact) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({
      title: task.title,
      categoryId: task.categoryId || '',
      date: task.date,
      isRecurring: !!task.isRecurring,
      recurringDays: Array.isArray(task.recurringDays) ? task.recurringDays : [],
      priority: task.priority || 'medium',
      duration: task.duration || 60,
      cronometrado: !!task.cronometrado,
      recurringIndeterminate: task.recurringIndeterminate ?? true,
      recurringStartDate: task.recurringStartDate || '',
      recurringEndDate: task.recurringEndDate || '',
    });
    const handleEditChange = (field: string, value: any) => {
      setEditData(prev => ({ ...prev, [field]: value }));
    };
    const handleEditSave = () => {
      updateTask(task.id, {
        ...editData,
        duration: Number(editData.duration) || 0,
        recurringDays: editData.isRecurring ? editData.recurringDays : [],
        recurringIndeterminate: editData.isRecurring ? editData.recurringIndeterminate : undefined,
        recurringStartDate: editData.isRecurring && !editData.recurringIndeterminate ? editData.recurringStartDate : undefined,
        recurringEndDate: editData.isRecurring && !editData.recurringIndeterminate ? editData.recurringEndDate : undefined,
      });
      setShowEditModal(false);
    };

    if (!compact) {
      console.log('TaskItem render', { task, categories });
    }
    return (
      <>
        <div className="flex items-center justify-between gap-2 px-4 py-3 mb-2 bg-gradient-to-r from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border border-indigo-100 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all group">
          <div className="flex-1 min-w-0 flex flex-col">
            <span className={`truncate font-semibold text-base ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-100'} transition-colors`}>{task.title}</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {category && <span className="text-xs px-2 py-1 rounded-full font-semibold shadow-sm" style={{ backgroundColor: `${category.color}22`, color: category.color }}>{category.name}</span>}
              {task.priority && <span className={`text-xs px-2 py-1 rounded-full font-semibold shadow-sm ${priorityClasses[task.priority]}`}>{task.priority === 'low' ? 'Baja' : task.priority === 'medium' ? 'Media' : 'Alta'}</span>}
              {typeof task.duration === 'number' && <span className="text-xs px-2 py-1 rounded-full font-semibold shadow-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">{task.duration} min</span>}
              {task.isRecurring && <span className="flex items-center text-xs px-2 py-1 rounded-full font-semibold shadow-sm bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200"><RepeatIcon className="w-3 h-3 mr-1" /> Recurrente</span>}
            </div>
          </div>
          <div className="flex gap-2 ml-2">
            {editable && (
              <button onClick={() => setShowEditModal(true)} className="p-1 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-700 shadow transition" title="Editar">
                <EditIcon className="w-4 h-4" />
              </button>
            )}
            {showDelete && (
              <button onClick={handleDelete} className="p-1 rounded-full bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-700 shadow transition" title="Eliminar">
                <TrashIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg relative">
              <button onClick={() => setShowEditModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <TrashIcon className="w-6 h-6" />
              </button>
              <h3 className="text-xl font-bold mb-4">Editar tarea</h3>
              <form onSubmit={e => { e.preventDefault(); handleEditSave(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                  <input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" value={editData.title} onChange={e => handleEditChange('title', e.target.value)} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" value={editData.categoryId} onChange={e => handleEditChange('categoryId', e.target.value)}>
                      <option value="">Sin categoría</option>
                      {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioridad</label>
                    <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" value={editData.priority} onChange={e => handleEditChange('priority', e.target.value)}>
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duración (minutos)</label>
                    <input type="number" min="1" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" value={editData.duration} onChange={e => handleEditChange('duration', e.target.value)} required />
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <input id={`cronometrado-${task.id}`} type="checkbox" checked={editData.cronometrado} onChange={e => handleEditChange('cronometrado', e.target.checked)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    <label htmlFor={`cronometrado-${task.id}`} className="text-sm text-gray-700 dark:text-gray-300">Cronometrado</label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" value={editData.date} onChange={e => handleEditChange('date', e.target.value)} required />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input id={`isRecurring-${task.id}`} type="checkbox" checked={editData.isRecurring} onChange={e => handleEditChange('isRecurring', e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <label htmlFor={`isRecurring-${task.id}`} className="text-sm text-gray-700 dark:text-gray-300">Tarea recurrente</label>
                </div>
                {editData.isRecurring && (
                  <div className="mt-2 bg-indigo-50 dark:bg-indigo-900 border-2 border-indigo-300 dark:border-indigo-700 rounded-xl shadow-inner p-4 transition-colors">
                    <label className="block text-sm font-medium text-indigo-800 dark:text-indigo-200 mb-2">Repetir en estos días:</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {[0,1,2,3,4,5,6].map(idx => (
                        <button type="button" key={idx} onClick={() => handleEditChange('recurringDays', editData.recurringDays.includes(idx) ? editData.recurringDays.filter((d: number) => d !== idx) : [...editData.recurringDays, idx])} className={`px-3 py-1 rounded-full text-xs ${editData.recurringDays.includes(idx) ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>{['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][idx]}</button>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-4 items-center">
                      <div className="flex items-center gap-1">
                        <input id={`recurringIndeterminate-${task.id}`} type="radio" checked={editData.recurringIndeterminate} onChange={() => handleEditChange('recurringIndeterminate', true)} className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        <label htmlFor={`recurringIndeterminate-${task.id}`} className="text-xs text-gray-700 dark:text-gray-300">Indeterminada</label>
                      </div>
                      <div className="flex items-center gap-1">
                        <input id={`recurringRange-${task.id}`} type="radio" checked={!editData.recurringIndeterminate} onChange={() => handleEditChange('recurringIndeterminate', false)} className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        <label htmlFor={`recurringRange-${task.id}`} className="text-xs text-gray-700 dark:text-gray-300">Por rango de fecha</label>
                      </div>
                    </div>
                    {!editData.recurringIndeterminate && (
                      <div className="w-full mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Fecha de inicio</label>
                          <input type="date" className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs" value={editData.recurringStartDate} onChange={e => handleEditChange('recurringStartDate', e.target.value)} />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Fecha de fin</label>
                          <input type="date" className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs" value={editData.recurringEndDate} onChange={e => handleEditChange('recurringEndDate', e.target.value)} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-6 flex justify-end space-x-3">
                  <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium">Guardar cambios</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  if (!compact) {
  }
  return (
    <div
      className={`flex items-center justify-between gap-2 px-4 py-3 mb-2 border rounded-xl shadow-sm hover:shadow-md transition-all group ${isCompleted ? 'opacity-60' : ''}`}
      style={category ? { background: category.color + '22', borderColor: category.color } : {}}
    >
      <button
        onClick={handleToggleComplete}
        className={`mr-3 p-1 rounded-full ${isCompleted ? 'bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-200' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'} hover:bg-green-300 dark:hover:bg-green-700 transition`}
        title="Marcar como completada"
      >
        <CheckIcon className="w-5 h-5" />
      </button>
      <div className="flex-1 min-w-0 flex flex-col">
        <span className={`truncate font-semibold text-base ${isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-100'} transition-colors`}>{task.title}</span>
        <div className="flex flex-wrap gap-2 mt-1">
          {category && <span className="text-xs px-2 py-1 rounded-full font-semibold shadow-sm" style={{ backgroundColor: `${category.color}22`, color: category.color }}>{category.name}</span>}
          {task.priority && <span className={`text-xs px-2 py-1 rounded-full font-semibold shadow-sm ${priorityClasses[task.priority]}`}>{task.priority === 'low' ? 'Baja' : task.priority === 'medium' ? 'Media' : 'Alta'}</span>}
          {typeof task.duration === 'number' && <span className="text-xs px-2 py-1 rounded-full font-semibold shadow-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">{task.duration} min</span>}
          {task.isRecurring && <span className="flex items-center text-xs px-2 py-1 rounded-full font-semibold shadow-sm bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200"><RepeatIcon className="w-3 h-3 mr-1" /> Recurrente</span>}
        </div>
      </div>
      <div className="flex gap-2 ml-2 items-center">
        {task.cronometrado && typeof task.duration === 'number' && (
          <>
            <button
              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              onClick={handleStart}
              disabled={timerRunning || isCompleted}
            >
              <PlayIcon className="inline w-4 h-4 mr-1" /> Iniciar
            </button>
            <button
              className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
              onClick={handleReset}
              disabled={!timerRunning || isCompleted}
            >
              <RotateCwIcon className="inline w-4 h-4 mr-1" /> Reiniciar
            </button>
            <span className="ml-2 font-mono text-sm">{secondsLeft !== null ? formatTime(secondsLeft) : '--:--'}</span>
          </>
        )}
      </div>
    </div>
  );
};
export default TaskItem;