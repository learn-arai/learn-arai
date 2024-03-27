import { BsCpuFill } from 'react-icons/bs';
import { FaMemory } from 'react-icons/fa6';

import { formatBytes } from '@/lib/utils';

import type { GraderDetail } from '@/components/hooks/useClassroomGrader';
import PDFViewer from '@/components/ui/pdf-viewer';
import { Separator } from '@/components/ui/separator';

export default function GraderDetail(props: { data: GraderDetail }) {
    const { data } = props;

    return (
        <div className="prose max-w-none p-8 flex flex-col h-full">
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
    );
}
