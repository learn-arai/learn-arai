'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useContext } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';

import { formatDate } from '@/lib/utils';

import { ClassroomContext } from '@/components/context/ClassroomContext';
import CreateClassroom from '@/components/module/classroom/create-classroom/create-classroom';
import JoinClassroom from '@/components/module/classroom/join-classroom/join-classroom';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import Logo from '@/public/logo_v2_black.svg';

import './navbar.css';

export default function Navbar(props: {
    'no-create-classroom'?: boolean;
    title?: string;
}) {
    const classroom = useContext(ClassroomContext);

    console.log(classroom);

    const noCreateClassroom = props['no-create-classroom'] || false;

    return (
        <>
            <nav className="flex h-20 w-full items-center justify-end p-3 px-6 shadow">
                <div className="mx-auto ml-0 flex items-center gap-4">
                    <Link href="/classroom">
                        <span className="flex items-center gap-2">
                            <Image
                                src={Logo}
                                alt="LearnArai logo"
                                className="h-8 w-8"
                            />

                            <h1 className="text-lg font-bold text-muted-foreground">
                                LearnArai
                            </h1>
                        </span>
                    </Link>

                    {classroom && (
                        <>
                            <FaChevronRight />

                            <span className="space-y-1.5">
                                <h2 className="leading-none">
                                    {classroom.name}
                                </h2>

                                {classroom.description && (
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {classroom.description}
                                    </p>
                                )}
                            </span>
                        </>
                    )}
                </div>

                {!noCreateClassroom && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="none" size="none">
                                <div className="rounded-full p-3 hover:bg-muted">
                                    <FaPlus />
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                className="px-4 hover:cursor-pointer"
                                onSelect={(e) => e.preventDefault()}
                            >
                                <CreateClassroom />
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="px-4 hover:cursor-pointer"
                                onSelect={(e) => e.preventDefault()}
                            >
                                <JoinClassroom />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </nav>

            {classroom?.willDeleteIn != null && (
                <div className="bg-destructive p-2 text-center text-sm text-destructive-foreground">
                    This classroom have been deleted, it will be permanently
                    deleted in {formatDate(classroom.willDeleteIn)}
                </div>
            )}
        </>
    );
}
