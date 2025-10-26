// src/context/TrainerContext.tsx

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Client, MasterExercise, WorkoutPlan, Trainer } from '../types';
import { db, storage } from '../firebase/config';
import { 
    collection, query, where, onSnapshot, addDoc, 
    deleteDoc, doc, getDocs, updateDoc, Timestamp, arrayRemove, arrayUnion
} from 'firebase/firestore';
import { 
    ref, uploadBytes, getDownloadURL, deleteObject 
} from 'firebase/storage';
// --- INICIO DE CAMBIOS ---
import toast from 'react-hot-toast';
// --- FIN DE CAMBIOS ---


interface TrainerContextType {
    trainerClients: Client[];
    isLoadingClients: boolean;
    masterExercises: MasterExercise[];
    isLoadingExercises: boolean;
    addClient: (clientData: { username: string; email: string; }) => Promise<void>;
    removeClient: (clientId: string) => Promise<void>;
    updateClientPlan: (clientId: string, plan: WorkoutPlan) => Promise<void>;
    addMasterExercise: (exerciseData: Omit<MasterExercise, 'id' | 'trainerId'>) => Promise<void>;
    updateMasterExercise: (exerciseId: string, exerciseData: Partial<Omit<MasterExercise, 'id' | 'trainerId'>>) => Promise<void>;
    deleteMasterExercise: (exerciseId: string) => Promise<void>;
    updateTrainerProfile: (data: {
        description?: string;
        newProfileImage?: File | null;
        newGalleryImages?: File[];
        galleryImagesToDelete?: string[];
    }) => Promise<void>;
    isUpdatingProfile: boolean;
}

const TrainerContext = createContext<TrainerContextType | undefined>(undefined);

export const TrainerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { currentUser } = useAuth();
    const [trainerClients, setTrainerClients] = useState<Client[]>([]);
    const [isLoadingClients, setLoadingClients] = useState(true);
    const [masterExercises, setMasterExercises] = useState<MasterExercise[]>([]);
    const [isLoadingExercises, setLoadingExercises] = useState(true);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    useEffect(() => {
        if (currentUser && currentUser.role === 'trainer') {
            const clientsQuery = query(collection(db, 'users'), where('trainerId', '==', currentUser.id));
            const unsubscribe = onSnapshot(clientsQuery, (snapshot) => {
                const clientsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
                setTrainerClients(clientsData);
                setLoadingClients(false);
            }, (error) => { setLoadingClients(false); });
            return () => unsubscribe();
        } else {
            setTrainerClients([]);
            setLoadingClients(false);
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser && currentUser.role === 'trainer') {
            setLoadingExercises(true);
            const exercisesQuery = query(collection(db, 'exercises'), where('trainerId', '==', currentUser.id));
            const unsubscribe = onSnapshot(exercisesQuery, (snapshot) => {
                const exercisesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MasterExercise));
                setMasterExercises(exercisesData);
                setLoadingExercises(false);
            }, (error) => { setLoadingExercises(false); });
            return () => unsubscribe();
        } else {
            setMasterExercises([]);
            setLoadingExercises(false);
        }
    }, [currentUser]);

    // --- INICIO DE CAMBIOS: Refactorización de todas las funciones ---

    const addClient = async (clientData: { username: string; email: string; }) => {
        if (!currentUser || currentUser.role !== 'trainer') {
            throw new Error("No tienes permiso para realizar esta acción.");
        }
        
        const promise = async () => {
            const q = query(collection(db, "users"), where("email", "==", clientData.email.trim()));
            const existingUser = await getDocs(q);
            if (!existingUser.empty) {
                throw new Error("Un usuario con este email ya existe.");
            }
            await addDoc(collection(db, "users"), { ...clientData, role: 'client', trainerId: currentUser.id });
        };

        await toast.promise(promise(), {
            loading: 'Añadiendo cliente...',
            success: 'Cliente añadido con éxito.',
            error: (err) => err.message || 'No se pudo añadir al cliente.',
        });
    };

    const removeClient = async (clientId: string) => {
        const promise = deleteDoc(doc(db, "users", clientId));
        await toast.promise(promise, {
            loading: 'Eliminando cliente...',
            success: 'Cliente eliminado correctamente.',
            error: 'No se pudo eliminar al cliente.',
        });
    };
    
    const updateClientPlan = async (clientId: string, plan: WorkoutPlan) => {
        if (!currentUser || currentUser.role !== 'trainer') {
            throw new Error("No tienes permiso para realizar esta acción.");
        }
        const planToSave: WorkoutPlan = {
            ...plan,
            createdAt: plan.createdAt || Timestamp.now(), 
            updatedAt: Timestamp.now(),
        };

        const promise = updateDoc(doc(db, 'users', clientId), { plan: planToSave });

        await toast.promise(promise, {
            loading: 'Guardando el plan...',
            success: 'Plan guardado con éxito.',
            error: 'Error al guardar el plan.',
        });
    };
    
    const addMasterExercise = async (exerciseData: Omit<MasterExercise, 'id' | 'trainerId'>) => {
        if (!currentUser) throw new Error("Acción no permitida");
        const promise = addDoc(collection(db, "exercises"), { ...exerciseData, trainerId: currentUser.id });

        await toast.promise(promise, {
            loading: 'Creando ejercicio...',
            success: 'Ejercicio creado con éxito.',
            error: 'No se pudo crear el ejercicio.',
        });
    };

    const updateMasterExercise = async (exerciseId: string, exerciseData: Partial<Omit<MasterExercise, 'id' | 'trainerId'>>) => {
        const promise = updateDoc(doc(db, 'exercises', exerciseId), exerciseData);

        await toast.promise(promise, {
            loading: 'Actualizando ejercicio...',
            success: 'Ejercicio actualizado correctamente.',
            error: 'Error al actualizar el ejercicio.',
        });
    };

    const deleteMasterExercise = async (exerciseId: string) => {
        const promise = deleteDoc(doc(db, "exercises", exerciseId));
        await toast.promise(promise, {
            loading: 'Eliminando ejercicio...',
            success: 'Ejercicio eliminado de tu banco.',
            error: 'No se pudo eliminar el ejercicio.',
        });
    };

    const updateTrainerProfile = async (data: {
        description?: string;
        newProfileImage?: File | null;
        newGalleryImages?: File[];
        galleryImagesToDelete?: string[];
    }) => {
        if (!currentUser || currentUser.role !== 'trainer') {
            throw new Error("Usuario no autenticado o sin permisos.");
        }
        
        const promise = async () => {
            setIsUpdatingProfile(true);
            const trainer = currentUser as Trainer;
            const userDocRef = doc(db, 'users', trainer.id);
            const dataToUpdate: { [key: string]: any } = {};

            if (data.description !== undefined) { dataToUpdate.description = data.description; }

            if (data.newProfileImage) {
                // --- INICIO DE LA CORRECCIÓN ---
                // Solo intentar borrar si la URL antigua es una URL de Firebase Storage
                if (trainer.photoURL && trainer.photoURL.includes('firebasestorage.googleapis.com')) {
                    try { 
                        await deleteObject(ref(storage, trainer.photoURL)); 
                    } catch (e) { 
                        console.warn("No se pudo borrar la imagen antigua, pero continuamos:", e); 
                    }
                }
                // --- FIN DE LA CORRECCIÓN ---

                const imageRef = ref(storage, `profile_images/${trainer.id}/${Date.now()}_${data.newProfileImage.name}`);
                await uploadBytes(imageRef, data.newProfileImage);
                dataToUpdate.photoURL = await getDownloadURL(imageRef);
            }

            if (data.galleryImagesToDelete && data.galleryImagesToDelete.length > 0) {
                // --- INICIO DE LA CORRECCIÓN ---
                const imagesToDeleteFromStorage: string[] = [];
                const imagesToKeepInFirestore: string[] = [];

                // Separamos las URLs que son de Firebase de las que no lo son
                trainer.galleryImages?.forEach(url => {
                    if (data.galleryImagesToDelete?.includes(url) && url.includes('firebasestorage.googleapis.com')) {
                        imagesToDeleteFromStorage.push(url);
                    } else {
                        imagesToKeepInFirestore.push(url);
                    }
                });
                
                // Actualizamos Firestore para que solo contenga las imágenes que no se borraron
                dataToUpdate.galleryImages = imagesToKeepInFirestore;

                // Borramos de Storage solo las que corresponden
                imagesToDeleteFromStorage.forEach(url => { 
                    try { 
                        deleteObject(ref(storage, url)); 
                    } catch (e) { 
                        console.warn("No se pudo borrar imagen de galería, pero continuamos:", e); 
                    }
                });
                // --- FIN DE LA CORRECCIÓN ---
            }

            if (Object.keys(dataToUpdate).length > 0) { await updateDoc(userDocRef, dataToUpdate); }

            if (data.newGalleryImages && data.newGalleryImages.length > 0) {
                const newImageUrls = await Promise.all(
                    data.newGalleryImages.map(async (file) => {
                        const imageRef = ref(storage, `gallery_images/${trainer.id}/${Date.now()}_${file.name}`);
                        await uploadBytes(imageRef, file);
                        return getDownloadURL(imageRef);
                    })
                );
                await updateDoc(userDocRef, { galleryImages: arrayUnion(...newImageUrls) });
            }
        };

        await toast.promise(promise(), {
            loading: 'Guardando cambios del perfil...',
            success: 'Perfil actualizado con éxito.',
            error: 'Hubo un error al guardar los cambios.',
        }).finally(() => {
            setIsUpdatingProfile(false);
        });
    };
    // --- FIN DE CAMBIOS ---

    const value = { 
        trainerClients, 
        isLoadingClients,
        masterExercises,
        isLoadingExercises,
        addClient,
        removeClient,
        updateClientPlan,
        addMasterExercise,
        updateMasterExercise,
        deleteMasterExercise,
        updateTrainerProfile,
        isUpdatingProfile
    };

    return <TrainerContext.Provider value={value}>{children}</TrainerContext.Provider>;
};

export const useTrainer = () => {
    const context = useContext(TrainerContext);
    if (context === undefined) {
        throw new Error('useTrainer debe ser usado dentro de un TrainerProvider');
    }
    return context;
};