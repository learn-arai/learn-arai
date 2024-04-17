'use client';

import { useClassroomGrader } from '@/components/hooks/useClassroomGrader';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';

import CodeArea from './code-area';
import GraderDetail from './grader-detail';

export default function Page({
    params,
}: {
    params: { slug: string; 'grader-slug': string };
}) {
    const { slug, 'grader-slug': graderSlug } = params;
    const { useGetDetail } = useClassroomGrader(slug);
    const { data } = useGetDetail(graderSlug);

    return (
        <div className="h-full max-h-full">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel className="">
                    {data && data.status === 'success' && (
                        <GraderDetail
                            data={data.data}
                            classroomSlug={slug}
                            graderSlug={graderSlug}
                        />
                    )}
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel className="flex flex-col max-h-full relative">
                    <CodeArea graderSlug={graderSlug} />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}