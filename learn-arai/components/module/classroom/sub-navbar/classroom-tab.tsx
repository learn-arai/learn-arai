'use client';

import Link from 'next/link';

import { useContext } from 'react';

import SlugContext from '@/components/context/SlugContext';
import { Button } from '@/components/ui/button';

export default function ClassroomTab() {
    const slug = useContext(SlugContext);

    return (
        <>
            <div className="text-sm">
                <Link href={`/classroom/${slug}`}>
                    <Button variant="ghost" className="font-semibold">
                        Stream
                    </Button>
                </Link>

                <Link href={`/classroom/${slug}/assignment`}>
                    <Button variant="ghost" className="font-semibold">
                        Classwork
                    </Button>
                </Link>

                <Link href={`/classroom/${slug}/member`}>
                    <Button variant="ghost" className="font-semibold">
                        People
                    </Button>
                </Link>
            </div>
        </>
    );
}
