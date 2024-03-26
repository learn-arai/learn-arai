import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
    message: z.string(),
});

type Conversation = {
    created_at: string;
    created_by: string;
    message: string;
};

export function Chat({ currentGroupSlug }: { currentGroupSlug: string }) {
    const sc = useRef<WebSocket>();
    const [conversation, setConversation] = useState<Conversation[]>([]);
    const [message, setMessage] = useState('');
    const endMessage = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        sc.current = new WebSocket(
            `${process.env.NEXT_PUBLIC_BACKEND_WS}/c/${currentGroupSlug}/g/chat`
        );

        sc.current.addEventListener('open', (event) => {
            setConversation([]);
        });

        sc.current.addEventListener('message', (event) => {
            const { message, created_at, created_by } = JSON.parse(event.data);
            console.log('message sent');
            setConversation((prev) => [
                ...prev,
                {
                    created_at,
                    created_by,
                    message,
                },
            ]);
        });

        setIsLoading(false);
    }, [currentGroupSlug]);

    useEffect(() => {
        if (endMessage.current) {
            endMessage.current.scrollIntoView({ block: 'end' });
        }
    }, [conversation]);

    const sendMessage = (data: z.infer<typeof formSchema>) => {
        const message = data.message;
        if (message.trim() === '') return;

        setMessage('');

        if (!sc.current) return;
        sc.current.send(
            JSON.stringify({
                type: 'message',
                message,
            })
        );
    };

    const convertTime = (time: string) => {
        const localTime = new Date(time);
        const today = new Date();

        return (
            (localTime.toLocaleDateString() == today.toLocaleDateString()
                ? 'Today'
                : localTime.toLocaleDateString()) +
            ', ' +
            localTime.toLocaleTimeString()
        );
    };

    return (
        <>
            <ScrollArea className="h-full">
                {isLoading &&
                    Array.from({ length: 20 }, (_, i) => {
                        return (
                            <div
                                className="flex items-center gap-4 p-2"
                                key={i}
                            >
                                <Skeleton className="h-[40px] w-[40px] rounded-full bg-slate-300 flex-shrink-0" />
                                <Skeleton
                                    className="h-4 bg-slate-300"
                                    style={{
                                        width: `${Math.floor(Math.random() * 500) + 209}px`,
                                    }}
                                />
                            </div>
                        );
                    })}

                {conversation.map((row) => (
                    <div key={row.created_at}>
                        <div className="flex gap-4 pl-4">
                            <p className="text-slate-500"> {row.created_by} </p>
                            {/* <p> { new Date(row.created_at) } </p> */}
                            <p>{convertTime(row.created_at)}</p>
                        </div>
                        <div className="flex items-center p-2 pl-4 gap-4 relative">
                            <Avatar>
                                <AvatarFallback className="bg-slate-300">
                                    {row.created_by.split(' ')[0][0] +
                                        row.created_by.split(' ')[1][0]}
                                </AvatarFallback>
                            </Avatar>
                            <div>{row.message}</div>
                        </div>
                    </div>
                ))}

                <div ref={endMessage}></div>
            </ScrollArea>

            <div className="sticky bottom-4 mx-8">
                <MessageInput
                    sendMessage={sendMessage}
                    setMessage={setMessage}
                    message={message}
                />
            </div>
        </>
    );
}

export function MessageInput({
    sendMessage,
    setMessage,
    message,
}: {
    sendMessage: (data: z.infer<typeof formSchema>) => void;
    setMessage: (message: string) => void;
    message: string;
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: '',
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(sendMessage)}>
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    placeholder="type message here..."
                                    {...field}
                                    value={message}
                                    onChangeCapture={(e) =>
                                        setMessage(e.currentTarget.value)
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}
