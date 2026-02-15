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
      // Check for API key wrapper
      if (!process.env.API_KEY) {
          // In a real scenario, we might prompt for a key, but per instructions we assume env.
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
      {/* Navbar - Hidden on Print */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 print:hidden">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
              A
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-teal-600 leading-tight">
                Arsitest
              </span>
              <span className="text-xs sm:text-sm text-orange-600 font-semibold mt-0.5 leading-tight">
                Dedi Efendi_Tim Pengembang Kurikulum Kanwil Kemenag Sumbar & Pengawas Madrasah Kab. Agam
              </span>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end">
            <div className="text-sm font-medium text-slate-500">
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
          <p className="text-slate-600 max-w-2xl">
            Rancang instrumen evaluasi (Soal Grup) berstandar nasional untuk jenjang SD/MI dan SMP/MTs. 
            Sistem otomatis memetakan stimulus, level kognitif (L1-L3), dan analisis pengecoh.
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
            <p className="text-slate-500 font-medium">Sedang menyusun stimulus dan validasi pengecoh...</p>
            <p className="text-xs text-slate-400 mt-2">Memproses SOP BSKAP No. 047/H/AN/2025</p>
          </div>
        )}

        {loadingState === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700 my-6 print:hidden">
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
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Arsitest Labs. All Reguatory Frameworks Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;