import { cn } from '@/lib/utils';

export default function CodeLine({
    content,
    className,
}: {
    content: string;
    className?: string;
}) {
    return (
        <p className={cn('rounded-sm bg-primary px-2 text-white', className)}>
            {content}
        </p>
    );
}
