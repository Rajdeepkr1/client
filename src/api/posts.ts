import { api } from './client';
import type { Post } from '../types';

export function listPosts() {
  return api<{ posts: Post[] }>('/posts').then((res) => res.posts);
}

export function createPost(content: string) {
  return api<{ post: Post }>('/posts', { method: 'POST', body: { content } }).then((res) => res.post);
}

export function deletePost(id: string) {
  return api<{ success: boolean }>(`/posts/${id}`, { method: 'DELETE' });
}
