import React, { useState } from 'react';
import { Task, useTask } from '../../context/TaskContext';
import { EditIcon, TrashIcon, RepeatIcon, StarIcon } from 'lucide-react';
import ConfirmationModal from '../ui/ConfirmationModal';

interface TaskManageItemProps {
  task: Task;
  onDuplicate: (task: Task) => void;
  onEdit: (task: Task) => void;
  isTemplate?: boolean;
}

const TaskManageItem: React.FC<TaskManageItemProps> = ({ task, onDuplicate, onEdit, isTemplate = true }) => {
  const { deleteTemplate, updateTask, tasks } = useTask();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showConvertConfirm, setShowConvertConfirm] = useState(false);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (isTemplate) {
      deleteTemplate(task.id);
    } else {
      deleteTemplate(task.id);
    }
  };

  const handleConvertToTemplate = () => {
    setShowConvertConfirm(true);
  };

  const confirmConvert = () => {
    updateTask(task.id, { isTemplate: true });
  };

  const instanceCount = isTemplate ? tasks.filter(t => t.templateId === task.id).length : 0;

  const priorityColors = {
    low: '#3b82f6',
    medium: '#f59e0b', 
    high: '#ef4444'
  };

  const priorityLabels = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta'
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: priorityColors[task.priority] }}
            />
            <span className="text-gray-800 dark:text-gray-200 font-medium truncate">
              {task.title}
            </span>
            {isTemplate && (
              <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">
                Plantilla
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>Prioridad: {priorityLabels[task.priority]}</span>
            {task.duration && <span>• {task.duration} min</span>}
            {task.isRecurring && <span>• Recurrente</span>}
            {task.cronometrado && <span>• Con temporizador</span>}
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <button 
            onClick={() => onEdit(task)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="Editar tarea"
          >
            <EditIcon className="w-4 h-4 text-green-600" />
          </button>
          {isTemplate ? (
            <button 
              onClick={() => onDuplicate(task)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="Duplicar plantilla"
            >
              <RepeatIcon className="w-4 h-4 text-indigo-600" />
            </button>
          ) : (
            <button 
              onClick={handleConvertToTemplate}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="Convertir en plantilla"
            >
              <StarIcon className="w-4 h-4 text-yellow-600" />
            </button>
          )}
          <button 
            onClick={handleDelete}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            title={isTemplate ? "Eliminar plantilla" : "Eliminar tarea"}
          >
            <TrashIcon className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title={isTemplate ? "Eliminar Plantilla" : "Eliminar Tarea"}
        message={isTemplate 
          ? "¿Estás seguro de que quieres eliminar esta plantilla?"
          : "¿Estás seguro de que quieres eliminar esta tarea?"
        }
        confirmText="Eliminar"
        type="danger"
        details={isTemplate ? [
          `Se eliminará la plantilla "${task.title}"`,
          instanceCount > 0 ? `Se eliminarán ${instanceCount} tarea${instanceCount !== 1 ? 's' : ''} creada${instanceCount !== 1 ? 's' : ''} a partir de esta plantilla` : 'No hay tareas creadas a partir de esta plantilla',
          'Esta acción no se puede deshacer'
        ] : [
          `Se eliminará la tarea "${task.title}"`,
          'Esta acción no se puede deshacer'
        ]}
      />

      <ConfirmationModal
        isOpen={showConvertConfirm}
        onClose={() => setShowConvertConfirm(false)}
        onConfirm={confirmConvert}
        title="Convertir en Plantilla"
        message="¿Quieres convertir esta tarea en una plantilla?"
        confirmText="Convertir"
        type="info"
        details={[
          `La tarea "${task.title}" se convertirá en una plantilla`,
          'Podrás usar esta plantilla para crear nuevas tareas rápidamente',
          'La tarea seguirá disponible como plantilla para futuras copias'
        ]}
      />
    </>
  );
};

export default TaskManageItem;
