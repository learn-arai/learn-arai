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

            <div className={cn('px-4 pt-[7rem] sm:px-14', inter.className)}>
                <h3 className="text-center text-4xl font-semibold">
                    Choose a plan
                    <br /> that&apos;s right for you
                </h3>

                <div className="mx-auto grid max-w-4xl grid-cols-3 gap-2 pt-12">
                    <Link href="/checkout" className="w-full">
                        <Button
                            variant="outline"
                            className="h-auto w-full flex-col items-start"
                        >
                            <p className="text-muted-foreground">Per Month</p>
                            <p className="text-xl">119฿</p>
                        </Button>
                    </Link>

                    <Button
                        disabled
                        variant="outline"
                        className="relative h-auto flex-col items-start"
                    >
                        <p className="text-muted-foreground">
                            6 Months (Coming Soon!)
                        </p>
                        <p className="text-xl">
                            699฿
                            <span className="pl-1 text-lg font-normal text-destructive line-through">
                                714฿
                            </span>
                        </p>
                    </Button>

                    <Button
                        disabled
                        variant="outline"
                        className="relative h-auto flex-col items-start"
                    >
                        <p className="text-muted-foreground">
                            12 Months (Coming Soon!)
                        </p>
                        <p className="text-xl">
                            1,399฿
                            <span className="pl-1 text-lg font-normal text-destructive line-through">
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
