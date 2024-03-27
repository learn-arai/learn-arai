'use client';

import Editor from '@monaco-editor/react';

import { cn } from '@/lib/utils';

export default function CodeEditor(props: { className?: string }) {
    const { className } = props;

    return (
        <>
            <Editor
                className={cn('w-full', className)}
                defaultLanguage="cpp"
                theme="vs-dark"
                defaultValue={`#include <iostream>

using namespace std;

int main() {
    return 0;
}`}
            />
        </>
    );
}
