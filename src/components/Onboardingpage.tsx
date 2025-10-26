// src/components/OnboardingPage.tsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { CreditCardIcon } from './icons'; // Asegúrate de que los iconos están bien importados

interface OnboardingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToLanding: () => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onNavigateToLogin, onNavigateToLanding }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();

  const handlePaymentClick = async () => {
    setIsLoading(true);
    
    // Si el usuario ya está logueado, va directo al pago
    if (currentUser) {
      try {
        const functions = getFunctions();
        const createSubscriptionCallable = httpsCallable(functions, 'createSubscription');
        const result = await createSubscriptionCallable({ 
          userId: currentUser.id, 
          userEmail: currentUser.email,
          userName: currentUser.username,
        });
        const data = result.data as { checkoutUrl?: string; error?: string };

        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          throw new Error(data.error || "No se recibió la URL de pago.");
        }
      } catch (error) {
        console.error("Error al iniciar el proceso de pago:", error);
        alert("Hubo un error al conectar con Mercado Pago. Por favor, inténtalo de nuevo.");
        setIsLoading(false);
      }
    } else {
      // --- CAMBIO CLAVE ---
      // Si el usuario NO está logueado, guardamos la intención y lo mandamos al login.
      console.log("Usuario no logueado. Guardando intención de suscribirse y redirigiendo a login.");
      localStorage.setItem('postLoginAction', JSON.stringify({ action: 'subscribe' }));
      onNavigateToLogin();
      // No necesitamos poner setIsLoading(false) porque la página va a cambiar.
    }
  };

  return (
    <div className="bg-background min-h-screen text-text-primary font-sans p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      {/* ... El resto del JSX de tu OnboardingPage se mantiene igual ... */}
       <div className="mt-auto pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={handlePaymentClick}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-secondary hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg text-base transition-transform transform hover:scale-105 disabled:bg-emerald-300"
          >
            <CreditCardIcon className="w-5 h-5" />
            <span>{isLoading ? '...' : <>Adquirir Plan<br />20 usd/mes</>}</span>
          </button>
          <button 
            onClick={onNavigateToLogin}
            className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-base transition-transform transform hover:scale-105"
          >
            Acceso Entrenador
          </button>
        </div>
    </div>
  );
};

export default OnboardingPage;