import React from 'react';
import { XIcon, AlertTriangleIcon, TrashIcon, CheckIcon } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  details?: string[];
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
  details = []
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    danger: {
      bgColor: 'from-red-600 to-red-700',
      iconColor: 'text-red-600',
      confirmBg: 'bg-red-600 hover:bg-red-700',
      icon: TrashIcon
    },
    warning: {
      bgColor: 'from-yellow-600 to-orange-600',
      iconColor: 'text-yellow-600',
      confirmBg: 'bg-yellow-600 hover:bg-yellow-700',
      icon: AlertTriangleIcon
    },
    info: {
      bgColor: 'from-blue-600 to-blue-700',
      iconColor: 'text-blue-600',
      confirmBg: 'bg-blue-600 hover:bg-blue-700',
      icon: CheckIcon
    }
  };

  const config = typeConfig[type];
  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 p-0 w-full max-w-md mx-4 relative overflow-hidden">
        {/* Header */}
        <div className={`flex items-center gap-3 justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r ${config.bgColor} rounded-t-2xl`}>
          <div className="flex items-center gap-3">
            <IconComponent className="w-6 h-6 text-white drop-shadow" />
            <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-200 transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800 ${config.iconColor}`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-gray-800 dark:text-gray-200 font-medium mb-2">
                {message}
              </p>
              {details.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 rounded-b-2xl">
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 ${config.confirmBg} text-white rounded-lg transition-colors flex items-center gap-2`}
            >
              <IconComponent className="w-4 h-4" />
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
