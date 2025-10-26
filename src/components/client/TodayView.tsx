// src/components/client/TodayView.tsx

import React from 'react';
import { Client, Workout } from '../../types';
import { ExerciseCard } from './ExerciseCard';
import { WeeklyProgress } from './WeeklyProgress'; // <-- Importamos el progreso
import { DumbbellIcon } from '../icons';

interface TodayViewProps {
    client: Client;
}

const getTodayWorkoutIndex = (planWorkouts: Workout[]) => {
    const today = new Date().getDay(); // 0 = Domingo, 1 = Lunes
    return (today === 0) ? 6 : today - 1;
};

export const TodayView: React.FC<TodayViewProps> = ({ client }) => {
    const todayIndex = getTodayWorkoutIndex(client.plan?.workouts || []);
    const todayWorkout = client.plan?.workouts[todayIndex];

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">¡Hola, {client.username}!</h2>
            
            {!client.plan || client.plan.workouts.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-lg shadow">
                    <p className="text-gray-600">Aún no tienes un plan de entrenamiento asignado.</p>
                </div>
            ) : (
                <>
                    {/* --- AÑADIMOS EL COMPONENTE DE PROGRESO --- */}
                    <WeeklyProgress workouts={client.plan.workouts} />
                    
                    {!todayWorkout ? (
                        <div className="p-8 text-center bg-white rounded-lg shadow">
                             <p className="text-2xl font-semibold mb-2">¡Día de Descanso!</p>
                            <p className="text-gray-600">Aprovecha para recuperar.</p>
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-semibold mb-4">Tu entrenamiento de hoy: <span className="text-indigo-600">{todayWorkout.day}</span></h3>
                            <a href="#today-workout" className="w-full text-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors block">
                                ¡Empezar a Entrenar!
                            </a>
                        </div>
                    )}
                </>
            )}
            
            <div id="today-workout" className="mt-8 space-y-8">
                {todayWorkout && (
                    <div className="bg-surface p-4 sm:p-6 rounded-xl shadow-md border border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-3">
                            <DumbbellIcon className="w-6 h-6 text-indigo-600" />
                            {todayWorkout.day}
                        </h3>
                        <div className="space-y-4">
                            {todayWorkout.exercises.map((exercise, index) => (
                                <ExerciseCard 
                                    key={`${exercise.id}-${index}`} 
                                    exercise={exercise} 
                                    workoutId={todayWorkout.id}
                                    exerciseIndex={index}
                                    // No pasamos isReadOnly, por lo que es interactivo por defecto
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};