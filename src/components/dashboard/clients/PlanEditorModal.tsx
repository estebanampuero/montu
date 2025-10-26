// src/components/dashboard/clients/PlanEditorModal.tsx

import React, { useState } from 'react';
import { X, PlusIcon } from 'lucide-react';
import { Client, WorkoutPlan, Workout } from '../../../types';
import { useTrainer } from '../../../context/TrainerContext';
// CORRECCIÓN: Ruta relativa correcta
import { WorkoutDayEditor } from './WorkoutDayEditor'; 
import { Timestamp } from 'firebase/firestore';

interface PlanEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    client: Client;
}

export const PlanEditorModal: React.FC<PlanEditorModalProps> = ({ isOpen, onClose, client }) => {
    const { updateClientPlan } = useTrainer();
    const [plan, setPlan] = useState<WorkoutPlan>(
        client.plan || { id: client.id, workouts: [], createdAt: Timestamp.now(), updatedAt: Timestamp.now() }
    );
    const [isSaving, setIsSaving] = useState(false);

    const handleAddDay = () => {
        const newDay: Workout = {
            id: `day-${plan.workouts.length + 1}`,
            day: `Día ${plan.workouts.length + 1}`,
            exercises: []
        };
        setPlan({ ...plan, workouts: [...plan.workouts, newDay] });
    };

    const handleUpdateDay = (index: number, updatedWorkout: Workout) => {
        const newWorkouts = [...plan.workouts];
        newWorkouts[index] = updatedWorkout;
        setPlan({ ...plan, workouts: newWorkouts });
    };

    const handleDeleteDay = (index: number) => {
        const newWorkouts = plan.workouts.filter((_, i) => i !== index);
        setPlan({ ...plan, workouts: newWorkouts });
    };

    const handleSavePlan = async () => {
        setIsSaving(true);
        try {
            await updateClientPlan(client.id, plan);
            onClose();
        } catch (error) {
            console.error("Error guardando el plan:", error);
            alert("No se pudo guardar el plan.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-50 rounded-lg shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh]">
                <div className="p-4 border-b bg-white rounded-t-lg flex justify-between items-center sticky top-0">
                    <h3 className="text-xl font-semibold text-gray-800">Editor de Plan para {client.username}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><X className="w-5 h-5 text-gray-500" /></button>
                </div>

                <div className="p-4 md:p-6 overflow-y-auto space-y-4">
                    {plan.workouts.map((workout, index) => (
                        <WorkoutDayEditor 
                            key={index}
                            workout={workout}
                            onUpdate={(updated) => handleUpdateDay(index, updated)}
                            onDelete={() => handleDeleteDay(index)}
                        />
                    ))}
                     <button type="button" onClick={handleAddDay} className="w-full flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md">
                        <PlusIcon className="w-4 h-4" />
                        Añadir Día de Entrenamiento
                    </button>
                </div>
               
                <div className="p-4 bg-white border-t rounded-b-lg flex justify-end gap-3 sticky bottom-0">
                    <button onClick={onClose} className="py-2 px-4 border rounded-md text-sm font-medium">Cancelar</button>
                    <button onClick={handleSavePlan} disabled={isSaving} className="py-2 px-4 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300">
                        {isSaving ? 'Guardando...' : 'Guardar Plan'}
                    </button>
                </div>
            </div>
        </div>
    );
};