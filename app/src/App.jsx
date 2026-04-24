import React, { useState, useEffect } from 'react';
import { Camera, Calendar, PieChart, Shield, CheckCircle2, ChevronRight, Activity, Sun, Moon, AlertCircle } from 'lucide-react';

// --- Datos Simulados basados en la Tesis ---
const SKIN_TYPES = [
  { id: 'seca', name: 'Piel Seca', color: 'text-blue-500', bg: 'bg-blue-100' },
  { id: 'grasa', name: 'Piel Grasa', color: 'text-green-500', bg: 'bg-green-100' },
  { id: 'mixta', name: 'Piel Mixta', color: 'text-purple-500', bg: 'bg-purple-100' },
  { id: 'normal', name: 'Piel Normal', color: 'text-teal-500', bg: 'bg-teal-100' },
  { id: 'sensible', name: 'Piel Sensible', color: 'text-rose-500', bg: 'bg-rose-100' }
];

const ROUTINES = {
  seca: {
    morning: ['Limpiador hidratante suave', 'Sérum de Ácido Hialurónico', 'Crema hidratante densa', 'Protector Solar SPF 50+'],
    night: ['Bálsamo desmaquillante', 'Limpiador suave', 'Sérum reparador', 'Crema de noche nutritiva']
  },
  grasa: {
    morning: ['Gel limpiador con Ácido Salicílico', 'Niacinamida 10%', 'Hidratante en gel', 'Protector Solar toque seco'],
    night: ['Agua micelar', 'Gel limpiador espumoso', 'Exfoliante BHA (2x semana)', 'Hidratante ligera libre de aceite']
  },
  mixta: {
    morning: ['Limpiador equilibrante', 'Sérum Antioxidante', 'Loción hidratante', 'Protector Solar fluido'],
    night: ['Limpiador doble', 'Tónico astringente en zona T', 'Tratamiento focalizado', 'Crema hidratante']
  },
  normal: {
    morning: ['Limpiador facial al agua', 'Vitamina C', 'Crema hidratante', 'Protector Solar SPF 50+'],
    night: ['Desmaquillante', 'Limpiador', 'Retinol (0.2%)', 'Crema hidratante de noche']
  },
  sensible: {
    morning: ['Limpiador syndet sin perfume', 'Sérum calmante (Centella)', 'Crema barrera reparadora', 'Protector Solar mineral'],
    night: ['Agua micelar para piel sensible', 'Limpiador syndet', 'Crema reparadora intensiva']
  }
};

export default function App() {
  // --- Estados de la SPA ---
  const [currentView, setCurrentView] = useState('onboarding'); // onboarding, analysis, routine, progress
  const [hasConsent, setHasConsent] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Estado para la adherencia (Checkboxes)
  const [completedSteps, setCompletedSteps] = useState({
    morning: [],
    night: []
  });

  // Calcular el progreso diario
  const totalSteps = analysisResult ? (ROUTINES[analysisResult.type.id].morning.length + ROUTINES[analysisResult.type.id].night.length) : 0;
  const completedCount = completedSteps.morning.length + completedSteps.night.length;
  const progressPercentage = totalSteps === 0 ? 0 : Math.round((completedCount / totalSteps) * 100);

  // --- Funciones de Lógica ---
  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    // Simulamos el procesamiento de la Red Neuronal Convolucional (CNN)
    setTimeout(() => {
      const randomType = SKIN_TYPES[Math.floor(Math.random() * SKIN_TYPES.length)];
      const confidence = (Math.random() * (98.5 - 85.0) + 85.0).toFixed(2); // Simula el AUC/Precisión de la tesis

      setAnalysisResult({
        type: randomType,
        confidence: confidence,
        date: new Date().toLocaleDateString()
      });
      setIsAnalyzing(false);

      // Resetear rutina al detectar nuevo tipo de piel
      setCompletedSteps({ morning: [], night: [] });
    }, 2500);
  };

  const toggleStep = (timeOfDay, stepIndex) => {
    setCompletedSteps(prev => {
      const current = prev[timeOfDay];
      if (current.includes(stepIndex)) {
        return { ...prev, [timeOfDay]: current.filter(i => i !== stepIndex) };
      } else {
        return { ...prev, [timeOfDay]: [...current, stepIndex] };
      }
    });
  };

  // --- Vistas (Componentes Internos) ---

  const OnboardingView = () => (
    <div className="flex flex-col items-center justify-center h-full p-6 space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
        <Activity className="text-white w-12 h-12" />
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-slate-800">Skincare AI</h1>
        <p className="text-slate-500">Tu rutina facial personalizada mediante visión artificial.</p>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-600 space-y-3">
        <div className="flex items-center space-x-2 text-slate-800 font-semibold">
          <Shield className="w-5 h-5 text-blue-600" />
          <span>Privacidad y Ética</span>
        </div>
        <p>Tus datos biométricos e imágenes faciales se procesan localmente y están protegidos de acuerdo a nuestro protocolo ético de investigación.</p>
        <label className="flex items-start space-x-2 pt-2 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 rounded text-blue-600 focus:ring-blue-500"
            checked={hasConsent}
            onChange={(e) => setHasConsent(e.target.checked)}
          />
          <span className="text-xs">Acepto el consentimiento informado y el tratamiento de datos para la generación de mi rutina.</span>
        </label>
      </div>

      <button
        disabled={!hasConsent}
        onClick={() => setCurrentView('analysis')}
        className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-md flex items-center justify-center space-x-2
          ${hasConsent ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-300 cursor-not-allowed'}`}
      >
        <span>Comenzar Evaluación</span>
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );

  const AnalysisView = () => (
    <div className="flex flex-col h-full p-6 animate-in slide-in-from-right-8 duration-300">
      <h2 className="text-xl font-bold text-slate-800 mb-2">Análisis de Visión Artificial</h2>
      <p className="text-sm text-slate-500 mb-6">Coloca tu rostro frente a la cámara con buena iluminación para que la CNN analice las características de tu piel.</p>

      {!analysisResult ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="relative w-64 h-64 bg-slate-100 rounded-3xl border-4 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shadow-inner">
            {isAnalyzing ? (
              <>
                {/* Escáner animado simulado */}
                <div className="absolute inset-0 bg-blue-500/10"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-[scan_2s_ease-in-out_infinite]"></div>
                <Camera className="w-16 h-16 text-blue-400 animate-pulse" />
              </>
            ) : (
              <Camera className="w-16 h-16 text-slate-400" />
            )}
          </div>

          <button
            onClick={handleStartAnalysis}
            disabled={isAnalyzing}
            className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all shadow-md flex justify-center items-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <Activity className="w-5 h-5 animate-spin" />
                <span>Procesando modelo IA...</span>
              </>
            ) : (
              <span>Capturar Imagen</span>
            )}
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col space-y-4">
          <div className={`p-6 rounded-2xl flex flex-col items-center justify-center space-y-2 ${analysisResult.type.bg}`}>
            <CheckCircle2 className={`w-12 h-12 ${analysisResult.type.color}`} />
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Diagnóstico IA</h3>
            <p className={`text-3xl font-bold ${analysisResult.type.color}`}>{analysisResult.type.name}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 font-semibold">CONFIANZA DEL MODELO (AUC)</p>
              <p className="text-lg font-bold text-slate-800">{analysisResult.confidence}%</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">FECHA DE ANÁLISIS</p>
              <p className="text-lg font-bold text-slate-800">{analysisResult.date}</p>
            </div>
          </div>

          <div className="flex-1"></div>

          <button
            onClick={() => setCurrentView('routine')}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md flex justify-center items-center space-x-2"
          >
            <span>Ver mi Rutina Personalizada</span>
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => setAnalysisResult(null)}
            className="w-full py-3 text-slate-500 font-semibold hover:bg-slate-100 rounded-xl transition-all"
          >
            Repetir Análisis
          </button>
        </div>
      )}
    </div>
  );

  const RoutineView = () => {
    if (!analysisResult) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-slate-300" />
          <h2 className="text-xl font-bold text-slate-800">Aún no hay datos</h2>
          <p className="text-slate-500">Realiza tu evaluación facial primero para que la IA genere tu rutina.</p>
          <button onClick={() => setCurrentView('analysis')} className="text-blue-600 font-bold mt-4">Ir a Evaluación</button>
        </div>
      );
    }

    const currentRoutine = ROUTINES[analysisResult.type.id];

    return (
      <div className="flex flex-col h-full bg-slate-50 overflow-y-auto animate-in slide-in-from-right-8 duration-300 pb-20">
        <div className="bg-white p-6 rounded-b-3xl shadow-sm space-y-4">
          <h2 className="text-2xl font-bold text-slate-800">Tu Rutina de Hoy</h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 font-semibold">Progreso Diario de Adherencia</span>
            <span className="text-sm font-bold text-blue-600">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Rutina de Mañana */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-amber-500 font-bold">
              <Sun className="w-5 h-5" />
              <h3>Rutina de Mañana</h3>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              {currentRoutine.morning.map((step, idx) => {
                const isChecked = completedSteps.morning.includes(idx);
                return (
                  <label key={idx} className={`flex items-center p-4 border-b border-slate-50 cursor-pointer transition-colors ${isChecked ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${isChecked ? 'bg-blue-500 border-blue-500' : 'border-slate-300'}`}>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <span className={`flex-1 transition-all ${isChecked ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>
                      {step}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Rutina de Noche */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-indigo-500 font-bold">
              <Moon className="w-5 h-5" />
              <h3>Rutina de Noche</h3>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              {currentRoutine.night.map((step, idx) => {
                const isChecked = completedSteps.night.includes(idx);
                return (
                  <label key={idx} className={`flex items-center p-4 border-b border-slate-50 cursor-pointer transition-colors ${isChecked ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${isChecked ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`}>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <span className={`flex-1 transition-all ${isChecked ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>
                      {step}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProgressView = () => (
    <div className="flex flex-col h-full p-6 space-y-6 overflow-y-auto animate-in slide-in-from-right-8 duration-300 pb-20">
      <h2 className="text-2xl font-bold text-slate-800">Mi Progreso</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col justify-center items-center text-center space-y-1">
          <span className="text-3xl font-bold text-blue-600">85%</span>
          <span className="text-xs font-semibold text-blue-800 uppercase">Adherencia Semanal</span>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col justify-center items-center text-center space-y-1">
          <span className="text-3xl font-bold text-green-600">6</span>
          <span className="text-xs font-semibold text-green-800 uppercase">Días Seguidos</span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 space-y-4">
        <h3 className="font-bold text-slate-800 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-slate-400" />
          <span>Últimos 7 días</span>
        </h3>
        <div className="flex justify-between items-end h-32 pt-4">
          {/* Simulación de gráfico de barras de adherencia */}
          {[60, 100, 80, 100, 40, 100, progressPercentage || 0].map((val, idx) => (
            <div key={idx} className="flex flex-col items-center w-8 group">
              <span className="text-[10px] text-slate-400 font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{val}%</span>
              <div className="w-full bg-slate-100 rounded-t-sm relative flex items-end h-24">
                <div
                  className={`w-full rounded-t-sm transition-all duration-1000 ${val >= 80 ? 'bg-green-400' : val > 0 ? 'bg-amber-400' : 'bg-slate-200'}`}
                  style={{ height: `${val}%` }}
                ></div>
              </div>
              <span className="text-xs text-slate-500 font-medium mt-2">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'][idx]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 text-white p-5 rounded-xl shadow-md space-y-2">
        <h3 className="font-bold flex items-center space-x-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <span>Impacto Clínico Estimado</span>
        </h3>
        <p className="text-sm text-slate-300">Según tus niveles de adherencia actuales, la IA estima una mejora del <strong className="text-white">24%</strong> en la hidratación de tu piel en las próximas 2 semanas.</p>
      </div>
    </div>
  );

  // --- Render Principal (Carcasa Móvil) ---
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-8 font-sans">
      {/* Contenedor que simula un Smartphone */}
      <div className="w-full max-w-[400px] h-[800px] max-h-screen bg-white sm:rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col sm:border-[8px] border-slate-800">

        {/* Simulación del 'Notch' o 'Isla Dinámica' */}
        <div className="absolute top-0 inset-x-0 h-6 bg-transparent flex justify-center z-50">
          <div className="w-32 h-6 bg-slate-800 rounded-b-2xl"></div>
        </div>

        {/* Área de Contenido Principal */}
        <main className="flex-1 overflow-hidden pt-6 relative bg-white">
          {currentView === 'onboarding' && <OnboardingView />}
          {currentView === 'analysis' && <AnalysisView />}
          {currentView === 'routine' && <RoutineView />}
          {currentView === 'progress' && <ProgressView />}
        </main>

        {/* Barra de Navegación Inferior (solo visible post-onboarding) */}
        {currentView !== 'onboarding' && (
          <nav className="absolute bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-200 flex justify-around items-center px-6 py-4 pb-6 sm:pb-4">
            <button
              onClick={() => setCurrentView('analysis')}
              className={`flex flex-col items-center space-y-1 transition-colors ${currentView === 'analysis' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Camera className="w-6 h-6" />
              <span className="text-[10px] font-bold">Evaluación</span>
            </button>
            <button
              onClick={() => setCurrentView('routine')}
              className={`flex flex-col items-center space-y-1 transition-colors ${currentView === 'routine' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <CheckCircle2 className="w-6 h-6" />
              <span className="text-[10px] font-bold">Mi Rutina</span>
            </button>
            <button
              onClick={() => setCurrentView('progress')}
              className={`flex flex-col items-center space-y-1 transition-colors ${currentView === 'progress' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <PieChart className="w-6 h-6" />
              <span className="text-[10px] font-bold">Progreso</span>
            </button>
          </nav>
        )}

        {/* Estilos para animaciones CSS customizadas */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes scan {
            0% { transform: translateY(0); }
            50% { transform: translateY(256px); }
            100% { transform: translateY(0); }
          }
        `}} />
      </div>
    </div>
  );
}