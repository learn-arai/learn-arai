'use client';

import Link from 'next/link';

import { useContext } from 'react';

import { Settings } from 'lucide-react';

import { ClassroomContext } from '@/components/context/ClassroomContext';
import SlugContext from '@/components/context/SlugContext';
import { Button } from '@/components/ui/button';

import ClassroomTab from './classroom-tab';

export default function SubNavBar() {
    const slug = useContext(SlugContext);
    const classroom = useContext(ClassroomContext);

    return (
        <>
            <nav className="flex h-12 w-full items-center justify-between px-6 text-muted-foreground shadow">
                <ClassroomTab />

                {classroom && classroom.type === 'teacher' && (
                    <Link
                        href={`/classroom/${slug}/setting`}
                        className="py-1.5"
                    >
                        <Button
                            variant="none"
                            size="none"
                            className="rounded-full p-2 hover:bg-muted"
                        >
                            <Settings className="h-5 w-5" />
                        </Button>
                    </Link>
                )}
            </nav>
        </>
    );
}
