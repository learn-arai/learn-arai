'use client';

import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Page({ params }: { params: { slug: string } }) {
    const chatRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.addEventListener('keypress', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();

                    sendMessage();
                }
            });
        }
    });

    const sc = useRef<WebSocket>();
    if (!sc.current) {
        sc.current = new WebSocket(
            `ws://localhost:3000/ticket/${params.slug}/chat`
        );

        sc.current.addEventListener('message', (event) => {
            const { message, type, createdAt } = JSON.parse(event.data);

            if (type == 'system') {
                const p = document.createElement('div');
                p.className =
                    'text-center text-sm text-muted-foreground py-4 font-mono';
                p.textContent = message;
                chatRef.current?.appendChild(p);
                return;
            }

            const div = document.createElement('div');
            div.className =
                'ds-chat ' + (type == 'you' ? 'ds-chat-end' : 'ds-chat-start');

            const bubble = document.createElement('div');
            bubble.className =
                'ds-chat-bubble ' +
                (type == 'other'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground');
            bubble.textContent = message;
            div.appendChild(bubble);

            const footer = document.createElement('div');
            footer.className = 'ds-chat-footer opacity-50 text-xs pt-1';
            footer.textContent = new Date(createdAt).toLocaleTimeString(
                'th-TH'
            );
            div.appendChild(footer);

            chatRef.current?.appendChild(div);
        });
    }

    const sendMessage = () => {
        if (!sc.current) return;
        sc.current.send(
            JSON.stringify({
                message: inputRef.current?.value,
            })
        );

        inputRef.current!.value = '';
    };

    return (
        <>
            <div className="max-w-xl" ref={chatRef}></div>

            <Label className="max-w-xl flex gap-2 items-center">
                <Input ref={inputRef} />
                <Button className="px-8" onClick={sendMessage}>
                    Send
                </Button>
            </Label>
        </>
    );
}
