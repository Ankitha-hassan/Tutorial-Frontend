// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { QuizDetailsService} from './quiz-details-service';
// import { CommonModule } from '@angular/common';
// import { Question } from '../Models/quiz-models';

// @Component({
//   selector: 'app-quiz-details',
//   templateUrl: './quiz-details.html',
//   imports:[CommonModule]
// })
// export class QuizDetails implements OnInit {

//   quizId!: number;
//   questions: Question[] = [];

//   constructor(
//     private route: ActivatedRoute,
//     private quizService: QuizDetailsService
//   ) { }

//   ngOnInit(): void {
//      this.route.paramMap.subscribe(params => {
//     const id = params.get('quizId');
//     this.quizId = id ? Number(id) : 0;
//     console.log('Quiz ID from route:', this.quizId);

//     if (this.quizId > 0) {
//       this.loadQuizQuestions();
//     } else {
//       console.error('Invalid or missing quizId');
//     }
//   });
//   }

//   loadQuizQuestions() {
//     this.quizService.getQuizDetails(this.quizId).subscribe(
//       data => this.questions = data,
//       error => console.error(error)
//     );
//   }
// }
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizDetailsService } from './quiz-details-service';
import { CommonModule } from '@angular/common';
import { Question } from '../Models/quiz-models';

interface QuizAnswer {
  questionId: number;
  selectedOptionId: number;
}

@Component({
  selector: 'app-quiz-details',
  templateUrl: './quiz-details.html',
  styleUrls: ['./quiz-details.css'],
  imports: [CommonModule]
})
export class QuizDetails implements OnInit, OnDestroy {
  quizId!: number;
  questions: Question[] = [];
  currentQuestionIndex: number = 0;
  answers: QuizAnswer[] = [];
  timer: number = 0;
  timerInterval: any;
  showResults: boolean = false;
  quizTitle: string = 'JavaScript Basics Quiz';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizDetailsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('quizId');
      this.quizId = id ? Number(id) : 0;

      if (this.quizId > 0) {
        this.loadQuizQuestions();
        this.startTimer();
      } else {
        console.error('Invalid or missing quizId');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  loadQuizQuestions(): void {
    this.quizService.getQuizDetails(this.quizId).subscribe({
      next: (data) => {
        this.questions = data;
      },
      error: (error) => console.error('Error loading questions:', error)
    });
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.timer++;
    }, 1000);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
    const existingIndex = this.answers.findIndex(a => a.questionId === questionId);
    
    if (existingIndex >= 0) {
      this.answers[existingIndex].selectedOptionId = optionId;
    } else {
      this.answers.push({ questionId, selectedOptionId: optionId });
    }
  }

  isOptionSelected(questionId: number, optionId: number): boolean {
    const answer = this.answers.find(a => a.questionId === questionId);
    return answer?.selectedOptionId === optionId;
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.submitQuiz();
    }
  }

  submitQuiz(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.showResults = true;
  }

  calculateResults() {
    let correctCount = 0;
    let totalPoints = 0;

    this.questions.forEach(q => {
      totalPoints += q.marks;
      const userAnswer = this.answers.find(a => a.questionId === q.questionId);
      const correctOption = q.options.find(o => o.isCorrect);
      
      if (userAnswer && correctOption && userAnswer.selectedOptionId === correctOption.optionId) {
        correctCount += q.marks;
      }
    });

    return {
      score: correctCount,
      total: totalPoints,
      percentage: ((correctCount / totalPoints) * 100).toFixed(2),
      passed: (correctCount / totalPoints) * 100 >= 70
    };
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
  return String.fromCharCode(65 + i); // 65 = 'A'
}
}