// src/components/LandingPage.tsx

import React from 'react';
// --- INICIO DE CAMBIOS ---
import { 
  MontuLogoIcon, 
  ClipboardListIcon, 
  UsersIcon, 
  BarChartIcon 
} from './icons';
// --- FIN DE CAMBIOS ---

interface LandingPageProps {
  onNavigateToOnboarding: () => void;
  onNavigateToLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToOnboarding, onNavigateToLogin }) => {

  return (
    <div className="bg-background min-h-screen text-text-primary">
      <header className="bg-surface/80 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <MontuLogoIcon className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-text-primary tracking-wider">Montu</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToLogin}
              className="bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Acceso Alumno
            </button>
            <button
              onClick={onNavigateToLogin}
              className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Acceso Entrenador
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* --- INICIO DE CAMBIOS: Sección Hero Rediseñada --- */}
        <section 
          className="relative text-center py-40 px-6 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2575&auto=format&fit=crop')` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10">
            <h2 className="text-5xl font-extrabold text-white mb-4">Eleva tu Coaching a un Nuevo Nivel</h2>
            <p className="text-xl text-slate-200 max-w-3xl mx-auto mb-8">
              La plataforma diseñada para que entrenadores como tú creen planes personalizados, gestionen clientes y sigan su progreso, todo desde un solo lugar.
            </p>
            <button
              onClick={onNavigateToOnboarding}
              className="bg-secondary hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
            >
              Comienza Ahora
            </button>
          </div>
        </section>
        {/* --- FIN DE CAMBIOS --- */}

        {/* --- INICIO DE CAMBIOS: Nueva Sección de Beneficios --- */}
        <section className="bg-surface py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-extrabold text-text-primary mb-4">La Herramienta Definitiva para Entrenadores</h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-16">
              Ahorra tiempo, mantén a tus clientes motivados y haz crecer tu negocio con una plataforma que lo tiene todo.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              
              {/* Beneficio 1: Crear Rutinas */}
              <div className="flex flex-col items-center">
                <ClipboardListIcon className="w-16 h-16 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-text-primary mb-2">Crea Rutinas en Minutos</h3>
                <p className="text-text-secondary">
                  Utiliza nuestro editor intuitivo y tu banco de ejercicios personal para diseñar planes de entrenamiento detallados. Personaliza series, repeticiones, peso y notas para cada cliente.
                </p>
              </div>

              {/* Beneficio 2: Gestionar Alumnos */}
              <div className="flex flex-col items-center">
                <UsersIcon className="w-16 h-16 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-text-primary mb-2">Gestiona Clientes sin Esfuerzo</h3>
                <p className="text-text-secondary">
                  Añade nuevos alumnos con solo su correo electrónico. Automáticamente recibirán acceso a su propio dashboard para ver las rutinas que les asignes, en cualquier momento y lugar.
                </p>
              </div>

              {/* Beneficio 3: Dashboard Central */}
              <div className="flex flex-col items-center">
                <BarChartIcon className="w-16 h-16 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-text-primary mb-2">Supervisa Todo desde un Vistazo</h3>
                <p className="text-text-secondary">
                  Tu dashboard de entrenador te da una visión completa de todos tus clientes. Accede a sus planes, supervisa quién está entrenando y mantén toda la información organizada.
                </p>
              </div>

            </div>
          </div>
        </section>
        {/* --- FIN DE CAMBIOS --- */}
        
      </main>

      <footer className="bg-surface py-6 border-t border-slate-200">
        <div className="container mx-auto px-6 text-center text-text-secondary">
          <p>&copy; {new Date().getFullYear()} Montu. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;