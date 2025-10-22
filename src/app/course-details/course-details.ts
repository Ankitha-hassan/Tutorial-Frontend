import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course, Subtopic, Topic } from '../Models/tutorial.models';
import { CourseService } from '../courses/course-service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  imports: [RouterModule, CommonModule],
  selector: 'app-course-details',
  templateUrl: './course-details.html',
  styleUrl: './course-details.css'
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

  // Fetch topics and then subtopics for each
    this.courseService.getTopicsByCourseId(this.courseId).subscribe({
      next: (topics) => {
        this.selectedTopics = topics;
        console.log('Selected Topics:', topics);

        // for each topic, fetch its subtopics
        this.selectedTopics.forEach((topic) => {
          this.courseService.getSubtopicsByTopicId(topic.topicId).subscribe({
            next: (subtopics) => {
              topic.subtopics = subtopics; // store directly inside topic
              console.log(`Subtopics for Topic ${topic.topicId}:`, subtopics);

              
            },
            error: (err) => {
              console.error(err);
            }
          });
        });
        this.courseService.setTopics(this.selectedTopics);

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load topics';
        this.loading = false;
      }
    });
  }
  
  selectedSubtopicId: number | null = null;
selectSubtopic(id: number): void {
  this.selectedSubtopicId = id;
  console.log('Selected Subtopic ID:', this.selectedSubtopicId);
}
  toggleTopic(index: number): void {
  this.selectedTopics[index].open = !this.selectedTopics[index].open;
}
getTotalLessons(): number {
    if (!this.selectedTopics?.length) return 0;
    return this.selectedTopics.reduce((total, topic) => {
      return total + (topic.subtopics?.length || 0);
    }, 0);
  }
  
}
