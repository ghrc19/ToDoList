import React, { useEffect, useState, createContext, useContext } from 'react';
import { db } from '../firebase';
import { ref, onValue, set, push, update, remove } from 'firebase/database';
import { useAuth } from './AuthContext';

export interface Category {
  id: string;
  name: string;
  color: string;
}
export interface Task {
  id: string;
  title: string;
  completed?: { [date: string]: boolean };
  categoryId: string | null;
  date: string;
  isRecurring: boolean;
  recurringDays: number[];
  priority: 'low' | 'medium' | 'high';
  duration: number;
  cronometrado?: boolean;
  recurringStartDate?: string;
  recurringEndDate?: string;
  recurringIndeterminate?: boolean;
  isTemplate?: boolean;
  templateId?: string;
}

interface TaskContextType {
  tasks: Task[];
  categories: Category[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getTodayTasks: () => Task[];
  addExistingTaskForDate: (taskId: string, date: string) => void;
  addExistingTaskForRange: (taskId: string, startDate: string, endDate: string) => void;
  getTemplates: () => Task[];
  createTaskFromTemplate: (templateId: string, date: string) => void;
  createTaskFromTemplateRange: (templateId: string, startDate: string, endDate: string) => void;
  updateTemplate: (templateId: string, updates: Partial<Task>) => void;
  deleteTemplate: (templateId: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const defaultCategories: Category[] = [
  { id: '1', name: 'Trabajo', color: '#4f46e5' },
  { id: '2', name: 'Personal', color: '#10b981' },
  { id: '3', name: 'Estudios', color: '#f59e0b' }
];

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }
    const tasksRef = ref(db, `users/${user.id}/tasks`);
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tasksList = Object.values(data) as Task[];
        tasksList.forEach((task: Task) => {
          if (task.isTemplate === undefined) {
            console.log('[MIGRATION] Setting isTemplate: false for task:', task.title);
            const taskRef = ref(db, `users/${user.id}/tasks/${task.id}`);
            update(taskRef, { isTemplate: false });
          }
        });
        
        setTasks(tasksList);
      } else {
        setTasks([]);
      }
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setCategories(defaultCategories);
      return;
    }
    const categoriesRef = ref(db, `users/${user.id}/categories`);
    const unsubscribe = onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCategories(Object.values(data));
      } else {
        setCategories(defaultCategories);
      }
    });
    return () => unsubscribe();
  }, [user]);

  const addTask = (task: Omit<Task, 'id'>) => {
    if (!user) return;
    const tasksRef = ref(db, `users/${user.id}/tasks`);
    const newTaskRef = push(tasksRef);
    const todayStr = (new Date()).toISOString().slice(0, 10);
    let completed: { [date: string]: boolean } = {};
    if (task.date) completed[task.date] = false;
    const cleanTask: any = { ...task, id: newTaskRef.key, isRecurring: !!task.isRecurring, recurringDays: Array.isArray(task.recurringDays) ? task.recurringDays : [], completed };
    Object.keys(cleanTask).forEach(key => {
      if (cleanTask[key] === undefined) {
        delete cleanTask[key];
      }
    });
    set(newTaskRef, cleanTask);
  };

  const updateTask = (id: string, taskUpdate: Partial<Task>) => {
    if (!user) return;
    const taskRef = ref(db, `users/${user.id}/tasks/${id}`);
    const cleanUpdate: any = { ...taskUpdate };
    Object.keys(cleanUpdate).forEach(key => {
      if (cleanUpdate[key] === undefined) {
        delete cleanUpdate[key];
      }
    });
    update(taskRef, cleanUpdate);
  };

  const deleteTask = (id: string) => {
    if (!user) return;
    const taskRef = ref(db, `users/${user.id}/tasks/${id}`);
    remove(taskRef);
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    if (!user) return;
    const categoriesRef = ref(db, `users/${user.id}/categories`);
    const newCategoryRef = push(categoriesRef);
    set(newCategoryRef, { ...category, id: newCategoryRef.key });
  };

  const updateCategory = (id: string, categoryUpdate: Partial<Category>) => {
    if (!user) return;
    const categoryRef = ref(db, `users/${user.id}/categories/${id}`);
    update(categoryRef, categoryUpdate);
  };

  const deleteCategory = (id: string) => {
    if (!user) return;
    const categoryRef = ref(db, `users/${user.id}/categories/${id}`);
    remove(categoryRef);
    tasks.forEach(task => {
      if (task.categoryId === id) {
        updateTask(task.id, { categoryId: null });
      }
    });
  };

  const getTodayTasks = (): Task[] => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const dayOfWeek = today.getDay();
    const recurrent = tasks.filter(task => {
      if (!task.isRecurring || !task.recurringDays.includes(dayOfWeek)) return false;
      if (task.recurringIndeterminate) return true;
      if (task.recurringEndDate) {
        return todayStr <= task.recurringEndDate;
      }
      return true;
    });
    const normales = tasks.filter(task => !task.isRecurring && task.date === todayStr);
    return [...recurrent, ...normales];
  };

  const addExistingTaskForDate = (taskId: string, date: string) => {
    const originalTask = tasks.find(task => task.id === taskId);
    if (!originalTask || !user) return;
    if (originalTask.isTemplate !== true) {
      updateTask(originalTask.id, { isTemplate: true });
    }

    const newTask: Omit<Task, 'id'> = {
      title: originalTask.title,
      categoryId: originalTask.categoryId,
      date: date,
      isRecurring: false,
      recurringDays: [],
      priority: originalTask.priority,
      duration: originalTask.duration,
      cronometrado: originalTask.cronometrado,
      templateId: originalTask.id,
      isTemplate: false,
    };

    addTask(newTask);
  };

  const addExistingTaskForRange = (taskId: string, startDate: string, endDate: string) => {
    const originalTask = tasks.find(task => task.id === taskId);
    if (!originalTask || !user) return;

    if (originalTask.isTemplate !== true) {
      updateTask(originalTask.id, { isTemplate: true });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      
      const newTask: Omit<Task, 'id'> = {
        title: originalTask.title,
        categoryId: originalTask.categoryId,
        date: dateStr,
        isRecurring: false,
        recurringDays: [],
        priority: originalTask.priority,
        duration: originalTask.duration,
        cronometrado: originalTask.cronometrado,
        templateId: originalTask.id,
        isTemplate: false,
      };

      addTask(newTask);
    }
  };

  const getTemplates = (): Task[] => {
    return tasks.filter(task => task.isTemplate === true);
  };

  const createTaskFromTemplate = (templateId: string, date: string) => {
    const template = tasks.find(task => task.id === templateId && task.isTemplate === true);
    if (!template || !user) return;

    const newTask: Omit<Task, 'id'> = {
      title: template.title,
      categoryId: template.categoryId,
      date: date,
      isRecurring: false,
      recurringDays: [],
      priority: template.priority,
      duration: template.duration,
      cronometrado: template.cronometrado,
      templateId: templateId,
      isTemplate: false,
    };

    addTask(newTask);
  };

  const createTaskFromTemplateRange = (templateId: string, startDate: string, endDate: string) => {
    const template = tasks.find(task => task.id === templateId && task.isTemplate === true);
    if (!template || !user) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      
      const newTask: Omit<Task, 'id'> = {
        title: template.title,
        categoryId: template.categoryId,
        date: dateStr,
        isRecurring: false,
        recurringDays: [],
        priority: template.priority,
        duration: template.duration,
        cronometrado: template.cronometrado,
        templateId: templateId,
        isTemplate: false,
      };

      addTask(newTask);
    }
  };

  const updateTemplate = (templateId: string, updates: Partial<Task>) => {
    if (!user) return;
    updateTask(templateId, updates);
  };

  const deleteTemplate = (templateId: string) => {
    if (!user) return;
    const instancesToDelete = tasks.filter(task => task.templateId === templateId);
    instancesToDelete.forEach(task => deleteTask(task.id));
    deleteTask(templateId);
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      categories,
      addTask,
      updateTask,
      deleteTask,
      addCategory,
      updateCategory,
      deleteCategory,
      getTodayTasks,
      addExistingTaskForDate,
      addExistingTaskForRange,
      getTemplates,
      createTaskFromTemplate,
      createTaskFromTemplateRange,
      updateTemplate,
      deleteTemplate
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};