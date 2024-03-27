import { useContext, useEffect, useState } from 'react';

import SlugContext from '@/components/context/SlugContext';
import { useClassroom } from '@/components/hooks/useClassroom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

type Member = {
    fullName : string;
    abbrevation : string;
};

export function UserList({ currentGroupSlug }: { currentGroupSlug: string }) {
    const { getGroupMember } = useClassroom();
    const slug = useContext(SlugContext);
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        getGroupMember(slug, currentGroupSlug).then((res) => {
            if (res.status === 'success') {
                setMembers([
                    ...res.data.map((member) => ({
                        fullName : member.fullName!,
                        abbrevation : (member.fullName!.split(' ')[0][0] + member.fullName!.split(' ')[1][0]).toUpperCase()
                    })),
                ]);
            }
        });

        setIsLoading(false);
    }, [currentGroupSlug]);

    return (
        <>
            <div>
                <p className="text-xl font-bold text-center p-2">
                    Group Members
                </p>

                {isLoading &&
                    Array.from({ length: 5 }, (_, i) => {
                        return (
                            <div
                                className="flex items-center gap-4 p-2"
                                key={i}
                            >
                                <Skeleton className="h-[40px] w-[40px] rounded-full bg-slate-300 flex-shrink-0" />
                                <Skeleton className="h-4 w-full bg-slate-300" />
                            </div>
                        );
                    })}

                {members.map((member) => (
                    <div
                        className="flex items-center p-2 gap-4"
                        key={member.fullName}
                    >
                        <Avatar>
                            {/* Need to implement the Avatar component */}
                            <AvatarImage src="" alt="@shadcn" />
                            <AvatarFallback className="bg-slate-300">
                                {member.abbrevation}
                            </AvatarFallback>
                        </Avatar>
                        <p>{member.fullName}</p>
                    </div>
                ))}
            </div>
        </>
    );
}
