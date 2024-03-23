'use client';

import { ChatRoom } from '@/components/module/classrooom/chat-room/chat-room';
import CreateInvite from '@/components/module/classrooom/create-invited-code/create-invite-code';

export default function Page() {
    return (
        <>
            <CreateInvite />
            <div>
                <ChatRoom/>
            </div>
        </>
    );
}
