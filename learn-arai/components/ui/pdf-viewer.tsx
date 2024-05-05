'use client';

import { cn } from '@/lib/utils';

export default function PDFViewer(props: { url: string; className?: string }) {
    const { url } = props;

    return (
        <iframe src={url} className={cn('w-full h-full', props.className)} />
    );
}
