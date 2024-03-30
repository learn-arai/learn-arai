import { cn } from '@/lib/utils';

import LandingNavbar from '@/components/module/landing/landing-navbar';
import { inter } from '@/components/ui/fonts';
import Footer from '@/components/ui/footer/footer';

export default function Page() {
    return (
        <>
            <LandingNavbar />

            <div className={cn('px-4 sm:px-14 pt-[7rem]', inter.className)}>
                <div className="bg-gradient-blue rounded-3xl p-12">
                    <h2 className="text-5xl font-bold text-center leading-snug text-primary pt-12">
                        Choose a plan thats right <br /> for you
                    </h2>

                    <div className="grid grid-cols-3 gap-8 mt-6">
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
            price: 0,
        },
        premium: {
            name: 'Premium',
            description:
                'Monitor most of your competitors and work with your team.',
            price: 199,
        },
        upcoming: {
            name: 'Upcoming',
            description:
                'For larger teams that need to monitor many competiors at once.',
            price: 299,
        },
    };

    return (
        <div className="bg-white rounded-2xl p-8 h-[35rem]">
            <h3 className="text-landing-blue font-semibold text-sm pb-1">{data[type].name}</h3>
            <p className=''>{data[type].description}</p>
            <h4 className="font-bold flex flex-col py-6">
                <span className="text-4xl">
                    {data[type].price == 0 ? 'Free!' : `${data[type].price}฿`}
                </span>
                <span className="font-light text-muted-foreground">
                    per month
                </span>
            </h4>
        </div>
    );
}
