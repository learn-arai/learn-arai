'use client';

import { useSearchParams } from 'next/navigation';

import { usePayment } from '@/components/hooks/usePayment';

export default function Page() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    const { useGetCheckoutSession } = usePayment();
    const { data } = useGetCheckoutSession(sessionId || '');

    console.log(data);

    return (
        <>
            <p>{sessionId}</p>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </>
    );
}
