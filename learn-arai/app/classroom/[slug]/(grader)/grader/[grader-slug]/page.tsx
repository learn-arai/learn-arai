'use client';

import { useClassroomGrader } from '@/components/hooks/useClassroomGrader';
import CodeEditor from '@/components/module/grader/code-editor';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';

import GraderDetail from './grader-detail';
import SubmitArea from './submit-area';
import { useState } from 'react';

export default function Page({
    params,
}: {
    params: { slug: string; 'grader-slug': string };
}) {
    const { slug, 'grader-slug': graderSlug } = params;
    const { useGetDetail } = useClassroomGrader(slug);
    const [ isSubmit, setIsSubmit ] = useState(false);
    const { data } = useGetDetail(graderSlug);

    return (
        <div className="h-full max-h-full">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel className="">
                    {data && data.status === 'success' && (
                        <GraderDetail data={data.data} />
                    )}
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel className="flex flex-col max-h-full relative">
                    <CodeEditor className="h-full" setIsSubmit={ setIsSubmit } isSubmit={ isSubmit } graderSlug={graderSlug}/>

                    <SubmitArea setIsSubmit={ setIsSubmit }/>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
