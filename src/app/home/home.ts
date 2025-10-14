import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CourseService } from '../courses/course-service';
import { Course } from '../Models/tutorial.models';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  imports: [RouterModule,CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  courses: Course[] = [];
  constructor(private courseService: CourseService) { } 

  ngOnInit(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        console.log('Courses from backend:', data);
        this.courses = data},
      error: (err) => console.error('Error loading courses:', err)
    });
  }
}
