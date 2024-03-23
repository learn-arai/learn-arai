'use client';

import { redirect, useSearchParams } from 'next/navigation';

import { useContext, useState } from 'react';

import { ClassroomContext } from '@/components/context/ClassroomContext';
import SlugContext from '@/components/context/SlugContext';
import CreateAssignment from '@/components/module/classrooom/create-assignment/create-assignment';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

import AssignmentList from './assignment-list';

export default function Page() {
    const classroom = useContext(ClassroomContext);
    const slug = useContext(SlugContext);

    const searchParams = useSearchParams();
    const oldRealtime = searchParams.get('realtime') === '1';

    const changeRealtimeUpdate = (e: boolean) => {
        if (e) {
            return redirect('?realtime=1');
        }

        redirect('?realtime=0');
    };

    return (
        <>
            <div className="py-4 space-y-4">
                {classroom && classroom.type === 'teacher' && (
                    <div className="flex items-center gap-4">
                        <CreateAssignment classroomSlug={slug} />

                        <Separator
                            orientation="vertical"
                            className="h-[35px]"
                        />

                        <div className="items-top flex space-x-2">
                            <Checkbox
                                id="realtime-update"
                                onCheckedChange={changeRealtimeUpdate}
                                defaultChecked={oldRealtime}
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="realtime-update"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Real-time Update
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                <AssignmentList
                    classroomSlug={slug}
                    realtimeUpdate={oldRealtime}
                />
            </div>
        </>
    );
}
