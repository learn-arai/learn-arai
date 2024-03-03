import { cn } from '@/lib/utils';

import { inter, openSans } from '@/components/ui/fonts';

export default function Hero() {
    return (
        <>
            <div
                className={cn(
                    'bg-landing-hero w-screen max-w-full text-white text-center pb-[20rem]',
                    inter.className
                )}
            >
                <h1 className="text-white text-[3.5rem] leading-none pt-[10rem] pb-[2rem] font-extrabold">
                    All in One <br />
                    Learning Platform
                </h1>
                <p className="text-lg max-w-[50ch] mx-auto font-light">
                    <span className={cn('font-bold', openSans.className)}>
                        <span className="text-red-logo-500">Learn</span>
                        <span className="text-blue-logo-500">Arai</span>
                    </span>{' '}
                    is the fast & easy way to automatically monitor every action
                    of your competitors.
                </p>
            </div>
        </>
    );
}
