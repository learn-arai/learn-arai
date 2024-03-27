'use client';

import { useClassroomGrader } from '@/components/hooks/useClassroomGrader';
import CodeEditor from '@/components/module/grader/code-editor';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';

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
        <>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel className="min-h-[90vh]">
                    {data && data.status === 'success' && (
                        <GraderDetail data={data.data} />
                    )}
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel className="min-h-[90vh]">
                    <CodeEditor />
                </ResizablePanel>
            </ResizablePanelGroup>
        </>
    );
}
