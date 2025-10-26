// src/types.ts

import { Timestamp } from "firebase/firestore";

export interface MasterExercise {
  id: string;
  trainerId: string;
  name: string;
  muscleGroup: string;
  type: string[];
  videoUrl?: string;
}

export interface Exercise {
  id: string; 
  name: string;
  type: string[];
  sets: number;
  reps: string; 
  weight?: string; // El peso sugerido por el entrenador
  rest: string; 
  videoUrl?: string;
  trainerNotes?: string;
  // --- INICIO DE CAMBIOS ---
  // Campos para el feedback y progreso del cliente
  isCompleted?: boolean;
  clientWeight?: string; // El peso que el cliente realmente levantó
  clientNotes?: string; // Notas que el cliente deja sobre el ejercicio
  // --- FIN DE CAMBIOS ---
}

export interface User {
  id: string; 
  email: string;
  username: string;
  photoURL?: string | null;
  role: 'trainer' | 'client';
}

export interface Trainer extends User {
  role: 'trainer';
  description?: string;
  galleryImages?: string[];
  subscriptionStatus: 'active' | 'inactive' | 'pending';
}

export interface Client extends User {
  role: 'client';
  trainerId: string;
  plan?: WorkoutPlan | null;
}

export interface WorkoutPlan {
  id: string;
  workouts: Workout[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Workout {
  id: string;
  day: string;
  exercises: Exercise[];
}

export interface Comment {
    id: string;
    text: string;
    timestamp: Timestamp;
}