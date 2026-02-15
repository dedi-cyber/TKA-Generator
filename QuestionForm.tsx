import React, { useState } from 'react';
import { GenerationParams } from '../types';

interface QuestionFormProps {
  onSubmit: (params: GenerationParams) => void;
  isLoading: boolean;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ onSubmit, isLoading }) => {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [gradeLevel, setGradeLevel] = useState('SMP');
  const [stimulusType, setStimulusType] = useState<'Literasi' | 'Numerasi'>('Literasi');
  const [useImageStimulus, setUseImageStimulus] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject.trim() && topic.trim()) {
      onSubmit({ subject, topic, gradeLevel, stimulusType, useImageStimulus });
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          Parameter Asesmen
        </h2>
        <p className="text-slate-500 text-sm mt-1">Masukkan detail materi untuk merancang instrumen evaluasi.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="gradeLevel" className="block text-sm font-medium text-slate-700 mb-1">
              Jenjang Pendidikan
            </label>
            <select
              id="gradeLevel"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
              disabled={isLoading}
            >
              <option value="SD">SD / MI (Sekolah Dasar)</option>
              <option value="SMP">SMP / MTs (Sekolah Menengah Pertama)</option>
            </select>
          </div>
          <div>
            <label htmlFor="stimulusType" className="block text-sm font-medium text-slate-700 mb-1">
              Jenis Kompetensi (Stimulus)
            </label>
            <select
              id="stimulusType"
              value={stimulusType}
              onChange={(e) => setStimulusType(e.target.value as 'Literasi' | 'Numerasi')}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
              disabled={isLoading}
            >
              <option value="Literasi">Literasi Membaca (Teks/Wacana)</option>
              <option value="Numerasi">Numerasi (Data/Grafik/Konteks Matematis)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">
              Mata Pelajaran
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Contoh: IPA Terpadu"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              disabled={isLoading}
              required
            />
          </div>
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-1">
              Topik / Sub-Materi
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Contoh: Pemanasan Global"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* Image Generation Toggle */}
        <div className="flex items-center gap-3 pt-2">
          <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              name="toggle"
              id="image-toggle"
              checked={useImageStimulus}
              onChange={(e) => setUseImageStimulus(e.target.checked)}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer peer checked:right-0 right-6"
              style={{ top: 0, transition: 'all 0.3s' }}
              disabled={isLoading}
            />
            <label 
              htmlFor="image-toggle" 
              className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer border border-slate-300 ${useImageStimulus ? 'bg-blue-600 border-blue-600' : 'bg-slate-300'}`}
            ></label>
          </div>
          <label htmlFor="image-toggle" className="text-sm font-medium text-slate-700 cursor-pointer">
            Buat Stimulus Visual (Grafik/Diagram) via AI <span className="text-xs text-orange-500 font-bold ml-1">BETA</span>
          </label>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading || !subject || !topic}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white shadow-sm transition-all
              ${isLoading || !subject || !topic 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md active:transform active:scale-95'}
            `}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {useImageStimulus ? 'Menyusun Soal & Menggambar...' : 'Memproses Regulasi...'}
              </>
            ) : (
              <>
                <span>Generate Soal</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 11-6-6"/><path d="m21 11-6 6"/><path d="M21 11H3"/></svg>
              </>
            )}
          </button>
        </div>
      </form>
      <style>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #2563eb;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #2563eb;
        }
        .toggle-checkbox {
          right: 1.5rem; /* 6 * 0.25rem = 1.5rem */
        }
      `}</style>
    </div>
  );
};

export default QuestionForm;