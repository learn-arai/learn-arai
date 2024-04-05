import Image from 'next/image';
import Link from 'next/link';

import { FaArrowRight } from 'react-icons/fa';
import { FaAngleDown } from 'react-icons/fa';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { openSans } from '@/components/ui/fonts';

import Logo from '@/public/logo_v2.svg';

export default function LandingNavbar() {
    return (
        <>
            <nav className="absolute px-4 sm:px-14 pt-6 flex items-center w-full z-10">
                <div className="flex items-center gap-2 mx-auto ml-0 relative">
                    <Image
                        src={Logo}
                        alt="LearnArai logo"
                        className="w-11 h-11"
                    />
                    <span
                        className={cn('font-bold text-lg', openSans.className)}
                    >
                        <span className="text-red-logo-500">Learn</span>
                        <span className="text-blue-logo-500">Arai</span>
                    </span>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-8">
                    <span>Price</span>
                    <span className="flex items-center gap-2">
                        Use Cases <FaAngleDown />
                    </span>
                    <span className="flex items-center gap-2">
                        Resources <FaAngleDown />
                    </span>
                </div>

                <div className="mx-auto mr-0 flex space-x-4">
                    <Link href="/login">
                        <Button
                            variant="link"
                            className="font-semibold text-base"
                        >
                            Sign In
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button variant="default" className="text-base py-6 ">
                            Getting Started <FaArrowRight className="ml-2" />
                        </Button>
                    </Link>
                </div>
            </nav>
        </>
    );
}
