'use client';

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { useContext, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { IoIosChatboxes } from 'react-icons/io';
import { LuTicket } from 'react-icons/lu';
import { MdOutlineSupportAgent } from 'react-icons/md';

import { formatDate } from '@/lib/utils';

import { TicketContext } from '@/components/context/TicketContext';
import { useTicket } from '@/components/hooks/useTicket';
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
    const ticket = useContext(TicketContext);

    return (
        <>
            <div className="px-32 py-12">
                <div className="prose pb-0">
                    <h2 className="flex items-center gap-2">
                        <LuTicket />
                        My Tickets
                    </h2>
                </div>

                <div className="my-6 flex max-w-full gap-6 overflow-x-scroll pb-2">
                    {(!ticket.history || ticket.history.length == 0) && (
                        <p className="w-full py-24 text-center text-sm font-semibold text-muted-foreground">
                            You have no tickets yet.
                        </p>
                    )}
                    {ticket.history &&
                        ticket.history.map((v) => (
                            <div key={v.slug}>
                                <Card className="flex h-full w-72 flex-col justify-between">
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            {v.title}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-5">
                                            {v.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardFooter className="flex flex-col items-start">
                                        <Link
                                            href={`/ticket/${v.slug}`}
                                            className="w-full"
                                        >
                                            <Button className="flex w-full items-center gap-2">
                                                Chat
                                                <IoIosChatboxes />
                                            </Button>
                                        </Link>

                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(v.createdAt)}
                                        </p>
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

                <CreateTicketForm />
            </div>

            <Separator />
            <Footer />
        </>
    );
}

function CreateTicketForm() {
    const { createTicket } = useTicket();
    const ticket = useContext(TicketContext);

    const [state, formAction] = useFormState(createTicket, {
        status: 'idle',
    });

    useEffect(() => {
        if (state.status === 'success') {
            ticket.updateTicket();
            redirect(`/ticket/${state.data.slug}`);
        }
    }, [state, ticket]);

    return (
        <form className="grid max-w-lg items-start gap-4" action={formAction}>
            <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input type="text" id="title" name="title" />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    className="min-h-[200px]"
                />
            </div>

            <Button className="w-fit px-12" type="submit">
                Submit
            </Button>
        </form>
    );
}
