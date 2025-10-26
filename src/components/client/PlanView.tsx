// src/components/client/PlanView.tsx

import React from 'react';
import { Client } from '../../types';
import { ExerciseCard } from './ExerciseCard';
import { WeeklyProgress } from './WeeklyProgress';
import { DumbbellIcon } from '../icons';

interface PlanViewProps {
    client: Client;
}

export const PlanView: React.FC<PlanViewProps> = ({ client }) => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Tu Plan Semanal</h2>
            {!client.plan || client.plan.workouts.length === 0 ? (
                 <p className="text-gray-600 text-center">Aún no tienes un plan de entrenamiento asignado.</p>
            ) : (
                <>
                    {/* --- AÑADIMOS EL COMPONENTE DE PROGRESO --- */}
                    <WeeklyProgress workouts={client.plan.workouts} />
                
                    <div className="space-y-8">
                        {client.plan.workouts.map(workout => (
                            <div key={workout.id} className="bg-surface p-4 sm:p-6 rounded-xl shadow-md border border-gray-200">
                                <h3 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-3">
                                    <DumbbellIcon className="w-6 h-6 text-indigo-600" />
                                    {workout.day}
                                </h3>
                                <div className="space-y-4">
                                    {workout.exercises.map((exercise, index) => (
                                        <ExerciseCard 
                                            key={`${exercise.id}-${index}`} 
                                            exercise={exercise} 
                                            workoutId={workout.id}
                                            exerciseIndex={index}
                                            isReadOnly={true} // <-- Hacemos las tarjetas de solo lectura
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};