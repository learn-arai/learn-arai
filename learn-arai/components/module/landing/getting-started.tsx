import { FaAngleRight } from 'react-icons/fa6';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { inter } from '@/components/ui/fonts';

export default function GettingStarted() {
    return (
        <>
            <section
                className={cn(
                    'bg-landing-hero rounded-3xl p-16 mx-36 space-y-8 relative overflow-hidden',
                    inter.className
                )}
            >
                <div className="absolute bottom-0 right-0 bg-muted w-[45%] aspect-[16_/_9] rounded-tl-lg" />

                <h2 className="text-5xl font-bold leading-snug !mt-0">
                    Ready to get
                    <br /> started?
                </h2>

                <p className="text-black/65">
                    Start your free 14 day trial today.
                    <br /> No Credit card required.
                </p>

                <Button
                    className="bg-white hover:bg-white/90 text-black tracking-wider flex items-center gap-2 shadow-lg"
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
