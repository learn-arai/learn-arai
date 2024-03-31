'use client';

import Link from 'next/link';

import { useContext } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import { MdContacts } from 'react-icons/md';

import { cn } from '@/lib/utils';

import { AuthContext } from '@/components/context/AuthContext';
import { User } from '@/components/hooks/useUser';
import LandingNavbar from '@/components/module/landing/landing-navbar';
import { Button } from '@/components/ui/button';
import { inter, notoColorEmoji } from '@/components/ui/fonts';
import Footer from '@/components/ui/footer/footer';

export default function Page() {
    const user = useContext(AuthContext);

    return (
        <>
            <LandingNavbar />

            <div className={cn('px-4 sm:px-14 pt-[7rem]', inter.className)}>
                <div className="bg-gradient-blue rounded-3xl p-12">
                    <h2 className="text-5xl font-bold text-center leading-snug text-primary pt-12 w-1/2 mx-auto pb-10">
                        Choose a plan thats right for you
                    </h2>

                    <div className="grid grid-cols-3 gap-4 mt-6 bg-white rounded-2xl p-4 max-w-[80rem] mx-auto">
                        <PriceCard type="free" user={user?.user} />
                        <PriceCard type="premium" user={user?.user} />
                        <PriceCard type="upcoming" user={user?.user} />
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

function PriceCard(props: {
    type: 'free' | 'premium' | 'upcoming';
    user: User | null | undefined;
}) {
    const { type, user } = props;

    const data = {
        free: {
            name: 'Free',
            description:
                'For teams that just getting started with basic competitor monitoring.',
            price: 'Free!',
            emoji: '📚',
        },
        premium: {
            name: 'Premium',
            description:
                'Monitor most of your competitors and work with your team.',
            price: '119฿',
            emoji: '🏫',
        },
        upcoming: {
            name: 'Enterpise / University',
            description:
                'For larger teams that need to monitor many competiors at once.',
            price: 'Custom',
            emoji: '🌐',
        },
    };

    const isOwned =
        (user?.package == 'free' && type == 'free') ||
        (user?.package == 'premium' && type == 'premium');

    const link =
        type !== 'upcoming'
            ? user
                ? isOwned
                    ? '/classroom'
                    : '/checkout/plan'
                : '/register'
            : '/contact';

    return (
        <div
            className={cn(
                'p-6 rounded-2xl',
                type === 'premium' && 'bg-[rgba(126,121,255,.1)]'
            )}
        >
            <div className="bg-muted rounded-xl w-16 h-16 aspect-square flex justify-center items-center">
                <p className={cn('text-xl', notoColorEmoji.className)}>
                    {data[type].emoji}
                </p>
            </div>

            <h3 className="text-landing-blue font-semibold text-sm pb-1 pt-6">
                {data[type].name}
            </h3>
            <p className="">{data[type].description}</p>
            <h4 className="font-bold flex flex-col py-6">
                <span className="text-4xl">{data[type].price}</span>
                <span
                    className={cn(
                        'font-light',
                        type !== 'upcoming'
                            ? 'text-muted-foreground'
                            : 'text-transparent'
                    )}
                >
                    per month
                </span>
            </h4>

            <Link href={link}>
                <Button
                    className="flex items-center gap-2 w-full"
                    size="lg"
                    variant={type !== 'premium' ? 'outline' : 'default'}
                >
                    {type == 'upcoming' ? (
                        <>
                            Contact us
                            <MdContacts />
                        </>
                    ) : isOwned ? (
                        <>Owned</>
                    ) : (
                        <>
                            Get started
                            <FaArrowRight />
                        </>
                    )}
                </Button>
            </Link>

            <ul className="pt-12 text-center font-medium text-sm space-y-4 list-disc list-inside marker:text-muted-foreground/25">
                <li className="max-w-[24ch]">Lorem ipsum dolor, sit amet</li>
                <li className="max-w-[24ch]">Lorem ipsum dolor, sit amet</li>
                <li className="max-w-[24ch]">Lorem ipsum dolor, sit amet</li>
                <li className="max-w-[24ch]">Lorem ipsum dolor, sit amet</li>
            </ul>
        </div>
    );
}
