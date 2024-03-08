import Image from 'next/image';

import CISLogo from '@/public/landing/cis_logo.png';

export default function Client() {
    return (
        <>
            <div className="pt-[10rem]">
                <p className="text-muted-foreground text-center">
                    Used & Trusted by
                </p>
                <div className="flex justify-center py-8">
                    <Image
                        src={CISLogo}
                        alt="CIS Logo"
                        className="w-16 grayscale opacity-60"
                    />
                </div>
            </div>
        </>
    );
}
