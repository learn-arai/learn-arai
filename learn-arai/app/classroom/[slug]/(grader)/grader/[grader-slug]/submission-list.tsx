'use client';

import { useState } from 'react';

import { ChevronLeft, Clock, Cpu } from 'lucide-react';

import { cn, formatDate, titleCase } from '@/lib/utils';

import { useClassroomGrader } from '@/components/hooks/useClassroomGrader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function SubmissionList(props: {
    graderSlug: string;
    classroomSlug: string;
}) {
    const { graderSlug, classroomSlug } = props;

    const { useGetSubmissionList } = useClassroomGrader(classroomSlug);
    const { data } = useGetSubmissionList(graderSlug);

    // TODO: Remove hard-coded submission Id
    // const [selectedSubmission, setSelectedSubmission] = useState<
    //     string | undefined
    // >('0d9acfaa-c57b-446f-ad43-74d76985f0e4');
    const [selectedSubmission, setSelectedSubmission] = useState<
        string | undefined
    >();

    if (selectedSubmission) {
        return (
            <SubmissionDetail
                subId={selectedSubmission}
                setSelectedSubmission={setSelectedSubmission}
            />
        );
    }

    // TODO: Remove console.log
    console.log(data);

    return (
        <>
            <Table className="min-w-fit h-full overflow-y-scroll no-scrollbar">
                <TableHeader>
                    <TableRow>
                        <TableHead className="">Status</TableHead>
                        <TableHead>Language</TableHead>
                        <TableHead>Runtime</TableHead>
                        <TableHead className="">Memory</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="max-h-full overflow-y-scroll">
                    {data?.data?.map((s: any) => (
                        <TableRow
                            key={s.id}
                            onClick={(_) => setSelectedSubmission(s.id)}
                            className="hover:cursor-pointer"
                        >
                            <TableCell className="">
                                <p
                                    className={cn(
                                        'font-semibold',
                                        s.status === 'accepted'
                                            ? 'text-success'
                                            : s.status === 'wrong_answer'
                                              ? 'text-destructive'
                                              : 'text-ds-amber-500'
                                    )}
                                >
                                    {titleCase(
                                        (s.status as string).replaceAll(
                                            '_',
                                            ' '
                                        )
                                    )}
                                </p>
                                <p className="leading-tight text-muted-foreground text-xs whitespace-nowrap">
                                    {formatDate(s.submitted_at)}
                                </p>
                            </TableCell>
                            <TableCell className="">
                                <span className="text-background bg-foreground py-0.5 px-1.5 rounded-md text-xs">
                                    C++
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1 whitespace-nowrap">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    158 ms
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1 whitespace-nowrap">
                                    <Cpu className="w-4 h-4 text-muted-foreground" />
                                    49.4 MB
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow className="h-48"></TableRow>
                </TableBody>
            </Table>
        </>
    );
}

function SubmissionDetail(props: {
    subId: string;
    setSelectedSubmission: (subId: undefined | string) => void;
}) {
    const { subId, setSelectedSubmission } = props;

    return (
        <div className="py-2 space-y-4">
            <div>
                <Button
                    onClick={(_) => setSelectedSubmission(undefined)}
                    className="w-fit"
                    size="icon-sm"
                    variant="link"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Submission List
                </Button>
            </div>

            <div className="!mt-0">
                <h4 className="text-success font-semibold text-lg">Accepted</h4>
                <div className="text-sm">
                    Athicha Leksansern{' '}
                    <span className="text-muted-foreground">
                        submitted at Apr 08, 2024 20:48
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
                <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Runtime</div>
                    <p className="pt-2 font-semibold">
                        XXXX{' '}
                        <span className="text-muted-foreground font-normal">
                            ms
                        </span>
                    </p>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Memory</div>
                    <p className="pt-2 font-semibold">
                        XXXX{' '}
                        <span className="text-muted-foreground font-normal">
                            MB
                        </span>
                    </p>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Score</div>
                    <p className="pt-2 font-semibold">
                        XXXX{' '}
                        <span className="text-muted-foreground font-normal">
                            / XX
                        </span>
                    </p>
                </Card>
            </div>

            <Card className="p-4">
                <table className="w-full text-center table-fixed text-sm">
                    <thead>
                        <tr>
                            <th
                                rowSpan={2}
                                className="align-middle bg-[#dff0d8]"
                            >
                                Case
                            </th>
                            <th colSpan={3} className="bg-[#f2dede]">
                                0
                            </th>
                            <th
                                rowSpan={2}
                                className="align-middle bg-[#d9edf7]"
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
                                className="align-middle bg-[#fcf8e3] font-semibold"
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
            </Card>

            <div className="prose max-w-none">
                <pre>code...</pre>
            </div>

            {subId}
        </div>
    );
}
