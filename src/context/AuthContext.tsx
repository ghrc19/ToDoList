
import React, { useEffect, useState, createContext, useContext } from 'react';
import { auth, db } from '../firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { ref, set, get, push } from 'firebase/database';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const isAuthenticated = !!user;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let name = '';
        const userRef = ref(db, `users/${firebaseUser.uid}`);
        const snap = await get(userRef);
        if (snap.exists() && snap.val().name) {
          name = snap.val().name;
        } else {
          name = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '';
        }
        setUser({
          id: firebaseUser.uid,
          name,
          email: firebaseUser.email || ''
        });
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
        await set(ref(db, `users/${auth.currentUser.uid}`), {
          name,
          email
        });
        const defaultCategories = [
          { name: 'Trabajo', color: '#4f46e5' },
          { name: 'Personal', color: '#10b981' },
          { name: 'Estudios', color: '#f59e0b' }
        ];
        const categoriesRef = ref(db, `users/${auth.currentUser.uid}/categories`);
        for (const cat of defaultCategories) {
          const newCatRef = push(categoriesRef);
          await set(newCatRef, { ...cat, id: newCatRef.key });
        }
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      authLoading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};