'use client';

import Link from 'next/link';

import { useContext } from 'react';

import { Settings } from 'lucide-react';

import SlugContext from '@/components/context/SlugContext';
import { Button } from '@/components/ui/button';

import ClassroomTab from './classroom-tab';

export default function SubNavBar() {
    const slug = useContext(SlugContext);
    return (
        <>
            <nav className="flex items-center justify-between shadow px-6 w-full text-muted-foreground">
                <ClassroomTab />

                <Link href={`/classroom/${slug}/setting`} className="py-1.5">
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
