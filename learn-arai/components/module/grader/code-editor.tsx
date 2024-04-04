'use client';

import { useContext, useEffect, useRef } from 'react';

import Editor from '@monaco-editor/react';

import { cn } from '@/lib/utils';
import SlugContext from '@/components/context/SlugContext';

export default function CodeEditor(props: {
    isSubmit: boolean;
    setIsSubmit: (value: boolean) => void;
    className?: string;
    graderSlug: string;
}) {
    const classroomSlug = useContext(SlugContext);
    const { className } = props;
    const editorRef = useRef<any>(null);
    const defaultValue = `#include <iostream>
using namespace std;
    
int main() {
    return 0;
}`;

    const handleEditorDidMount = (editor: any, monaco: any) => {
        editorRef.current = editor;
    };

    const submitSourceCode = async (sourceCode: string) => {
        const formData = new FormData();
        formData.append('source_code', sourceCode);

        //TODO: still not woked, I don't know why
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/c/${classroomSlug}/gd/${props.graderSlug}/submit`, {
            credentials: 'include',
            method: 'POST',
            body: formData,
        })
    };

    useEffect(() => {
        props.setIsSubmit(false);
        if (editorRef.current) {
            submitSourceCode(editorRef.current.getValue());
        }
    }, [props.isSubmit]);

    return (
        <>
            <Editor
                className={cn('w-full', className)}
                defaultLanguage="cpp"
                theme="vs-dark"
                defaultValue={defaultValue}
                onMount={handleEditorDidMount}
            />

            
        </>
    );
}
