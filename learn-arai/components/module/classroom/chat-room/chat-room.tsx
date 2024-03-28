import { useState } from 'react';

import { ChatBox } from './chat-box';
import { GroupList } from './group-list';
import { UserList } from './user-list';

export function ChatRoom() {
    const [currentGroupSlug, setCurrentGroupSlug] = useState('');

    return (
        <>
            <div className="w-2/12 bg-slate-50">
                <GroupList
                    setGroupSlug={setCurrentGroupSlug}
                    groupSlug={currentGroupSlug}
                />
            </div>

            <div className="w-full bg-slate-100">
                <ChatBox currentGroupSlug={currentGroupSlug} />
            </div>

            <div className="w-3/12 bg-slate-50 p-2">
                <UserList currentGroupSlug={currentGroupSlug} />
            </div>
        </>
    );
}
