import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

import { openSans } from '@/components/ui/fonts';

import Logo from '@/public/logo_v2_black.svg';

export default function Footer() {
    return (
        <>
            <footer className="px-12 sm:px-36 py-32 flex flex-col sm:flex-row w-full justify-between">
                <div className="space-y-12 pr-20">
                    <Link href="/">
                        <div className="flex items-center gap-2 w-fit">
                            <Image
                                src={Logo}
                                alt="LearnArai Logo"
                                className="w-12 h-12"
                            />
                            <span
                                className={cn(
                                    'font-bold text-lg',
                                    openSans.className
                                )}
                            >
                                <span className="text-red-logo-500">Learn</span>
                                <span className="text-blue-logo-500">Arai</span>
                            </span>
                        </div>
                    </Link>

                    <p className="font-semibold">
                        &ldquo; Learn deeply,
                        <br /> Live cleanly &rdquo;
                    </p>

                    <p className="text-muted-foreground/65 text-sm">
                        Made with ♥ by{' '}
                        <Link
                            href="https://github.com/learn-arai/learn-arai"
                            className="underline font-semibold"
                            target="_blank"
                        >
                            LearnArai team
                        </Link>
                    </p>
                </div>

                <div className="space-y-6">
                    <p className="font-bold text-lg">Product</p>
                    <p className="text-muted-foreground/65 font-semibold text-sm">
                        FOOTER_CONTENT
                    </p>
                    <p className="text-muted-foreground/65 font-semibold text-sm">
                        FOOTER_CONTENT
                    </p>
                    <p className="text-muted-foreground/65 font-semibold text-sm">
                        FOOTER_CONTENT
                    </p>
                </div>

                <div className="space-y-6">
                    <p className="font-bold text-lg">Resources</p>

                    <p className="text-muted-foreground/65 font-semibold text-sm hover:underline">
                        <Link href="/ticket" target="_blank">
                            Support Ticket
                        </Link>
                    </p>

                    <p className="text-muted-foreground/65 font-semibold text-sm">
                        FOOTER_CONTENT
                    </p>
                    <p className="text-muted-foreground/65 font-semibold text-sm">
                        FOOTER_CONTENT
                    </p>
                    <p className="text-muted-foreground/65 font-semibold text-sm">
                        FOOTER_CONTENT
                    </p>
                    <p className="text-muted-foreground/65 font-semibold text-sm">
                        FOOTER_CONTENT
                    </p>
                </div>

                <div className="space-y-6">
                    <p className="font-bold text-lg">Company</p>
                    <p className="text-muted-foreground/65 font-semibold text-sm">
                        FOOTER_CONTENT
                    </p>
                    <p className="text-muted-foreground/65 font-semibold text-sm">
                        FOOTER_CONTENT
                    </p>
                    <p className="text-muted-foreground/65 font-semibold text-sm">
                        FOOTER_CONTENT
                    </p>
                    <p className="text-muted-foreground/65 font-semibold text-sm">
                        FOOTER_CONTENT
                    </p>
                </div>
            </footer>
        </>
    );
}
