import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

export default function NavBar() {
    return (
        <>
            <div className="flex flex-col p-4 border-b shadow-lg">
                <div className="flex justify-between">
                    <div className="mb-4">
                        <h2 className="text-2xl">Assignment name</h2>
                    </div>
                    <div className="mb-4 border-4 rounded-full w-[50px] h-[50px] flex justify-center items-center">
                        <h2 className="">Icon</h2>
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="flex items-center">
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    Peerasin srisri
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                    <DropdownMenuItem>Billing</DropdownMenuItem>
                                    <DropdownMenuItem>Team</DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Subscription
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="flex ">
                            <button className="hover:bg-gray-200 h-[40px] w-[40px] text-4xl rounded-full flex justify-center items-center">
                                <MdKeyboardArrowLeft />
                            </button>
                            <button className="hover:bg-gray-200 h-[40px] w-[40px] text-4xl rounded-full flex justify-center items-center">
                                <MdKeyboardArrowRight />
                            </button>
                        </div>
                    </div>
                    <div>
                        <Button variant="success">return</Button>
                    </div>
                </div>
            </div>
        </>
    );
}