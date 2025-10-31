import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../Models/quiz-models';
import { AuthenticationService } from '../login/authentication-service';

@Injectable({
  providedIn: 'root'
})
export class QuizDetailsService {
  private apiUrl = 'http://localhost:8081/api/v1/Question/GetAllQuestionsByQuizId?quizId='; 
  private submitUrl = 'http://localhost:8081/api/v1/Participant/SubmitQuiz';

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  getQuizDetails(quizId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}${quizId}`);
  }

  submitQuiz(payload: any): Observable<any> {
    return this.http.post(`${this.submitUrl}`, payload);
  }

  calculateResults(
    questions: Question[],
    answers: { questionId: number; selectedOptionId: number }[]
  ): { score: number; total: number; percentage: string; passed: boolean } {
    let score = 0;
    let total = 0;

    questions.forEach(q => {
      total += q.marks;
      const userAnswer = answers.find(a => a.questionId === q.questionId);
      const correctOption = q.options.find(o => o.isCorrect);

      if (userAnswer && correctOption && userAnswer.selectedOptionId === correctOption.optionId) {
        score += q.marks;
      }
    });

    const percentage = ((score / total) * 100).toFixed(2);
    const passed = parseFloat(percentage) >= 70;

    return { score, total, percentage, passed };
  }
}
