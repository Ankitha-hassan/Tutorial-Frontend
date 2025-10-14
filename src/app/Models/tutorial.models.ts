
export interface Course {
  courseId: number;
  courseName: string;
  description?: string;
  topics?: Topic[];
}
export interface Topic {
  open: any;
  topicId: number;
  courseId: number;
  topicName: string;
  subtopics?: Subtopic[];
}
export interface Subtopic {
  subtopicId: number;
  topicId: number;
  subTopicName: string;
}
export interface Content {
  id: number;
  subtopicId: number;
  title: string;
  body: string; // markdown/html
  contentType: 'markdown'|'html'|'video'|'embed';
}
