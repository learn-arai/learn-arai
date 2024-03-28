'use client';

import React, { useEffect } from 'react';
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
                <div className="w-full flex flex-col justify-center items-center">
                    <IoMdCloudy className="text-muted-foreground h-fit w-2/5 opacity-10 -my-4" />

                    <Button onClick={open} size="sm" className="px-10 z-50">
                        Browse
                    </Button>

                    <input {...getInputProps()} />
                    <p className="mt-2 font-normal text-muted-foreground text-sm">
                        Or drag files here
                    </p>
                </div>
            </div>
        </div>
    );
}
