import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { Search, CheckCircle2, Loader2, AlertCircle, Share2, Users } from 'lucide-react';

/**
 * CONFIGURACIÓN DE FIREBASE PARA REPLIT
 * * En Replit, ve a la pestaña "Secrets" (icono de candado) y añade estas claves:
 * VITE_FIREBASE_API_KEY
 * VITE_FIREBASE_AUTH_DOMAIN
 * VITE_FIREBASE_PROJECT_ID
 * VITE_FIREBASE_STORAGE_BUCKET
 * VITE_FIREBASE_MESSAGING_SENDER_ID
 * VITE_FIREBASE_APP_ID
 */

const getFirebaseConfig = () => {
  // Intentamos leer variables de entorno de Vite (Replit)
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_FIREBASE_API_KEY) {
      return {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
      };
    }
  } catch (e) {
    // No estamos en un entorno con import.meta.env
  }

  // Configuración por defecto del entorno de Canvas
  try {
    // @ts-ignore
    return JSON.parse(__firebase_config);
  } catch (e) {
    return null;
  }
};

const config = getFirebaseConfig();
const app = config ? initializeApp(config) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
// @ts-ignore
const appId = typeof __app_id !== 'undefined' ? __app_id : 'honorarios-tracker-v1';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const ESTADOS = [
  { label: 'Pendiente', color: 'bg-gray-100 text-gray-700 border-gray-300' },
  { label: 'Recibido', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { label: 'Enviado', color: 'bg-yellow-100 text-yellow-700 border-blue-300' },
  { label: 'Devuelto', color: 'bg-red-100 text-red-700 border-red-300' },
  { label: 'Subsanado', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  { label: 'Pagado', color: 'bg-green-100 text-green-700 border-green-300' }
];

const PRESTADORES_RAW = `Loreto Andrea Passalacqua Cerda
Olga Fabiola Vargas Mora
Tatiana Ayala Beas
Francisco Bunster Nilo
Carlos Poblete Galvez
Emerson Ordenes
Mahli Angélica Manríquez Amigo
Paola Elizabeth Zúñiga Gómez
Viviana Valenzuela Merino
Mario Jolley Urbaneja
Irma Pérez Llanquín
Daniela Ester Romero Pino
Gustavo Robles Cid
Alfonso Huaquinao Millán
Nolberto Vio Riveros
Pablo Francisco Simón Salvador Toro Fuentes 
Emilio Vinger Castro
Catalina Paz Perez Vasquez 
Camila Charrier Vegas
Chritopher Simpson Botta
Bryan Acevedo Poblete
Bastian Adanger Nooa Muñoz
Javier Ignacio Cofré Crisóstomo
Angelica María Ortega Zambrano
Manuel Carrillo Vallejos
Catalina Araya Contreras
Paulina Pizarro Osses
José Olivarí Ibieta
Daniela Ramírez Canales
Fabian Alejandro Perez Nouveau
Andres Ignacio Fernando Aguilera Abarca 
Marcela Katerine Hinojosa Gomez 
Levi Eduardo Chavez Cea 
Marisol Rebeca Pascua San Martin 
Andres Alejandro Urrutia Santana
Juan Guillermo Contreras Garrido 
Iván Alejandro Acosta Chacoff
Danitza Baeza Gutierrez
Yanina Chavez Saavedra
Juan Damaso Zavala Perez
Javiera Valles Andaur
Josué Suarez Cid
Claudio Antonio Muñoz MIranda
Carla Patricia Garcia Castro
Constanza Vigueras Martínez
Fernanda Lavín Oviedo
Alexander López Urra
Carolina Chiguay Cortes
Millaray Inti Salinas Vasquez
Juan Arturo Hernández Varas
Eduardo Fermandez Espinoza
Alejandro Valenzuela Badilla 
Kimberly Dayanna Sepulveda Alegria
Bryan Ignacio Oviedo de la Paz
Sara Díaz Ortiz
Bárbara Lía Sarmiento Ramírez
Raul Sebastian Castro Caro
Jonathan Odría Sepúlveda
Deyanira Elaine Úbeda Urbina 
Luis Adolfo Merino Montt 
Isamar Andrea Portilla Rojas 
Paloma Catalina Letelier Ortiz 
FERNANDO ADOLFO GALINDO FUENTES
Marco Saavedra Castillo 
FRANCISCA ANDREA ENCINA HIDALGO
Pablo Andres Gonzalez Cornejo 
Romina Sánchez Godoy
VERONICA CORREA GUZMAN
Fabrizio Antonio Alday Valdovinos
KAREN CISTERNA
Katherine Elena Montenegro Montenegro
Vicente Inzunza Valdes
Carlos Arcila Pacheco
Oscar Santelices Martínez
Felipe Valenzuela Maraboli
Karen Cabezas Miranda
Bruno Gómez González
Juan Calfumil Callfumil
Angelica Paz Rojas Ramirez
Jose Luis Painean Cisterna
Angie Lara Leyton
Miriam Millaguir Epuleo
Eduardo Gutiérrez Rodríguez
Fernando Casanova Fuentes
Valentina Moreno Vilches 
Gabriela Godoy Latorre
Benjamin Cornejo
Maria José Hernández Soto
Fernando Hernández
Gabriela Sierra Sazo
Anibal Pinto Solari
Paula Alcayaga
Laura Briceño Ramirez
Carolina Díaz Camille
Patricio Munita Rebolledo
Sebastian Urrea González
Pamela Herrera Osorio
Sebastian Negrete Quezada
Benjamín Campos Espejo
Mackarena Araya Silva
Tomas Ugarte Muñoz
Sebastian Morales Fernandez
Baltica Pérez Hernández
Lorena del Carmen Andrade Saavedra
Norma Paulina Concha Carrasco 
Miguel Angel Parraguez Muñoz
Jorge Luis Pérez Chandia
JAIME VALENZUELA 
JONATHAN ARANCIBIA
Victor Manuel Hernan Ramirez Donoso
Jorge Ignacio Gamboa Carrasco
Zammyr Alexis Barrera Pavez 
Juan Enrique Melin Venegas
Carmen Barrera Pino 
Jose Luis Barrera Pavez
Miguel Angel Zepeda Quiroz
Juan Alexis Borquez Guajardo
Gonzalo Antonio Fierro Caniullan 
José Daniel Morón 
Rodrigo Melendez Araya
Luis Mena Irarrazabal
Yannara Labbe Lobos
Jorge Carrasco Chirino
Ruben Espinoza
FERNANDA RAMIREZ MELLADO
FELIPE BLANCO BUSTOS 
ALVARO ORMEÑO SALAZAR
FRANCISCA RAMIREZ IRIARTE
Andrea Carolina Alfaro Varas
Aracelli del Rosario Diaz Velasquez
Juan Bernardo Henriquez Ormeño
Aldo Rodrigo Navarro Farías
María Violeta Olmos Aguirre`;

export default function App() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [error, setError] = useState(null);

  const prestadores = useMemo(() => {
    return [...new Set(PRESTADORES_RAW.split('\n').map(n => n.trim()).filter(n => n && n !== 'ENCARGADO'))];
  }, []);

  useEffect(() => {
    if (!auth) {
      setError("Base de datos no configurada. Revisa los Secrets en Replit.");
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        // @ts-ignore
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          // @ts-ignore
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Error de autenticación:", err);
        setError("Error al conectar con el servicio de datos.");
      }
    };
    initAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, setUser);
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user || !db) return;

    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'tracking_main', 'current');
    
    const unsubscribeData = onSnapshot(docRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          setData(docSnap.data());
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error de Firestore:", err);
        setError("No tienes permisos para ver los datos. Verifica la configuración.");
        setLoading(false);
      }
    );

    return () => unsubscribeData();
  }, [user]);

  const updateStatus = async (prestador, mes, estado) => {
    if (!user || !db) return;
    
    const newData = {
      ...data,
      [prestador]: {
        ...(data[prestador] || {}),
        [mes]: estado
      }
    };
    
    setData(newData);
    setSaveStatus('Guardando cambios...');
    
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'tracking_main', 'current');
      await setDoc(docRef, newData);
      setSaveStatus('¡Guardado con éxito!');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      setSaveStatus('Error al guardar');
      console.error(err);
    }
  };

  const handleShare = () => {
    try {
      const url = window.location.href;
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setSaveStatus('Enlace copiado al portapapeles');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (e) {
      setSaveStatus('Error al copiar el enlace');
    }
  };

  const filteredPrestadores = prestadores.filter(p => 
    p.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-gray-600 font-medium">Sincronizando con la oficina...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8 font-sans">
      <header className="max-w-7xl mx-auto mb-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 shadow-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <CheckCircle2 className="text-green-600 w-6 h-6" />
              Seguimiento de Honorarios
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Users className="w-4 h-4 text-gray-400" />
              <p className="text-gray-500 text-sm">Modo colaborativo activado</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {saveStatus && (
              <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border shadow-sm transition-all animate-in fade-in slide-in-from-top-2 ${
                saveStatus.includes('Error') ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'
              }`}>
                {saveStatus.includes('Error') ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                {saveStatus}
              </div>
            )}
            
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
            >
              <Share2 className="w-4 h-4 text-blue-500" />
              Compartir App
            </button>

            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar por nombre..." 
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full md:w-64 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="p-4 font-semibold text-gray-700 min-w-[250px] sticky left-0 bg-gray-100 z-10 border-r border-gray-200">
                    Nombre del Prestador
                  </th>
                  {MESES.map(mes => (
                    <th key={mes} className="p-4 font-semibold text-gray-700 text-center text-xs uppercase tracking-wider min-w-[130px]">
                      {mes}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPrestadores.map((nombre, idx) => (
                  <tr key={nombre} className={`border-b border-gray-100 transition-colors hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="p-4 font-medium text-gray-800 sticky left-0 bg-inherit z-10 border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                      {nombre}
                    </td>
                    {MESES.map(mes => {
                      const currentStatus = data[nombre]?.[mes] || 'Pendiente';
                      const stateConfig = ESTADOS.find(s => s.label === currentStatus) || ESTADOS[0];
                      
                      return (
                        <td key={mes} className="p-2 text-center">
                          <select 
                            disabled={!!error}
                            value={currentStatus}
                            onChange={(e) => updateStatus(nombre, mes, e.target.value)}
                            className={`w-full text-[10px] font-bold py-1.5 px-2 rounded-md border appearance-none text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${stateConfig.color} ${error ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {ESTADOS.map(s => (
                              <option key={s.label} value={s.label}>{s.label}</option>
                            ))}
                          </select>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      <footer className="max-w-7xl mx-auto mt-8 flex flex-wrap gap-4 justify-center items-center opacity-70">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
          Referencia de Estados:
        </div>
        <div className="flex flex-wrap gap-2">
          {ESTADOS.map(s => (
            <div key={s.label} className={`text-[10px] px-2 py-0.5 rounded border ${s.color}`}>
              {s.label}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}