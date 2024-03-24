import CodeEditor from '@/components/module/grader/code-editor';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';

export default function Page() {
    return (
        <>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel>One</ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel>
                    <CodeEditor />
                </ResizablePanel>
            </ResizablePanelGroup>
        </>
    );
}
