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
        setTasks(Object.values(data));
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
      getTodayTasks
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