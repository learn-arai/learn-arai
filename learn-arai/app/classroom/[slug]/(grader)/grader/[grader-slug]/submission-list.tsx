'use client';

import { useContext, useState } from 'react';

import { ChevronLeft, Clock, Cpu } from 'lucide-react';

import { cn, formatDate, titleCase } from '@/lib/utils';

import { AuthContext } from '@/components/context/AuthContext';
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
                classroomSlug={classroomSlug}
                graderSlug={graderSlug}
                subId={selectedSubmission}
                setSelectedSubmission={setSelectedSubmission}
            />
        );
    }

    // TODO: Remove console.log
    console.log(data);

    return (
        <>
            <Table className="no-scrollbar h-full min-w-fit overflow-y-scroll">
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
                                <p className="whitespace-nowrap text-xs leading-tight text-muted-foreground">
                                    {formatDate(s.submitted_at)}
                                </p>
                            </TableCell>
                            <TableCell className="">
                                <span className="rounded-md bg-foreground px-1.5 py-0.5 text-xs text-background">
                                    C++
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1 whitespace-nowrap">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    {s.total_run_time} ms
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1 whitespace-nowrap">
                                    <Cpu className="h-4 w-4 text-muted-foreground" />
                                    {Number(s.total_memory).toFixed(3)} MB
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
    classroomSlug: string;
    graderSlug: string;
    setSelectedSubmission: (subId: undefined | string) => void;
}) {
    const { subId, setSelectedSubmission, classroomSlug, graderSlug } = props;
    const { useGetSubmissionDetail } = useClassroomGrader(classroomSlug);

    const auth = useContext(AuthContext);
    const { data } = useGetSubmissionDetail(graderSlug, subId);

    // TODO: Remove Console.log
    console.log(
        '[learn-arai/app/classroom/[slug]/(grader)/grader/[grader-slug]/submission-list.tsx]:',
        data
    );

    return (
        <div className="no-scrollbar h-full space-y-4 overflow-scroll py-2 pb-24">
            <div>
                <Button
                    onClick={(_) => setSelectedSubmission(undefined)}
                    className="w-fit"
                    size="icon-sm"
                    variant="link"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Submission List
                </Button>
            </div>

            <div className="!mt-0">
                <h4
                    className={cn(
                        'text-lg font-semibold',
                        data?.data?.status === 'accepted'
                            ? 'text-success'
                            : data?.data?.status === 'wrong_answer'
                              ? 'text-destructive'
                              : 'text-ds-amber-500'
                    )}
                >
                    {titleCase((data?.data?.status ?? '').replaceAll('_', ' '))}
                </h4>
                <div className="text-sm">
                    {auth?.user?.email}{' '}
                    <span className="text-muted-foreground">
                        submitted at {formatDate(data?.data?.submitted_at)}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
                <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Runtime</div>
                    <p className="pt-2 font-semibold">
                        {data?.data?.total_run_time ?? '...'}{' '}
                        <span className="font-normal text-muted-foreground">
                            ms
                        </span>
                    </p>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Memory</div>
                    <p className="pt-2 font-semibold">
                        {Number(data?.data?.total_memory).toFixed(3) ?? '...'}{' '}
                        <span className="font-normal text-muted-foreground">
                            MB
                        </span>
                    </p>
                </Card>
                <Card className="p-4">
                    <div className="text-sm text-muted-foreground">Score</div>
                    <p className="pt-2 font-semibold">
                        XXXX{' '}
                        <span className="font-normal text-muted-foreground">
                            / XX
                        </span>
                    </p>
                </Card>
            </div>

            {/* TODO: Show each test case status */}
            <Card className="p-4">
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
            </Card>

            <div className="prose max-w-none">
                <pre>{data?.data?.source_code ?? '// Loading...'}</pre>
            </div>

            {subId}
        </div>
    );
}
