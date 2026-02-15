import React, { useState } from 'react';
import { generateAssessment } from './services/geminiService';
import { AssessmentSet, GenerationParams, LoadingState } from './types';
import QuestionForm from './components/QuestionForm';
import ResultDisplay from './components/ResultDisplay';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [result, setResult] = useState<AssessmentSet | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (params: GenerationParams) => {
    setLoadingState('generating');
    setError(null);
    setResult(null);

    try {
      if (!process.env.API_KEY) {
          throw new Error("API configuration missing.");
      }

      const data = await generateAssessment(params);
      setResult(data);
      setLoadingState('success');
    } catch (err) {
      console.error(err);
      setError("Gagal menghasilkan soal. Pastikan koneksi internet stabil atau coba topik lain.");
      setLoadingState('error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50 print:bg-white">
      {/* Navbar - Improved Proportionality */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 print:hidden shadow-sm">
        <div className="max-w-6xl mx-auto px-4 min-h-[5rem] flex items-center justify-between py-3">
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-inner transform -rotate-3">
              A
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-teal-600 leading-none mb-1">
                Arsitest
              </span>
              <span className="text-sm sm:text-base text-orange-500 font-bold leading-tight tracking-tight">
                Dedi Efendi_Tim Pengembang Kurikulum Kanwil Kemenag Sumbar & Pengawas Madrasah Kab. Agam
              </span>
            </div>
          </div>
          <div className="hidden lg:flex flex-col items-end flex-shrink-0 ml-4 border-l border-slate-200 pl-4">
            <div className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
              Expertise Level
            </div>
            <div className="text-xs font-bold text-slate-700">
              Senior Psychometrician AI
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 print:p-0 print:max-w-none">
        
        {/* Intro / Hero - Hidden on Print */}
        <div className="mb-8 text-center sm:text-left print:hidden">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Studio Perancangan Soal</h1>
          <p className="text-slate-600 max-w-2xl text-sm sm:text-base">
            Rancang instrumen evaluasi (Soal Grup) berstandar nasional untuk jenjang SD/MI dan SMP/MTs. 
            Sistem otomatis memetakan stimulus, level kognitif (L1-L3), dan analisis pengecoh sesuai standar TKA.
          </p>
        </div>

        {/* Input Form - Hidden on Print */}
        <div className="print:hidden">
          <QuestionForm onSubmit={handleGenerate} isLoading={loadingState === 'generating'} />
        </div>

        {/* Status Messages - Hidden on Print */}
        {loadingState === 'generating' && (
          <div className="flex flex-col items-center justify-center py-12 animate-pulse print:hidden">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium text-center px-4">Sedang menyusun stimulus dan validasi pengecoh...</p>
            <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest">SOP BSKAP No. 047/H/AN/2025 COMPLIANT</p>
          </div>
        )}

        {loadingState === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700 my-6 print:hidden shadow-sm">
            <p className="font-semibold mb-1">Terjadi Kesalahan Sistem</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Results - Visible on Print */}
        {loadingState === 'success' && result && (
          <div className="animate-slide-up print:animate-none">
            <ResultDisplay data={result} />
          </div>
        )}
      </main>

      {/* Footer - Hidden on Print */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-8 print:hidden">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
          <p>&copy; {new Date().getFullYear()} Arsitest Labs.</p>
          <p>TKA Onedumind Compatible Framework v3.1</p>
        </div>
      </footer>
    </div>
  );
};

export default App;