export interface Quiz {
  quizId: number;
  quizTitle: string;
  
 courseId: number;
}
export interface Question {
  questionId: number;
  quizId: number;
  questionText: string;
  marks: number;
  options: Option[];
  correctOptionId: number;
}
export interface Option {
  optionId: number;
  questionId: number;
  isCorrect: boolean;
  optionText: string;
}