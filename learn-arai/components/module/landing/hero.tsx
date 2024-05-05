import Image from 'next/image';

import { cn } from '@/lib/utils';

import { inter, openSans } from '@/components/ui/fonts';

import HeroImage from '@/public/landing/grader_ui.png';
import ClassroomCard from '@/public/landing/hero_classroom_card.png';
import GraderCard from '@/public/landing/hero_grader_card.png';

import HeroAnimation from './hero-animation';

export default function Hero() {
    return (
        <>
            <section
                className={cn(
                    'relative w-screen max-w-full bg-landing-hero pb-[38vw] text-center text-white',
                    inter.className
                )}
            >
                <h1 className="pb-[2rem] pt-[10rem] text-[5rem] font-extrabold leading-none text-white">
                    All in One <br />
                    <HeroAnimation /> Platform
                </h1>
                <p className="mx-auto max-w-[50ch] text-lg font-light">
                    <span className={cn('font-bold', openSans.className)}>
                        <span className="text-red-logo-500">Learn</span>
                        <span className="text-blue-logo-500">Arai</span>
                    </span>{' '}
                    is the fast & easy way to automatically monitor every action
                    of your competitors.
                </p>

                <div className="absolute bottom-[-5rem] left-1/2 mx-auto aspect-[14_/_9] w-[60vw] -translate-x-1/2">
                    <div className="relative h-full w-full">
                        <Image
                            src={HeroImage}
                            alt="Hero Image"
                            className="absolute z-50 h-full w-full rounded-xl shadow-2xl"
                        />

                        <Image
                            src={ClassroomCard}
                            alt="Classroom System"
                            className="absolute left-[-21%] top-[10%] z-40 h-[11vw] w-auto rotate-[-10.5deg]"
                        />

                        <Image
                            src={GraderCard}
                            alt="Grader System"
                            className="absolute right-[-25%] top-[14%] z-40 h-[10vw] w-auto rotate-[-9.7deg]"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
