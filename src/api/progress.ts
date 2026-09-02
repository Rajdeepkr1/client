import { api } from './client';
import type { ProgressItem } from '../types';

export function listProgress() {
  return api<{ progress: ProgressItem[] }>('/progress').then((res) => res.progress);
}

export function toggleRead(subject: string, topicId: string) {
  return api<{ progress: ProgressItem }>(`/progress/${subject}/${topicId}/read`, {
    method: 'POST',
  }).then((res) => res.progress);
}

export function toggleBookmark(subject: string, topicId: string) {
  return api<{ progress: ProgressItem }>(`/progress/${subject}/${topicId}/bookmark`, {
    method: 'POST',
  }).then((res) => res.progress);
}
