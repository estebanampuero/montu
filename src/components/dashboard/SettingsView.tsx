// src/components/dashboard/SettingsView.tsx

import React from 'react';
import { Settings, User, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Trainer } from '../../types';

export const SettingsView: React.FC = () => {
  const { currentUser } = useAuth();
  const trainer = currentUser as Trainer;

  // URL para que el cliente gestione su suscripción en Mercado Pago
  // NOTA: Esta es una URL genérica. Mercado Pago no ofrece un portal de cliente directo
  // a través de la API estándar de Checkout Pro para gestionar suscripciones.
  // Esta sección se podría mejorar si se usa la API de Suscripciones de MP.
  const subscriptionManagementUrl = "https://www.mercadopago.com/subscriptions";

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <Settings className="w-8 h-8 mr-3 text-gray-500" />
        Configuración
      </h2>

      <div className="space-y-8">
        {/* Sección de Cuenta */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-indigo-500" />
            Cuenta
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Nombre de Usuario</p>
              <p className="text-gray-800">{trainer.username}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-gray-800">{trainer.email}</p>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              El nombre y el email se gestionan a través de tu cuenta de Google.
            </p>
          </div>
        </div>

        {/* Sección de Suscripción */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-green-500" />
            Suscripción
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Estado de la Suscripción</p>
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                trainer.subscriptionStatus === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {trainer.subscriptionStatus ? trainer.subscriptionStatus.charAt(0).toUpperCase() + trainer.subscriptionStatus.slice(1) : 'Desconocido'}
              </span>
            </div>
            <div className="pt-2">
                <a 
                  href={subscriptionManagementUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
                >
                  Gestionar en Mercado Pago
                </a>
            </div>
             <p className="text-xs text-gray-400 mt-2">
              Serás redirigido a Mercado Pago para ver los detalles de tu suscripción y métodos de pago.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsView;