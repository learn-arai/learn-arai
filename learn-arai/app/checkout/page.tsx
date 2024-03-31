'use client';

import {
    EmbeddedCheckout,
    EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { usePayment } from '@/components/hooks/usePayment';

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function Page() {
    const { createCheckoutAndGetClientSecret } = usePayment();

    const options = { fetchClientSecret: createCheckoutAndGetClientSecret };

    return (
        <div className="h-screen flex items-center">
            <EmbeddedCheckoutProvider stripe={stripe} options={options}>
                <EmbeddedCheckout className="w-full" />
            </EmbeddedCheckoutProvider>
        </div>
    );
}
