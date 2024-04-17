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

                <div className="w-[60vw] mx-auto aspect-[14_/_9] absolute left-1/2 -translate-x-1/2 bottom-[-5rem]">
                    <div className="relative w-full h-full">
                        <Image
                            src={HeroImage}
                            alt="Hero Image"
                            className="w-full h-full absolute rounded-xl shadow-2xl z-50"
                        />

                        <Image
                            src={ClassroomCard}
                            alt="Classroom System"
                            className="absolute z-40 left-[-21%] top-[10%] rotate-[-10.5deg] h-[11vw] w-auto"
                        />

                        <Image
                            src={GraderCard}
                            alt="Grader System"
                            className="absolute z-40 right-[-25%] top-[14%] rotate-[-9.7deg] h-[10vw] w-auto"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
