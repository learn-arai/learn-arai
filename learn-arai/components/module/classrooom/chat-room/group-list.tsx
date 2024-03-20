import { useContext, useEffect, useState } from 'react';

import SlugContext from '@/components/context/SlugContext';
import { useClassroom } from '@/components/hooks/useClassroom';
import { Group } from '@/components/hooks/useCreateInviteCode';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area"

export function GroupList( { setGroupSlug, groupSlug }: { setGroupSlug: (slug: string) => void, groupSlug : string } ) {
    const slug = useContext(SlugContext);
    const [groupList, setGroupList] = useState<Group[]>([]);
    const { getChatGroupList } = useClassroom();

    useEffect(() => {
        const fetchGroupList = async () => {
            const res = await getChatGroupList(slug);

            if (res.status === 'success') {
                setGroupList(res.data);
                setGroupSlug(res.data[0].slug);
            }

        };
        
        fetchGroupList();
    }, []);

    return (
        <>
          <ScrollArea>
            {groupList.map((group) => (
                <GroupButton name={group.title} key={group.slug} setGroupSlug={setGroupSlug} slug={group.slug} groupSlug={groupSlug}/>
            ))}
          </ScrollArea>
        </>
    );
}

function GroupButton({ name, setGroupSlug, slug, groupSlug }: GroupButtonProps) {
    return (
        <div>
            <Button className={`w-full border-t-0 ${ groupSlug === slug ? 'bg-slate-200' : ''}`} variant="outline"
                    onClick={() => setGroupSlug(slug)}>
                <p>{name}</p>
            </Button>
        </div>
    );
}

type GroupButtonProps = {
    name: string;
    setGroupSlug: (slug: string) => void;
    slug : string;
    groupSlug : string;
};
