import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Layout } from './layout/layout';
import { Courses } from './courses/courses';
import { CourseDetails } from './course-details/course-details';
import { SubtopicContent } from './sub-topic-content/subtopic-content';

export const routes: Routes = [
    { path : '', component: Layout ,
        children: [
            {path: 'home', component: Home},
            {path: 'Courses', component: Courses},
            {path: 'course-details', component: CourseDetails},
            { path: 'course-details/:id', component: CourseDetails },
            { path: 'subtopics/:subtopicId', component: SubtopicContent },
            { path: '', redirectTo: '/home', pathMatch: 'full' }
        ]

    } 
   
    
];
