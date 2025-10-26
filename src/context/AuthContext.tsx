// src/context/AuthContext.tsx

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signOut as firebaseSignout } from 'firebase/auth';
import {
    doc, collection, onSnapshot, query, where,
    updateDoc, addDoc, getDocs, deleteDoc, setDoc, getDoc // Se añade getDoc
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth, db } from '../firebase/config';
// Se añade el tipo Trainer
import { User, Client, WorkoutPlan, Exercise, Trainer } from '../types'; 
import toast from 'react-hot-toast';

interface AuthContextType {
    currentUser: User | null;
    isAuthLoading: boolean;
    trainerClients: Client[];
    logout: () => Promise<void>;
    updateClientPlan: (clientId: string, plan: WorkoutPlan) => Promise<void>;
    addClient: (clientData: { username: string; email: string; }) => Promise<{ success: boolean; message: string; }>;
    removeClient: (clientId: string) => Promise<void>;
    updateClientExercise: (workoutId: string, exerciseIndex: number, updatedExercise: Exercise) => Promise<void>;
    // --- INICIO DE CAMBIOS ---
    getTrainerProfile: (trainerId: string) => Promise<Trainer | null>; // Se añade la nueva función al tipo
    // --- FIN DE CAMBIOS ---
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [trainerClients, setTrainerClients] = useState<Client[]>([]);
    const [isAuthLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        let unsubscribeUser: (() => void) | undefined = undefined;

        if (currentUser && currentUser.role === 'client') {
            const userDocRef = doc(db, 'users', currentUser.id);
            unsubscribeUser = onSnapshot(userDocRef, (doc) => {
                if (doc.exists()) {
                    setCurrentUser({ id: doc.id, ...doc.data() } as Client);
                }
            });
        }
    
        return () => {
            if (unsubscribeUser) {
                unsubscribeUser();
            }
        };
    }, [currentUser?.id]);

    const processUserLogin = async (firebaseUser: FirebaseUser) => {
        console.log("--- Inicio de processUserLogin ---");
        
        const actionString = localStorage.getItem('postLoginAction');
        if (actionString) {
            localStorage.removeItem('postLoginAction'); 
            const actionData = JSON.parse(actionString);

            if (actionData.action === 'subscribe') {
                console.log("Acción post-login detectada: 'subscribe'. Redirigiendo a pago...");
                
                const tempUser = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email!,
                    username: firebaseUser.displayName || 'Nuevo Entrenador',
                    photoURL: firebaseUser.photoURL,
                    role: 'trainer',
                    subscriptionStatus: 'pending'
                } as User;
                
                setCurrentUser(tempUser);

                try {
                    const functions = getFunctions();
                    const createSubscriptionCallable = httpsCallable(functions, 'createSubscription');
                    const result = await createSubscriptionCallable({ 
                        userId: tempUser.id, 
                        userEmail: tempUser.email,
                        userName: tempUser.username,
                    });
                    const data = result.data as { checkoutUrl?: string; error?: string };

                    if (data.checkoutUrl) {
                        window.location.href = data.checkoutUrl;
                    } else {
                        throw new Error(data.error || "No se recibió la URL de pago.");
                    }
                } catch (error) {
                    console.error("Error al iniciar el proceso de suscripción post-login:", error);
                    toast.error("Hubo un error al conectar con el sistema de pago.");
                    await firebaseSignout(auth);
                }
                return;
            }
        }

        console.log("Flujo de login normal (no es suscripción).");
        try {
            const q = query(collection(db, "users"), where("email", "==", firebaseUser.email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                toast.error("Tu cuenta no está registrada. Contacta a tu entrenador.");
                await firebaseSignout(auth);
                return;
            }

            const userDoc = querySnapshot.docs[0];
            const manualData = userDoc.data();
            let userProfileRef = doc(db, 'users', userDoc.id);

            const profileDataForDB = {
                email: firebaseUser.email,
                username: firebaseUser.displayName || manualData.username || 'Usuario',
                photoURL: firebaseUser.photoURL || null,
                ...(manualData.role && { role: manualData.role }),
                ...(manualData.subscriptionStatus && { subscriptionStatus: manualData.subscriptionStatus }),
                ...(manualData.trainerId && { trainerId: manualData.trainerId }),
            };

            if (userDoc.id !== firebaseUser.uid) {
                console.warn("ADVERTENCIA: Iniciando MIGRACIÓN de ID.");
                
                const newUserRef = doc(db, 'users', firebaseUser.uid);
                await setDoc(newUserRef, profileDataForDB);
                await deleteDoc(userDoc.ref);

                userProfileRef = newUserRef;
                console.log("MIGRACIÓN COMPLETA.");
            } else {
                console.log("OK: IDs Coinciden. Actualizando documento.");
                await updateDoc(userProfileRef, profileDataForDB);
            }
            
            setCurrentUser({ id: userProfileRef.id, ...profileDataForDB } as User);
            console.log("SUCCESS: Usuario establecido en el contexto.");

        } catch (error: any) {
            console.error("Error al procesar el inicio de sesión:", error.message || error);
            toast.error(`Error de autenticación/DB. Se cerró la sesión. Detalle: ${error.code || 'permission-denied'}`);
            await firebaseSignout(auth);
        }
    };
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                if (!currentUser) { 
                    await processUserLogin(user);
                }
            } else {
                setCurrentUser(null);
            }
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);
    
    useEffect(() => {
        if (currentUser && currentUser.role === 'trainer') {
            const clientsQuery = query(collection(db, 'users'), where('trainerId', '==', currentUser.id));
            const unsubscribeClients = onSnapshot(clientsQuery, (snapshot) => {
                const clientsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
                setTrainerClients(clientsData);
            });
            return () => unsubscribeClients();
        } else {
            setTrainerClients([]);
        }
    }, [currentUser]);

    const logout = async () => {
        await firebaseSignout(auth);
    };

    const updateClientPlan = async (clientId: string, plan: WorkoutPlan) => {
        const clientDocRef = doc(db, 'users', clientId);
        await updateDoc(clientDocRef, { plan });
    };

    const addClient = async (clientData: { username: string; email: string; }) => {
        if (!currentUser || currentUser.role !== 'trainer') {
            return { success: false, message: "No tienes permiso para realizar esta acción." };
        }
        const q = query(collection(db, "users"), where("email", "==", clientData.email));
        const existingUser = await getDocs(q);
        if (!existingUser.empty) {
            return { success: false, message: "Un usuario con este email ya existe." };
        }
        await addDoc(collection(db, "users"), { ...clientData, role: 'client', trainerId: currentUser.id });
        return { success: true, message: "Cliente añadido con éxito." };
    };

    const removeClient = async (clientId: string) => {
        await deleteDoc(doc(db, "users", clientId));
    };
    
    const updateClientExercise = async (workoutId: string, exerciseIndex: number, updatedExercise: Exercise) => {
        if (!currentUser || currentUser.role !== 'client' || !(currentUser as Client).plan) {
            console.error("Acción no permitida o el plan no existe.");
            return;
        }

        const client = currentUser as Client;
        const userDocRef = doc(db, 'users', client.id);
        const newPlan = JSON.parse(JSON.stringify(client.plan));
        const workoutIndex = newPlan.workouts.findIndex((w: { id: string; }) => w.id === workoutId);
        
        if (workoutIndex === -1) {
            console.error("Workout no encontrado");
            return;
        }

        newPlan.workouts[workoutIndex].exercises[exerciseIndex] = updatedExercise;

        try {
            await updateDoc(userDocRef, { plan: newPlan });
        } catch (error) {
            console.error("Error al actualizar el ejercicio:", error);
        }
    };
    
    // --- INICIO DE CAMBIOS: Nueva función para obtener el perfil del entrenador ---
    const getTrainerProfile = async (trainerId: string): Promise<Trainer | null> => {
        try {
            const trainerDocRef = doc(db, 'users', trainerId);
            const trainerDoc = await getDoc(trainerDocRef);
            if (trainerDoc.exists()) {
                return { id: trainerDoc.id, ...trainerDoc.data() } as Trainer;
            }
            console.log("No se encontró el entrenador con ID:", trainerId);
            return null;
        } catch (error) {
            console.error("Error al obtener el perfil del entrenador:", error);
            return null;
        }
    };
    // --- FIN DE CAMBIOS ---

    const value = { currentUser, isAuthLoading, trainerClients, logout, updateClientPlan, addClient, removeClient, updateClientExercise, getTrainerProfile };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};