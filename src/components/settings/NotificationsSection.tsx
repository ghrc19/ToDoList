import React from 'react';
import Alert from '../ui/Alert';
import { BellIcon } from 'lucide-react';

interface NotificationsSectionProps {
  notificationPermission: NotificationPermission | null;
}

const NotificationsSection: React.FC<NotificationsSectionProps> = ({ notificationPermission }) => (
  <section className="relative mb-10 p-8 bg-gradient-to-br from-indigo-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 rounded-2xl shadow-lg border border-indigo-100 dark:border-indigo-900 overflow-hidden">
    <div className="flex items-center mb-4">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900 shadow-lg mr-4">
        <BellIcon className="h-8 w-8 text-indigo-500 dark:text-indigo-300" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Notificaciones</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Gestiona los permisos y el estado de las notificaciones para recibir recordatorios de tus tareas.</p>
      </div>
    </div>
    <div className="mt-6">
      {notificationPermission === 'denied' && (
        <Alert type="error">
          Has denegado el permiso de notificaciones en el navegador. Puedes cambiarlo desde la configuración del navegador si deseas recibir notificaciones.
        </Alert>
      )}
      {notificationPermission === 'granted' && (
        <Alert type="success">
          Permiso de notificaciones activado correctamente.
        </Alert>
      )}
      {notificationPermission === 'default' && (
        <Alert type="info">
          El permiso de notificaciones aún no ha sido solicitado.
        </Alert>
      )}
    </div>
    <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none select-none">
      <BellIcon className="w-40 h-40 text-indigo-300 dark:text-indigo-800" />
    </div>
  </section>
);

export default NotificationsSection;
