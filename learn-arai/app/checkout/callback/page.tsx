'use client';

import { useSearchParams } from 'next/navigation';

export default function Page() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    return <>{sessionId}</>;
}
