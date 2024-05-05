import Link from 'next/link';

import { useContext } from 'react';
import { FaAngleLeft } from 'react-icons/fa';

import { LockIcon } from 'lucide-react';

import { cn, timeAgo } from '@/lib/utils';

import { TicketContext } from '@/components/context/TicketContext';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function ChatList({ slug }: { slug: string }) {
    const ticket = useContext(TicketContext);

    return (
        <>
            <Card className="relative rounded-none border-r-0">
                <CardContent className="py-4 text-center font-semibold">
                    <h2>My Tickets</h2>
                </CardContent>

                <Link
                    href="/ticket"
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                >
                    <FaAngleLeft className="" />
                </Link>
            </Card>

            <div className="flex flex-col gap-2 p-4">
                {ticket.history?.map((h) => (
                    <div key={h.slug}>
                        <Link href={`/ticket/${h.slug}`}>
                            <Card
                                className={cn('', slug == h.slug && 'bg-muted')}
                            >
                                <CardHeader className="p-4">
                                    <CardTitle className="flex items-center justify-between text-base">
                                        {h.isClose && (
                                            <div className="mr-1 flex min-w-fit items-center gap-1 text-green-500">
                                                <LockIcon className="h-4 w-4" />
                                                <span className="text-sm font-light">
                                                    (closed)
                                                </span>
                                            </div>
                                        )}

                                        <span className="mx-auto ml-0 truncate whitespace-nowrap">
                                            {h.title}
                                        </span>

                                        <span className="min-w-fit text-sm font-medium text-muted-foreground">
                                            {timeAgo(h.createdAt, true)} ago
                                        </span>
                                    </CardTitle>
                                    <CardDescription>
                                        {h.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    </div>
                ))}
            </div>
        </>
    );
}
