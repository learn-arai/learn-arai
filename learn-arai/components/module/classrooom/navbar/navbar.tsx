'use client';

import { forwardRef } from 'react';
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

export default function Navbar() {
    return (
        <>
            <nav className="flex items-center justify-end shadow p-3 px-6">
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
                            className="px-4"
                            onSelect={(e) => e.preventDefault()}
                        >
                            <CreateClassroom />
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="px-4"
                            onSelect={(e) => e.preventDefault()}
                        >
                            <JoinClassroom />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>
        </>
    );
}
