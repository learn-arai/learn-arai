import { cn } from '@/lib/utils';

import { inter, openSans } from '@/components/ui/fonts';

export default function Feature() {
    return (
        <>
            <section className={cn('pb-14 pt-12', inter.className)}>
                <h2 className="mx-12 text-center text-4xl font-bold sm:mx-0">
                    What{' '}
                    <span className={cn('font-bold', openSans.className)}>
                        <span className="text-red-logo-500">Learn</span>
                        <span className="text-blue-logo-500">Arai</span>
                    </span>{' '}
                    can do for you
                </h2>

                <div className="mx-auto grid gap-8 px-12 pt-20 sm:grid-cols-3 sm:px-36">
                    <FeatureCard />
                    <FeatureCard />
                    <FeatureCard />
                    <FeatureCard />
                    <FeatureCard />
                    <FeatureCard />
                </div>
            </section>
        </>
    );
}

function FeatureCard() {
    return (
        <>
            <div className="space-y-4 rounded-3xl bg-muted/50 p-8">
                <div className="aspect-[2_/_1] w-full" />
                <h3 className="font-bold">Title</h3>
                <p className="text-sm font-light text-muted-foreground">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Dicta dolores, tempora qui reiciendis temporibus
                </p>
            </div>
        </>
    );
}
