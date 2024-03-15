import { cn } from '@/lib/utils';

export default function CodeLine({
    content,
    className,
}: {
    content: string;
    className?: string;
}) {
    return (
        <p className={cn('px-2 bg-primary text-white rounded-sm', className)}>
            {content}
        </p>
    );
}
