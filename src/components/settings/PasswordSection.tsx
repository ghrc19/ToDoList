import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { LockIcon, CheckCircle2, XCircle } from 'lucide-react';

interface PasswordSectionProps {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  passwordError?: string;
  onCurrentPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNewPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const PasswordSection: React.FC<PasswordSectionProps> = ({
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}) => {
  const [open, setOpen] = useState(false);
  const [localCurrent, setLocalCurrent] = useState('');
  const [localNew, setLocalNew] = useState('');
  const [localConfirm, setLocalConfirm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleOpen = () => {
    setOpen(true);
    setLocalCurrent('');
    setLocalNew('');
    setLocalConfirm('');
    setLocalError('');
    setShowSuccess(false);
  };

  const handleClose = () => {
    setOpen(false);
    setLocalCurrent('');
    setLocalNew('');
    setLocalConfirm('');
    setLocalError('');
    setShowSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setShowSuccess(false);
    if (!localCurrent || !localNew || !localConfirm) {
      setLocalError('Por favor, completa todos los campos.');
      return;
    }
    if (localNew !== localConfirm) {
      setLocalError('La nueva contraseña y la confirmación no coinciden.');
      return;
    }
    if (onCurrentPasswordChange) onCurrentPasswordChange({ target: { value: localCurrent } } as any);
    if (onNewPasswordChange) onNewPasswordChange({ target: { value: localNew } } as any);
    if (onConfirmPasswordChange) onConfirmPasswordChange({ target: { value: localConfirm } } as any);
    if (onSubmit) onSubmit(e);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setOpen(false);
    }, 2000);
  };

  const passwordsMatch = localNew && localConfirm && localNew === localConfirm;

  return (
    <section className="relative mb-10 p-8 bg-gradient-to-br from-indigo-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 rounded-2xl shadow-lg border border-indigo-100 dark:border-indigo-900 overflow-hidden">
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900 shadow-lg mr-4">
          <LockIcon className="h-8 w-8 text-indigo-500 dark:text-indigo-300" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Cambiar contraseña</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Actualiza tu contraseña para mantener tu cuenta segura.</p>
        </div>
      </div>
      <div className="flex justify-center">
        <Button type="button" className="w-full md:w-auto min-h-[42px] py-2 flex items-center justify-center px-4 text-base" onClick={handleOpen}>
          <LockIcon className="w-5 h-5 mr-2" />
          Actualizar contraseña
        </Button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-indigo-400 dark:border-indigo-700 p-0 w-full max-w-md relative animate-dialog-pop overflow-hidden">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <LockIcon className="w-60 h-60 text-indigo-100 dark:text-indigo-900 opacity-20" />
            </div>

            <div className="flex flex-col items-center pt-8 pb-2 px-8 relative z-10">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-800 shadow mb-3">
                <LockIcon className="h-8 w-8 text-indigo-500 dark:text-indigo-200" />
              </div>
              <h3 className="text-2xl font-bold mb-1 text-gray-900 dark:text-gray-100">Actualizar contraseña</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">Por seguridad, ingresa tu contraseña actual y elige una nueva contraseña segura.</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-8 pb-8 relative z-10">
              <Input
                id="current-password-dialog"
                label="Contraseña actual"
                type="password"
                value={localCurrent}
                onChange={e => setLocalCurrent(e.target.value)}
                autoComplete="current-password"
                icon={<LockIcon className="h-5 w-5 text-gray-400" />}
              />
              <div className="relative">
                <Input
                  id="new-password-dialog"
                  label="Nueva contraseña"
                  type="password"
                  value={localNew}
                  onChange={e => setLocalNew(e.target.value)}
                  icon={<LockIcon className="h-5 w-5 text-gray-400" />}
                  className={localNew ? 'pr-12' : ''}
                />
                {localNew && localConfirm && (
                  <span className="absolute right-2 inset-y-0 flex items-center justify-center h-full w-8">
                    {localNew === localConfirm ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <button type="button" tabIndex={0} aria-label="Limpiar campo" onClick={() => setLocalNew('')} className="focus:outline-none bg-transparent p-0 m-0">
                        <XCircle className="w-6 h-6 text-red-500 cursor-pointer" />
                      </button>
                    )}
                  </span>
                )}
              </div>
              <div className="relative">
                <Input
                  id="confirm-password-dialog"
                  label="Confirmar nueva contraseña"
                  type="password"
                  value={localConfirm}
                  onChange={e => setLocalConfirm(e.target.value)}
                  icon={<LockIcon className="h-5 w-5 text-gray-400" />}
                  className={localConfirm ? 'pr-12' : ''}
                />
                {localConfirm && localNew && (
                  <span className="absolute right-2 inset-y-0 flex items-center justify-center h-full w-8">
                    {localNew === localConfirm ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <button type="button" tabIndex={0} aria-label="Limpiar campo" onClick={() => setLocalConfirm('')} className="focus:outline-none bg-transparent p-0 m-0">
                        <XCircle className="w-6 h-6 text-red-500 cursor-pointer" />
                      </button>
                    )}
                  </span>
                )}
              </div>
              {localError && <Alert type="error">{localError}</Alert>}
              {showSuccess && <Alert type="success">Contraseña actualizada correctamente.</Alert>}
              <div className="flex gap-3 mt-2">
                <Button type="button" className="w-1/2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600" onClick={handleClose}>Cancelar</Button>
                <Button type="submit" className="w-1/2 py-3 text-base">Confirmar cambio</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none select-none">
        <LockIcon className="w-40 h-40 text-indigo-300 dark:text-indigo-800" />
      </div>
    </section>
  );
};
export default PasswordSection;
