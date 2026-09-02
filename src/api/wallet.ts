import { api } from './client';
import type { TopUpOrder, WalletInfo } from '../types';
import type { VerifyPayload } from './purchases';

export function getWallet() {
  return api<WalletInfo>('/wallet');
}

export function topUp(amount: number) {
  return api<TopUpOrder>('/wallet/topup', { method: 'POST', body: { amount } });
}

export function verifyTopUp(payload: VerifyPayload) {
  return api<{ success: boolean; balance: number }>('/wallet/verify', {
    method: 'POST',
    body: payload,
  });
}
