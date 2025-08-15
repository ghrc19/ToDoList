import React, { useState, useEffect, useRef } from 'react';
import { Task, Category, useTask } from '../../context/TaskContext';
import { CheckIcon, EditIcon, TrashIcon, RepeatIcon, PlayIcon, RotateCwIcon, SquareIcon } from 'lucide-react';
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

  const initialSeconds = task.cronometrado && typeof task.duration === 'number' ? task.duration * 60 : 0;
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notificationIcon = '/icono.png';

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
    setTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [task.id, initialSeconds]);

  useEffect(() => {
    if (!timerRunning) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s > 0) {
          return s - 1;
        } else {
          if (timerRef.current) clearInterval(timerRef.current);
          setTimerRunning(false);
          finish.play();
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification('¡Tarea completada!', { body: task.title, icon: notificationIcon });
          }
          updateTask(task.id, { completed: { ...completedMap, [dateKey]: true } });
          return 0;
        }
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  const handleStart = () => {
    if (secondsLeft <= 0) {
      setSecondsLeft(initialSeconds);
    }
    setTimerRunning(true);
    beep.play();
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Temporizador iniciado', { body: task.title, icon: notificationIcon });
    }
  };
  const handlePause = () => {
    setTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    notify.play();
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Temporizador detenido', { body: task.title, icon: notificationIcon });
    }
  };
  const handleReset = () => {
    setTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setSecondsLeft(initialSeconds);
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
    let background = '';
    let textColor = 'text-black dark:text-white';
    if (task.priority) {
      const isDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      background = isDark ? 'transparent' : '#fff';
    }
    return (
      <div
        className={`flex items-center justify-between gap-2 px-2 py-2 border rounded-xl shadow-sm hover:shadow-md transition-all group ${isCompleted ? 'opacity-60' : ''}`}
        style={task.priority ? {
          background,
          borderColor: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#fb923c' : '#fde047',
        } : {}}
      >
        <button
          onClick={handleToggleComplete}
          className={`mr-2 p-1 rounded-full ${isCompleted ? 'bg-green-200 dark:bg-green-800' : 'bg-gray-200 dark:bg-gray-700'} hover:bg-green-300 dark:hover:bg-green-700 transition`}
          title="Marcar como completada"
        >
          <CheckIcon className="w-4 h-4 text-indigo-900 dark:text-white" />
        </button>
        <div className="flex-1 min-w-0 flex flex-col">
          <span className={`truncate font-semibold text-[15px] ${isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : textColor} transition-colors`}>{task.title}</span>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {typeof task.duration === 'number' && <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold shadow-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">{task.duration} min</span>}
            {task.isRecurring && <span className="flex items-center text-[11px] px-2 py-0.5 rounded-full font-semibold shadow-sm bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200"><RepeatIcon className="w-3 h-3 mr-1" /> Recurrente</span>}
          </div>
        </div>
  <div className="flex gap-1 ml-2 items-center">
          {task.cronometrado && typeof task.duration === 'number' && (
            <>
              {timerRunning && !isCompleted ? (
                <button
                  className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 flex items-center justify-center"
                  onClick={handlePause}
                  disabled={isCompleted}
                  title="Detener"
                >
                  <SquareIcon className="w-3 h-3" />
                </button>
              ) : (
                <button
                  className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
                  onClick={handleStart}
                  disabled={timerRunning || isCompleted}
                  title="Iniciar"
                >
                  <PlayIcon className="w-3 h-3" />
                </button>
              )}
              <button
                className="p-1 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 disabled:opacity-50 flex items-center justify-center"
                onClick={handleReset}
                disabled={isCompleted}
                title="Reiniciar"
              >
                <RotateCwIcon className="w-3 h-3" />
              </button>
              <span className="ml-1 font-mono text-[13px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">{secondsLeft !== null ? formatTime(secondsLeft) : '--:--'}</span>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!compact) {
  }
  let textColor = 'text-black dark:text-white';
  let background = '';
  if (task.priority) {
    const isDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    background = isDark ? 'transparent' : '#fff';
  }
  return (
    <div
      className={`flex items-center justify-between gap-2 px-4 py-3 mb-2 border rounded-xl shadow-sm hover:shadow-md transition-all group ${isCompleted ? 'opacity-60' : ''}`}
      style={task.priority ? {
        background,
        borderColor: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#fb923c' : '#fde047',
      } : {}}
    >
      <button
        onClick={handleToggleComplete}
        className={`mr-3 p-1 rounded-full ${isCompleted ? 'bg-green-200 dark:bg-green-800' : 'bg-gray-200 dark:bg-gray-700'} hover:bg-green-300 dark:hover:bg-green-700 transition`}
        title="Marcar como completada"
      >
        <CheckIcon className="w-5 h-5 text-indigo-900 dark:text-white" />
      </button>
      <div className="flex-1 min-w-0 flex flex-col">
  <span className={`truncate font-semibold text-base ${isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : textColor} transition-colors`}>{task.title}</span>
        <div className="flex flex-wrap gap-2 mt-1">
          {typeof task.duration === 'number' && <span className="text-xs px-2 py-1 rounded-full font-semibold shadow-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">{task.duration} min</span>}
          {task.isRecurring && <span className="flex items-center text-xs px-2 py-1 rounded-full font-semibold shadow-sm bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200"><RepeatIcon className="w-3 h-3 mr-1" /> Recurrente</span>}
        </div>
      </div>
      <div className="flex gap-2 ml-2 items-center">
        {task.cronometrado && typeof task.duration === 'number' && (
          <>
            {timerRunning && !isCompleted ? (
              <button
                className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 flex items-center justify-center"
                onClick={handlePause}
                disabled={isCompleted}
                title="Detener"
              >
                <SquareIcon className="w-4 h-4" />
              </button>
            ) : (
              <button
                className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
                onClick={handleStart}
                disabled={timerRunning || isCompleted}
                title="Iniciar"
              >
                <PlayIcon className="w-4 h-4" />
              </button>
            )}
            <button
              className="p-1 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 disabled:opacity-50 flex items-center justify-center ml-1"
              onClick={handleReset}
              disabled={isCompleted}
              title="Reiniciar"
            >
              <RotateCwIcon className="w-4 h-4" />
            </button>
            <span className="ml-2 font-mono text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">{secondsLeft !== null ? formatTime(secondsLeft) : '--:--'}</span>
          </>
        )}
      </div>
    </div>
  );
};
export default TaskItem;