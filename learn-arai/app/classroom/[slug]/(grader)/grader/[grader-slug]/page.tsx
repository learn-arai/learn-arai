'use client';

import { useClassroomGrader } from '@/components/hooks/useClassroomGrader';
import CodeEditor from '@/components/module/grader/code-editor';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTriggerMinimal,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
        <div className="h-full max-h-full">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel className="">
                    {data && data.status === 'success' && (
                        <GraderDetail data={data.data} />
                    )}
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel className="flex flex-col max-h-full relative">
                    <CodeEditor className="h-full" />

                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full p-2">
                        <div className="flex items-center justify-end gap-2 mb-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-sm"
                            >
                                Run
                            </Button>
                            <Button
                                variant="success"
                                size="sm"
                                className="h-7 text-sm"
                            >
                                Submit
                            </Button>
                        </div>
                        <Card className="p-2">
                            <span>Testcase</span>
                            <span>Test Result</span>
                        </Card>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
