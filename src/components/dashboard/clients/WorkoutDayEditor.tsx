// src/components/dashboard/clients/WorkoutDayEditor.tsx

import React, { useState } from 'react';
import { PlusIcon, Trash2 } from 'lucide-react';
import { Workout, Exercise, MasterExercise } from '../../../types';
// CORRECCIÓN: Rutas relativas correctas
import { ExerciseSelectorModal } from './ExerciseSelectorModal'; 
import { ExerciseEditor } from './ExerciseEditor';

interface WorkoutDayEditorProps {
    workout: Workout;
    onUpdate: (updatedWorkout: Workout) => void;
    onDelete: () => void;
}

export const WorkoutDayEditor: React.FC<WorkoutDayEditorProps> = ({ workout, onUpdate, onDelete }) => {
    const [isSelectorOpen, setSelectorOpen] = useState(false);

    const handleDayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ ...workout, day: e.target.value });
    };

    const handleAddExercises = (selected: MasterExercise[]) => {
        const newExercises: Exercise[] = selected.map(ex => ({
            id: ex.id,
            name: ex.name,
            videoUrl: ex.videoUrl,
            sets: 4,
            reps: '10-12',
            weight: '',
            rest: '60s',
            trainerNotes: '',
        }));
        onUpdate({ ...workout, exercises: [...workout.exercises, ...newExercises] });
    };

    const handleExerciseUpdate = (index: number, updatedExercise: Exercise) => {
        const newExercises = [...workout.exercises];
        newExercises[index] = updatedExercise;
        onUpdate({ ...workout, exercises: newExercises });
    };

    const handleRemoveExercise = (index: number) => {
        const newExercises = workout.exercises.filter((_, i) => i !== index);
        onUpdate({ ...workout, exercises: newExercises });
    };

    return (
        <>
            <ExerciseSelectorModal isOpen={isSelectorOpen} onClose={() => setSelectorOpen(false)} onSelect={handleAddExercises} />
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <input 
                        type="text"
                        value={workout.day}
                        onChange={handleDayNameChange}
                        placeholder="Nombre del día (ej: Día 1: Pecho y Tríceps)"
                        className="text-lg font-bold text-gray-800 p-1 -ml-1 border-transparent focus:border-gray-300 focus:ring-0 rounded"
                    />
                    <button type="button" onClick={onDelete} className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="w-5 h-5" /></button>
                </div>
                <div className="space-y-3 mb-4">
                    {workout.exercises.map((ex, index) => (
                        <ExerciseEditor 
                            key={index}
                            exercise={ex}
                            onUpdate={(updated) => handleExerciseUpdate(index, updated)}
                            onRemove={() => handleRemoveExercise(index)}
                        />
                    ))}
                </div>
                <button type="button" onClick={() => setSelectorOpen(true)} className="w-full flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-md">
                    <PlusIcon className="w-4 h-4" />
                    Añadir Ejercicio
                </button>
            </div>
        </>
    );
};