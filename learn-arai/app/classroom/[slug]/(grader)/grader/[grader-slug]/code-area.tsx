'use client';

import { useContext, useRef, useState } from 'react';

import type { editor } from 'monaco-editor';

import SlugContext from '@/components/context/SlugContext';
import { useClassroomGrader } from '@/components/hooks/useClassroomGrader';
import CodeEditor from '@/components/module/grader/code-editor';
import { useToast } from '@/components/ui/use-toast';

import SubmitArea from './submit-area';

export default function CodeArea(props: { graderSlug: string }) {
    const { graderSlug } = props;

    const { toast } = useToast();
    const slug = useContext(SlugContext);
    const editorRef = useRef<editor.IStandaloneCodeEditor>();
    const [subId, setSubId] = useState<string | undefined>();

    const { submit } = useClassroomGrader(slug);

    return (
        <>
            <CodeEditor className="h-full" ref={editorRef} />

            <SubmitArea
                setSubId={setSubId}
                graderSlug={graderSlug}
                subId={subId}
                onSubmit={async () => {
                    const status = await submit(
                        graderSlug,
                        editorRef?.current?.getValue() || ''
                    );

                    if (status.status === 'error') {
                        toast({
                            title: 'Error occurred!',
                            description: status.message,
                            variant: 'destructive',
                        });
                        return;
                    }

                    setSubId(status.data.submission_id);
                }}
            />
        </>
    );
}
