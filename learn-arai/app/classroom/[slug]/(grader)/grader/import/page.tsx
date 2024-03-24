import { FolderOpen, Terminal } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import FileTree, { File } from '@/components/ui/file-tree';

export default function Page() {
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
                    ],
                },
            ],
        },
    ];

    return (
        <>
            <div className="max-w-5xl mx-auto py-4">
                <Alert variant="warning">
                    <Terminal
                        className="h-4 w-4"
                        color="hsl(var(--ds-amber-900))"
                    />
                    <AlertTitle>File format & How to import</AlertTitle>
                    <AlertDescription className="prose text-amber-900">
                        <FileTree file={fileGuide} className="pb-1" noPadding />
                        You can add components and dependencies to your app
                        using the cli.
                    </AlertDescription>
                </Alert>
            </div>
        </>
    );
}
