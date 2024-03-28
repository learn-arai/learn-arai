'use client';

import Link from 'next/link';

import { useContext } from 'react';
import { FaFileImport } from 'react-icons/fa6';

import { PlusIcon } from 'lucide-react';

import SlugContext from '@/components/context/SlugContext';
import { Button } from '@/components/ui/button';

import ProblemList from './problem-list';

export default function Page() {
    const slug = useContext(SlugContext);

    return (
        <>
            <div className="max-w-5xl mx-auto py-4">
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

                <ProblemList />
            </div>
        </>
    );
}
