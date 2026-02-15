// Input types
export interface GenerationParams {
  subject: string;
  topic: string;
  gradeLevel: string;
  stimulusType: 'Literasi' | 'Numerasi';
  useImageStimulus: boolean; // New field for image toggle
}

// Data model for the generated question item
export interface QuestionItem {
  id: string;
  questionText: string;
  options?: string[]; // Optional, for MC/MCMA
  cognitiveLevel: 'L1' | 'L2' | 'L3';
  questionType: 'Pilihan Ganda Tunggal' | 'Pilihan Ganda Kompleks' | 'Benar/Salah';
  correctAnswer: string;
  rationale: string;
}

// Data model for the full response set
export interface AssessmentSet {
  stimulusTitle: string;
  stimulusContent: string;
  imagePrompt?: string; // The prompt used to generate the image
  stimulusImage?: string; // Base64 string of the generated image
  topic: string;
  questions: QuestionItem[];
}

// UI State types
export type LoadingState = 'idle' | 'generating' | 'success' | 'error';