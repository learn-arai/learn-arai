'use client';

import { FaChevronRight } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';

import CreateClassroom from '@/components/module/classrooom/create-classroom/create-classroom';
import JoinClassroom from '@/components/module/classrooom/join-classroom/join-classroom';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import './navbar.css';

export default function Navbar(props: {
    'no-create-classroom'?: boolean;
    title?: string;
}) {
    const noCreateClassroom = props['no-create-classroom'] || false;
    const title = props.title || '';

    return (
        <>
            <nav className="flex items-center justify-end shadow p-3 px-6 h-20 w-full">
                {title && (
                    <div className="mx-auto ml-0 flex items-center gap-4">
                        <h1 className="text-primary text-lg">LearnArai</h1>
                        <FaChevronRight />

                        <span className="space-y-1.5">
                            <h2 className="leading-none">{title}</h2>
                            <p className="text-xs text-muted-foreground leading-none">
                                1
                            </p>
                        </span>
                    </div>
                )}

                {!noCreateClassroom && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="none" size="none">
                                <div className="hover:bg-muted p-3 rounded-full">
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
        </>
    );
}
