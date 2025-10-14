
export interface Course {
  courseId: number;
  courseName: string;
  description?: string;
  topics?: Topic[];
}
export interface Topic {
  topicId: number;
  courseId: number;
  topicName: string;
  subtopics?: Subtopic[];
}
export interface Subtopic {
  subtopicId: number;
  topicId: number;
  subtopicName: string;
}
export interface Content {
  id: number;
  subtopicId: number;
  title: string;
  body: string; // markdown/html
  contentType: 'markdown'|'html'|'video'|'embed';
}
