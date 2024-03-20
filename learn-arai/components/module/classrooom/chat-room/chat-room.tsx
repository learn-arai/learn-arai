import { useState } from "react";
import { Chat } from "./chat";
import { GroupList } from "./group-list";
import { UserList } from "./user-list";

export function ChatRoom() {
  const [currentGroupSlug, setCurrentGroupSlug] = useState('');
  
  return (
    <div className="flex h-full">
      <div className="w-2/12">
        <GroupList setGroupSlug={setCurrentGroupSlug} groupSlug={currentGroupSlug}/>
      </div>

      <div className="w-full relative bg-slate-100 overflow-auto h-[100vh]">
        <Chat currentGroupSlug={currentGroupSlug}/>
      </div>

      <div className="w-2/12 bg-slate-400">
        <UserList/>
      </div>

    </div>
  )
}