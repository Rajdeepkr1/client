interface RazorpayCheckoutOptions {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayCheckout {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayCheckout;
  }
}

const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';
let loadPromise: Promise<void> | null = null;

export function loadRazorpayScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.onload = () => resolve();
    script.onerror = () => {
      loadPromise = null;
      reject(new Error('Could not load the Razorpay checkout script.'));
    };
    document.body.appendChild(script);
  });

  return loadPromise;
}

export function openRazorpayCheckout(options: RazorpayCheckoutOptions) {
  if (!window.Razorpay) throw new Error('Razorpay script not loaded yet.');
  const checkout = new window.Razorpay(options);
  checkout.open();
}
