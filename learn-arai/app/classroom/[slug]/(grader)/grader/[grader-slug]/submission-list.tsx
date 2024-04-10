import { Clock, Cpu } from 'lucide-react';

import { formatDate } from '@/lib/utils';

import { useClassroomGrader } from '@/components/hooks/useClassroomGrader';
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
                        <TableRow key={s.id}>
                            <TableCell className="">
                                <p className="text-success font-semibold">
                                    Accepted
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
