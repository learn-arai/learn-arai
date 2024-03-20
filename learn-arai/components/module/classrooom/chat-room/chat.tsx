import { createElement, useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import SlugContext from '@/components/context/SlugContext';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
    message: z.string(),
});

export function Chat({ currentGroupSlug }: { currentGroupSlug: string }) {
    const sc = useRef<WebSocket>();
    const conversation = useRef<HTMLDivElement>(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        sc.current = new WebSocket(
            `${process.env.NEXT_PUBLIC_BACKEND_WS}/c/${currentGroupSlug}/g/chat`
        );
        sc.current.addEventListener('open', (event) => {
        });

        sc.current.addEventListener('message', (event) => {
            const { message, created_at, created_by } = JSON.parse(event.data);

            const div = document.createElement('div');
            div.textContent = message;
            conversation.current?.appendChild(div);
        });
    }, [currentGroupSlug]);

    const sendMessage = (data: z.infer<typeof formSchema>) => {
        const message = data.message;
        if ( message.trim() === '') return;
        
        setMessage('');

        if (!sc.current) return;
        sc.current.send(
            JSON.stringify({
                type: 'message',
                message,
            })
        );
    };

    return (
        <>
            <div ref={conversation} className='overflow-y'>

            </div>
            <div className="sticky inset-x-0 mx-auto bottom-4 w-11/12">
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
            <form
                onSubmit={form.handleSubmit(sendMessage)}
                className="space-y-8"
            >
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
