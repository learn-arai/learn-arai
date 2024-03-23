import { useEffect, useState } from "react";
import { Chat } from "./chat";
import { GroupList } from "./group-list";
import { UserList } from "./user-list";

export function ChatRoom() {
  const [currentGroupSlug, setCurrentGroupSlug] = useState('');

  return (
    <div className="flex">
      <div className="w-2/12 bg-slate-50 overflow-y-auto h-[70vh]">
        <GroupList setGroupSlug={setCurrentGroupSlug} groupSlug={currentGroupSlug}/>
      </div>

      <div className="w-full relative bg-slate-100 h-[70vh]">
        <Chat currentGroupSlug={currentGroupSlug}/>
      </div>

      <div className="w-3/12 bg-slate-50 p-2 overflow-y-auto h-[70vh]">
        <UserList currentGroupSlug={currentGroupSlug}/>
      </div>
    </div>
  )
}