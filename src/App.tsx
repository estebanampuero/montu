// src/App.tsx

import React, { useState } from 'react';
// --- INICIO DE CAMBIOS ---
import { Toaster } from 'react-hot-toast';
// --- FIN DE CAMBIOS ---
import { AuthProvider, useAuth } from './context/AuthContext';
import { TrainerProvider } from './context/TrainerContext';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { TrainerDashboard } from './components/TrainerDashboard';
import { ClientView } from './components/ClientView';
import LandingPage from './components/LandingPage';
import OnboardingPage from './components/OnboardingPage';
import { ClientDashboard } from './components/client/ClientDashboard'; // Importamos el nuevo dashboard

const AppContent: React.FC = () => {
  const { currentUser, isAuthLoading } = useAuth();
  const [view, setView] = useState<'landing' | 'onboarding' | 'login'>('landing');

  if (isAuthLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }
  
  if (!currentUser) {
    switch (view) {
      case 'onboarding':
        return <OnboardingPage 
                  onNavigateToLogin={() => setView('login')} 
                  onNavigateToLanding={() => setView('landing')} 
                />;
      case 'login':
        return <LoginScreen 
                  onNavigateToLanding={() => setView('landing')} 
                />;
      case 'landing':
      default:
        return <LandingPage 
                  onNavigateToOnboarding={() => setView('onboarding')} 
                  onNavigateToLogin={() => setView('login')} 
                />;
    }
  }

  return (
    <div className="bg-background min-h-screen text-text-primary font-sans">
      <Header />
      <main>
        {currentUser.role === 'trainer' && (
          <TrainerProvider>
            <TrainerDashboard />
          </TrainerProvider>
        )}
        {currentUser.role === 'client' && <ClientDashboard />}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      {/* --- INICIO DE CAMBIOS --- */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#374151', // Un gris oscuro
            color: '#ffffff',
            borderRadius: '8px',
            fontSize: '16px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981', // Verde secundario
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444', // Rojo
              secondary: 'white',
            },
          },
        }}
      />
      {/* --- FIN DE CAMBIOS --- */}
      <AppContent />
    </AuthProvider>
  );
};

export default App;