import React from 'react';
import { useTask } from '../../context/TaskContext';
import TaskManageItem from './TaskManageItem';
import { XIcon, ListTodoIcon, ClipboardListIcon } from 'lucide-react';

interface TaskListManageModalProps {
  onClose: () => void;
  onDuplicate: (task: any) => void;
  onEdit: (task: any) => void;
}

const TaskListManageModal: React.FC<TaskListManageModalProps> = ({ onClose, onDuplicate, onEdit }) => {
  const { getTemplates, tasks } = useTask();
  const templates = getTemplates();
  // Solo mostrar tareas que NO son plantillas Y que NO fueron creadas desde plantillas
  const nonTemplates = tasks.filter(task => task.isTemplate !== true && !task.templateId);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-indigo-400 dark:border-indigo-700 p-0 w-full max-w-xl h-[600px] flex flex-col relative overflow-hidden">
        {/* Icono de fondo decorativo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <ClipboardListIcon className="w-[350px] h-[350px] text-indigo-100 dark:text-indigo-900 opacity-10" />
        </div>
        <div className="flex items-center gap-3 justify-between px-8 py-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl relative z-10">
          <div className="flex items-center gap-3">
            <ListTodoIcon className="w-7 h-7 text-white drop-shadow" />
            <h3 className="text-2xl font-bold text-white tracking-tight">Gestionar plantillas</h3>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-white">
            <XIcon className="w-7 h-7" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-white dark:bg-gray-900 rounded-b-2xl custom-scrollbar relative z-10">
          <div className="space-y-6">
            {/* Sección de plantillas */}
            {templates.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">Plantillas existentes:</h4>
                {templates.map(template => (
                  <TaskManageItem 
                    key={template.id} 
                    task={template} 
                    onDuplicate={onDuplicate}
                    onEdit={onEdit}
                    isTemplate={true}
                  />
                ))}
              </div>
            )}
            
            {/* Sección de tareas normales */}
            {nonTemplates.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-lg border-t border-gray-200 dark:border-gray-700 pt-4">
                  Tareas originales (convertibles en plantillas):
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 -mt-2">
                  Estas son tareas creadas manualmente que puedes convertir en plantillas
                </p>
                {nonTemplates.map(task => (
                  <TaskManageItem 
                    key={task.id} 
                    task={task} 
                    onDuplicate={onDuplicate}
                    onEdit={onEdit}
                    isTemplate={false}
                  />
                ))}
              </div>
            )}
            
            {/* Mensaje cuando no hay tareas */}
            {templates.length === 0 && nonTemplates.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <p className="mb-2">No hay plantillas ni tareas originales</p>
                <p className="text-sm">Crea una tarea nueva para empezar</p>
                <p className="text-xs mt-2 opacity-75">Las tareas creadas desde plantillas no aparecen aquí</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskListManageModal;

