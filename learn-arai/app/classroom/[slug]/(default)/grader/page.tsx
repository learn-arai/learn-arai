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
            <div className="max-w-5xl mx-auto py-4 min-h-[60vh]">
                {classroom?.type === 'teacher' && (
                    <div className="flex items-center gap-2">
                        <Link href={`/classroom/${slug}/grader/create`}>
                            <Button className="flex gap-1 items-center">
                                Create
                                <PlusIcon className="w-4 h-4" />
                            </Button>
                        </Link>

                        <Link href={`/classroom/${slug}/grader/import`}>
                            <Button
                                className="flex gap-1 items-center"
                                variant="secondary"
                            >
                                Import zip
                                <FaFileImport className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                )}

                <ProblemList />

                <Card className="fixed bottom-0 w-full rounded-none left-1/2 -translate-x-1/2 shadow">
                    <CardContent className="p-2 font-mono flex justify-end">
                        <div>100/100</div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
