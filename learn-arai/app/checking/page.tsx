'use client';

import Image from 'next/image';

import { FormEvent, useState } from 'react';
import React from 'react';

import { BadgeCheck } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { inter } from '@/components/ui/fonts';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from '@/components/ui/input-otp';

import sideLoginPicture from '@/public/login/teaching.jpeg';

export default function Cheack() {
    const [message, setMessage] = useState('');

    async function submitVerification(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const result = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/email-verification`,
            {
                method: 'POST',
                body: formData,
                credentials: 'include',
            }
        );

        const data = await result.json();
        if (data.status == 'error') {
            return setMessage(data.message);
        }

        window.location.href = '/';
    }

    return (
        <div className={cn('flex', inter.className)}>
            <div className="bg-greymain-100 flex h-screen w-1/2 flex-col items-center justify-center pl-10">
                <Card className="flex h-[300px] w-[500px] flex-col items-center justify-center gap-4">
                    <form
                        onSubmit={(e) => submitVerification(e)}
                        className="flex flex-col items-center justify-center gap-4"
                    >
                        <h1>Email Verification</h1>
                        <h2 className="text-center">
                            Please enter the 6-digit verification code <br />
                            that was sent to your email
                        </h2>

                        <InputOTP
                            maxLength={6}
                            name="code"
                            className="text-foreground"
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>

                        <p className="text-red-500">{message}</p>

                        <Button
                            variant="success"
                            className="w-full"
                            type="submit"
                        >
                            Verify <BadgeCheck className="ml-1 h-4 w-4" />
                        </Button>
                    </form>
                </Card>
            </div>
            <Image
                src={sideLoginPicture}
                alt="side-login-picture"
                height={0}
                width={0}
                sizes="100vw"
                style={{
                    width: '50%',
                    height: 'auto',
                    objectFit: 'cover',
                }}
            />
        </div>
    );
}
