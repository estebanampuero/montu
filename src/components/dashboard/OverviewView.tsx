// src/components/dashboard/OverviewView.tsx

import React from 'react';
// --- INICIO DE CAMBIOS ---
import { useTrainer } from '../../context/TrainerContext';
import { Users, ClipboardList, Zap } from 'lucide-react';
// --- FIN DE CAMBIOS ---

// --- INICIO DE CAMBIOS: Sub-componente para las tarjetas de estadísticas ---
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: 'indigo' | 'green' | 'yellow';
  isLoading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, color, isLoading }) => {
  const colorClasses = {
    indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', value: 'text-indigo-900' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', value: 'text-green-900' },
    yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', value: 'text-yellow-900' },
  };

  const selectedColor = colorClasses[color];

  return (
    <div className={`${selectedColor.bg} p-5 rounded-lg border ${selectedColor.border} shadow-sm`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${selectedColor.text} ${selectedColor.bg === 'bg-yellow-50' ? 'bg-yellow-100' : selectedColor.bg === 'bg-green-50' ? 'bg-green-100' : 'bg-indigo-100'}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className={`text-sm font-medium ${selectedColor.text}`}>{label}</p>
          {isLoading ? (
            <div className="h-8 w-16 bg-gray-200 rounded-md animate-pulse mt-1"></div>
          ) : (
            <p className={`text-3xl font-bold ${selectedColor.value}`}>{value}</p>
          )}
        </div>
      </div>
    </div>
  );
};
// --- FIN DE CAMBIOS ---

export const OverviewView: React.FC = () => {
  // --- INICIO DE CAMBIOS ---
  const { trainerClients, masterExercises, isLoadingClients, isLoadingExercises } = useTrainer();

  // Calculamos las estadísticas
  const activeClientsCount = trainerClients.length;
  const clientsWithPlanCount = trainerClients.filter(client => client.plan && client.plan.workouts.length > 0).length;
  const exercisesCount = masterExercises.length;
  // --- FIN DE CAMBIOS ---

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Resumen del Día</h2>
      <p className="text-gray-600">
        Bienvenido de nuevo. Aquí puedes ver un resumen rápido de tus clientes, planes asignados y tu banco de ejercicios.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* --- INICIO DE CAMBIOS: Usamos el nuevo componente con datos dinámicos --- */}
        <StatCard
          icon={Users}
          label="Clientes Activos"
          value={activeClientsCount}
          color="indigo"
          isLoading={isLoadingClients}
        />
        <StatCard
          icon={ClipboardList}
          label="Clientes con Plan"
          value={clientsWithPlanCount}
          color="green"
          isLoading={isLoadingClients}
        />
        <StatCard
          icon={Zap}
          label="Ejercicios Creados"
          value={exercisesCount}
          color="yellow"
          isLoading={isLoadingExercises}
        />
        {/* --- FIN DE CAMBIOS --- */}
      </div>
    </div>
  );
};

export default OverviewView;