'use client';

import { useEffect, useRef } from 'react';

import { generateNanoId } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ChatBox({ slug }: { slug: string }) {
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
        sc.current = new WebSocket(`ws://localhost:3000/ticket/${slug}/chat`);

        sc.current.addEventListener('message', (event) => {
            const { message, type, createdAt } = JSON.parse(event.data);

            if (type == 'system') {
                const div = document.createElement('div');
                div.className =
                    'text-center text-sm text-muted-foreground py-2 font-mono relative';
                div.textContent = message;

                const anchor = document.createElement('a');
                anchor.className = 'absolute top-[200px] left-0';
                div.appendChild(anchor);

                chatRef.current?.appendChild(div);

                anchor.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'start',
                });
                return;
            }

            const div = document.createElement('div');
            div.className =
                'ds-chat relative ' +
                (type == 'you' ? 'ds-chat-end' : 'ds-chat-start');

            const bubble = document.createElement('div');
            bubble.className =
                'ds-chat-bubble ' +
                (type == 'other'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground');
            bubble.textContent = message;
            div.appendChild(bubble);

            if (type === 'other') {
                const header = document.createElement('div');
                header.className = 'ds-chat-header pb-1';
                header.textContent = 'Tonkaew';
                div.appendChild(header);
            }

            const footer = document.createElement('div');
            footer.className = 'ds-chat-footer opacity-50 text-xs pt-1';
            footer.textContent = new Date(createdAt).toLocaleTimeString(
                'th-TH'
            );
            div.appendChild(footer);

            const anchor = document.createElement('a');
            anchor.className = 'absolute top-[200px] left-0';
            div.appendChild(anchor);

            chatRef.current?.appendChild(div);

            anchor.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start',
            });
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
        <div className="h-full overflow-y-scroll relative px-4">
            <div
                className="pt-4 min-h-full max-w-full overflow-x-hidden"
                ref={chatRef}
            ></div>

            <Label className="flex gap-2 items-center bottom-0 sticky w-full px-4">
                <Input ref={inputRef} />
                <Button className="px-8" onClick={sendMessage}>
                    Send
                </Button>
            </Label>
        </div>
    );
}
