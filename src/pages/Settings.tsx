import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { updatePassword, signOut } from 'firebase/auth';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon, AlertTriangle } from 'lucide-react';
import UserProfileSection from '../components/settings/UserProfileSection';
import PasswordSection from '../components/settings/PasswordSection';
import NotificationsSection from '../components/settings/NotificationsSection';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import PreferencesSection from '../components/settings/PreferencesSection';
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
      if (newValue && typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'default') {
          Notification.requestPermission().then((perm) => {
            setNotificationPermission(perm);
            if (perm === 'granted') {
              localStorage.setItem('notifications', 'true');
            } else {
              localStorage.setItem('notifications', 'false');
            }
          });
          return prev;
        } else if (Notification.permission === 'granted') {
          localStorage.setItem('notifications', 'true');
          new Notification('Notificaciones activadas', {
            body: 'Recibirás recordatorios de tus tareas.',
            icon: '/icono.png'
          });
        } else {
          localStorage.setItem('notifications', 'false');
        }
      } else {
        localStorage.setItem('notifications', newValue.toString());
      }
      return newValue;
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Configuración
      </h2>
      <UserProfileSection
        name={name}
        email={email}
        onNameChange={e => setName(e.target.value)}
        onEmailChange={e => setEmail(e.target.value)}
        onSubmit={handleProfileSubmit}
      />
      <PasswordSection
        currentPassword={currentPassword}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        passwordError={passwordError}
        onCurrentPasswordChange={e => setCurrentPassword(e.target.value)}
        onNewPasswordChange={e => setNewPassword(e.target.value)}
        onConfirmPasswordChange={e => setConfirmPassword(e.target.value)}
        onSubmit={handlePasswordSubmit}
      />
  <PreferencesSection
    theme={theme}
    toggleTheme={toggleTheme}
    notificationSetting={notificationSetting}
    handleNotificationToggle={handleNotificationToggle}
  />
    <div className="mt-8 flex flex-col items-center">
      <button
        onClick={() => setShowDeleteModal(true)}
        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-md transition-colors"
      >
        Eliminar cuenta
      </button>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-red-400 dark:border-red-700 p-0 w-full max-w-md relative animate-dialog-pop overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <AlertTriangle className="w-60 h-60 text-red-100 dark:text-red-900 opacity-20" />
            </div>
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-3xl font-bold z-10" onClick={() => { setShowDeleteModal(false); setDeletePassword(''); setDeleteError(''); }}>&times;</button>
            <div className="flex flex-col items-center pt-8 pb-2 px-8 relative z-10">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-800 shadow mb-3">
                <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-200" />
              </div>
              <h3 className="text-2xl font-bold mb-1 text-red-700 dark:text-red-200">Eliminar cuenta</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">Esta acción es <span className="font-bold text-red-600 dark:text-red-300">irreversible</span>. Ingresa tu contraseña para confirmar la eliminación de tu cuenta.</p>
            </div>
            <div className="px-8 pb-8 relative z-10">
              <input
                type="password"
                placeholder="Contraseña"
                className="mb-3 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
                autoComplete="off"
              />
              {deleteError && <div className="mb-2 text-red-600 text-sm font-semibold flex items-center gap-2"><AlertTriangle className="w-4 h-4" />{deleteError}</div>}
              {deleteSuccess && <div className="mb-2 text-green-600 text-sm font-semibold">Cuenta eliminada correctamente. Redirigiendo...</div>}
              <div className="flex gap-3 mt-2">
                <button onClick={() => { setShowDeleteModal(false); setDeletePassword(''); setDeleteError(''); }} className="w-1/2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl py-3 font-semibold transition">Cancelar</button>
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
                  className="w-1/2 bg-red-600 text-white font-semibold hover:bg-red-700 rounded-xl py-3 transition"
                  disabled={deleteSuccess}
                >
                  Confirmar eliminación
                </button>
              </div>
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