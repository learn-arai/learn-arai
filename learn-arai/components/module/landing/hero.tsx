import { cn } from '@/lib/utils';

import { inter, openSans } from '@/components/ui/fonts';

import HeroAnimation from './hero-animation';

export default function Hero() {
    return (
        <>
            <section
                className={cn(
                    'bg-landing-hero w-screen max-w-full text-white text-center relative pb-[38vw]',
                    inter.className
                )}
            >
                <h1 className="text-white text-[5rem] leading-none pt-[10rem] pb-[2rem] font-extrabold">
                    All in One <br />
                    <HeroAnimation /> Platform
                </h1>
                <p className="text-lg max-w-[50ch] mx-auto font-light">
                    <span className={cn('font-bold', openSans.className)}>
                        <span className="text-red-logo-500">Learn</span>
                        <span className="text-blue-logo-500">Arai</span>
                    </span>{' '}
                    is the fast & easy way to automatically monitor every action
                    of your competitors.
                </p>

                <div className="w-[60vw] mx-auto aspect-[14_/_9] bg-muted rounded-xl absolute left-1/2 -translate-x-1/2 bottom-[-5rem] shadow-2xl" />
            </section>
        </>
    );
}
