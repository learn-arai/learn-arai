import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

import { openSans } from '@/components/ui/fonts';

import Logo from '@/public/logo_v2_black.svg';

export default function Footer() {
    return (
        <>
            <footer className="flex w-full flex-col justify-between px-12 py-32 sm:flex-row sm:px-36">
                <div className="space-y-12 pr-20">
                    <Link href="/">
                        <div className="flex w-fit items-center gap-2">
                            <Image
                                src={Logo}
                                alt="LearnArai Logo"
                                className="h-12 w-12"
                            />
                            <span
                                className={cn(
                                    'text-lg font-bold',
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

                    <p className="text-sm text-muted-foreground/65">
                        Made with ♥ by{' '}
                        <Link
                            href="https://github.com/learn-arai/learn-arai"
                            className="font-semibold underline"
                            target="_blank"
                        >
                            LearnArai team
                        </Link>
                    </p>
                </div>

                <div className="space-y-6">
                    <p className="text-lg font-bold">Product</p>
                    <p className="text-sm font-semibold text-muted-foreground/65 hover:underline">
                        <Link href="/pricing">Pricing</Link>
                    </p>
                    <p className="text-sm font-semibold text-muted-foreground/65">
                        FOOTER_CONTENT
                    </p>
                    <p className="text-sm font-semibold text-muted-foreground/65">
                        FOOTER_CONTENT
                    </p>
                </div>

                <div className="space-y-6">
                    <p className="text-lg font-bold">Resources</p>

                    <p className="text-sm font-semibold text-muted-foreground/65 hover:underline">
                        <Link href="/ticket" target="_blank">
                            Support Ticket
                        </Link>
                    </p>

                    <p className="text-sm font-semibold text-muted-foreground/65">
                        FOOTER_CONTENT
                    </p>
                    <p className="text-sm font-semibold text-muted-foreground/65">
                        FOOTER_CONTENT
                    </p>
                    <p className="text-sm font-semibold text-muted-foreground/65">
                        FOOTER_CONTENT
                    </p>
                    <p className="text-sm font-semibold text-muted-foreground/65">
                        FOOTER_CONTENT
                    </p>
                </div>

                <div className="space-y-6">
                    <p className="text-lg font-bold">Company</p>
                    <p className="text-sm font-semibold text-muted-foreground/65">
                        FOOTER_CONTENT
                    </p>
                    <p className="text-sm font-semibold text-muted-foreground/65">
                        FOOTER_CONTENT
                    </p>
                    <p className="text-sm font-semibold text-muted-foreground/65">
                        FOOTER_CONTENT
                    </p>
                    <p className="text-sm font-semibold text-muted-foreground/65">
                        FOOTER_CONTENT
                    </p>
                </div>
            </footer>
        </>
    );
}
