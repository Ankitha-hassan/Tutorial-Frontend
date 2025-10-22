import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject,Observable } from 'rxjs';
import {  Course, Subtopic, Topic } from '../Models/tutorial.models';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
   private apiUrl = 'http://localhost:9090/api/v1/Courses'; 
   private apiUrl1 = 'http://localhost:9090/api/v1/Courses';
   private apiUrl2 = 'http://localhost:9090/api/v1/Courses/topics';
   private apiUrl3 = 'http://localhost:9090/api/v1/Courses/subtopics';

  constructor(private http: HttpClient) { }

   private topicsSource = new BehaviorSubject<Topic[]>([]);
  topics$ = this.topicsSource.asObservable();

  setTopics(topics: Topic[]) {
    this.topicsSource.next(topics);
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  getTopicsByCourseId(courseId: number): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${this.apiUrl1}/${courseId}/topics`);
  }

  getSubtopicsByTopicId(topicId: number): Observable<Subtopic[]> {
    return this.http.get<Subtopic[]>(`${this.apiUrl2}/${topicId}/subtopics`);
  }
  getContentBySubtopicId(subtopicId: number): Observable<Subtopic> {
    return this.http.get<Subtopic>(`${this.apiUrl3}/${subtopicId}`);
  }
}