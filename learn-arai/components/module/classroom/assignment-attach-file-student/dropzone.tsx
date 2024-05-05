'use client';

import React from 'react';
import { useDropzone } from 'react-dropzone';
import { IoMdCloudy } from 'react-icons/io';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

export default function Dropzone(props: { onDrop: (files: File[]) => void }) {
    const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
        // Disable click and keydown behavior
        noClick: true,
        noKeyboard: true,
        onDropAccepted: (files) => {
            props.onDrop(files);
        },
    });

    return (
        <div className={cn('pb-6', isDragActive && 'bg-green-500/15')}>
            <div
                {...getRootProps({
                    className: 'dropzone',
                })}
            >
                <div className="flex w-full flex-col items-center justify-center">
                    <IoMdCloudy className="-my-4 h-fit w-2/5 text-muted-foreground opacity-10" />

                    <Button onClick={open} size="sm" className="z-50 px-10">
                        Browse
                    </Button>

                    <input {...getInputProps()} />
                    <p className="mt-2 text-sm font-normal text-muted-foreground">
                        Or drag files here
                    </p>
                </div>
            </div>
        </div>
    );
}
