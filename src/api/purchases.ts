import { api } from './client';
import type { CheckoutOrder, PricingInfo, SubjectPurchase } from '../types';

export function getPricing() {
  return api<PricingInfo>('/purchases/pricing');
}

export function listPurchases() {
  return api<{ purchases: SubjectPurchase[] }>('/purchases').then((res) => res.purchases);
}

export function createCheckout(subject: string) {
  return api<CheckoutOrder>('/purchases/checkout', { method: 'POST', body: { subject } });
}

export interface VerifyPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export function verifyPayment(payload: VerifyPayload) {
  return api<{ success: boolean }>('/purchases/verify', { method: 'POST', body: payload });
}

export function payWithWallet(subject: string) {
  return api<{ success: boolean; balance: number }>('/purchases/wallet-pay', {
    method: 'POST',
    body: { subject },
  });
}
