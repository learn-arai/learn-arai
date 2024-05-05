'use client';

import { useContext } from 'react';

import { TicketContext } from '@/components/context/TicketContext';
import { useTicket } from '@/components/hooks/useTicket';
import { Card, CardContent } from '@/components/ui/card';
import Footer from '@/components/ui/footer/footer';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';

import ChatBox from './chat-box';
import ChatList from './chat-list';
import CloseTicketButton from './close-ticket-button';

export default function Page({ params }: { params: { slug: string } }) {
    const ticket = useContext(TicketContext);
    const { closeTicket } = useTicket();

    return (
        <>
            <div className="h-screen w-screen max-w-full">
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={35}>
                        <ChatList slug={params.slug} />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel className="flex flex-1 flex-col pb-8">
                        <Card className="rounded-none border-l-0">
                            <CardContent className="relative py-4 text-center font-semibold">
                                <h2>
                                    {ticket.history !== null
                                        ? ticket.history.find(
                                              (v) => v.slug == params.slug
                                          )?.title || params.slug
                                        : params.slug}
                                </h2>

                                <CloseTicketButton slug={params.slug} />
                            </CardContent>
                        </Card>

                        <ChatBox slug={params.slug} />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>

            <Separator />
            <Footer />
        </>
    );
}
