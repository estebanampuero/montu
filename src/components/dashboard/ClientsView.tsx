// src/components/dashboard/ClientsView.tsx

import React, { useState, FormEvent, useEffect } from 'react'; // Importamos useEffect
import { Users, PlusIcon, TrashIcon, X } from 'lucide-react';
import { useTrainer } from '../../context/TrainerContext';
import { Client } from '../../types';
import { PlanEditorModal } from './clients/PlanEditorModal';
import toast from 'react-hot-toast';


interface AddClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (name: string, email: string) => Promise<void>;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) {
            toast.error("Por favor, completa todos los campos.");
            return;
        }
        setIsAdding(true);
        try {
            await onAdd(name, email);
            onClose(); 
            setName('');
            setEmail('');
        } catch (error) {
           // El toast de error se mostrará desde el contexto
        } finally {
            setIsAdding(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">Añadir Nuevo Cliente</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="client-name" className="block text-sm font-medium text-gray-700">Nombre del Cliente</label>
                            <input type="text" id="client-name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2" />
                        </div>
                        <div>
                            <label htmlFor="client-email" className="block text-sm font-medium text-gray-700">Email del Cliente</label>
                            <input type="email" id="client-email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2" />
                            <p className="text-xs text-gray-500 mt-1">El cliente usará esta cuenta de Google para iniciar sesión.</p>
                        </div>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isAdding} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300">
                            {isAdding ? "Añadiendo..." : "Añadir Cliente"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


interface ClientDetailViewProps {
    client: Client | null;
    onOpenPlanEditor: () => void;
}

const ClientDetailView: React.FC<ClientDetailViewProps> = ({ client, onOpenPlanEditor }) => {
    if (!client) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                <p>Selecciona un cliente para ver sus detalles</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
                <img src={client.photoURL || `https://ui-avatars.com/api/?name=${client.username}&background=random`} alt={client.username} className="w-20 h-20 rounded-full object-cover" />
                <div>
                    <h3 className="text-3xl font-bold text-gray-800">{client.username}</h3>
                    <p className="text-gray-500">{client.email}</p>
                </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg text-gray-700 mb-2">Plan de Entrenamiento</h4>
                {client.plan && client.plan.workouts.length > 0 ? (
                    <div className="space-y-2">
                        <p className="text-gray-600">Este cliente tiene un plan con {client.plan.workouts.length} día(s).</p>
                        <ul className="list-disc list-inside text-gray-500">
                            {client.plan.workouts.map(w => <li key={w.id}>{w.day}</li>)}
                        </ul>
                    </div>
                ) : (
                    <p className="text-gray-600">Este cliente aún no tiene un plan de entrenamiento asignado.</p>
                )}
                <button onClick={onOpenPlanEditor} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                    {client.plan ? "Editar Plan" : "Crear Plan"}
                </button>
            </div>
        </div>
    );
};


export const ClientsView: React.FC = () => {
    const { trainerClients, isLoadingClients, addClient, removeClient } = useTrainer();
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isPlanEditorOpen, setPlanEditorOpen] = useState(false);

    // --- INICIO DE LA SOLUCIÓN ---
    // Este efecto sincroniza el cliente seleccionado con la lista maestra de clientes.
    // Se ejecuta cada vez que la lista 'trainerClients' cambia (por ejemplo, después de guardar un plan).
    useEffect(() => {
        if (selectedClient?.id) {
            // Buscamos la versión más actualizada del cliente en la lista del contexto.
            const updatedClient = trainerClients.find(client => client.id === selectedClient.id);
            if (updatedClient) {
                // Actualizamos el estado local con el cliente que ya incluye el nuevo plan.
                setSelectedClient(updatedClient);
            }
        }
    }, [trainerClients, selectedClient?.id]);
    // --- FIN DE LA SOLUCIÓN ---

    const handleAddClient = async (username: string, email: string) => {
        await addClient({ username, email });
    };
    
    const handleRemoveClient = (e: React.MouseEvent, clientId: string) => {
        e.stopPropagation();
        if (window.confirm("¿Estás seguro de que quieres eliminar a este cliente? Esta acción es irreversible.")) {
            removeClient(clientId);
            if (selectedClient?.id === clientId) {
                setSelectedClient(null);
            }
        }
    };
    
    return (
        <>
            <AddClientModal 
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                onAdd={handleAddClient}
            />
            {selectedClient && (
                <PlanEditorModal
                    isOpen={isPlanEditorOpen}
                    onClose={() => setPlanEditorOpen(false)}
                    client={selectedClient}
                />
            )}

            <div className="flex flex-col md:flex-row h-full max-h-[calc(100vh-160px)] bg-white rounded-lg shadow-md overflow-hidden">
                <aside className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center"><Users className="w-5 h-5 mr-2" /> Clientes</h2>
                        <button onClick={() => setAddModalOpen(true)} className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700" title="Añadir nuevo cliente">
                            <PlusIcon className="w-5 h-5" />
                        </button>
                    </div>
                    {isLoadingClients ? (
                        <p className="p-4 text-center text-gray-500">Cargando clientes...</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {trainerClients.map(client => (
                                <li key={client.id} onClick={() => setSelectedClient(client)} className={`p-3 flex justify-between items-center cursor-pointer ${selectedClient?.id === client.id ? 'bg-indigo-100' : 'hover:bg-gray-50'}`}>
                                    <div className="flex items-center gap-3">
                                        <img src={client.photoURL || `https://ui-avatars.com/api/?name=${client.username}&background=random`} alt={client.username} className="w-10 h-10 rounded-full object-cover" />
                                        <div>
                                            <p className="font-semibold text-gray-800">{client.username}</p>
                                            <p className="text-xs text-gray-500">{client.email}</p>
                                        </div>
                                    </div>
                                    <button onClick={(e) => handleRemoveClient(e, client.id)} className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600" title="Eliminar cliente">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </aside>
                
                <main className="flex-1 overflow-y-auto">
                    <ClientDetailView 
                        client={selectedClient} 
                        onOpenPlanEditor={() => setPlanEditorOpen(true)}
                    />
                </main>
            </div>
        </>
    );
};

export default ClientsView;