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

            <div className={cn('px-4 pt-[7rem] sm:px-14', inter.className)}>
                <div className="rounded-3xl bg-gradient-blue p-12">
                    <h2 className="mx-auto w-1/2 pb-10 pt-12 text-center text-5xl font-bold leading-snug text-primary">
                        Choose a plan thats right for you
                    </h2>

                    <div className="mx-auto mt-6 grid max-w-[80rem] grid-cols-3 gap-4 rounded-2xl bg-white p-4">
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
                'rounded-2xl p-6',
                type === 'premium' && 'bg-[rgba(126,121,255,.1)]'
            )}
        >
            <div className="flex aspect-square h-16 w-16 items-center justify-center rounded-xl bg-muted">
                <p className={cn('text-xl', notoColorEmoji.className)}>
                    {data[type].emoji}
                </p>
            </div>

            <h3 className="pb-1 pt-6 text-sm font-semibold text-landing-blue">
                {data[type].name}
            </h3>
            <p className="">{data[type].description}</p>
            <h4 className="flex flex-col py-6 font-bold">
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
                    className="flex w-full items-center gap-2"
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

            <ul className="list-inside list-disc space-y-4 pt-12 text-center text-sm font-medium marker:text-muted-foreground/25">
                <li className="max-w-[24ch]">Lorem ipsum dolor, sit amet</li>
                <li className="max-w-[24ch]">Lorem ipsum dolor, sit amet</li>
                <li className="max-w-[24ch]">Lorem ipsum dolor, sit amet</li>
                <li className="max-w-[24ch]">Lorem ipsum dolor, sit amet</li>
            </ul>
        </div>
    );
}
