'use client';

import Link from 'next/link';

import { useContext } from 'react';
import { FaClipboardList } from 'react-icons/fa';

import { cn, formatDate } from '@/lib/utils';

import { ClassroomContext } from '@/components/context/ClassroomContext';
import {
    Assignment,
    useClassroomAssignment,
} from '@/components/hooks/useClassroomAssignment';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTriggerMinimal,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function AssignmentList(props: {
    classroomSlug: string;
    realtimeUpdate: boolean;
}) {
    const classroom = useContext(ClassroomContext);

    const { classroomSlug, realtimeUpdate } = props;

    const { useGetAssignmentList } = useClassroomAssignment(classroomSlug);
    const { data, isLoading } = useGetAssignmentList({
        ...(realtimeUpdate && { refetchInterval: 2500 }),
    });

    return (
        <div className="pt-12">
            <ul className="space-y-2">
                {isLoading &&
                    [1, 2, 3, 4].map((idx) => {
                        return (
                            <AssignmentCard
                                key={idx}
                                classroomSlug={classroomSlug}
                            />
                        );
                    })}

                {data?.status === 'success' &&
                    data.data.map((a) => {
                        return (
                            <AssignmentCard
                                data={a}
                                key={a.slug}
                                classroomSlug={classroomSlug}
                                isTeacher={classroom?.type === 'teacher'}
                            />
                        );
                    })}
            </ul>
        </div>
    );
}

function AssignmentCard(props: {
    data?: Assignment;
    classroomSlug: string;
    isTeacher?: boolean;
}) {
    const { data, classroomSlug, isTeacher } = props;

    if (!data) {
        return (
            <li>
                <Card>
                    <Skeleton className="flex items-center justify-between p-6 py-4">
                        <h3 className="flex items-center gap-2 font-semibold text-muted-foreground">
                            <span className="rounded-full bg-muted-foreground p-2 text-primary-foreground">
                                <FaClipboardList />
                            </span>
                            <Skeleton className="h-[18px] w-[50px] bg-primary/50" />
                        </h3>

                        <span className="text-sm text-muted-foreground">
                            <Skeleton className="h-[18px] w-[210px] bg-primary/25" />
                        </span>
                    </Skeleton>
                </Card>
            </li>
        );
    }

    const { title, slug, due_date: dueDate, description } = data;

    return (
        <li>
            <Accordion type="single" collapsible>
                <AccordionItem value={slug} className="border-b-0">
                    <Card className="w-full transition-all group-hover:bg-accent">
                        <AccordionTriggerMinimal className="group py-0 hover:no-underline">
                            <CardContent className="flex w-full items-center justify-between p-6 py-4">
                                <h3 className="flex items-center gap-2 font-semibold text-primary/75">
                                    <span className="rounded-full bg-muted-foreground p-2 text-primary-foreground">
                                        <FaClipboardList />
                                    </span>
                                    {title}
                                </h3>

                                <span className="text-sm text-muted-foreground">
                                    Due {formatDate(dueDate)}
                                </span>
                            </CardContent>
                        </AccordionTriggerMinimal>

                        <AccordionContent className="p-0">
                            <Separator />
                            <CardContent className="flex justify-between px-6 py-4">
                                <p className="line-clamp-6 whitespace-pre-line pr-6">
                                    {description}
                                </p>

                                {isTeacher && (
                                    <div className="flex items-center justify-end space-x-8">
                                        <StatsCard
                                            name="Turned in"
                                            count={data.num_turned_in}
                                        />
                                        <StatsCard
                                            name="Assigned"
                                            count={data.num_assigned}
                                            className="pr-10"
                                        />
                                    </div>
                                )}
                            </CardContent>
                            <Separator />
                            <CardContent className="flex items-center justify-between p-2">
                                <Link
                                    href={`/classroom/${classroomSlug}/assignment/${slug}/detail`}
                                >
                                    <Button variant="ghost">Details</Button>
                                </Link>

                                {isTeacher && (
                                    <Link
                                        href={`/classroom/${classroomSlug}/assignment/${slug}/submissions`}
                                    >
                                        <Button>Grading</Button>
                                    </Link>
                                )}
                            </CardContent>
                        </AccordionContent>
                    </Card>
                </AccordionItem>
            </Accordion>
        </li>
    );
}

function StatsCard(props: { name: string; count: number; className?: string }) {
    return (
        <div
            className={cn('flex items-center space-x-4 py-4', props.className)}
        >
            <Separator orientation="vertical" className="h-[65px]" />
            <div>
                <p className="text-4xl font-medium text-primary">
                    {props.count}
                </p>
                <p className="w-fit whitespace-nowrap text-xs text-muted-foreground">
                    {props.name}
                </p>
            </div>
        </div>
    );
}
