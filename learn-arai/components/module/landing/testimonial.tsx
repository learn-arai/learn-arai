import Image from 'next/image';

import { cn } from '@/lib/utils';

import { inter } from '@/components/ui/fonts';
import { Separator } from '@/components/ui/separator';

import CISLogo from '@/public/landing/cis_logo.png';

export default function Testimonial() {
    return (
        <>
            <section
                className={cn(
                    'mb-28 mt-12 bg-[linear-gradient(#aba8ff,#c5c3ff)] px-12 py-32 sm:px-36',
                    inter.className
                )}
            >
                <h2 className="text-center text-5xl font-semibold leading-tight text-white">
                    Loved by students and teachers <br />
                    around the world
                </h2>

                <p className="mx-auto max-w-[65ch] pt-8 text-center text-lg font-light text-white">
                    Companies use tona daily to know what their competitors are
                    doing without spending endless hours on manual work or
                    breaking the bank.
                </p>

                <div className="grid gap-10 pt-12 sm:grid-cols-2">
                    <div className="flex flex-col justify-between rounded-3xl bg-[linear-gradient(135deg,#ffc7c2,#fdb0ac)] p-10 text-white">
                        <p className="text-4xl font-bold leading-snug">
                            เจ๋งมากเลยครับ ใช้งานง่าย เหมือน Grader
                            อาจารย์เฉียบเลย
                        </p>
                        <div className="flex items-center gap-4 pt-8 text-base font-light">
                            <span>Athicha Leksansern</span>
                            <Separator
                                orientation="vertical"
                                className="h-6 bg-white"
                            />
                            <span>Student @ CS KMUTNB</span>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between rounded-3xl bg-[linear-gradient(135deg,#ffe0b4,#fed298)] p-10 text-black">
                        <p className="text-4xl font-bold leading-snug">
                            Feature เยอะมาก, ใช้งานเร็วมาก, ไม่ค้าง,
                            ตรวจคะแนนนักศึกษาได้ง่าย
                        </p>
                        <div className="flex items-center gap-4 pt-8 text-base font-light">
                            <span>Asst.Prof.Sathit Prasomphan</span>
                            <Separator
                                orientation="vertical"
                                className="h-6 bg-black"
                            />
                            <span>Professor @ CS KMUTNB</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center pt-12">
                    <Image
                        src={CISLogo}
                        alt="CIS Logo"
                        className="w-20 grayscale"
                    />
                </div>
            </section>
        </>
    );
}
