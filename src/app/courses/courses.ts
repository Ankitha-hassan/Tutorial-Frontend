import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from './course-service';
import { Course } from '../Models/tutorial.models';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-courses',
  imports: [CommonModule,RouterModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css'
})
export class Courses implements OnInit {
  courses: Course[] = [];
  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
      this.courseService.getCourses().subscribe({
      next: (data) => this.courses = data,
      error: (err) => console.error('Error loading courses:', err)
    });  }
    
}
