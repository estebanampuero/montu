// src/components/dashboard/ProfileView.tsx

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { User, ImagePlus, Save, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTrainer } from '../../context/TrainerContext';
import { Trainer } from '../../types';

export const ProfileView: React.FC = () => {
    // --- INICIO DE CAMBIOS ---
    const { currentUser } = useAuth();
    // Usamos useTrainer para la lógica de actualización
    const { updateTrainerProfile, isUpdatingProfile } = useTrainer();
    // --- FIN DE CAMBIOS ---
    
    const trainer = currentUser as Trainer;

    // Estados del formulario
    const [description, setDescription] = useState('');
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
    // --- INICIO DE CAMBIOS ---
    const [galleryImagesToDelete, setGalleryImagesToDelete] = useState<string[]>([]);
    // --- FIN DE CAMBIOS ---
    
    // Estados para previsualización de imágenes
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
    const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>([]);
    
    useEffect(() => {
        if (trainer) {
            setDescription(trainer.description || '');
            setProfileImagePreview(trainer.photoURL || null);
        }
    }, [trainer]);

    const handleProfileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImageFile(file);
            setProfileImagePreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const currentCount = (trainer.galleryImages?.length || 0) - galleryImagesToDelete.length;
            const newCount = files.length;
            if (currentCount + newCount > 5) {
                alert(`Puedes subir un máximo de 5 imágenes. Ya tienes ${currentCount}.`);
                return;
            }
            setGalleryImageFiles(files);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setGalleryImagePreviews(newPreviews);
        }
    };
    
    // --- INICIO DE CAMBIOS ---
    const handleDeleteGalleryImage = (imageUrl: string) => {
        if (window.confirm("¿Seguro que quieres eliminar esta imagen?")) {
            setGalleryImagesToDelete(prev => [...prev, imageUrl]);
        }
    };
    // --- FIN DE CAMBIOS ---

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await updateTrainerProfile({
                description,
                newProfileImage: profileImageFile,
                newGalleryImages: galleryImageFiles,
                galleryImagesToDelete: galleryImagesToDelete
            });
            // Resetea los estados de archivos después de subir
            setProfileImageFile(null);
            setGalleryImageFiles([]);
            setGalleryImagePreviews([]);
            setGalleryImagesToDelete([]);
        } catch (error) {
            console.error("Fallo el submit del perfil:", error);
        }
    };

    if (!trainer) return <div>Cargando perfil...</div>;

    // Filtra las imágenes que no han sido marcadas para eliminar
    const visibleGalleryImages = trainer.galleryImages?.filter(url => !galleryImagesToDelete.includes(url)) || [];

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <User className="w-8 h-8 mr-3 text-green-500" />
                Mi Perfil
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Sección Foto de Perfil */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Foto de Perfil</label>
                    <div className="flex items-center gap-4">
                        <img 
                            src={profileImagePreview || `https://ui-avatars.com/api/?name=${trainer.username}&background=random&color=fff`} 
                            alt="Vista previa del perfil" 
                            className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                        />
                        <label htmlFor="profile-upload" className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 transition duration-150 flex items-center gap-2">
                           <ImagePlus className="w-5 h-5" /> Cambiar foto
                        </label>
                        <input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
                    </div>
                </div>

                {/* Sección Descripción */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Descripción / Biografía
                    </label>
                    <textarea
                        id="description"
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        placeholder="Cuéntales a tus clientes sobre ti, tu experiencia y tu filosofía de entrenamiento."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>
                
                {/* Sección Galería de Fotos */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Galería de Fotos (Máx. 5)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                        {visibleGalleryImages.map((url, index) => (
                            <div key={index} className="relative group aspect-square">
                                <img src={url} alt={`Galería ${index + 1}`} className="w-full h-full object-cover rounded-lg shadow-sm" />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteGalleryImage(url)}
                                    className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-700 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Eliminar imagen"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {galleryImagePreviews.map((url, index) => (
                             <div key={`preview-${index}`} className="relative aspect-square">
                                <img src={url} alt={`Nueva ${index + 1}`} className="w-full h-full object-cover rounded-lg shadow-sm border-2 border-green-400" />
                            </div>
                        ))}
                    </div>
                     <label htmlFor="gallery-upload" className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 transition duration-150 flex items-center gap-2 w-fit">
                       <ImagePlus className="w-5 h-5" /> Añadir más fotos
                    </label>
                     <input id="gallery-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryImagesChange} />
                </div>

                {/* Botón de Guardar */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition duration-150 shadow-md disabled:bg-indigo-300 disabled:cursor-not-allowed"
                    >
                        <Save className="w-5 h-5" />
                        {isUpdatingProfile ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileView;