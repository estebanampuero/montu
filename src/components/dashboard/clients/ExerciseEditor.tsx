// src/components/dashboard/clients/ExerciseEditor.tsx

import React from 'react';
import { Trash2 } from 'lucide-react';
import { Exercise } from '../../../types';

interface ExerciseEditorProps {
    exercise: Exercise;
    onUpdate: (updatedExercise: Exercise) => void;
    onRemove: () => void;
}

export const ExerciseEditor: React.FC<ExerciseEditorProps> = ({ exercise, onUpdate, onRemove }) => {
    
    const handleChange = (field: keyof Exercise, value: string | number) => {
        onUpdate({ ...exercise, [field]: value });
    };

    return (
        <div className="bg-gray-100 p-3 rounded-md border border-gray-200 space-y-2">
            <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-800">{exercise.name}</p>
                <button type="button" onClick={onRemove} className="p-1 text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <input type="number" value={exercise.sets || ''} onChange={e => handleChange('sets', parseInt(e.target.value) || 0)} className="w-full p-1 border rounded" placeholder="Sets"/>
                <input type="text" value={exercise.reps} onChange={e => handleChange('reps', e.target.value)} className="w-full p-1 border rounded" placeholder="Reps" />
                <input type="text" value={exercise.weight || ''} onChange={e => handleChange('weight', e.target.value)} className="w-full p-1 border rounded" placeholder="Peso" />
                <input type="text" value={exercise.rest} onChange={e => handleChange('rest', e.target.value)} className="w-full p-1 border rounded" placeholder="Descanso" />
            </div>
             <textarea
                value={exercise.trainerNotes || ''}
                onChange={e => handleChange('trainerNotes', e.target.value)}
                className="w-full p-1 border rounded text-sm"
                placeholder="Notas para el cliente..."
                rows={1}
            />
        </div>
    );
};