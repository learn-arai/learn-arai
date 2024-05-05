'use client';

import Link from 'next/link';

import { useContext } from 'react';
import { FaFileImport } from 'react-icons/fa6';

import { PlusIcon } from 'lucide-react';

import { ClassroomContext } from '@/components/context/ClassroomContext';
import SlugContext from '@/components/context/SlugContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import ProblemList from './problem-list';

export default function Page() {
    const classroom = useContext(ClassroomContext);
    const slug = useContext(SlugContext);

    return (
        <>
            <div className="mx-auto min-h-[60vh] max-w-5xl py-4">
                {classroom?.type === 'teacher' && (
                    <div className="flex items-center gap-2">
                        <Link href={`/classroom/${slug}/grader/create`}>
                            <Button className="flex items-center gap-1">
                                Create
                                <PlusIcon className="h-4 w-4" />
                            </Button>
                        </Link>

                        <Link href={`/classroom/${slug}/grader/import`}>
                            <Button
                                className="flex items-center gap-1"
                                variant="secondary"
                            >
                                Import zip
                                <FaFileImport className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                )}

                <ProblemList />

                <Card className="fixed bottom-0 left-1/2 w-full -translate-x-1/2 rounded-none shadow">
                    <CardContent className="flex justify-end p-2 font-mono">
                        <div>100/100</div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
