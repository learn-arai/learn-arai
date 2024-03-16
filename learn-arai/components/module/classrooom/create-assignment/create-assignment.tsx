'use client';

import * as React from 'react';
import { useState } from 'react';
import { BiRename } from 'react-icons/bi';
import { GrScorecard } from 'react-icons/gr';

import { PlusIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { useMediaQuery } from '@/components/hooks/useMediaQuery';
import { DatePicker } from '@/components/module/classrooom/create-assignment/date-picker';
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

function CreateAssignmentButton(props: React.ComponentProps<'button'>) {
    return (
        <Button className="flex gap-1 items-center" {...props}>
            Create
            <PlusIcon className="w-4 h-4" />
        </Button>
    );
}

export default function CreateAssignment() {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const title = 'Create new assignment';

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <CreateAssignmentButton />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    <CreateAssignmentForm />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <CreateAssignmentButton />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                </DrawerHeader>
                <CreateAssignmentForm className="px-4" />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

function CreateAssignmentForm({ className }: React.ComponentProps<'form'>) {
    // const { createClassroom } = useClassroom();

    // const [state, formAction] = useFormState(createClassroom, {
    //     status: 'idle',
    // });

    // useEffect(() => {
    //     if (state.status === 'success') {
    //         redirect(`/classroom/${state.data.classroom.slug}`);
    //     }
    // }, [state]);

    return (
        <form
            className={cn('grid items-start gap-4', className)}
            // action={formAction}
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
                <Label htmlFor="score" className="relative w-[120px]">
                    Score
                    <Input
                        type="number"
                        id="score"
                        name="score"
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
                <Button type="submit" className="w-full">
                    Create
                </Button>
                <p className="pt-1 text-xs text-destructive text-right">
                    {/* {state.status === 'error' && state.message} */}
                </p>
            </div>
        </form>
    );
}
