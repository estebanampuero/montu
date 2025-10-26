// src/components/client/ExerciseCard.tsx

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Exercise } from '../../types';
import { Video, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ExerciseCardProps {
    exercise: Exercise;
    workoutId: string;
    exerciseIndex: number;
    isReadOnly?: boolean; // <-- NUEVA PROP
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, workoutId, exerciseIndex, isReadOnly = false }) => {
    const { updateClientExercise } = useAuth();
    const [clientWeight, setClientWeight] = useState(exercise.clientWeight || '');
    const [clientNotes, setClientNotes] = useState(exercise.clientNotes || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleToggleCompleted = async () => {
        if (isReadOnly) return; // Si es solo lectura, no hacemos nada

        setIsSaving(true);
        const updatedExercise = { 
            ...exercise, 
            isCompleted: !exercise.isCompleted,
            clientWeight: clientWeight, // Guardamos los valores actuales al marcar
            clientNotes: clientNotes,
        };
        try {
            await updateClientExercise(workoutId, exerciseIndex, updatedExercise);
            toast.success(updatedExercise.isCompleted ? '¡Ejercicio completado!' : 'Ejercicio desmarcado.');
        } catch {
            toast.error('No se pudo guardar el cambio.');
        } finally {
            setIsSaving(false);
        }
    };

    const cardBg = exercise.isCompleted ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200';
    const textColor = exercise.isCompleted ? 'text-gray-500' : 'text-gray-800';
    const textDecoration = exercise.isCompleted ? 'line-through' : '';

    return (
        <div className={`p-4 rounded-lg border shadow-sm transition-colors ${cardBg}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h4 className={`text-lg font-bold ${textColor} ${textDecoration}`}>{exercise.name}</h4>
                    {exercise.videoUrl && (
                        <a href={exercise.videoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1">
                            <Video className="w-4 h-4" /> Ver Video
                        </a>
                    )}
                </div>
                <button 
                    onClick={handleToggleCompleted}
                    disabled={isSaving || isReadOnly} // Deshabilitamos el botón si es solo lectura
                    className={`p-2 rounded-full transition-colors ${exercise.isCompleted ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'} disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-label={exercise.isCompleted ? 'Marcar como no completado' : 'Marcar como completado'}
                >
                    <CheckCircle className="w-5 h-5" />
                </button>
            </div>
            
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className={`${textDecoration}`}><p className="text-sm text-gray-500">Series</p><p className={`font-semibold text-lg ${textColor}`}>{exercise.sets}</p></div>
                <div className={`${textDecoration}`}><p className="text-sm text-gray-500">Reps</p><p className={`font-semibold text-lg ${textColor}`}>{exercise.reps}</p></div>
                <div className={`${textDecoration}`}><p className="text-sm text-gray-500">Descanso</p><p className={`font-semibold text-lg ${textColor}`}>{exercise.rest}</p></div>
                <div className={`${textDecoration}`}><p className="text-sm text-gray-500">Peso Sugerido</p><p className={`font-semibold text-lg ${textColor}`}>{exercise.weight || 'N/A'}</p></div>
            </div>

            {exercise.trainerNotes && (
                <div className="mt-4 p-3 bg-indigo-50 rounded-md">
                    <p className="text-sm font-semibold text-indigo-800">Notas del Entrenador:</p>
                    <p className="text-sm text-indigo-700">{exercise.trainerNotes}</p>
                </div>
            )}
            
            <div className="mt-4 space-y-3">
                <div>
                    <label htmlFor={`weight-${exercise.id}`} className="block text-sm font-medium text-gray-700">Peso Utilizado (kg/lbs)</label>
                    <input 
                        type="text" 
                        id={`weight-${exercise.id}`}
                        value={clientWeight}
                        onChange={(e) => setClientWeight(e.target.value)}
                        readOnly={isReadOnly} // Hacemos el input de solo lectura
                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm ${isReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        placeholder="Ej: 80kg"
                    />
                </div>
                <div>
                    <label htmlFor={`notes-${exercise.id}`} className="block text-sm font-medium text-gray-700">Mis Notas</label>
                    <textarea
                        id={`notes-${exercise.id}`}
                        rows={2}
                        value={clientNotes}
                        onChange={(e) => setClientNotes(e.target.value)}
                        readOnly={isReadOnly} // Hacemos el textarea de solo lectura
                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm ${isReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        placeholder="¿Cómo te sentiste? ¿Alguna dificultad?"
                    ></textarea>
                </div>
            </div>
        </div>
    );
};