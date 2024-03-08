'use client';

import Link from 'next/link';

import { useEffect, useState } from 'react';
import { IoIosChatboxes } from 'react-icons/io';
import { LuTicket } from 'react-icons/lu';
import { MdOutlineSupportAgent } from 'react-icons/md';

import { useTicket } from '@/components/hooks/useTicket';
import type { History } from '@/components/hooks/useTicket';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import Footer from '@/components/ui/footer/footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

export default function Page() {
    const { getHistory } = useTicket();
    const [history, setHistory] = useState<History[] | null>(null);

    useEffect(() => {
        if (history === null) {
            getHistory().then((h) => {
                if (h.status === 'success') {
                    setHistory(h.data);
                }
            });
        }
    });

    return (
        <>
            <div className="px-32 py-12">
                <div className="prose pb-0">
                    <h2 className="flex items-center gap-2">
                        <LuTicket />
                        My Tickets
                    </h2>
                </div>

                <div className="flex gap-6 pb-2 my-6 max-w-full overflow-x-scroll">
                    {history &&
                        history.map((v) => (
                            <div key={v.slug}>
                                <Card className="w-72">
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            {v.title}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-5">
                                            {v.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardFooter>
                                        <Link
                                            href={`/ticket/${v.slug}`}
                                            className="w-full"
                                        >
                                            <Button className="w-full flex items-center gap-2">
                                                Chat
                                                <IoIosChatboxes />
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </div>
                        ))}
                </div>

                <div className="prose pb-6">
                    <h2 className="flex items-center gap-2">
                        <MdOutlineSupportAgent />
                        Submit a ticket
                    </h2>
                </div>

                <form className="max-w-lg grid items-start gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input type="text" id="title" name="title" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" />
                    </div>

                    <Button className="w-fit px-12">Submit</Button>
                </form>
            </div>

            <Separator />
            <Footer />
        </>
    );
}
