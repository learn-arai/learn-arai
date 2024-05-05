'use client';

import { redirect } from 'next/navigation';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { FaRegFile } from 'react-icons/fa6';
import { TbCircleNumber4 } from 'react-icons/tb';
import { useQueryClient } from 'react-query';

import { Plus } from 'lucide-react';

import { cn } from '@/lib/utils';

import { useClassroom } from '@/components/hooks/useClassroom';
import { useClassroomGrader } from '@/components/hooks/useClassroomGrader';
import { useMediaQuery } from '@/components/hooks/useMediaQuery';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export default function AddTestCaseButton(props: {
    classroomSlug: string;
    graderSlug: string;
}) {
    const { graderSlug, classroomSlug } = props;
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const title = 'Add new Test-case';

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>
                        Add <Plus className="ml-1.5 h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    <AddTestCaseForm
                        setOpen={setOpen}
                        classroomSlug={classroomSlug}
                        graderSlug={graderSlug}
                    />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button>
                    Add <Plus className="ml-1.5 h-4 w-4" />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                </DrawerHeader>
                <AddTestCaseForm
                    setOpen={setOpen}
                    classroomSlug={classroomSlug}
                    graderSlug={graderSlug}
                    className="px-4"
                />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

function AddTestCaseForm({
    className,
    classroomSlug,
    graderSlug,
    setOpen,
}: React.ComponentProps<'form'> & {
    classroomSlug: string;
    graderSlug: string;
    setOpen: (open: boolean) => void;
}) {
    const { addTestCase } = useClassroomGrader(classroomSlug);
    const { toast } = useToast();
    const client = useQueryClient();

    const [state, formAction] = useFormState(addTestCase, {
        graderSlug: graderSlug,
        message: '',
        status: 'idle',
    });

    useEffect(() => {
        const updateTestCaseList = async () => {
            await client.invalidateQueries([
                'get-submission-list',
                classroomSlug,
                graderSlug,
            ]);
        };

        if (state.status === 'idle') return;

        toast({
            title:
                state.status === 'success'
                    ? 'Test-case added'
                    : 'Failed to add test-case',
            description: state.message,
            variant: state.status === 'success' ? 'default' : 'destructive',
        });

        if (state.status === 'success') {
            updateTestCaseList().then(() => setOpen(false));
        }
    }, [classroomSlug, client, graderSlug, setOpen, state, toast]);

    return (
        <form
            className={cn('grid items-start gap-4', className)}
            action={formAction}
        >
            <FormInput
                name="input"
                type="file"
                label="Input file (.in)"
                placeholder="..."
            >
                <FaRegFile className="bg-primary text-primary-foreground" />
            </FormInput>

            <FormInput
                name="output"
                type="file"
                label="Output file (.sol)"
                placeholder="..."
            >
                <FaRegFile className="bg-primary text-primary-foreground" />
            </FormInput>

            <FormInput
                name="score"
                label="Score"
                type="number"
                defaultValue="10"
            >
                <TbCircleNumber4 />
            </FormInput>

            <div className="w-full">
                <Button type="submit" className="w-full">
                    Create
                </Button>
                <p className="pt-1 text-right text-xs text-destructive">
                    {state.status === 'error' && state.message}
                </p>
            </div>
        </form>
    );
}

function FormInput({
    name,
    label,
    defaultValue,
    type,
    children,
    placeholder,
}: {
    name: string;
    label: string;
    defaultValue?: string;
    type?: string;
    children?: React.ReactNode;
    placeholder?: string;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={name} className="relative">
                {label}
                <Input
                    type={type || 'text'}
                    id={name}
                    name={name}
                    defaultValue={defaultValue}
                    className={cn(
                        'mt-2',
                        !!children && 'pl-9',
                        type === 'file' &&
                            'h-10 py-0 pl-0 file:mr-2 file:h-full file:w-0 file:bg-primary file:pl-9 file:pr-0 file:text-primary'
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
