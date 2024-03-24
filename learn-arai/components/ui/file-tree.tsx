import { CornerDownRight, File, FolderOpen } from 'lucide-react';

import { cn } from '@/lib/utils';

export default function FileTree(props: {
    file: File[];
    className?: string;
    asChild?: boolean;
    noPadding?: boolean;
}) {
    const { file, className, asChild, noPadding } = props;

    return (
        <div className={cn('pt-1 space-y-1', className)}>
            {file.map((f) => (
                <div key={f.name} className="">
                    <div className="flex items-center gap-2">
                        {asChild && (
                            <CornerDownRight className="w-4 h-4 opacity-25" />
                        )}
                        {f.type === 'directory' ? (
                            <div className="flex items-center gap-1">
                                <FolderOpen className="w-4 h-4" />
                                {f.name}
                            </div>
                        ) : (
                            <div className="flex items-center gap-1">
                                <File className="w-4 h-4" /> {f.name}
                            </div>
                        )}
                    </div>

                    {f.children && (
                        <div className={cn(!noPadding && 'pl-4')}>
                            <FileTree file={f.children} asChild />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export type File = {
    name: string;
    type: 'file' | 'directory';
    children?: File[];
};
