// src/components/dashboard/ProgramsView.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Zap, PlusIcon, Edit, Trash2, X, ChevronDown, Video } from 'lucide-react';
import { useTrainer } from '../../context/TrainerContext';
import { MasterExercise } from '../../types';
// --- INICIO DE LA CORRECCIÓN ---
// La ruta ahora es ../../data/exerciseDatabase para subir dos niveles correctamente.
import { exerciseDatabase, ExerciseInfo } from '../../data/exerciseDatabase';
// --- FIN DE LA CORRECCIÓN ---

// Listas de opciones que usaremos en los dropdowns
const exerciseTypes = [
    'Fuerza base',
    'Fuerza posterior de piernas',
    'Potencia',
    'Cadera',
    'Piernas',
    'Estabilidad',
    'Potencia coordinación',
    'Empuje superior',
    'Tracción superior',
    'Fuerza isométrica',
    'Potencia cuerpo completo',
    'Control',
    'Movilidad',
    'Piernas equilibrio',
    'Potencia explosividad',
    'Movilidad lateral',
    'Core rotación'
];

const muscleGroupsList = [
    "Pecho", "Espalda", "Hombros", "Bíceps", "Tríceps", "Antebrazos", "Trapecios",
    "Dorsales", "Core", "Abdominales", "Oblicuos", "Glúteos", "Cuádriceps",
    "Isquiotibiales", "Aductores", "Abductores", "Pantorrillas", "Tibiales"
];

// --- NUEVO COMPONENTE: Input de búsqueda de ejercicios con autocompletado ---
interface ExerciseSearchInputProps {
    value: string;
    onChange: (value: string) => void;
}

const ExerciseSearchInput: React.FC<ExerciseSearchInputProps> = ({ value, onChange }) => {
    const [suggestions, setSuggestions] = useState<ExerciseInfo[]>([]);
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        onChange(query);
        if (query.length > 1) {
            const filtered = exerciseDatabase.filter(ex =>
                ex.name_es.toLowerCase().includes(query.toLowerCase()) ||
                ex.name_en.toLowerCase().includes(query.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 5)); // Limitar a 5 sugerencias
            setIsSuggestionsOpen(true);
        } else {
            setIsSuggestionsOpen(false);
        }
    };

    const handleSuggestionClick = (exercise: ExerciseInfo) => {
        onChange(exercise.name_es); // Usamos el nombre en español por defecto
        setIsSuggestionsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSuggestionsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchRef]);

    return (
        <div className="relative" ref={searchRef}>
            <label htmlFor="ex-name" className="block text-sm font-medium text-gray-700">Nombre del Ejercicio</label>
            <input
                type="text"
                id="ex-name"
                value={value}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm"
                autoComplete="off"
            />
            {isSuggestionsOpen && suggestions.length > 0 && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map(suggestion => (
                        <div
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                            <p className="text-sm font-medium text-gray-800">{suggestion.name_es}</p>
                            <p className="text-xs text-gray-500">{suggestion.name_en}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Componente reutilizable para dropdowns de selección múltiple.
interface MultiSelectDropdownProps {
    label: string;
    options: string[];
    selectedOptions: string[];
    onChange: (selected: string[]) => void;
    placeholder: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ label, options, selectedOptions, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggleOption = (option: string) => {
        const newSelection = selectedOptions.includes(option)
            ? selectedOptions.filter(item => item !== option)
            : [...selectedOptions, option];
        onChange(newSelection);
    };

    // Hook para cerrar el dropdown si se hace clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="mt-1 flex justify-between items-center w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm text-left"
            >
                <span className="text-gray-700">
                    {selectedOptions.length > 0 ? `${selectedOptions.length} seleccionados` : placeholder}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {options.map(option => (
                        <div key={option} className="flex items-center p-2 hover:bg-gray-100">
                            <input
                                id={`multiselect-${label}-${option}`}
                                type="checkbox"
                                checked={selectedOptions.includes(option)}
                                onChange={() => handleToggleOption(option)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor={`multiselect-${label}-${option}`} className="ml-2 text-sm text-gray-700 flex-1 cursor-pointer">
                                {option}
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

interface ExerciseEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    exercise?: MasterExercise | null;
}

const ExerciseEditorModal: React.FC<ExerciseEditorModalProps> = ({ isOpen, onClose, exercise }) => {
    const { addMasterExercise, updateMasterExercise } = useTrainer();
    const [name, setName] = useState(exercise?.name || '');
    const [muscleGroups, setMuscleGroups] = useState<string[]>(Array.isArray(exercise?.muscleGroup) ? exercise.muscleGroup : []);
    const [types, setTypes] = useState<string[]>(Array.isArray(exercise?.type) ? exercise.type : []);
    const [videoUrl, setVideoUrl] = useState(exercise?.videoUrl || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const dataToSave = { name, muscleGroup: muscleGroups, type: types, videoUrl };
            if (exercise) {
                await updateMasterExercise(exercise.id, dataToSave);
            } else {
                await addMasterExercise(dataToSave);
            }
            onClose();
        } catch (error) {
            console.error("Error guardando ejercicio:", error);
            alert("No se pudo guardar el ejercicio.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
                <div className="p-6 border-b flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">{exercise ? 'Editar Ejercicio' : 'Crear Nuevo Ejercicio'}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><X className="w-5 h-5 text-gray-500" /></button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
                    <div className="p-6 space-y-4 overflow-y-auto">
                        <ExerciseSearchInput value={name} onChange={setName} />
                        <MultiSelectDropdown
                            label="Grupo Muscular"
                            options={muscleGroupsList}
                            selectedOptions={muscleGroups}
                            onChange={setMuscleGroups}
                            placeholder="Seleccionar grupos musculares"
                        />
                        <MultiSelectDropdown
                            label="Tipo de Ejercicio"
                            options={exerciseTypes}
                            selectedOptions={types}
                            onChange={setTypes}
                            placeholder="Seleccionar tipos de ejercicio"
                        />
                        <div>
                            <label htmlFor="ex-video" className="block text-sm font-medium text-gray-700">URL del Video (YouTube, etc.)</label>
                            <input type="url" id="ex-video" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm" />
                        </div>
                    </div>
                    <div className="p-6 bg-gray-50 flex justify-end gap-3 border-t">
                        <button type="button" onClick={onClose} className="py-2 px-4 border rounded-md text-sm font-medium">Cancelar</button>
                        <button type="submit" disabled={isSaving} className="py-2 px-4 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300">
                            {isSaving ? 'Guardando...' : 'Guardar Ejercicio'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const ProgramsView: React.FC = () => {
    const { masterExercises, isLoadingExercises, deleteMasterExercise } = useTrainer();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingExercise, setEditingExercise] = useState<MasterExercise | null>(null);

    const handleOpenCreate = () => {
        setEditingExercise(null);
        setModalOpen(true);
    };

    const handleOpenEdit = (exercise: MasterExercise) => {
        setEditingExercise(exercise);
        setModalOpen(true);
    };

    const handleDelete = async (exerciseId: string) => {
        if (window.confirm("¿Seguro que quieres eliminar este ejercicio de tu banco?")) {
            try {
                await deleteMasterExercise(exerciseId);
            } catch (error) {
                alert("No se pudo eliminar el ejercicio.");
            }
        }
    };

    return (
        <>
            {isModalOpen && (
                <ExerciseEditorModal 
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    exercise={editingExercise}
                />
            )}
            <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                        <Zap className="w-6 h-6 mr-3 text-red-500" />
                        Banco de Ejercicios
                    </h2>
                    <button onClick={handleOpenCreate} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md">
                        <PlusIcon className="w-5 h-5" />
                        Nuevo Ejercicio
                    </button>
                </div>
                
                {isLoadingExercises ? (
                    <p>Cargando ejercicios...</p>
                ) : (
                    <div className="space-y-3">
                        {masterExercises.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">Aún no has creado ningún ejercicio. ¡Añade el primero!</p>
                        ) : (
                            masterExercises.map(ex => (
                                <div key={ex.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center border border-gray-200">
                                    <div className="flex-1 pr-4">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-gray-900">{ex.name}</p>
                                            {ex.videoUrl && (
                                                <Video 
                                                    className="w-5 h-5 text-gray-400" 
                                                    title="Tiene video asociado" 
                                                />
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-1 my-2">
                                            {ex.muscleGroup && Array.isArray(ex.muscleGroup) && ex.muscleGroup.map(group => (
                                                <span key={group} className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-200 text-gray-800">
                                                    {group}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {ex.type && Array.isArray(ex.type) && ex.type.map(t => (
                                                <span key={t} className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleOpenEdit(ex)} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-100 rounded-full">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(ex.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default ProgramsView;