import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuizService } from './quiz-service';
import { LeaderboardService } from '../leaderboard-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.html',
  styleUrls: ['./quiz-list.css'],
  imports: [CommonModule,RouterModule]
  
})
export class QuizList implements OnInit {

  quizzes: any[] = [];
  leaderboard: any[] = [];
  isLoading: boolean = true;

  constructor(
    private quizService: QuizService,
  
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadQuizzes();
  
  }

  loadQuizzes(): void {
    this.quizService.getAllQuizzes().subscribe({
      next: (data) => {
        this.quizzes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading quizzes:', err);
        this.isLoading = false;
      }
    });
  }


  startQuiz(quizId: number): void {
    this.router.navigate(['/quizdetails', quizId]);
  }
}

