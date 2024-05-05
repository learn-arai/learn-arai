import { FaAngleRight } from 'react-icons/fa6';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { inter } from '@/components/ui/fonts';

export default function GettingStarted() {
    return (
        <>
            <section
                className={cn(
                    'relative mx-12 space-y-8 overflow-hidden rounded-3xl bg-landing-hero p-16 sm:mx-36',
                    inter.className
                )}
            >
                <div className="absolute bottom-0 right-0 aspect-[16_/_9] w-[29rem] rounded-tl-lg bg-muted" />

                <h2 className="!mt-0 text-5xl font-bold leading-snug">
                    Ready to get
                    <br /> started?
                </h2>

                <p className="text-black/65">
                    Start your free 14 day trial today.
                    <br /> No Credit card required.
                </p>

                <Button
                    className="flex items-center gap-2 bg-white tracking-wider text-black shadow-lg hover:bg-white/90"
                    size="lg"
                >
                    <span>💪</span>
                    Get Started
                    <FaAngleRight />
                </Button>
            </section>
        </>
    );
}
