// src/lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
} from "firebase/firestore";
import { getStorage } from "firebase/storage"; // <-- PASUL 1: Importă getStorage

// --- CONFIGURAREA TA FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyCtv-Ma8A_gnrJphT2bxI1p3lWaYScGYP0",
  authDomain: "invatamimpreuna-d109a.firebaseapp.com",
  projectId: "invatamimpreuna-d109a",
  storageBucket: "invatamimpreuna-d109a.firebasestorage.app",
  messagingSenderId: "97869258977",
  appId: "1:97869258977:web:c48963074655625c2e57a0",
  measurementId: "G-4T2MY0SSCB",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // <-- PASUL 2: Inițializează și exportă storage

// --- LOGICA PENTRU FIRESTORE (rămâne neschimbată) ---

export interface UserProgress {
  completedLessons: string[];
  testResults: {
    testId: string;
    score: number;
    totalQuestions: number;
    completedAt: Timestamp;
  }[];
}

// Obține progresul unui utilizator
export const getUserProgress = async (
  userId: string
): Promise<UserProgress | null> => {
  const docRef = doc(db, "progress", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProgress;
  }
  return null;
};

// Marchează o lecție ca fiind completată/necompletată
export const toggleLessonCompletion = async (
  userId: string,
  lessonId: string,
  isCompleted: boolean
) => {
  const progressRef = doc(db, "progress", userId);
  const progressSnap = await getDoc(progressRef);

  if (progressSnap.exists()) {
    await updateDoc(progressRef, {
      completedLessons: isCompleted
        ? arrayUnion(lessonId)
        : arrayRemove(lessonId),
    });
  } else {
    if (isCompleted) {
      await setDoc(progressRef, {
        completedLessons: [lessonId],
        testResults: [],
      });
    }
  }
};

// Salvează rezultatul unui test
export const saveTestResult = async (
  userId: string,
  testId: string,
  score: number,
  totalQuestions: number
) => {
  const progressRef = doc(db, "progress", userId);
  const progressSnap = await getDoc(progressRef);
  const newResult = {
    testId,
    score,
    totalQuestions,
    completedAt: Timestamp.now(),
  };

  if (progressSnap.exists()) {
    const progressData = progressSnap.data() as UserProgress;
    const existingResults = progressData.testResults.filter(
      (r) => r.testId !== testId
    );
    await updateDoc(progressRef, {
      testResults: [...existingResults, newResult],
    });
  } else {
    await setDoc(progressRef, {
      completedLessons: [],
      testResults: [newResult],
    });
  }
};
