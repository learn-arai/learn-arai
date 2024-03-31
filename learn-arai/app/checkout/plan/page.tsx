import Link from 'next/link';

import { cn } from '@/lib/utils';

import LandingNavbar from '@/components/module/landing/landing-navbar';
import { Button } from '@/components/ui/button';
import { inter } from '@/components/ui/fonts';
import Footer from '@/components/ui/footer/footer';

export default function Page() {
    return (
        <>
            <LandingNavbar />

            <div className={cn('px-4 sm:px-14 pt-[7rem]', inter.className)}>
                <h3 className="text-center font-semibold text-4xl">
                    Choose a plan
                    <br /> that&apos;s right for you
                </h3>

                <div className="grid grid-cols-3 gap-2 max-w-4xl mx-auto pt-12">
                    <Link href="/checkout" className="w-full">
                        <Button
                            variant="outline"
                            className="items-start flex-col h-auto w-full"
                        >
                            <p className="text-muted-foreground">Per Month</p>
                            <p className="text-xl">119฿</p>
                        </Button>
                    </Link>

                    <Button
                        disabled
                        variant="outline"
                        className="items-start flex-col h-auto relative"
                    >
                        <p className="text-muted-foreground">
                            6 Months (Coming Soon!)
                        </p>
                        <p className="text-xl">
                            699฿
                            <span className="text-destructive text-lg pl-1 line-through font-normal">
                                714฿
                            </span>
                        </p>
                    </Button>

                    <Button
                        disabled
                        variant="outline"
                        className="items-start flex-col h-auto relative"
                    >
                        <p className="text-muted-foreground">
                            12 Months (Coming Soon!)
                        </p>
                        <p className="text-xl">
                            1,399฿
                            <span className="text-destructive text-lg pl-1 line-through font-normal">
                                1,428฿
                            </span>
                        </p>
                    </Button>
                </div>
            </div>

            <Footer />
        </>
    );
}
