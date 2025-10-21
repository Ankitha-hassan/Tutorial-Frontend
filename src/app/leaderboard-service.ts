import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private apiUrl = 'http://localhost:8081/api/v1/LeaderBoard'; // ✅ Replace with your real API URL

  constructor(private http: HttpClient) {}

  getLeaderboard(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
