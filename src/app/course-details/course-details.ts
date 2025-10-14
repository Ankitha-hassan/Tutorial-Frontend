import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course, Subtopic, Topic } from '../Models/tutorial.models';
import { CourseService } from '../courses/course-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  imports: [CommonModule, RouterModule],
  selector: 'app-course-details',
  templateUrl: './course-details.html'
})
export class CourseDetails implements OnInit {
  selectedCourse: Course | undefined;
  selectedTopics: Topic[] = [];
  selectedSubTopics: Subtopic[] = [];
  courseId!: number | null;
  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
  const idParam = this.route.snapshot.paramMap.get('id');
  this.courseId = idParam ? Number(idParam) : null;

  if (this.courseId === null) {
    this.error = 'Invalid course ID.';
    this.loading = false;
    return;
  }

  // Fetch course details
  this.courseService.getCourseById(this.courseId).subscribe({
    next: (course) => {
      this.selectedCourse = course;
      console.log('Selected Course:', course);
      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.error = 'Could not load course.';
      this.loading = false;
    }
  });

  // Fetch topics for the course
  this.courseService.getTopicsByCourseId(this.courseId).subscribe({
    next: (topics) => {
      this.selectedTopics = topics;
      console.log('Topics:', topics);
    },
    error: (err) => {
      console.error(err);
      this.error = 'Failed to load topics';
    }
  });
}

}
