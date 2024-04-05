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
            <Card className="rounded-none relative border-r-0">
                <CardContent className="py-4 font-semibold text-center">
                    <h2>My Tickets</h2>
                </CardContent>

                <Link
                    href="/ticket"
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                >
                    <FaAngleLeft className="" />
                </Link>
            </Card>

            <div className="p-4 gap-2 flex flex-col">
                {ticket.history?.map((h) => (
                    <div key={h.slug}>
                        <Link href={`/ticket/${h.slug}`}>
                            <Card
                                className={cn('', slug == h.slug && 'bg-muted')}
                            >
                                <CardHeader className="p-4">
                                    <CardTitle className="text-base flex justify-between items-center">
                                        {h.isClose && (
                                            <div className="text-green-500 min-w-fit flex items-center gap-1 mr-1">
                                                <LockIcon className="w-4 h-4" />
                                                <span className="text-sm font-light">
                                                    (closed)
                                                </span>
                                            </div>
                                        )}

                                        <span className="truncate whitespace-nowrap mx-auto ml-0">
                                            {h.title}
                                        </span>

                                        <span className="font-medium text-muted-foreground text-sm min-w-fit">
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
