import { Component, OnInit } from '@angular/core';
import { CourseService } from '../courses/course-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Course, Subtopic, Topic } from '../Models/tutorial.models';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-subtopic-content',
  imports: [CommonModule, RouterModule],
  templateUrl: './subtopic-content.html',
  styleUrl: './subtopic-content.css'
})
export class SubtopicContent implements OnInit {
  subtopicContent?: Subtopic;
  topics: Topic[] = [];
  courses: any;
  loading = true;
  error = '';
  hasSidebar = true;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 🔹 Subscribe to shared topics from service
    this.courseService.topics$.subscribe((topics) => {
      this.topics = topics;
    });

    // 🔹 Fetch subtopic content
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('subtopicId');
      const id = Number(idParam);

      if (id && !isNaN(id)) {
        this.courseService.getContentBySubtopicId(id).subscribe({
          next: (data) => {
            console.log('Fetched Subtopic Content:', data);
            this.subtopicContent = data;
            this.setNavigation();
            this.loading = false;
          },
          error: (err) => {
            console.error(err);
            this.error = 'Failed to load content';
            this.loading = false;
          }
        });
      } else {
        this.error = 'Invalid Subtopic ID';
        this.loading = false;
      }
    });
  }

  toggleTopic(index: number): void {
    this.topics[index].open = !this.topics[index].open;
  }

  selectSubtopic(id: number): void {
    console.log('Selected Subtopic ID:', id);
  }

  isCompleted = false;

  markAsComplete(): void {
  this.isCompleted = true;
}
  currentSubtopicIndex: number = 0;
  previousSubtopic: Subtopic | null = null;
  nextSubtopic: Subtopic | null = null;

  private setNavigation() {
    if (!this.topics?.length || !this.subtopicContent) {
      this.previousSubtopic = null;
      this.nextSubtopic = null;
      return;
    }

    // Flatten all subtopics safely
    const allSubtopics = this.topics.flatMap(t => t.subtopics ?? []);

    // Find current subtopic index safely
    const currentIndex = allSubtopics.findIndex(
      s => s.subTopicId === this.subtopicContent?.subTopicId
    );

    if (currentIndex === -1) {
      this.previousSubtopic = null;
      this.nextSubtopic = null;
      return;
    }

    this.currentSubtopicIndex = currentIndex;
    this.previousSubtopic = allSubtopics[currentIndex - 1] ?? null;
    this.nextSubtopic = allSubtopics[currentIndex + 1] ?? null;
  }

  goToPreviousSubtopic() {
    if (this.previousSubtopic) {
      this.router.navigate(['/subtopics', this.previousSubtopic.subTopicId]);
    }
  }

  goToNextSubtopic() {
    if (this.nextSubtopic) {
      this.router.navigate(['/subtopics', this.nextSubtopic.subTopicId]);
    }
  }

}
