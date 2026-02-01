
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, Timestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// CONFIG CORECT
const firebaseConfig = {
apiKey: "AIzaSyCtv-Ma8A_gnrJphT2bxI1p3lWaYScGYP0",
authDomain: "invatamimpreuna-d109a.firebaseapp.com",
projectId: "invatamimpreuna-d109a",
storageBucket: "invatamimpreuna-d109a.appspot.com",
messagingSenderId: "97869258977",
appId: "1:97869258977:web:c48963074655625c2e57a0",
measurementId: "G-4T2MY0SSCB",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Offline persistence (opțional, dar util)
if (typeof window !== 'undefined') {
enableIndexedDbPersistence(db).catch(() => {});
}

// Forțează bucket-ul corect (evită rămânerea pe config vechi)
export const storage = getStorage(app, "gs://invatamimpreuna-d109a.appspot.com");

// Tipuri & funcții tale Firestore (rămân)
export interface UserProgress {
completedLessons: string[];
testResults: {
testId: string;
score: number;
totalQuestions: number;
completedAt: Timestamp;
}[];
}

export const getUserProgress = async (userId: string): Promise<UserProgress | null> => {
const docRef = doc(db, "progress", userId);
const snap = await getDoc(docRef);
return snap.exists() ? (snap.data() as UserProgress) : null;
};

export const toggleLessonCompletion = async (userId: string, lessonId: string, isCompleted: boolean) => {
const progressRef = doc(db, "progress", userId);
const snap = await getDoc(progressRef);
if (snap.exists()) {
await updateDoc(progressRef, {
completedLessons: isCompleted ? arrayUnion(lessonId) : arrayRemove(lessonId),
});
} else if (isCompleted) {
await setDoc(progressRef, { completedLessons: [lessonId], testResults: [] });
}
};

export const saveTestResult = async (userId: string, testId: string, score: number, totalQuestions: number) => {
const progressRef = doc(db, "progress", userId);
const snap = await getDoc(progressRef);
const newResult = { testId, score, totalQuestions, completedAt: Timestamp.now() };
if (snap.exists()) {
const data = snap.data() as UserProgress;
const rest = data.testResults.filter(r => r.testId !== testId);
await updateDoc(progressRef, { testResults: [...rest, newResult] });
} else {
await setDoc(progressRef, { completedLessons: [], testResults: [newResult] });
}
};