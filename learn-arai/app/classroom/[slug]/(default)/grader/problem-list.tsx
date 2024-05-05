'use client';

import Link from 'next/link';

import { useContext } from 'react';
import { RiLoader5Fill } from 'react-icons/ri';

import { Settings } from 'lucide-react';

import { ClassroomContext } from '@/components/context/ClassroomContext';
import SlugContext from '@/components/context/SlugContext';
import {
    GraderListItem,
    useClassroomGrader,
} from '@/components/hooks/useClassroomGrader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProblemList() {
    const slug = useContext(SlugContext);
    const classroom = useContext(ClassroomContext);

    const { useGetGraderList } = useClassroomGrader(slug);
    const { data, isLoading } = useGetGraderList();

    if (data?.status === 'error') {
        return <div>{data.message}</div>;
    }

    return (
        <>
            <div className="space-y-3 py-6">
                {data?.data.map((d, i) => (
                    <GraderCard
                        key={i}
                        data={d}
                        classroomSlug={slug}
                        isTeacher={classroom?.type === 'teacher'}
                    />
                ))}

                {isLoading && (
                    <div className="mx-auto flex items-center justify-center gap-2 py-12 text-center text-muted-foreground">
                        Loading...
                        <RiLoader5Fill className="animate-spin" />
                    </div>
                )}
            </div>
        </>
    );
}

function GraderCard(props: {
    data?: GraderListItem;
    classroomSlug: string;
    isTeacher?: boolean;
}) {
    const { data, classroomSlug, isTeacher } = props;

    if (!data) {
        return <></>;
    }

    return (
        <Card className="transition-all hover:bg-muted/50">
            <Link href={`/classroom/${classroomSlug}/grader/${data.slug}`}>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between text-base">
                        {data.name}

                        {isTeacher && (
                            <Link
                                href={`/classroom/${classroomSlug}/grader/${data.slug}/edit`}
                            >
                                <Button size="icon-sm">
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                    <table className="w-full table-fixed text-center text-sm">
                        <thead>
                            <tr>
                                <th
                                    rowSpan={2}
                                    className="bg-[#dff0d8] align-middle"
                                >
                                    Case
                                </th>
                                <th colSpan={3} className="bg-[#f2dede]">
                                    0
                                </th>
                                <th
                                    rowSpan={2}
                                    className="bg-[#d9edf7] align-middle"
                                >
                                    Total
                                </th>
                            </tr>
                            <tr>
                                <th className="bg-[#fcf8e3]">1</th>
                                <th className="bg-[#fcf8e3]">2</th>
                                <th className="bg-[#fcf8e3]">3</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="bg-[#d9edf7] font-semibold">
                                    result
                                </td>
                                <td className="bg-[#dff0d8]">K</td>
                                <td className="bg-[#dff0d8]">K</td>
                                <td className="bg-[#dff0d8]">K</td>
                                <td
                                    rowSpan={2}
                                    className="bg-[#fcf8e3] align-middle font-semibold"
                                >
                                    30
                                </td>
                            </tr>
                            <tr>
                                <td className="bg-[#f2dede] font-semibold">
                                    score
                                </td>
                                <td className="bg-[#d9edf7]">10</td>
                                <td className="bg-[#d9edf7]">10</td>
                                <td className="bg-[#d9edf7]">10</td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Link>
        </Card>
    );
}
