import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { UserIcon, SaveIcon } from 'lucide-react';

interface UserProfileSectionProps {
  name: string;
  email: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({ name, email, onNameChange, onEmailChange, onSubmit }) => (
  <section className="relative mb-10 p-8 bg-gradient-to-br from-indigo-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 rounded-2xl shadow-lg border border-indigo-100 dark:border-indigo-900 overflow-hidden">
    <div className="flex items-center mb-4">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900 shadow-lg mr-4">
        <UserIcon className="h-8 w-8 text-indigo-500 dark:text-indigo-300" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Perfil de usuario</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Actualiza tu nombre y correo electrónico para mantener tu cuenta al día.</p>
      </div>
    </div>
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-end mb-2">
      <div className="col-span-1">
        <Input
          id="name"
          label="Nombre"
          type="text"
          value={name}
          onChange={onNameChange}
          icon={<UserIcon className="h-5 w-5 text-gray-400" />}
        />
      </div>
      <div className="col-span-1">
        <Input
          id="email"
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={onEmailChange}
        />
      </div>
      <div className="col-span-1">
  <Button type="submit" className="w-full h-full min-h-[42px] py-2 flex items-center justify-center px-4">
          <SaveIcon className="w-4 h-4 mr-2" />
          Guardar cambios
        </Button>
      </div>
    </form>
    <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none select-none">
      <UserIcon className="w-40 h-40 text-indigo-300 dark:text-indigo-800" />
    </div>
  </section>
);

export default UserProfileSection;
