import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuizDetailsService } from './quiz-details-service';
import { Question, Quiz } from '../Models/quiz-models';
import { AuthenticationService } from '../login/authentication-service';

interface QuizAnswer {
  questionId: number;
  selectedOptionId: number;
}

@Component({
  selector: 'app-quiz-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-details.html',
  styleUrls: ['./quiz-details.css']
})
export class QuizDetails implements OnInit, OnDestroy {
  quizId!: number;
  questions: Question[] = [];
  currentQuestionIndex = 0;
  answers: QuizAnswer[] = [];
  quiz!: Quiz;
  timer = 0;
  timerInterval: any;
  showResults = false;
  quizTitle = 'Quiz';
  results: any = null; // stores results from service

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizDetailsService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('quizId');
      this.quizId = id ? Number(id) : 0;
      if (this.quizId > 0) {
        this.loadQuizQuestions();
        this.startTimer();
      } else {
        console.error('Invalid quizId');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  loadQuizQuestions(): void {
    this.quizService.getQuizDetails(this.quizId).subscribe({
      next: (data) => {
        this.questions = data;
        this.quizTitle = `Quiz #${this.quizId}`;
      },
      error: (err) => console.error('Error loading quiz:', err)
    });
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => this.timer++, 1000);
  }

  formatTime(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  get currentQuestion(): Question | undefined {
    return this.questions[this.currentQuestionIndex];
  }

  get progress(): number {
    return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  }

  get answeredCount(): number {
    return this.answers.length;
  }

  selectOption(questionId: number, optionId: number): void {
    const existing = this.answers.find(a => a.questionId === questionId);
    if (existing) existing.selectedOptionId = optionId;
    else this.answers.push({ questionId, selectedOptionId: optionId });
  }

  isOptionSelected(qId: number, oId: number): boolean {
    return this.answers.find(a => a.questionId === qId)?.selectedOptionId === oId;
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) this.currentQuestionIndex--;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) this.currentQuestionIndex++;
  }

  submitQuiz(): void {
    clearInterval(this.timerInterval);
    this.results = this.quizService.calculateResults(this.questions, this.answers);
    this.showResults = true;

    const userId = this.authService.getUserId();
    if (!userId) {
      alert('Please log in to submit your quiz.');
      return;
    }

    const payload = {
      userId,
      quizId: this.quizId,
      score: this.results.score
    };

    this.quizService.submitQuiz(payload).subscribe({
      next: () => alert(`Quiz submitted! \nScore: ${this.results.score}/${this.results.total}`),
      error: (err) => console.error('Submit error:', err)
    });
  }

  getQuestionReview() {
    return this.questions.map(q => {
      const userAnswer = this.answers.find(a => a.questionId === q.questionId);
      const correctOption = q.options.find(o => o.isCorrect);
      const selectedOption = q.options.find(o => o.optionId === userAnswer?.selectedOptionId);

      return {
        question: q.questionText,
        yourAnswer: selectedOption?.optionText || 'Not answered',
        correctAnswer: correctOption?.optionText || '',
        isCorrect: userAnswer?.selectedOptionId === correctOption?.optionId,
        points: q.marks
      };
    });
  }

  backToQuizList(): void {
    this.router.navigate(['/quiz-list']);
  }

  charFromCode(i: number): string {
    return String.fromCharCode(65 + i);
  }
}
