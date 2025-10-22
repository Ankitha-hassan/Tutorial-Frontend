import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from './course-service';
import { Course } from '../Models/tutorial.models';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-courses',
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css'
})
export class Courses implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchTerm: string = '';

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
     this.courseService.getCourses().subscribe((data: Course[]) => {
      this.courses = data;
      this.filteredCourses = data; // initially show all
    });
  }

  filterCourses() {
    const term = this.searchTerm.toLowerCase();
    this.filteredCourses = this.courses.filter(course =>
      course.courseName.toLowerCase().includes(term) ||
      course.description?.toLowerCase().includes(term)
    );
  }
    
}
