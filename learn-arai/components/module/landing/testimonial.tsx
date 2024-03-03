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
                    'bg-[linear-gradient(#aba8ff,#c5c3ff)] px-36 py-32 mb-28 mt-12',
                    inter.className
                )}
            >
                <h2 className="text-white text-5xl text-center font-semibold leading-tight">
                    Loved by students and teachers <br />
                    around the world
                </h2>

                <p className="text-white text-center text-lg font-light max-w-[65ch] mx-auto pt-8">
                    Companies use tona daily to know what their competitors are
                    doing without spending endless hours on manual work or
                    breaking the bank.
                </p>

                <div className="grid grid-cols-2 gap-10 pt-12">
                    <div className="bg-[linear-gradient(135deg,#ffc7c2,#fdb0ac)] p-10 rounded-3xl text-white flex flex-col justify-between">
                        <p className="font-bold text-4xl leading-snug">
                            เจ๋งมากเลยครับ ใช้งานง่าย เหมือน Grader
                            อาจารย์เฉียบเลย
                        </p>
                        <div className="text-lg font-light flex items-center gap-4 pt-8">
                            <span>Athicha Leksansern</span>
                            <Separator
                                orientation="vertical"
                                className="h-6 bg-white"
                            />
                            <span>Student @ CS KMUTNB</span>
                        </div>
                    </div>
                    <div className="bg-[linear-gradient(135deg,#ffe0b4,#fed298)] p-10 rounded-3xl text-black flex flex-col justify-between">
                        <p className="font-bold text-4xl leading-snug">
                            Feature เยอะมาก, ใช้งานเร็วมาก, ไม่ค้าง,
                            ตรวจคะแนนนักศึกษาได้ง่าย
                        </p>
                        <div className="text-lg font-light flex items-center gap-4 pt-8">
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
                        className="grayscale w-20"
                    />
                </div>
            </section>
        </>
    );
}
