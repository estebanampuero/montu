// src/components/client/TrainerProfileView.tsx

import React from 'react';
import { Trainer } from '../../types';

interface TrainerProfileViewProps {
    trainer: Trainer | null;
}

export const TrainerProfileView: React.FC<TrainerProfileViewProps> = ({ trainer }) => {
    if (!trainer) {
        return <div className="text-center p-8">Cargando perfil del entrenador...</div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Tu Entrenador</h2>
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-4 mb-6">
                    <img 
                        src={trainer.photoURL || `https://ui-avatars.com/api/?name=${trainer.username}&background=random&color=fff`} 
                        alt={trainer.username} 
                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                    />
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">{trainer.username}</h3>
                        <p className="text-gray-500">{trainer.email}</p>
                    </div>
                </div>

                {trainer.description && (
                    <div>
                        <h4 className="font-semibold text-lg text-gray-700 mb-2">Sobre mí</h4>
                        <p className="text-gray-600 whitespace-pre-wrap">{trainer.description}</p>
                    </div>
                )}

                {trainer.galleryImages && trainer.galleryImages.length > 0 && (
                    <div className="mt-6">
                        <h4 className="font-semibold text-lg text-gray-700 mb-2">Galería</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {trainer.galleryImages.map((url, index) => (
                                <div key={index} className="aspect-square">
                                    <img src={url} alt={`Galería ${index + 1}`} className="w-full h-full object-cover rounded-lg shadow-sm" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};