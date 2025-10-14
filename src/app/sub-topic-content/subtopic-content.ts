import { Component } from '@angular/core';
import { CourseService } from '../courses/course-service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Content } from '../Models/tutorial.models';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-subtopic-content',
  imports: [CommonModule, RouterModule],
  templateUrl: './subtopic-content.html',
  styleUrl: './subtopic-content.css'
})
export class SubtopicContent {
  subtopicContent: Content[] = [];
  loading: boolean = true;
  error: string = '';

   constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) { }

    ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('subtopicId');
      const id = Number(idParam);

      if (id && !isNaN(id)) {
        this.courseService.getContentBySubtopicId(id).subscribe({
          next: (data) => {
            this.subtopicContent = data;
            console.log('Subtopic Content:', data);
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
    }
  
