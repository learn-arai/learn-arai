import { cn } from '@/lib/utils';

import { inter, openSans } from '@/components/ui/fonts';

export default function Feature() {
    return (
        <>
            <section className={cn('pt-12 pb-14', inter.className)}>
                <h2 className="text-4xl text-center font-bold mx-12 sm:mx-0">
                    What{' '}
                    <span className={cn('font-bold', openSans.className)}>
                        <span className="text-red-logo-500">Learn</span>
                        <span className="text-blue-logo-500">Arai</span>
                    </span>{' '}
                    can do for you
                </h2>

                <div className="grid sm:grid-cols-3 px-12 sm:px-36 mx-auto gap-8 pt-20">
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
            <div className="bg-muted/50 rounded-3xl p-8 space-y-4">
                <div className="w-full aspect-[2_/_1]" />
                <h3 className="font-bold">Title</h3>
                <p className="text-sm text-muted-foreground font-light">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Dicta dolores, tempora qui reiciendis temporibus
                </p>
            </div>
        </>
    );
}
