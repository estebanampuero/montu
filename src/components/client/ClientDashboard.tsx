// src/components/client/ClientDashboard.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Client, Trainer } from '../../types';
import { Home, List, BarChart, User } from 'lucide-react';
import { TodayView } from './TodayView';
import { PlanView } from './PlanView';
import { ProgressView } from './ProgressView';
import { TrainerProfileView } from './TrainerProfileView';

type ClientView = 'today' | 'plan' | 'progress' | 'trainer';

export const ClientDashboard: React.FC = () => {
    const { currentUser, getTrainerProfile } = useAuth();
    const client = currentUser as Client;
    
    const [activeView, setActiveView] = useState<ClientView>('today');
    const [trainer, setTrainer] = useState<Trainer | null>(null);

    useEffect(() => {
        const fetchTrainer = async () => {
            if (client?.trainerId) {
                const trainerProfile = await getTrainerProfile(client.trainerId);
                setTrainer(trainerProfile);
            }
        };
        fetchTrainer();
    }, [client?.trainerId, getTrainerProfile]);

    const renderContent = () => {
        switch (activeView) {
            case 'today':
                return <TodayView client={client} />;
            case 'plan':
                return <PlanView client={client} />;
            case 'progress':
                return <ProgressView client={client} />;
            case 'trainer':
                return <TrainerProfileView trainer={trainer} />;
            default:
                return <TodayView client={client} />;
        }
    };
    
    if (!client) {
        return <div className="p-8 text-center">Cargando datos...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <main className="flex-1 p-4 pb-20">
                {renderContent()}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-t-lg">
                <div className="flex justify-around max-w-lg mx-auto">
                    <NavItem icon={Home} label="Hoy" view="today" activeView={activeView} onClick={setActiveView} />
                    <NavItem icon={List} label="Mi Plan" view="plan" activeView={activeView} onClick={setActiveView} />
                    <NavItem icon={BarChart} label="Progreso" view="progress" activeView={activeView} onClick={setActiveView} />
                    <NavItem icon={User} label="Mi Coach" view="trainer" activeView={activeView} onClick={setActiveView} />
                </div>
            </nav>
        </div>
    );
};

// Componente para los items de navegación
interface NavItemProps {
    icon: React.ElementType;
    label: string;
    view: ClientView;
    activeView: ClientView;
    onClick: (view: ClientView) => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, view, activeView, onClick }) => {
    const isActive = activeView === view;
    const color = isActive ? 'text-indigo-600' : 'text-gray-500';

    return (
        <button onClick={() => onClick(view)} className={`flex flex-col items-center justify-center p-3 w-full ${color} transition-colors`}>
            <Icon className="w-6 h-6 mb-1" />
            <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>{label}</span>
        </button>
    );
};