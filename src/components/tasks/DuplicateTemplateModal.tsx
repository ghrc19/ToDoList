import React, { useState } from 'react';
import { useTask } from '../../context/TaskContext';
import { XIcon, CopyIcon } from 'lucide-react';

interface DuplicateTemplateModalProps {
  template: any;
  onClose: () => void;
}

const DuplicateTemplateModal: React.FC<DuplicateTemplateModalProps> = ({ template, onClose }) => {
  const { createTaskFromTemplate, createTaskFromTemplateRange } = useTask();
  const [duplicateType, setDuplicateType] = useState<'today' | 'range'>('today');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const handleDuplicate = () => {
    if (duplicateType === 'today') {
      createTaskFromTemplate(template.id, startDate);
    } else {
      createTaskFromTemplateRange(template.id, startDate, endDate);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-purple-400 dark:border-purple-700 p-0 w-full max-w-md relative overflow-hidden">
        <div className="flex items-center gap-3 justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <CopyIcon className="w-6 h-6 text-white drop-shadow" />
            <h3 className="text-xl font-bold text-white tracking-tight">Duplicar plantilla</h3>
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

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">¿Cómo quieres duplicarla?</h4>
            
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="duplicateType"
                  value="today"
                  checked={duplicateType === 'today'}
                  onChange={(e) => setDuplicateType(e.target.value as 'today' | 'range')}
                  className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-gray-700 dark:text-gray-300">Para una fecha específica</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="duplicateType"
                  value="range"
                  checked={duplicateType === 'range'}
                  onChange={(e) => setDuplicateType(e.target.value as 'today' | 'range')}
                  className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                />
                <span className="text-gray-700 dark:text-gray-300">Para un rango de días</span>
              </label>
            </div>

            {duplicateType === 'today' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fecha inicio
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            )}
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
              onClick={handleDuplicate}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <CopyIcon className="w-4 h-4" />
              Duplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuplicateTemplateModal;
