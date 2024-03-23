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

export default function AssignmentList(props: { classroomSlug: string }) {
    const classroom = useContext(ClassroomContext);

    const { classroomSlug } = props;

    const { useGetAssignmentList } = useClassroomAssignment(classroomSlug);
    const { data, isLoading } = useGetAssignmentList();

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
                    <Skeleton className="p-6 py-4 flex items-center justify-between">
                        <h3 className="flex items-center gap-2 font-semibold text-muted-foreground">
                            <span className="bg-muted-foreground text-primary-foreground p-2 rounded-full">
                                <FaClipboardList />
                            </span>
                            <Skeleton className="w-[50px] h-[18px] bg-primary/50" />
                        </h3>

                        <span className="text-muted-foreground text-sm">
                            <Skeleton className="w-[210px] h-[18px] bg-primary/25" />
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
                    <Card className="w-full group-hover:bg-accent transition-all">
                        <AccordionTriggerMinimal className="hover:no-underline group py-0">
                            <CardContent className="p-6 py-4 flex items-center justify-between w-full">
                                <h3 className="flex items-center gap-2 font-semibold text-primary/75">
                                    <span className="bg-muted-foreground text-primary-foreground p-2 rounded-full">
                                        <FaClipboardList />
                                    </span>
                                    {title}
                                </h3>

                                <span className="text-muted-foreground text-sm">
                                    Due {formatDate(dueDate)}
                                </span>
                            </CardContent>
                        </AccordionTriggerMinimal>

                        <AccordionContent className="p-0">
                            <Separator />
                            <CardContent className="flex px-6 py-4 justify-between">
                                <p className="pr-6 whitespace-pre-line line-clamp-6">
                                    {description}
                                </p>

                                {isTeacher && (
                                    <div className="flex items-center space-x-8 justify-end">
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
                            <CardContent className="p-2 flex items-center justify-between">
                                <Link
                                    href={`/classroom/${classroomSlug}/assignment/${slug}/detail`}
                                >
                                    <Button variant="ghost">Details</Button>
                                </Link>

                                {isTeacher && <Button>Grading</Button>}
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
            className={cn('py-4 flex items-center space-x-4', props.className)}
        >
            <Separator orientation="vertical" className="h-[65px]" />
            <div>
                <p className="text-4xl text-primary font-medium">
                    {props.count}
                </p>
                <p className="text-muted-foreground text-xs w-fit whitespace-nowrap">
                    {props.name}
                </p>
            </div>
        </div>
    );
}
