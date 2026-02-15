import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AssessmentSet, GenerationParams } from "../types";

// Schema definition to force structured JSON output
const assessmentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    stimulusTitle: {
      type: Type.STRING,
      description: "Judul stimulus yang relevan dan menarik.",
    },
    stimulusContent: {
      type: Type.STRING,
      description: "Konten stimulus mendalam (Wacana/Data). Harus cukup kaya untuk digali menjadi 30 soal analisis.",
    },
    imagePrompt: {
      type: Type.STRING,
      description: "Detailed English prompt for Imagen model if visual is requested.",
    },
    topic: {
      type: Type.STRING,
      description: "Topik spesifik mata pelajaran.",
    },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          questionText: { type: Type.STRING, description: "Pertanyaan HOTS yang jelas dan tidak ambigu." },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Pilihan jawaban yang homogen dan fungsional (4 untuk SD, 5 untuk SMP/MTs).",
          },
          cognitiveLevel: {
            type: Type.STRING,
            enum: ["L1", "L2", "L3"],
          },
          questionType: {
            type: Type.STRING,
            enum: ["Pilihan Ganda Tunggal", "Pilihan Ganda Kompleks", "Benar/Salah"],
          },
          correctAnswer: { type: Type.STRING },
          rationale: {
            type: Type.STRING,
            description: "Pembahasan mendalam: Mengapa jawaban benar dan mengapa pengecoh lainnya salah (analisis miskonsepsi).",
          },
        },
        required: ["id", "questionText", "cognitiveLevel", "questionType", "correctAnswer", "rationale"],
      },
    },
  },
  required: ["stimulusTitle", "stimulusContent", "topic", "questions"],
};

export const generateAssessment = async (params: GenerationParams): Promise<AssessmentSet> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key configuration missing.");

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
Role: Anda adalah Senior Lead Item Writer di TKA (Tes Kompetensi Akademik) Generator.
Tugas: Menghasilkan 30 butir soal berkualitas tinggi yang setara dengan standar seleksi nasional dan platform TKA Onedumind.

Prinsip Penulisan Soal (TKA Standard):
1. **Stimulus-Based**: Semua pertanyaan wajib merujuk pada stimulus. Jangan menanyakan pengetahuan umum di luar stimulus.
2. **HOTS Oriented**: Fokus pada Level L2 (Aplikasi) dan L3 (Penalaran/Analisis). Hindari soal L1 yang hanya bersifat "Copy-Paste" dari teks.
3. **Konstruksi Pilihan Jawaban**:
   - Pilihan harus homogen secara panjang kalimat dan struktur gramatikal.
   - Pengecoh (Distractors) harus didasarkan pada kesalahan logika atau miskonsepsi umum siswa.
4. **Pembahasan Diagnostik**: Rationale harus menjelaskan alur berpikir untuk menemukan jawaban benar, bukan sekadar menyatakan kunci jawaban.

Distribusi Item (Rigid):
- No 1-10: L1 (Pemahaman/Identifikasi) - Format: Pilihan Ganda Tunggal.
- No 11-20: L2 (Aplikasi/Interpretasi) - Format: Pilihan Ganda Kompleks (pilih lebih dari satu).
- No 21-30: L3 (Penalaran/Sintesis/Evaluasi) - Format: Benar/Salah atau Pilihan Ganda Kompleks.

Jenjang: ${params.gradeLevel}
Mata Pelajaran: ${params.subject}
Fokus: ${params.stimulusType}
`;

  const prompt = `
Buatkan paket soal TKA lengkap untuk topik: ${params.topic}.
Pastikan stimulus sangat mendalam dan teknis. 
Jika Numerasi, sertakan data angka yang memerlukan kalkulasi dua tahap.
Jika Literasi, sertakan wacana yang mengandung opini tersirat dan fakta.
Gunakan Bahasa Indonesia yang formal (EYD/PUEBI).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Menggunakan Pro untuk penalaran soal yang lebih tajam sesuai standar TKA
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: assessmentSchema,
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 4000 } // Menambahkan budget berpikir untuk kualitas logika soal
      },
    });

    const parsedData = JSON.parse(response.text || "{}") as AssessmentSet;

    if (params.useImageStimulus && parsedData.imagePrompt) {
      try {
        const imageResponse = await ai.models.generateImages({
          model: 'imagen-4.0-generate-001',
          prompt: `Standard academic assessment graphic: ${parsedData.imagePrompt}, clean white background, educational style, highly detailed.`,
          config: { numberOfImages: 1, aspectRatio: '16:9' },
        });
        const base64Image = imageResponse.generatedImages?.[0]?.image?.imageBytes;
        if (base64Image) parsedData.stimulusImage = base64Image;
      } catch (e) { console.warn("Image gen failed", e); }
    }

    return parsedData;
  } catch (error) {
    throw error;
  }
};