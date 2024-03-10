'use client';

import { useContext } from 'react';

import { CheckCircle } from 'lucide-react';

import { TicketContext } from '@/components/context/TicketContext';
import { useTicket } from '@/components/hooks/useTicket';
import { Button } from '@/components/ui/button';
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
                    <ResizablePanel className="flex flex-col flex-1 pb-8">
                        <Card className="rounded-none border-l-0">
                            <CardContent className="py-4 font-semibold text-center relative">
                                <h2>
                                    {ticket.history !== null
                                        ? ticket.history.find(
                                              (v) => v.slug == params.slug
                                          )?.title || params.slug
                                        : params.slug}
                                </h2>

                                <Button
                                    className="absolute right-4 top-1/2 -translate-y-1/2"
                                    variant="success"
                                    onClick={async () => {
                                        await closeTicket(params.slug);
                                        location.reload();
                                    }}
                                >
                                    Close Ticket
                                    <CheckCircle className="w-4 h-4 ml-2" />
                                </Button>
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
