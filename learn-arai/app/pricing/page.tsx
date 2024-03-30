import { FaArrowRight } from 'react-icons/fa6';

import { cn } from '@/lib/utils';

import LandingNavbar from '@/components/module/landing/landing-navbar';
import { Button } from '@/components/ui/button';
import { inter, notoColorEmoji } from '@/components/ui/fonts';
import Footer from '@/components/ui/footer/footer';

export default function Page() {
    return (
        <>
            <LandingNavbar />

            <div className={cn('px-4 sm:px-14 pt-[7rem]', inter.className)}>
                <div className="bg-gradient-blue rounded-3xl p-12">
                    <h2 className="text-5xl font-bold text-center leading-snug text-primary pt-12 w-1/2 mx-auto pb-10">
                        Choose a plan thats right for you
                    </h2>

                    <div className="grid grid-cols-3 gap-4 mt-6 bg-white rounded-2xl p-4 max-w-[80rem] mx-auto">
                        <PriceCard type="free" />
                        <PriceCard type="premium" />
                        <PriceCard type="upcoming" />
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

function PriceCard(props: { type: 'free' | 'premium' | 'upcoming' }) {
    const { type } = props;

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
            price: '199฿',
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
                <span className="font-light text-muted-foreground">
                    per month
                </span>
            </h4>

            <Button
                className="flex items-center gap-2 w-full"
                size="lg"
                variant={type !== 'premium' ? 'outline' : 'default'}
            >
                Get started <FaArrowRight />
            </Button>

            <ul className="pt-12 text-center font-medium text-sm space-y-4 list-disc list-inside marker:text-muted-foreground/25">
                <li className="max-w-[24ch]">Lorem ipsum dolor, sit amet</li>
                <li className="max-w-[24ch]">Lorem ipsum dolor, sit amet</li>
                <li className="max-w-[24ch]">Lorem ipsum dolor, sit amet</li>
                <li className="max-w-[24ch]">Lorem ipsum dolor, sit amet</li>
            </ul>
        </div>
    );
}
