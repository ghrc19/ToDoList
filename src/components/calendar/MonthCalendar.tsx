import React from 'react';
import { useTask, Task, Category } from '../../context/TaskContext';
import { getTasksForDate } from '../../utils/getTasksForDate';

interface MonthCalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

function getMonthDays(year: number, month: number) {
  const lastDay = new Date(year, month + 1, 0);
  const days = [];
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d, 0, 0, 0, 0);
    days.push(date);
  }
  return days;
}

function groupTasksByDate(tasks: Task[]) {
  const map: Record<string, Task[]> = {};
  for (const task of tasks) {
    if (!map[task.date]) map[task.date] = [];
    map[task.date].push(task);
  }
  return map;
}


const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const MonthCalendar: React.FC<MonthCalendarProps> = ({ selectedDate, onSelectDate }) => {
  const { tasks, categories } = useTask();
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = React.useState(today.getMonth());
  const [selectedYear, setSelectedYear] = React.useState(today.getFullYear());
  const days = getMonthDays(selectedYear, selectedMonth);
  const tasksByDate = groupTasksByDate(tasks);

  const weeks: (Date | null)[][] = [];
  let week: (Date | null)[] = [];
  let dayIdx = 0;
  const firstDay = new Date(selectedYear, selectedMonth, 1);
  const firstDayOfWeek = firstDay.getDay();
  for (let i = 0; i < firstDayOfWeek; i++) {
    week.push(null);
  }
  for (const day of days) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  const yearOptions = [];
  for (let y = today.getFullYear() - 10; y <= today.getFullYear() + 5; y++) {
    yearOptions.push(y);
  }

  return (
    <div className="overflow-x-auto">
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              if (selectedMonth === 0) {
                setSelectedMonth(11);
                setSelectedYear(y => y - 1);
              } else {
                setSelectedMonth(m => m - 1);
              }
            }}
            aria-label="Mes anterior"
          >
            &#8592;
          </button>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(Number(e.target.value))}
            className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {monthNames.map((name, idx) => (
              <option key={name} value={idx}>{name}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {yearOptions.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              if (selectedMonth === 11) {
                setSelectedMonth(0);
                setSelectedYear(y => y + 1);
              } else {
                setSelectedMonth(m => m + 1);
              }
            }}
            aria-label="Mes siguiente"
          >
            &#8594;
          </button>
        </div>
        <h3 className="text-lg font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
          {monthNames[selectedMonth]} {selectedYear}
        </h3>
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
          {["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"].map(dia => <div key={dia}>{dia}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-2">
            {weeks.map((week, weekIdx) => (
              week.map((date, dayIdx) => {
                if (!date) return <div key={`empty-${weekIdx}-${dayIdx}`} className="h-14" />;
                const dateStr = date.toISOString().split('T')[0];
                const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
                const isSelected = selectedDate && date.getDate() === selectedDate.getDate() && date.getMonth() === selectedDate.getMonth() && date.getFullYear() === selectedDate.getFullYear();
                return (
                  <button
                    key={`day-${weekIdx}-${dayIdx}`}
                    className={`h-14 flex flex-col items-center justify-center w-full rounded-lg focus:outline-none transition border-2 ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-300 dark:ring-indigo-700' : 'border-transparent'} ${isToday && !isSelected ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onSelectDate(date)}
                    aria-label={`Seleccionar día ${date.getDate()} de ${monthNames[date.getMonth()]}`}
                    type="button"
                  >
                    <span className={`text-sm font-medium ${isToday ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>{date.getDate()}</span>
                    <div className="flex flex-wrap gap-0.5 mt-1 justify-center">
                      {getTasksForDate(tasks, dateStr).slice(0, 4).map((task, i) => {
                        const cat = categories.find(c => c.id === task.categoryId);
                        const color = cat ? cat.color : '#a3a3a3';
                        return (
                          <span
                            key={i}
                            title={task.title}
                            className="w-2.5 h-2.5 rounded-full border border-white dark:border-gray-800"
                            style={{ backgroundColor: color }}
                          />
                        );
                      })}
                    </div>
                  </button>
                );
              })
            ))}
        </div>
      </div>
    </div>
  );
};

export default MonthCalendar;
