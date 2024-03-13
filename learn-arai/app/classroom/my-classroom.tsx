'use client';

import { useClassroom } from '@/components/hooks/useClassroom';

export default function MyClassroom() {
    const { useGetMyClassroom } = useClassroom();
    const { data, isLoading } = useGetMyClassroom();

    return (
        <>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </>
    );
}
