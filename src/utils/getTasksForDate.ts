import { Task } from '../context/TaskContext';
import { getLocalDayOfWeek } from './getLocalDayOfWeek';

export function getTasksForDate(tasks: Task[], dateStr: string): Task[] {
  const dayOfWeek = getLocalDayOfWeek(dateStr);
  // ...
  const normalTasks = tasks.filter(
    task => !task.isRecurring && task.date === dateStr
  );
  const normalIds = new Set(normalTasks.map(t => t.id));
  const recurrentTasks = tasks.filter(task => {
    if (!task.isRecurring || !Array.isArray(task.recurringDays) || !task.recurringDays.includes(dayOfWeek)) return false;
    const start = task.recurringStartDate || task.date;
    if (dateStr < start) return false;
    if (task.recurringEndDate && dateStr > task.recurringEndDate) return false;
    if (task.recurringIndeterminate) return true;
    if (normalIds.has(task.id)) return false;
    return true;
  });
  const dayTasksMap = new Map();
  for (const t of [...recurrentTasks, ...normalTasks]) {
    dayTasksMap.set(t.id, t);
  }
  return Array.from(dayTasksMap.values());
}
