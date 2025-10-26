import React from 'react';
import { useAuth } from '../context/AuthContext';
// CAMBIO: Importamos el nuevo logo y quitamos el antiguo
import { MontuLogoIcon, LogoutIcon } from './icons';

export const Header: React.FC = () => {
  const { logout, currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <header className="bg-surface p-4 shadow-sm flex justify-between items-center border-b border-slate-200">
      <div className="flex items-center gap-3">
        {/* CAMBIO: Usamos el nuevo logo */}
        <MontuLogoIcon className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold text-text-primary tracking-wider">Montu</h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-text-secondary hidden sm:block">Bienvenido, {currentUser.username}</span>
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
          aria-label="Cerrar Sesión"
        >
          <LogoutIcon className="w-5 h-5" />
          <span className="hidden sm:block">Cerrar Sesión</span>
        </button>
      </div>
    </header>
  );
};