import React, { useState } from 'react';
import { useTask } from '../../context/TaskContext';
import { XIcon, PlusIcon, ClipboardListIcon } from 'lucide-react';

interface AddExistingTaskModalProps {
  onClose: () => void;
  selectedDate: string;
}

const AddExistingTaskModal: React.FC<AddExistingTaskModalProps> = ({ onClose, selectedDate }) => {
  const { getTemplates, createTaskFromTemplate, createTaskFromTemplateRange } = useTask();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [addType, setAddType] = useState<'today' | 'range'>('today');
  const [startDate, setStartDate] = useState(selectedDate);
  const [endDate, setEndDate] = useState(selectedDate);

  const templates = getTemplates();

  const handleAddTask = () => {
    if (!selectedTemplate) return;

    if (addType === 'today') {
      createTaskFromTemplate(selectedTemplate.id, selectedDate);
    } else {
      createTaskFromTemplateRange(selectedTemplate.id, startDate, endDate);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-indigo-400 dark:border-indigo-700 p-0 w-full max-w-lg h-[600px] flex flex-col relative overflow-hidden">
        {/* Icono de fondo decorativo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <ClipboardListIcon className="w-[350px] h-[350px] text-indigo-100 dark:text-indigo-900 opacity-10" />
        </div>
        <div className="flex items-center gap-3 justify-between px-8 py-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl relative z-10">
          <div className="flex items-center gap-3">
            <PlusIcon className="w-7 h-7 text-white drop-shadow" />
            <h3 className="text-2xl font-bold text-white tracking-tight">Agregar tarea existente</h3>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-white">
            <XIcon className="w-7 h-7" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-white dark:bg-gray-900 relative z-10">
          {templates.length > 0 ? (
            <div className="space-y-4">
              {/* Lista de plantillas */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Selecciona una plantilla:</h4>
                {templates.map(template => (
                  <div 
                    key={template.id} 
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedTemplate?.id === template.id 
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <span className="font-medium text-gray-900 dark:text-gray-100">{template.title}</span>
                  </div>
                ))}
              </div>

              {/* Opciones de agregado */}
              {selectedTemplate && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">¿Cómo quieres agregarla?</h4>
                  
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="addType"
                        value="today"
                        checked={addType === 'today'}
                        onChange={(e) => setAddType(e.target.value as 'today' | 'range')}
                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">Solo por hoy</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="addType"
                        value="range"
                        checked={addType === 'range'}
                        onChange={(e) => setAddType(e.target.value as 'today' | 'range')}
                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">Por rango de días</span>
                    </label>
                  </div>

                  {/* Selector de rango de fechas */}
                  {addType === 'range' && (
                    <div className="space-y-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Fecha inicio
                          </label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Fecha fin
                          </label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <p className="mb-2">No hay plantillas disponibles</p>
              <p className="text-sm">Crea una tarea y luego duplícala para convertirla en plantilla</p>
            </div>
          )}
        </div>
        
        {/* Footer con botones */}
        <div className="px-8 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 rounded-b-2xl relative z-10">
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddTask}
              disabled={!selectedTemplate}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Agregar tarea
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExistingTaskModal;
