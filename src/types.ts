export interface TopicSummary {
  id: string;
  title: string;
  order: number;
}

export interface SubjectSummary {
  slug: string;
  title: string;
  topicCount: number;
  topics: TopicSummary[];
}

export interface SubjectDetail {
  slug: string;
  title: string;
  content: string;
  topics: TopicSummary[];
}

export interface TopicDetail {
  subject: string;
  subjectTitle: string;
  id: string;
  title: string;
  content: string;
}

export interface SearchResult {
  subject: string;
  subjectTitle: string;
  topicId: string;
  topicTitle: string;
  snippet: string;
}

export interface ProgressItem {
  _id: string;
  subject: string;
  topicId: string;
  subjectTitle: string;
  topicTitle: string;
  read: boolean;
  bookmarked: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
}

export interface Post {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
