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
                <ResizablePanel>
                    {data && data.status === 'success' && (
                        <GraderDetail data={data.data} />
                    )}
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel>
                    <CodeEditor />
                </ResizablePanel>
            </ResizablePanelGroup>
        </>
    );
}
