'use client';

import { redirect } from 'next/navigation';

import { useContext, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { BiRename } from 'react-icons/bi';
import { BsCpuFill } from 'react-icons/bs';
import { FaMemory } from 'react-icons/fa6';
import { PiFilePdfFill } from 'react-icons/pi';

import { TerminalIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import SlugContext from '@/components/context/SlugContext';
import { useClassroomGrader } from '@/components/hooks/useClassroomGrader';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import FileDetail from './file-detail';

export default function Page() {
    const slug = useContext(SlugContext);
    const { createGrader } = useClassroomGrader(slug);

    const [state, action] = useFormState(createGrader, { status: 'idle' });

    useEffect(() => {
        if (state.status === 'success') {
            redirect(`/classroom/${slug}/grader/${state.data.slug}`);
        }
    }, [state, slug]);

    return (
        <div className="max-w-5xl mx-auto py-12">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TerminalIcon className="w-5 h-5" />
                        Create new problem
                    </CardTitle>
                    <CardDescription>
                        You can create a new problem here
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="max-w-xl space-y-4">
                        <FileDetail />

                        <form
                            className="grid items-start gap-4"
                            action={action}
                        >
                            <div className="grid grid-cols-2 gap-2">
                                <FormInput name="name" label="Name">
                                    <BiRename />
                                </FormInput>

                                <FormInput
                                    name="instruction_file"
                                    label="Instruction (.pdf)"
                                    type="file"
                                >
                                    <PiFilePdfFill className="bg-primary text-primary-foreground" />
                                </FormInput>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <FormInput
                                    name="cpu_limit"
                                    label="CPU Time Limit (ms)"
                                    type="number"
                                    defaultValue="500"
                                >
                                    <BsCpuFill />
                                </FormInput>

                                <FormInput
                                    name="mem_limit"
                                    label="Memory Limit (MB)"
                                    type="number"
                                    defaultValue="512"
                                >
                                    <FaMemory />
                                </FormInput>
                            </div>

                            <div className="w-full">
                                <Button className="w-full">Create</Button>
                                <p className="pt-1 text-xs text-destructive text-left font-medium">
                                    {state.status === 'error' && state.message}
                                </p>
                            </div>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function FormInput({
    name,
    label,
    defaultValue,
    type,
    children,
    placeholder,
    disabled,
}: {
    name: string;
    label: string;
    defaultValue?: string;
    type?: string;
    children?: React.ReactNode;
    placeholder?: string;
    disabled?: boolean;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={name} className="relative">
                {label}
                <Input
                    disabled={disabled}
                    type={type || 'text'}
                    id={name}
                    name={name}
                    defaultValue={defaultValue}
                    className={cn(
                        'mt-2',
                        children && 'pl-9',
                        type === 'file' &&
                            'file:bg-primary file:text-primary h-10 py-0 file:h-full pl-0 file:pl-9 file:w-0 file:pr-0 file:mr-2'
                    )}
                    placeholder={placeholder}
                />
                <div
                    className={cn(
                        'absolute bottom-3 mx-3 text-muted-foreground',
                        type === 'file' && 'bg-background'
                    )}
                >
                    {children}
                </div>
            </Label>
        </div>
    );
}
