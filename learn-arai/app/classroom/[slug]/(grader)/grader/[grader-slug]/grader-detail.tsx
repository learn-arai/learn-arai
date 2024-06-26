import { BsCpuFill } from 'react-icons/bs';
import { FaMemory } from 'react-icons/fa6';

import { History, NotebookText } from 'lucide-react';

import { formatBytes } from '@/lib/utils';

import type { GraderDetail } from '@/components/hooks/useClassroomGrader';
import PDFViewer from '@/components/ui/pdf-viewer';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import SubmissionList from './submission-list';

export default function GraderDetail(props: {
    data: GraderDetail;
    graderSlug: string;
    classroomSlug: string;
}) {
    const { data, graderSlug, classroomSlug } = props;

    return (
        <Tabs
            defaultValue="description"
            className="flex h-full flex-col space-y-0 p-4 py-2"
        >
            <TabsList className="w-full justify-start">
                <TabsTrigger
                    className="flex items-center gap-1"
                    value="description"
                >
                    <NotebookText className="h-4 w-4 text-blue-500" />
                    Description
                </TabsTrigger>
                <TabsTrigger
                    className="flex items-center gap-1"
                    value="submission"
                >
                    <History className="h-4 w-4 text-green-500" />
                    Submissions
                </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="h-full">
                <div className="prose flex h-full max-w-none flex-col p-0 pt-2">
                    <h3 className="mb-2 w-fit">{data.name}</h3>

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
            <TabsContent value="submission" className="h-full">
                <div className="flex h-full flex-col">
                    <SubmissionList
                        graderSlug={graderSlug}
                        classroomSlug={classroomSlug}
                    />
                </div>
            </TabsContent>
        </Tabs>
    );
}
