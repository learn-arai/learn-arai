'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useContext } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { FaAngleDown } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';

import { cn } from '@/lib/utils';

import { AuthContext } from '@/components/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { openSans } from '@/components/ui/fonts';

import Logo from '@/public/logo_v2.svg';

export default function LandingNavbar() {
    const user = useContext(AuthContext);

    return (
        <>
            <nav className="absolute z-10 flex w-full items-center px-4 pt-6 sm:px-14">
                <div className="relative mx-auto ml-0 flex items-center gap-2">
                    <Image
                        src={Logo}
                        alt="LearnArai logo"
                        className="h-11 w-11"
                    />
                    <span
                        className={cn('text-lg font-bold', openSans.className)}
                    >
                        <span className="text-red-logo-500">Learn</span>
                        <span className="text-blue-logo-500">Arai</span>
                    </span>
                </div>

                <div className="absolute left-1/2 flex -translate-x-1/2 items-center space-x-8">
                    <span>
                        <Link href="/pricing">Price</Link>
                    </span>
                    <span className="flex items-center gap-2">
                        Use Cases <FaAngleDown />
                    </span>
                    <span className="flex items-center gap-2">
                        Resources <FaAngleDown />
                    </span>
                </div>

                <div className="mx-auto mr-0 flex items-center space-x-4">
                    {user?.user ? (
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button className="flex items-center gap-2 bg-primary text-primary-foreground">
                                        <p className="text-sm">
                                            {user.user.first_name}{' '}
                                            {user.user.last_name}
                                        </p>
                                        <FaUserCircle className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>
                                        My Account
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link href="/profile">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link href="/profile/subscription">
                                            Subscription
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button
                                    variant="link"
                                    className="text-base font-semibold"
                                >
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button
                                    variant="default"
                                    className="py-6 text-base "
                                >
                                    Getting Started{' '}
                                    <FaArrowRight className="ml-2" />
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </>
    );
}
