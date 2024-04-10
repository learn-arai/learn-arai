import { BsCpuFill } from 'react-icons/bs';
import { FaMemory } from 'react-icons/fa6';

import { Clock, Cpu, History, NotebookText } from 'lucide-react';

import { formatBytes, formatDate } from '@/lib/utils';

import type { GraderDetail } from '@/components/hooks/useClassroomGrader';
import PDFViewer from '@/components/ui/pdf-viewer';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function GraderDetail(props: { data: GraderDetail }) {
    const { data } = props;

    return (
        <Tabs
            defaultValue="description"
            className="h-full flex flex-col space-y-0 p-4 py-2"
        >
            <TabsList className="w-full justify-start">
                <TabsTrigger
                    className="flex items-center gap-1"
                    value="description"
                >
                    <NotebookText className="text-blue-500 w-4 h-4" />
                    Description
                </TabsTrigger>
                <TabsTrigger
                    className="flex items-center gap-1"
                    value="submission"
                >
                    <History className="text-green-500 w-4 h-4" />
                    Submissions
                </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="h-full">
                <div className="prose max-w-none p-0 pt-2 flex flex-col h-full">
                    <h3 className="w-fit mb-2">{data.name}</h3>

                    <div className="mb-2 flex items-center gap-2 font-semibold">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <BsCpuFill />
                            {Number(data.cpu_limit).toFixed(0)} ms
                        </span>

                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <FaMemory />
                            {formatBytes(data.mem_limit * 1024 * 1024)}
                        </span>
                    </div>

                    <Separator className="mb-2" />

                    <PDFViewer
                        className="grow"
                        url={`${process.env.NEXT_PUBLIC_BACKEND_URL}/file/${data.instruction_file}.pdf`}
                    />
                </div>
            </TabsContent>
            <TabsContent value="submission">
                <Table className="min-w-fit overflow-x-scroll">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="">Status</TableHead>
                            <TableHead>Language</TableHead>
                            <TableHead>Runtime</TableHead>
                            <TableHead className="">Memory</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="">
                                <p className="text-success font-semibold">
                                    Accepted
                                </p>
                                <p className="leading-tight text-muted-foreground text-xs whitespace-nowrap">
                                    {formatDate(new Date(Date.now()))}
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
                    </TableBody>
                </Table>
            </TabsContent>
        </Tabs>
    );
}
