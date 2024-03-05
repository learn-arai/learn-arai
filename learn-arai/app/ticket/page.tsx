'use client';

import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Page() {
    const chatRef = useRef<HTMLUListElement>(null);
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
            `ws://localhost:3000/ticket/${'2rqUs09muS'}/chat`
        );

        sc.current.addEventListener('message', (event) => {
            console.log(JSON.parse(event.data));

            const li = document.createElement('li');
            li.textContent = JSON.parse(event.data).message;
            chatRef.current?.appendChild(li);
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
            <ul ref={chatRef}></ul>

            <Label className="max-w-xl flex gap-2 items-center">
                <Input ref={inputRef} />
                <Button onClick={sendMessage}>Send</Button>
            </Label>
        </>
    );
}
