'use client';

import Link from 'next/link';

import { useContext } from 'react';

import { Settings } from 'lucide-react';

import SlugContext from '@/components/context/SlugContext';
import { Button } from '@/components/ui/button';

export default function SubNavBar() {
    const slug = useContext(SlugContext);
    return (
        <>
            <nav className="flex items-center justify-end shadow px-6 w-full text-muted-foreground py-1.5">
                <Link href={`/classroom/${slug}/setting`}>
                    <Button
                        variant="none"
                        size="none"
                        className="hover:bg-muted p-2 rounded-full"
                    >
                        <Settings className="w-5 h-5" />
                    </Button>
                </Link>
            </nav>
        </>
    );
}
