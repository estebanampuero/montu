// src/components/LoginScreen.tsx

import React, { useState } from 'react';
import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    setPersistence, 
    browserLocalPersistence 
} from 'firebase/auth'; 
import { auth } from '../firebase/config';
import { MontuLogoIcon } from './icons';

interface LoginScreenProps {
    onNavigateToLanding: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigateToLanding }) => {
    const [isLoading, setIsLoading] = useState(false);
    
    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        const provider = new GoogleAuthProvider();
        
        // --- INICIO DE LA SOLUCIÓN ---
        // Esta línea le dice a Google que SIEMPRE muestre la pantalla 
        // para que el usuario elija con qué cuenta quiere iniciar sesión.
        provider.setCustomParameters({ prompt: 'select_account' });
        // --- FIN DE LA SOLUCIÓN ---

        try {
            await setPersistence(auth, browserLocalPersistence); 
            console.log("Persistencia establecida a LOCAL.");

            const result = await signInWithPopup(auth, provider);
            
            console.log(`Login exitoso con Popup. Usuario: ${result.user.email}`);

        } catch (err: any) {
            console.error("Error al iniciar sesión con POPUP:", err);
            const errorMessage = err.message || "Error desconocido en el Popup.";
            alert(`❌ ERROR CRÍTICO DE AUTENTICACIÓN ❌\nDetalle: ${errorMessage}\n\nSi este error persiste, revisa las restricciones de la API Key en Google Cloud Console.`);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="bg-surface p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200 text-center">
                <div className="flex flex-col items-center mb-6">
                    <MontuLogoIcon className="w-16 h-16 text-primary mb-4" />
                    <h1 className="text-3xl font-bold text-text-primary">Montu</h1>
                    <p className="text-text-secondary mt-1">Accede con tu cuenta de Google</p>
                </div>
                
                <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-text-primary font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors hover:bg-slate-50 disabled:opacity-50"
                >
                    <svg className="w-6 h-6" viewBox="0 0 48 48">
                        <path fill="#4285F4" d="M24 9.5c3.2 0 6.1 1.1 8.4 3.2l6.5-6.5C34.6 2.3 29.6 0 24 0 14.9 0 7.3 5.4 3 13.2l7.7 6C12.5 13.4 17.8 9.5 24 9.5z"></path>
                        <path fill="#34A853" d="M46.2 25.4c0-1.7-.2-3.4-.5-5H24v9.5h12.5c-.5 3.1-2.2 5.7-4.8 7.5l7.3 5.7c4.3-4 6.7-9.8 6.7-16.7z"></path>
                        <path fill="#FBBC05" d="M10.7 28.2c-.4-1.2-.6-2.5-.6-3.8s.2-2.6.6-3.8l-7.7-6C1.1 18.2 0 21 0 24.4c0 3.4 1.1 6.3 3 8.8l7.7-5z"></path>
                        <path fill="#EA4335" d="M24 48c5.6 0 10.5-1.9 14-5.1l-7.3-5.7c-1.9 1.3-4.3 2-6.7 2-6.2 0-11.5-3.9-13.3-9.3l-7.7 6C7.3 42.6 14.9 48 24 48z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                    {isLoading ? 'Conectando...' : 'Ingresar con Google'}
                </button>

                <div className="text-center mt-6">
                    <button onClick={onNavigateToLanding} className="text-sm text-text-secondary hover:text-primary transition-colors">
                       « Volver al inicio
                    </button>
                </div>
            </div>
        </div>
    );
};