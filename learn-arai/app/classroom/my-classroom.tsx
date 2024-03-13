'use client';

import { useGetMyClassroom } from '@/components/hooks/useClassroom';

export default function MyClassroom() {
    const { data, isLoading } = useGetMyClassroom();

    return (
        <>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </>
    );
}
