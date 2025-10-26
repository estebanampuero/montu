/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // --- INICIO DE LA CORRECCIÓN ---
    extend: {
      colors: {
        'primary': '#1e40af',        // Azul principal
        'secondary': '#10b981',      // Verde para acciones
        'background': '#f8fafc',    // Fondo general (casi blanco)
        'surface': '#ffffff',       // Superficies como tarjetas (blanco)
        'text-primary': '#1e293b',   // Texto principal (casi negro)
        'text-secondary': '#64748b', // Texto secundario (gris)
      }
    },
    // --- FIN DE LA CORRECCIÓN ---
  },
  plugins: [],
}