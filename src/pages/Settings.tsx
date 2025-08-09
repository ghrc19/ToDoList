import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { updatePassword, signOut } from 'firebase/auth';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon, SaveIcon } from 'lucide-react';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
const Settings: React.FC = () => {
  const {
    user,
    logout
  } = useAuth();
  const {
    theme,
    toggleTheme
  } = useTheme();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notificationSetting, setNotificationSetting] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? saved === 'true' : true;
  });
  const [notificationPermission, setNotificationPermission] = useState<string | null>(null);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccessMsg(true);
    setTimeout(() => setShowSuccessMsg(false), 3000);
  };
  const [passwordError, setPasswordError] = useState('');
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (!auth.currentUser || !currentPassword || !newPassword || newPassword !== confirmPassword) {
      setPasswordError('Verifica los campos.');
      return;
    }
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email || '', currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowSuccessMsg(true);
      setTimeout(() => setShowSuccessMsg(false), 3000);
    } catch (err: any) {
      setPasswordError('Error al cambiar la contraseña: ' + (err?.message || '')); 
    }
  };
  const handleNotificationToggle = () => {
    setNotificationSetting((prev) => {
      const newValue = !prev;
      localStorage.setItem('notifications', newValue.toString());
      if (newValue && typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'default') {
          Notification.requestPermission().then((perm) => {
            setNotificationPermission(perm);
          });
        } else {
          setNotificationPermission(Notification.permission);
        }
      }
      return newValue;
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Configuración
      </h2>
      {showSuccessMsg && <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-700 dark:text-green-300">
            Cambios guardados correctamente
          </p>
        </div>}
      {notificationPermission === 'denied' && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300 text-sm">
            Has denegado el permiso de notificaciones en el navegador. Puedes cambiarlo desde la configuración del navegador si deseas recibir notificaciones.
          </p>
        </div>
      )}
      {notificationPermission === 'granted' && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-700 dark:text-green-300 text-sm">
            Permiso de notificaciones activado correctamente.
          </p>
        </div>
      )}
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Perfil de usuario
        </h3>
        <form onSubmit={handleProfileSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre
              </label>
              <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Correo electrónico
              </label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium flex items-center">
              <SaveIcon className="w-4 h-4 mr-2" />
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Cambiar contraseña
        </h3>
        <form onSubmit={handlePasswordSubmit}>
          <div className="space-y-4 mb-6">
            {passwordError && <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded text-red-700 dark:text-red-300 text-sm">{passwordError}</div>}
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contraseña actual
              </label>
              <input id="current-password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" autoComplete="current-password" />
            </div>
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nueva contraseña
              </label>
              <input id="new-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirmar nueva contraseña
              </label>
              <input id="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium">
              Actualizar contraseña
            </button>
          </div>
        </form>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Preferencias
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Tema
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Cambiar entre modo claro y oscuro
              </p>
            </div>
            <button onClick={toggleTheme} className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md">
              {theme === 'light' ? <>
                  <SunIcon className="w-5 h-5 text-amber-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Modo claro
                  </span>
                </> : <>
                  <MoonIcon className="w-5 h-5 text-indigo-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Modo oscuro
                  </span>
                </>}
            </button>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Notificaciones
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Recibir recordatorios de tareas
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={notificationSetting}
                onChange={handleNotificationToggle}
                className="sr-only peer"
              />
              <div
                className={
                  `w-12 h-7 flex items-center rounded-full p-1 duration-300 transition-colors
                  ${notificationSetting ? 'bg-blue-200 dark:bg-blue-400' : 'bg-gray-300 dark:bg-gray-600'}`
                }
              >
                <div
                  className={
                    `bg-white w-5 h-5 rounded-full shadow-md transform duration-300 transition-transform
                    ${notificationSetting ? 'translate-x-5' : 'translate-x-0'}`
                  }
                />
              </div>
              <span className={`ml-3 text-sm font-medium ${notificationSetting ? 'text-blue-700 dark:text-blue-200' : 'text-gray-600 dark:text-gray-300'}`}>
                {notificationSetting ? 'Activadas' : 'Desactivadas'}
              </span>
            </label>
          </div>
        </div>
      </div>
    <div className="mt-8 flex flex-col items-center">
      <button
        onClick={() => setShowDeleteModal(true)}
        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-md transition-colors"
      >
        Eliminar cuenta
      </button>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" onClick={() => { setShowDeleteModal(false); setDeletePassword(''); setDeleteError(''); }}>&times;</button>
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Eliminar cuenta</h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">Esta acción es irreversible. Ingresa tu contraseña para confirmar la eliminación de tu cuenta.</p>
            <input
              type="password"
              placeholder="Contraseña"
              className="mb-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full"
              value={deletePassword}
              onChange={e => setDeletePassword(e.target.value)}
              autoComplete="off"
            />
            {deleteError && <div className="mb-2 text-red-600 text-sm">{deleteError}</div>}
            {deleteSuccess && <div className="mb-2 text-green-600 text-sm">Cuenta eliminada correctamente. Redirigiendo...</div>}
            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowDeleteModal(false); setDeletePassword(''); setDeleteError(''); }} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600">Cancelar</button>
              <button
                onClick={async () => {
                  if (!user) return;
                  if (!deletePassword) {
                    setDeleteError('Por favor, ingresa tu contraseña.');
                    return;
                  }
                  try {
                    if (auth.currentUser && auth.currentUser.email) {
                      const credential = EmailAuthProvider.credential(auth.currentUser.email, deletePassword);
                      await reauthenticateWithCredential(auth.currentUser, credential);
                    }
                    const { ref, remove } = await import('firebase/database');
                    const { db } = await import('../firebase');
                    await remove(ref(db, `users/${user.id}`));
                    await auth.currentUser?.delete();
                    await logout();
                    setDeleteSuccess(true);
                    setTimeout(() => {
                      window.location.href = '/login';
                    }, 1800);
                  } catch (err: any) {
                    setDeleteError(err?.message || 'Error al eliminar la cuenta.');
                  }
                }}
                className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700"
                disabled={deleteSuccess}
              >
                Confirmar eliminación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
};
export default Settings;

export const areNotificationsEnabled = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('notifications') === 'true';
  }
  return true;
};