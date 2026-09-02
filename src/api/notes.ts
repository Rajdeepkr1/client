import { api } from './client';
import type { SearchResult, SubjectResponse, SubjectSummary, TopicDetail } from '../types';

export function getSubjects() {
  return api<{ subjects: SubjectSummary[] }>('/subjects').then((res) => res.subjects);
}

export function getSubject(slug: string) {
  return api<SubjectResponse>(`/subjects/${slug}`);
}

export function getTopic(slug: string, topicId: string) {
  return api<TopicDetail>(`/subjects/${slug}/topics/${topicId}`);
}

export function searchNotes(query: string) {
  if (!query || query.trim().length < 2) return Promise.resolve<SearchResult[]>([]);
  return api<{ results: SearchResult[] }>('/subjects/search', { params: { q: query } }).then(
    (res) => res.results
  );
}
