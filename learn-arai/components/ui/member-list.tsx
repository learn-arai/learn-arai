'use client';

import { useContext } from 'react';

import SlugContext from '../context/SlugContext';
import { GroupMember, useClassroom } from '../hooks/useClassroom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

import { Skeleton } from './skeleton';

export default function MemberList() {
    const { useGetUsers } = useClassroom();
    const slug = useContext(SlugContext);

    const { data, isLoading } = useGetUsers(slug);

    return (
        <div className="flex w-full flex-col gap-2 py-4">
            <h2 className="mb-2 w-full border-b-2 border-green-600 pb-4 font-semibold text-green-600">
                Teacher
            </h2>

            {data?.status == 'success' && (
                <>
                    {data.data.teacher.map((d) => (
                        <MemberCard key={d.id} data={d} />
                    ))}
                </>
            )}

            {isLoading && (
                <>
                    <MemberCard />
                    <MemberCard />
                </>
            )}

            <div className="mb-2 mt-8 flex justify-between border-b-2 border-green-600 pb-4">
                <h2 className="font-semibold text-green-600">Classmates</h2>
                <h2 className="font-semibold text-green-600">
                    {data?.status === 'success' ? data.data.student.length : 0}
                </h2>
            </div>

            {data?.status === 'success' && (
                <>
                    {data.data.student.map((d) => (
                        <MemberCard key={d.id} data={d} />
                    ))}
                </>
            )}

            {isLoading && (
                <>
                    <MemberCard />
                    <MemberCard />
                    <MemberCard />
                </>
            )}
        </div>
    );
}

function MemberCard(props: { data?: GroupMember }) {
    const { data: d } = props;

    return (
        <div className="flex flex-col">
            <div className="mb-4 ml-4 flex items-center">
                <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-xs uppercase">
                        {d ? d.firstName[0] + d.lastName[0] : ''}
                    </AvatarFallback>
                </Avatar>
                {d ? (
                    <p className="ml-4 flex items-center text-sm uppercase">
                        {d.firstName} {d.lastName}
                    </p>
                ) : (
                    <>
                        <Skeleton className="ml-4 h-5 w-12" />
                        <Skeleton className="w-18 ml-2 h-5" />
                    </>
                )}
            </div>
            <Separator />
        </div>
    );
}
