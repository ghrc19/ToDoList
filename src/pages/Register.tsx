import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon, UserIcon, LockIcon } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const {
    register
  } = useAuth();
  const {
    theme,
    toggleTheme
  } = useTheme();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      const success = await register(name, email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Error al registrar la cuenta');
      }
    } catch (err) {
      setError('Error al crear la cuenta');
    }
  };
  return <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-end p-4">
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}>
          {theme === 'light' ? <MoonIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" /> : <SunIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />}
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="flex flex-col items-center">
            <img src="/logo.png" alt="Logo To-Do" className="mx-auto mb-4 max-w-full" style={{ width: '512px', height: 'auto', aspectRatio: '1024/446' }} />
            <h2 className="mt-6 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
              Crea tu cuenta
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Empieza a organizar tus tareas diarias
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>}
            <div className="rounded-md shadow-sm space-y-4">
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nombre completo"
                icon={<UserIcon className="h-5 w-5 text-gray-400" style={{ minWidth: 20, minHeight: 20 }} />}
              />
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-gray-400" style={{ minWidth: 20, minHeight: 20, maxWidth: 20, maxHeight: 20 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-.876 1.797l-7.5 5.625a2.25 2.25 0 01-2.748 0l-7.5-5.625A2.25 2.25 0 012.25 6.993V6.75" />
                  </svg>
                }
              />
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Contraseña"
                icon={<LockIcon className="h-5 w-5 text-gray-400" style={{ minWidth: 20, minHeight: 20 }} />}
              />
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirmar contraseña"
                icon={<LockIcon className="h-5 w-5 text-gray-400" style={{ minWidth: 20, minHeight: 20 }} />}
              />
            </div>
            <div>
              <Button type="submit">Crear cuenta</Button>
            </div>
          </form>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>;
};
export default Register;