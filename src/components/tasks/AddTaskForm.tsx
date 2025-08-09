import React, { useState } from 'react';
import { useTask } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { XIcon, CalendarIcon, RepeatIcon } from 'lucide-react';

interface AddTaskFormProps {
  onClose: (created?: boolean) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onClose }) => {
  const { addTask, categories } = useTask();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);

  function getLocalDateStr() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  const [date, setDate] = useState(getLocalDateStr());
  const [isRecurring, setIsRecurring] = useState(false);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [duration, setDuration] = useState(60);
  const [cronometrado, setCronometrado] = useState(false);
  const [recurringIndeterminate, setRecurringIndeterminate] = useState(true);
  const [recurringStartDate, setRecurringStartDate] = useState(date);
  const [recurringEndDate, setRecurringEndDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Debes iniciar sesión para crear tareas.');
      return;
    }
    if (!title.trim()) {
      setError('El título es obligatorio.');
      return;
    }
    if (!duration || duration < 1) {
      setError('La duración debe ser mayor a 0.');
      return;
    }
    if (!categoryId) {
      setError('Debes seleccionar una categoría.');
      return;
    }
    if (isRecurring && recurringDays.length === 0) {
      setError('Selecciona al menos un día para la recurrencia.');
      return;
    }
    if (isRecurring && !recurringIndeterminate && (!recurringStartDate || !recurringEndDate)) {
      setError('Debes indicar el rango de fechas para la recurrencia.');
      return;
    }
    setError(null);
    addTask({
      title: title.trim(),
      completed: { [date]: false },
      categoryId,
      date,
      isRecurring,
      recurringDays,
      priority,
      duration: Number(duration) || 0,
      cronometrado,
      recurringIndeterminate: isRecurring ? recurringIndeterminate : undefined,
      recurringStartDate: isRecurring && !recurringIndeterminate ? recurringStartDate : undefined,
      recurringEndDate: isRecurring && !recurringIndeterminate ? recurringEndDate : undefined,
    });
    onClose(true);
  };

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const [recurringDays, setRecurringDays] = useState<number[]>([]);
  const selectAllDays = () => setRecurringDays([0,1,2,3,4,5,6]);
  const selectLaborables = () => setRecurringDays([1,2,3,4,5]);
  const selectWeekends = () => setRecurringDays([0,6]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Nueva tarea</h3>
        <button onClick={() => onClose(false)} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
          <XIcon className="w-5 h-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {error && <div className="mb-2 text-red-600 text-sm font-semibold">{error}</div>}
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
            <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="¿Qué necesitas hacer?" required disabled={!user} />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duración (minutos)</label>
              <input id="duration" type="number" min="1" value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required disabled={!user} />
            </div>
            <span className="flex items-center mt-6">
              <input id="cronometrado" type="checkbox" checked={cronometrado} onChange={() => setCronometrado(!cronometrado)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label htmlFor="cronometrado" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 flex items-center">Cronometrado</label>
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
              <select id="category" value={categoryId || ''} onChange={e => setCategoryId(e.target.value || null)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <option value="">Sin categoría</option>
                {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioridad</label>
              <select id="priority" value={priority} onChange={e => setPriority(e.target.value as any)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha</label>
            <div className="relative">
              <input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <input id="recurring" type="checkbox" checked={isRecurring} onChange={() => setIsRecurring(!isRecurring)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor="recurring" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 flex items-center"><RepeatIcon className="w-4 h-4 mr-1" />Tarea recurrente</label>
            </div>
            {isRecurring && (
              <div className="mt-2 bg-indigo-50 dark:bg-indigo-900 border-2 border-indigo-300 dark:border-indigo-700 rounded-xl shadow-inner p-4 transition-colors">
                <label className="block text-sm font-medium text-indigo-800 dark:text-indigo-200 mb-2">Repetir en estos días:</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <button type="button" onClick={selectAllDays} className="px-3 py-1 rounded-full text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 hover:bg-indigo-200 dark:hover:bg-indigo-800">Todos los días</button>
                  <button type="button" onClick={selectLaborables} className="px-3 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800">Días laborables</button>
                  <button type="button" onClick={selectWeekends} className="px-3 py-1 rounded-full text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-800">Fines de semana</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day, index) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        if (recurringDays.includes(index)) {
                          setRecurringDays(recurringDays.filter(d => d !== index));
                        } else {
                          setRecurringDays([...recurringDays, index]);
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm ${recurringDays.includes(index) ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-4 items-center">
                  <div className="flex flex-col gap-2 mt-4 w-full">
                    <div className="flex flex-row items-center gap-4 w-full">
                      <div className="flex items-center gap-1">
                        <input id="recurringIndeterminate" type="radio" checked={recurringIndeterminate} onChange={() => setRecurringIndeterminate(true)} className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        <label htmlFor="recurringIndeterminate" className="text-xs text-gray-700 dark:text-gray-300">Indeterminada</label>
                      </div>
                      <div className="flex items-center gap-1">
                        <input id="recurringRange" type="radio" checked={!recurringIndeterminate} onChange={() => setRecurringIndeterminate(false)} className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        <label htmlFor="recurringRange" className="text-xs text-gray-700 dark:text-gray-300">Por rango de fecha</label>
                      </div>
                    </div>
                    {!recurringIndeterminate && (
                      <div className="w-full mt-1">
                        <div className="bg-white dark:bg-gray-950 border border-indigo-200 dark:border-indigo-800 rounded-md p-2 shadow-inner flex flex-col gap-2">
                          <div className="flex flex-col gap-0.5">
                            <label htmlFor="recurringStartDate" className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Fecha de inicio</label>
                            <input id="recurringStartDate" type="date" value={recurringStartDate} onChange={e => setRecurringStartDate(e.target.value)} className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs" />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <label htmlFor="recurringEndDate" className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Fecha de fin</label>
                            <input id="recurringEndDate" type="date" value={recurringEndDate} onChange={e => setRecurringEndDate(e.target.value)} className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button type="button" onClick={() => onClose(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancelar</button>
          <button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50" disabled={!user}>Guardar tarea</button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskForm;