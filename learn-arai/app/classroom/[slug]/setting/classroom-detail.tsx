'use client';

import Link from 'next/link';

import { useContext } from 'react';
import { BiRename } from 'react-icons/bi';
import { CgDetailsMore } from 'react-icons/cg';
import { FaBook } from 'react-icons/fa';

import { cn } from '@/lib/utils';

import { ClassroomContext } from '@/components/context/ClassroomContext';
import SlugContext from '@/components/context/SlugContext';
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

export default function ClassroomDetail() {
    const classroom = useContext(ClassroomContext);
    const slug = useContext(SlugContext);

    return (
        <Card id="classroom-detail">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FaBook className="w-5 h-5" />
                    Classroom Detail
                </CardTitle>
                <CardDescription>
                    You can edit the classroom information here
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="grid items-start gap-4 max-w-xl">
                    <FormInput
                        name="name"
                        label="Name"
                        disabled={classroom === null}
                        defaultValue={classroom?.name || 'Loading...'}
                    >
                        <BiRename />
                    </FormInput>

                    <FormInput
                        name="description"
                        label="Description"
                        disabled={classroom === null}
                        defaultValue={
                            classroom ? classroom.description : 'Loading...'
                        }
                    >
                        <CgDetailsMore />
                    </FormInput>

                    <div className="grid grid-cols-2 gap-2">
                        <Button>Save</Button>
                        <Link href={`/classroom/${slug}`} className="w-full">
                            <Button variant="outline" className="w-full">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
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
