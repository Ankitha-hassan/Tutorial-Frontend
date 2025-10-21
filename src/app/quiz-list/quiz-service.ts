import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quiz } from '../Models/quiz-models';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:8081/api/v1/Quiz/GetAllQuizzes'; // ✅ Replace with your real API URL

  constructor(private http: HttpClient) {}

  getAllQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.apiUrl);
  }

  getQuizById(id: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/${id}`);
  }
}

