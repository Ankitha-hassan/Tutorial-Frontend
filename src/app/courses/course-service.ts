import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject,Observable } from 'rxjs';
import {  Course, Subtopic, Topic } from '../Models/tutorial.models';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
 
  private topicsSource = new BehaviorSubject<Topic[]>([]);
  topics$ = this.topicsSource.asObservable();

  setTopics(topics: Topic[]) {
    this.topicsSource.next(topics);
  }

  private gatewayUrl = 'http://localhost:8082/api'; // Gateway base URL
  constructor(private http: HttpClient) { }
getCourses(): Observable<Course[]> {
  return this.http.get<Course[]>(`${this.gatewayUrl}/Course`);
}

getCourseById(id: number): Observable<Course> {
  return this.http.get<Course>(`${this.gatewayUrl}/Course/${id}`);
}

getTopicsByCourseId(courseId: number): Observable<Topic[]> {
  return this.http.get<Topic[]>(`${this.gatewayUrl}/Topics?courseId=${courseId}`);
}

getSubtopicsByTopicId(topicId: number): Observable<Subtopic[]> {
  return this.http.get<Subtopic[]>(`${this.gatewayUrl}/SubTopics?topicId=${topicId}`);
}

getContentBySubtopicId(subtopicId: number): Observable<Subtopic> {
  return this.http.get<Subtopic>(`${this.gatewayUrl}/SubTopics/${subtopicId}`);
}

}