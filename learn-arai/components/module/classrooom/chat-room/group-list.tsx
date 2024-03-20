import { useContext, useEffect, useState } from 'react';

import SlugContext from '@/components/context/SlugContext';
import { useClassroom } from '@/components/hooks/useClassroom';
import { Group } from '@/components/hooks/useCreateInviteCode';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area"

export function GroupList() {
    const slug = useContext(SlugContext);
    const [groupList, setGroupList] = useState<Group[]>([]);
    const { getGroupList } = useClassroom();

    useEffect(() => {
        const fetchGroupList = async () => {
            const res = await getGroupList(slug);

            if (res.status === 'success') {
                setGroupList(res.data);
            }
        };

        fetchGroupList();
    });

    return (
        <>
          <ScrollArea>
            {groupList.map((group) => (
                <GroupButton name={group.title} key={group.slug} />
            ))}
          </ScrollArea>
        </>
    );
}

function GroupButton({ name }: GroupButtonProps) {
    return (
        <div>
            <Button className="w-full border-t-0" variant="outline">
                <p>{name}</p>
            </Button>
        </div>
    );
}

type GroupButtonProps = {
    name: string;
};
