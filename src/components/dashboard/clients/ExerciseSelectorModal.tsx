// src/components/dashboard/clients/ExerciseSelectorModal.tsx

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTrainer } from '../../../context/TrainerContext';
import { MasterExercise } from '../../../types';

interface ExerciseSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (exercises: MasterExercise[]) => void;
}

export const ExerciseSelectorModal: React.FC<ExerciseSelectorModalProps> = ({ isOpen, onClose, onSelect }) => {
    const { masterExercises, isLoadingExercises } = useTrainer();
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const handleToggle = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const handleAdd = () => {
        const selected = masterExercises.filter(ex => selectedIds.has(ex.id));
        onSelect(selected);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col max-h-[80vh]">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Seleccionar Ejercicios</h3>
                    <button type="button" onClick={onClose}><X className="w-5 h-5" /></button>
                </div>
                <div className="p-4 overflow-y-auto">
                    {isLoadingExercises ? <p>Cargando...</p> : (
                        <ul className="space-y-2">
                            {masterExercises.map(ex => (
                                <li key={ex.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-100">
                                    <input
                                        type="checkbox"
                                        id={`ex-select-${ex.id}`}
                                        checked={selectedIds.has(ex.id)}
                                        onChange={() => handleToggle(ex.id)}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor={`ex-select-${ex.id}`} className="flex-grow cursor-pointer">
                                        <p className="font-medium">{ex.name}</p>
                                        <p className="text-sm text-gray-500">{ex.muscleGroup}</p>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="p-4 bg-gray-50 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="py-2 px-4 border rounded-md text-sm">Cancelar</button>
                    <button type="button" onClick={handleAdd} disabled={selectedIds.size === 0} className="py-2 px-4 rounded-md text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300">
                        Añadir Seleccionados
                    </button>
                </div>
            </div>
        </div>
    );
};