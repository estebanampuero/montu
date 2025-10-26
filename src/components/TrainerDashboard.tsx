// src/components/TrainerDashboard.tsx

import React, { useState, useMemo } from 'react';
import { LayoutDashboard, Users, Zap, User, Settings, Menu, X } from 'lucide-react';

// --- INICIO DE LA CORRECCIÓN DE RUTAS ---
// Ahora las rutas apuntan a la subcarpeta './dashboard/'
import { OverviewView } from './dashboard/OverviewView';
import { ClientsView } from './dashboard/ClientsView';
import { ProgramsView } from './dashboard/ProgramsView';
import { ProfileView } from './dashboard/ProfileView';
import { SettingsView } from './dashboard/SettingsView';
// --- FIN DE LA CORRECCIÓN DE RUTAS ---

type TrainerDashboardView = "overview" | "clients" | "programs" | "profile" | "settings";

interface NavItemProps {
  view: TrainerDashboardView;
  label: string;
  icon: React.ElementType;
  isSelected: boolean;
  onClick: (view: TrainerDashboardView) => void;
}

const NavItem: React.FC<NavItemProps> = ({ view, label, icon: Icon, isSelected, onClick }) => {
  const baseClasses = "flex items-center p-3 rounded-lg transition-all duration-200 cursor-pointer";
  const activeClasses = "bg-indigo-700 text-white shadow-lg";
  const inactiveClasses = "text-indigo-200 hover:bg-indigo-700/50 hover:text-white";

  return (
    <li onClick={() => onClick(view)}>
      <div className={`${baseClasses} ${isSelected ? activeClasses : inactiveClasses}`}>
        <Icon className="w-5 h-5 mr-3" />
        <span className="font-medium">{label}</span>
      </div>
    </li>
  );
};

export const TrainerDashboard: React.FC = () => {
  const [selectedView, setSelectedView] = useState<TrainerDashboardView>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const views: { view: TrainerDashboardView, label: string, icon: React.ElementType }[] = useMemo(() => [
    { view: "overview", label: "Resumen", icon: LayoutDashboard },
    { view: "clients", label: "Clientes", icon: Users },
    { view: "programs", label: "Programas", icon: Zap },
    { view: "profile", label: "Perfil", icon: User },
    { view: "settings", label: "Configuración", icon: Settings },
  ], []);

  const renderContent = () => {
    switch (selectedView) {
      case "overview":
        return <OverviewView />;
      case "clients":
        return <ClientsView />;
      case "programs":
        return <ProgramsView />;
      case "profile":
        return <ProfileView />;
      case "settings":
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex font-inter antialiased">
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-full shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle Navigation"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                   lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out 
                   w-64 bg-indigo-800 p-4 flex flex-col z-40`}
      >
        <div className="flex items-center justify-between lg:justify-center mb-10 mt-2">
          <h1 className="text-2xl font-extrabold text-white tracking-wider">
            Montu
          </h1>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2">
            {views.map(item => (
              <NavItem
                key={item.view}
                view={item.view}
                label={item.label}
                icon={item.icon}
                isSelected={selectedView === item.view}
                onClick={(view) => {
                  setSelectedView(view);
                  setIsSidebarOpen(false);
                }}
              />
            ))}
          </ul>
        </nav>
        <div className="mt-auto pt-4 border-t border-indigo-700">
          <p className="text-sm text-indigo-300 text-center">
            Dashboard del Entrenador
          </p>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <main className="flex-1 p-4 md:p-8 lg:ml-0 pt-20 lg:pt-8 overflow-y-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 capitalize hidden lg:block">
          {views.find(v => v.view === selectedView)?.label}
        </h1>
        {renderContent()}
      </main>
    </div>
  );
};