'use client';

import { Terminal } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import Dropzone from '@/components/ui/dropzone';
import FileTree, { File } from '@/components/ui/file-tree';
import { Separator } from '@/components/ui/separator';

export default function Page() {
    return (
        <>
            <div className="max-w-5xl mx-auto py-4 space-y-4">
                <ImportAlert />

                <Card>
                    <CardContent>
                        <Dropzone onDrop={(f) => console.log(f)} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

function ImportAlert() {
    const fileGuide: File[] = [
        {
            name: 'problem1.zip',
            type: 'directory',
            children: [
                {
                    name: 'docs.pdf',
                    type: 'file',
                },
                {
                    name: 'testcases',
                    type: 'directory',
                    children: [
                        {
                            name: '1.in',
                            type: 'file',
                        },
                        {
                            name: '1.sol',
                            type: 'file',
                        },
                        {
                            name: '...',
                            type: 'other',
                        },
                    ],
                },
                {
                    name: 'data',
                    type: 'directory',
                    optional: true,
                },
            ],
        },
    ];
    return (
        <Alert variant="warning">
            <Terminal className="h-4 w-4" color="hsl(var(--ds-amber-900))" />
            <AlertTitle>File format & How to import</AlertTitle>
            <AlertDescription className="prose max-w-none text-ds-amber-900 flex gap-8 items-start w-full">
                <FileTree file={fileGuide} className="pb-1" noPadding />
                <Separator
                    orientation="vertical"
                    className="h-[150px] my-auto bg-ds-amber-900"
                />
                <div className="py-4 w-full grow">
                    <p className="!my-0">
                        - The file should be in <strong>.zip</strong> format.
                    </p>
                    <p className="!my-0">
                        - Must contain a <strong>docs.pdf</strong> file for
                        problem instruction
                    </p>
                    <p className="!my-0">
                        - Testcases should be in a folder named{' '}
                        <strong>testcases</strong>
                    </p>
                    <p className="!my-0 pl-6">
                        - Each testcase should have an input file (
                        <strong>.in</strong>) and a output file (
                        <strong>.sol</strong>) but it can be any name.
                    </p>
                </div>
            </AlertDescription>
        </Alert>
    );
}
