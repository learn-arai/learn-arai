import { useContext, useEffect, useState } from 'react';

import SlugContext from '@/components/context/SlugContext';
import { useClassroom } from '@/components/hooks/useClassroom';
import { Group } from '@/components/hooks/useCreateInviteCode';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

export function GroupList({
    setGroupSlug,
    groupSlug,
}: {
    setGroupSlug: (slug: string) => void;
    groupSlug: string;
}) {
    const slug = useContext(SlugContext);
    const [groupList, setGroupList] = useState<Group[]>([]);
    const { getChatGroupList } = useClassroom();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGroupList = async () => {
            const res = await getChatGroupList(slug);

            if (res.status === 'success') {
                setGroupList(res.data);
                setGroupSlug(res.data[0].slug);
            }
        };

        fetchGroupList();
        setIsLoading(false);
    }, []);

    return (
        <>
            <p className="text-xl font-bold text-center p-2">Group Lists</p>

            <ScrollArea className="h-full w-full">
                {isLoading &&
                    Array.from({ length: 5 }, (_, i) => {
                        return (
                            <div
                                className="flex items-center gap-4 py-1"
                                key={i}
                            >
                                <Skeleton
                                    className="h-[40px] w-full bg-slate-300 srounded-lg"
                                    style={{
                                        width: `${Math.floor(Math.random() * 500) + 209}px`,
                                    }}
                                />
                            </div>
                        );
                    })}

                {groupList.map((group) => (
                    <GroupButton
                        name={group.title}
                        key={group.slug}
                        setGroupSlug={setGroupSlug}
                        slug={group.slug}
                        groupSlug={groupSlug}
                    />
                ))}
            </ScrollArea>
        </>
    );
}

function GroupButton({
    name,
    setGroupSlug,
    slug,
    groupSlug,
}: GroupButtonProps) {
    return (
        <div>
            <Button
                className={`w-full border-t-0 ${groupSlug === slug ? 'bg-slate-200' : ''}`}
                variant="outline"
                onClick={() => setGroupSlug(slug)}
            >
                <p>{name}</p>
            </Button>
        </div>
    );
}

type GroupButtonProps = {
    name: string;
    setGroupSlug: (slug: string) => void;
    slug: string;
    groupSlug: string;
};
