import React from 'react';
import { SunIcon, MoonIcon, BellIcon } from 'lucide-react';

interface PreferencesSectionProps {
  theme: string;
  toggleTheme: () => void;
  notificationSetting: boolean;
  handleNotificationToggle: () => void;
}

const PreferencesSection: React.FC<PreferencesSectionProps> = ({ theme, toggleTheme, notificationSetting, handleNotificationToggle }) => (
  <section className="relative mb-10 p-8 bg-gradient-to-br from-indigo-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 rounded-2xl shadow-lg border border-indigo-100 dark:border-indigo-900 overflow-hidden">
    <div className="flex items-center mb-4">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900 shadow-lg mr-4">
        <BellIcon className="h-8 w-8 text-indigo-500 dark:text-indigo-300" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Preferencias</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Personaliza la apariencia y las notificaciones de tu experiencia.</p>
      </div>
    </div>
    <div className="flex flex-col md:flex-row gap-8 mt-6">
      <div className="flex-1 flex flex-col gap-2 justify-center min-w-[260px] md:min-w-[320px]">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1 min-w-[120px]">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Tema</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Cambia entre modo claro y oscuro</p>
          </div>
          <div className="flex-1 flex justify-end">
            <button onClick={toggleTheme} className="flex items-center px-4 py-2 rounded-lg shadow bg-gray-100 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors mt-4 md:mt-0">
              {theme === 'light' ? <>
                <SunIcon className="w-5 h-5 text-amber-500 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Modo claro</span>
              </> : <>
                <MoonIcon className="w-5 h-5 text-indigo-400 mr-2" />
                <span className="text-sm font-medium text-gray-200">Modo oscuro</span>
              </>}
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 pt-4 md:pt-0 md:pl-8">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notificaciones</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Recibe recordatorios de tus tareas</p>
          </div>
          <div className="flex-1 flex justify-end">
            <label className="relative inline-flex items-center cursor-pointer select-none ml-2 mt-2 md:mt-0">
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
    </div>
    <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none select-none">
      <BellIcon className="w-40 h-40 text-indigo-300 dark:text-indigo-800" />
    </div>
  </section>
);

export default PreferencesSection;
