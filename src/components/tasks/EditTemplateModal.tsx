import React, { useState } from 'react';
import { useTask } from '../../context/TaskContext';
import { XIcon, EditIcon } from 'lucide-react';
import AddTaskForm from './AddTaskForm';

interface EditTemplateModalProps {
  template: any;
  onClose: () => void;
}

const EditTemplateModal: React.FC<EditTemplateModalProps> = ({ template, onClose }) => {
  const { tasks } = useTask();
  const [applyToAll, setApplyToAll] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const instanceCount = tasks.filter(task => task.templateId === template.id).length;

  const handleEditConfirm = () => {
    setShowForm(true);
  };

  const handleFormClose = (created?: boolean) => {
    if (created && applyToAll) {
    }
    onClose();
  };

  if (showForm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
        <div className="w-full max-w-lg mx-auto">
          <AddTaskForm 
            onClose={handleFormClose}
            initialTask={{
              title: template.title,
              categoryId: template.categoryId,
              isRecurring: template.isRecurring,
              recurringDays: template.recurringDays,
              priority: template.priority,
              duration: template.duration,
              cronometrado: template.cronometrado,
              recurringIndeterminate: template.recurringIndeterminate,
              recurringStartDate: template.recurringStartDate,
              recurringEndDate: template.recurringEndDate,
            }}
            initialDate={template.date}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-green-400 dark:border-green-700 p-0 w-full max-w-md relative overflow-hidden">
        <div className="flex items-center gap-3 justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <EditIcon className="w-6 h-6 text-white drop-shadow" />
            <h3 className="text-xl font-bold text-white tracking-tight">Editar plantilla</h3>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors p-1 rounded-full">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Plantilla:</h4>
            <p className="text-gray-600 dark:text-gray-400">{template.title}</p>
          </div>

          {instanceCount > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                Esta plantilla tiene <strong>{instanceCount}</strong> tarea{instanceCount !== 1 ? 's' : ''} creada{instanceCount !== 1 ? 's' : ''} a partir de ella.
              </p>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyToAll}
                  onChange={(e) => setApplyToAll(e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Aplicar cambios a todas las tareas existentes (próximamente)
                </span>
              </label>
            </div>
          )}

          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-lg">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Los cambios en la plantilla afectarán a las nuevas tareas que se creen a partir de ella.
            </p>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 rounded-b-2xl">
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleEditConfirm}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <EditIcon className="w-4 h-4" />
              Editar plantilla
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTemplateModal;
