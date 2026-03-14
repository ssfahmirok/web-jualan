'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip on server side
    if (!auth) {
      setLoading(false);
      return;
    }

    const createUserDocument = async (firebaseUser: FirebaseUser, additionalData?: Partial<User>) => {
      if (!db) return null;
      
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const newUser: Omit<User, 'uid'> & { uid: string } = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || additionalData?.displayName || 'User',
          photoURL: firebaseUser.photoURL,
          balance: 0,
          role: 'USER',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          ...additionalData,
        };
        await setDoc(userRef, newUser);
        return newUser;
      } else {
        return userSnap.data() as User;
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        const userData = await createUserDocument(firebaseUser);
        setUser(userData);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase not initialized');
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    if (db) {
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUser(userSnap.data() as User);
      }
    }
  };

  const register = async (email: string, password: string, name: string) => {
    if (!auth) throw new Error('Firebase not initialized');
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    
    if (db) {
      const newUser: Omit<User, 'uid'> & { uid: string } = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: name,
        photoURL: result.user.photoURL,
        balance: 0,
        role: 'USER',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await setDoc(doc(db, 'users', result.user.uid), newUser);
      setUser(newUser);
    }
  };

  const logout = async () => {
    if (!auth) throw new Error('Firebase not initialized');
    await signOut(auth);
    setUser(null);
  };

  const loginWithGoogle = async () => {
    if (!auth) throw new Error('Firebase not initialized');
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    if (db) {
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        const newUser: Omit<User, 'uid'> & { uid: string } = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || 'User',
          photoURL: result.user.photoURL,
          balance: 0,
          role: 'USER',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        await setDoc(userRef, newUser);
        setUser(newUser);
      } else {
        setUser(userSnap.data() as User);
      }
    }
  };

  const resetPassword = async (email: string) => {
    if (!auth) throw new Error('Firebase not initialized');
    await sendPasswordResetEmail(auth, email);
  };

  const refreshUser = async () => {
    if (firebaseUser && db) {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUser(userSnap.data() as User);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        login,
        register,
        logout,
        loginWithGoogle,
        resetPassword,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
