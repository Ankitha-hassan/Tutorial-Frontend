import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuizDetails } from './quiz-details';
import { Question } from '../Models/quiz-models';
@Injectable({
  providedIn: 'root'
})
export class QuizDetailsService {
  
  private apiUrl = 'http://localhost:8081/api/v1/Question/GetAllQuestionsByQuizId?quizId='; // ✅ Replace with your real API URL

  constructor(private http: HttpClient) { }

  getQuizDetails(quizId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}${quizId}`);
  }
}
