'use client';

import { useContext, useRef, useState } from 'react';

import type { editor } from 'monaco-editor';

import SlugContext from '@/components/context/SlugContext';
import { useClassroomGrader } from '@/components/hooks/useClassroomGrader';
import CodeEditor from '@/components/module/grader/code-editor';

import SubmitArea from './submit-area';

export default function CodeArea(props: { graderSlug: string }) {
    const { graderSlug } = props;

    const slug = useContext(SlugContext);
    const editorRef = useRef<editor.IStandaloneCodeEditor>();

    const { submit } = useClassroomGrader(slug);

    const [waiting, setWaiting] = useState(false);
    const [subId, setSubId] = useState(null);

    console.log(waiting, subId);

    return (
        <>
            <CodeEditor className="h-full" ref={editorRef} />

            <SubmitArea
                onSubmit={async () => {
                    const status = await submit(
                        graderSlug,
                        editorRef?.current?.getValue() || ''
                    );

                    setSubId(status.data.submission_id);
                    setWaiting(true);
                }}
            />
        </>
    );
}
