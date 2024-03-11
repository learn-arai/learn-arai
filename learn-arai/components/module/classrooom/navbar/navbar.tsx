'use client';

import { FaPlus } from 'react-icons/fa6';

import CreateClassroom from '@/components/module/classrooom/create-classroom/create-classroom';
import JoinClassroom from '@/components/module/classrooom/join-classroom/join-classroom';
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
            <nav className="flex items-center shadow p-3 px-6">
                <DropdownMenu>
                    <DropdownMenuTrigger className="mx-auto mr-0">
                        <div className="hover:bg-muted mx-auto mr-0 p-3 rounded-full">
                            <FaPlus className="" />
                        </div>
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
            </nav>
        </>
    );
}
