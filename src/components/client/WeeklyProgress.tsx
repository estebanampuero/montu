// src/components/client/WeeklyProgress.tsx

import React from 'react';
import { Workout } from '../../types';

interface WeeklyProgressProps {
    workouts: Workout[];
}

// Esta función cuenta cuántos días de la semana tienen al menos un ejercicio completado.
const countCompletedWorkouts = (workouts: Workout[]): number => {
    if (!workouts) return 0;
    
    return workouts.reduce((count, workout) => {
        const hasCompletedExercise = workout.exercises.some(ex => ex.isCompleted);
        return hasCompletedExercise ? count + 1 : count;
    }, 0);
};

export const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ workouts }) => {
    const completedCount = countCompletedWorkouts(workouts);
    const totalWorkouts = workouts.length > 4 ? workouts.length : 4; // Muestra al menos 4 ticks/barras

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">Progreso Semanal</h4>
            <div className="flex items-center gap-2">
                {Array.from({ length: totalWorkouts }).map((_, index) => {
                    const isCompleted = index < completedCount;
                    return (
                        <div 
                            key={index}
                            className={`w-full h-2 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}
                            title={isCompleted ? 'Entrenamiento completado' : 'Pendiente'}
                        >
                        </div>
                    );
                })}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-right">{completedCount} de {totalWorkouts} entrenamientos iniciados.</p>
        </div>
    );
};