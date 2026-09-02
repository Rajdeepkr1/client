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
  price: number | null;
  purchased: boolean;
}

export interface SubjectDetail {
  slug: string;
  title: string;
  content: string;
  topics: TopicSummary[];
  locked: false;
  price: number | null;
}

export interface LockedSubject {
  slug: string;
  title: string;
  topicCount: number;
  locked: true;
  price: number;
}

export type SubjectResponse = SubjectDetail | LockedSubject;

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

export interface PricingInfo {
  configured: boolean;
  prices: Record<string, number>;
}

export interface SubjectPurchase {
  subject: string;
  amount: number;
  currency: string;
  createdAt: string;
}

export type CheckoutOrder =
  | { free: true }
  | { free?: false; orderId: string; amount: number; currency: string; keyId: string };

export interface WalletTransactionRecord {
  _id: string;
  type: 'topup' | 'purchase' | 'refund';
  amount: number;
  balanceAfter: number;
  subject?: string;
  createdAt: string;
}

export interface WalletInfo {
  balance: number;
  transactions: WalletTransactionRecord[];
}

export type TopUpOrder =
  | { free: true; balance: number }
  | { free?: false; orderId: string; amount: number; currency: string; keyId: string };
