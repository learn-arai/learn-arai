'use client';

import Link from 'next/link';

import { FaAngleLeft } from 'react-icons/fa';

import { Card, CardContent } from '@/components/ui/card';
import Footer from '@/components/ui/footer/footer';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';

import ChatBox from './chat-box';

export default function Page({ params }: { params: { slug: string } }) {
    return (
        <>
            <div className="h-screen w-screen max-w-full">
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={25}>
                        <Card className="rounded-none relative">
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
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel className="flex flex-col flex-1 pb-8">
                        <Card className="rounded-none">
                            <CardContent className="py-4 font-semibold text-center">
                                <h2>{params.slug}</h2>
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
