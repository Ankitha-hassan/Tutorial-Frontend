import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course, Subtopic, Topic } from '../Models/tutorial.models';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
   private apiUrl = 'http://localhost:8080/api/Course'; 
   private apiUrl1 = 'http://localhost:8080/api/Topics';
   private apiUrl2 = 'http://localhost:8080/api/Subtopics';

  constructor(private http: HttpClient) { }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  getTopicsByCourseId(courseId: number): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${this.apiUrl1}/ByCourse/${courseId}`);
  }

  getSubtopicsByTopicId(topicId: number): Observable<Subtopic[]> {
    return this.http.get<Subtopic[]>(`${this.apiUrl2}/ByTopic/${topicId}`);
  }
}
//http://localhost:8080/api/Course/1
