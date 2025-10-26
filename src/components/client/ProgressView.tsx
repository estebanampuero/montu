// src/components/client/ProgressView.tsx
import React from 'react';
import { Client } from '../../types';

interface ProgressViewProps {
    client: Client;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ client }) => {
    // NOTA: Para un gráfico de progreso real, necesitarías guardar un historial
    // de entrenamientos completados en una colección separada en Firestore.
    // Esto es una maqueta visual de cómo se vería.

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Tu Progreso</h2>
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-lg text-gray-700">Progreso en Ejercicios</h3>
                <p className="text-sm text-gray-500 mb-4">Selecciona un ejercicio para ver cómo has mejorado tu fuerza con el tiempo.</p>
                
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
                    <p className="font-bold">¡Próximamente!</p>
                    <p className="text-sm">Estamos trabajando en los gráficos de progreso. ¡Pronto podrás ver aquí tu evolución!</p>
                </div>

                {/* Ejemplo de cómo se vería el selector y el gráfico */}
                <div className="mt-6 opacity-40">
                    <label htmlFor="exercise-select" className="block text-sm font-medium text-gray-700">Seleccionar Ejercicio</label>
                    <select id="exercise-select" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-100" disabled>
                        <option>Press de Banca</option>
                    </select>
                    <div className="mt-4 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Aquí se mostrará el gráfico</p>
                    </div>
                </div>
            </div>
        </div>
    );
};