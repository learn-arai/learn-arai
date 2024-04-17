'use client';

import React, { forwardRef } from 'react';

import Editor from '@monaco-editor/react';
import type { OnMount } from '@monaco-editor/react';

import { cn } from '@/lib/utils';

const CodeEditor = forwardRef<any, any>(CodeEditorRoot);
export default CodeEditor;

export function CodeEditorRoot(
    props: {
        className?: string;
    },
    ref: any
) {
    const { className } = props;

    const defaultValue = `#include <iostream>
using namespace std;
    
int main() {
    return 0;
}`;

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        ref.current = editor;
    };

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