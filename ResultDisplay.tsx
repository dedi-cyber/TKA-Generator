import React, { useState, useRef } from 'react';
import { AssessmentSet, QuestionItem } from '../types';

interface ResultDisplayProps {
  data: AssessmentSet;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ data }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const generateContent = () => {
    let text = `[TKA GENERATOR REPORT]\n`;
    text += `Judul: ${data.stimulusTitle}\n`;
    text += `Topik: ${data.topic}\n\n`;
    text += `--- STIMULUS ---\n${data.stimulusContent}\n\n`;
    
    data.questions.forEach((q, idx) => {
      text += `SOAL NO. ${idx + 1} [${q.cognitiveLevel} - ${q.questionType}]\n`;
      text += `${q.questionText}\n`;
      if(q.options) q.options.forEach((opt, i) => text += `${String.fromCharCode(65 + i)}. ${opt}\n`);
      text += `KUNCI: ${q.correctAnswer}\n`;
      text += `PEMBAHASAN: ${q.rationale}\n\n`;
    });
    return text;
  };

  const handleDownloadPDF = () => {
    setIsMenuOpen(false);
    if (!contentRef.current || typeof (window as any).html2pdf === 'undefined') return;
    setIsGenerating(true);
    const element = contentRef.current;
    const opt = {
      margin: [15, 15, 15, 15],
      filename: `TKA_${data.topic.replace(/\s/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css'] }
    };
    (window as any).html2pdf().set(opt).from(element).save().then(() => setIsGenerating(false));
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border border-slate-300 overflow-hidden">
      {/* Action Bar */}
      <div className="bg-slate-800 text-white px-6 py-3 flex justify-between items-center print:hidden">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold tracking-widest uppercase">TKA Standardized Output</span>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleDownloadPDF}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-4 rounded transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            EKSPOR PDF
          </button>
        </div>
      </div>

      <div ref={contentRef} className="p-8 sm:p-12 bg-white font-serif text-black leading-relaxed">
        {/* Kop Surat / Header */}
        <div className="text-center mb-10 border-b-4 border-double border-black pb-6">
          <h1 className="text-2xl font-black uppercase tracking-tighter mb-1">Tes Kompetensi Akademik (TKA)</h1>
          <p className="text-sm font-bold uppercase tracking-widest text-slate-600">Instrumen Evaluasi Kurikulum Merdeka & AKM</p>
          <div className="mt-4 grid grid-cols-2 text-left text-xs font-bold border-t border-slate-200 pt-4 max-w-md mx-auto">
            <span>MATA PELAJARAN: {data.topic}</span>
            <span className="text-right">KODE: TKA-2025-GEN</span>
          </div>
        </div>

        {/* Section Stimulus */}
        <div className="mb-12 break-inside-avoid">
          <div className="bg-slate-100 p-1 mb-4 inline-block transform -skew-x-12">
            <span className="px-4 py-1 bg-black text-white text-xs font-black uppercase tracking-tighter inline-block skew-x-12">Wacana Stimulus</span>
          </div>
          <h2 className="text-xl font-bold mb-4 underline decoration-2 underline-offset-8">{data.stimulusTitle}</h2>
          
          {data.stimulusImage && (
            <div className="my-6 flex justify-center border-2 border-slate-100 p-2 rounded-lg">
              <img src={`data:image/jpeg;base64,${data.stimulusImage}`} alt="Stimulus" className="max-w-full h-auto max-h-[350px] object-contain shadow-sm" />
            </div>
          )}
          
          <div className="text-sm leading-loose text-justify whitespace-pre-line first-letter:text-4xl first-letter:font-bold first-letter:mr-2 first-letter:float-left">
            {data.stimulusContent}
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-12">
          {data.questions.map((q, idx) => (
            <div key={q.id} className="break-inside-avoid border-t border-slate-100 pt-8">
              <div className="flex justify-between items-start mb-4">
                <span className="text-lg font-black bg-black text-white px-3 py-1 mr-4">SOAL {idx + 1}</span>
                <div className="flex gap-2">
                  <span className="text-[10px] border border-black px-2 py-0.5 font-bold">{q.cognitiveLevel}</span>
                  <span className="text-[10px] border border-black px-2 py-0.5 font-bold uppercase">{q.questionType}</span>
                </div>
              </div>

              <p className="text-base font-bold mb-6">{q.questionText}</p>

              {q.options && (
                <div className="grid grid-cols-1 gap-3 ml-4 mb-8">
                  {q.options.map((opt, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <span className="font-bold flex-none w-6 h-6 border border-black rounded-full flex items-center justify-center text-xs">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-sm pt-0.5">{opt}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Pembahasan Box - Styled like TKA Onedumind */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black text-yellow-700 uppercase tracking-widest">Kunci Jawaban & Pembahasan Diagnostik</span>
                </div>
                <p className="text-sm font-bold text-slate-900 mb-1">Jawaban: <span className="bg-white px-2 py-0.5 border border-yellow-200">{q.correctAnswer}</span></p>
                <p className="text-xs text-slate-700 italic leading-relaxed text-justify">
                  {q.rationale}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t-2 border-slate-200 text-center">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em]">
            Arsitest Engine v3.1 • TKA Onedumind Compatible Framework • 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;