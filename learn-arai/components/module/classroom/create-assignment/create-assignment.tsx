'use client';

import { redirect } from 'next/navigation';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { BiRename } from 'react-icons/bi';
import { FaAngleRight } from 'react-icons/fa';
import { GrScorecard } from 'react-icons/gr';

import { PlusIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { useClassroomAssignment } from '@/components/hooks/useClassroomAssignment';
import { useMediaQuery } from '@/components/hooks/useMediaQuery';
import { DatePicker } from '@/components/module/classroom/create-assignment/date-picker';
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
import { Textarea } from '@/components/ui/textarea';

export default function CreateAssignment(props: { classroomSlug: string }) {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const title = 'Create new assignment';

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="flex items-center gap-1">
                        Create
                        <PlusIcon className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    <CreateAssignmentForm classroomSlug={props.classroomSlug} />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button className="flex items-center gap-1">
                    Create
                    <PlusIcon className="h-4 w-4" />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                </DrawerHeader>
                <CreateAssignmentForm
                    className="px-4"
                    classroomSlug={props.classroomSlug}
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

function CreateAssignmentForm(
    props: React.ComponentProps<'form'> & {
        classroomSlug: string;
    }
) {
    const { className, classroomSlug } = props;

    const { createAssignment } = useClassroomAssignment(classroomSlug);
    const [state, formAction] = useFormState(createAssignment, {
        status: 'idle',
    });

    useEffect(() => {
        if (state.status === 'success') {
            redirect(
                `/classroom/${classroomSlug}/assignment/${state.data.slug}/detail`
            );
        }
    }, [state, classroomSlug]);

    return (
        <form
            className={cn('grid items-start gap-4', className)}
            action={formAction}
        >
            <div className="grid gap-2">
                <Label htmlFor="title" className="relative">
                    Name
                    <Input
                        type="text"
                        id="title"
                        name="title"
                        className="mt-2 pl-9"
                        placeholder="..."
                    />
                    <div className="absolute bottom-3 mx-3 text-muted-foreground">
                        <BiRename />
                    </div>
                </Label>
            </div>

            <div className="flex gap-2">
                <Label htmlFor="max_score" className="relative w-[120px]">
                    Score
                    <Input
                        type="number"
                        id="max_score"
                        name="max_score"
                        className="mt-2 pl-9"
                        defaultValue={100}
                        placeholder="100"
                    />
                    <div className="absolute bottom-3 mx-3 text-muted-foreground">
                        <GrScorecard />
                    </div>
                </Label>

                <Label htmlFor="due_date" className="relative flex-grow">
                    Due date
                    <DatePicker />
                </Label>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description" className="relative">
                    Description
                    <Textarea
                        id="description"
                        name="description"
                        className="mt-2"
                    />
                </Label>
            </div>

            <div className="w-full">
                <Button
                    type="submit"
                    className="flex w-full items-center gap-1"
                >
                    Continue
                    <FaAngleRight />
                </Button>
                <p className="pt-1 text-right text-xs text-destructive">
                    {state.status === 'error' && state.message}
                </p>
            </div>
        </form>
    );
}
