'use client';

import Image from 'next/image';

import { FormEvent } from 'react';
import React from 'react';

import { OTPInput, SlotProps } from 'input-otp';

import { cn } from '@/lib/utils';

import sideLoginPicture from '@/public/login/teaching.jpeg';

import '@/app/register/register.css';

function Slot(props: SlotProps) {
    return (
        <div
            className={cn(
                'relative w-10 h-14 text-[2rem]',
                'flex items-center justify-center',
                'transition-all',
                'border-border border-y border-r first:border-l first:rounded-l-md last:rounded-r-md',
                'group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20',
                'outline outline-0 outline-accent-foreground/20',
                { 'outline-4 outline-accent-foreground': props.isActive }
            )}
        >
            {props.char !== null && <div>{props.char}</div>}
            {props.hasFakeCaret && <FakeCaret />}
        </div>
    );
}

// You can emulate a fake textbox caret!
function FakeCaret() {
    return (
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
            <div className="w-px h-8 bg-white" />
        </div>
    );
}

// Inspired by Stripe's MFA input.
function FakeDash() {
    return (
        <div className="flex w-10 justify-center items-center">
            <div className="w-3 h-1 rounded-full bg-border" />
        </div>
    );
}

async function submitVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const result = await fetch(
        'http://localhost:3000/auth/email-verification',
        {
            method: 'POST',
            body: formData,
            credentials: 'include',
        }
    );
    const data = await result.json();
    console.log(data);
    if (data.status == 'error') {
        alert(data.message);
    } else {
        window.location.href = '/';
    }
}

export default function cheack() {
    return (
        <div className="flex">
            <div className="flex flex-col h-screen w-1/2 items-center justify-center bg-greymain-100 pl-10">
                <div className="border-4 w-[500px] h-[300px] flex flex-col gap-4 justify-center items-center rounded-xl ">
                    <form
                        onSubmit={(e) => submitVerification(e)}
                        className="flex flex-col gap-4 justify-center items-center"
                    >
                        <h1>Email Verification</h1>
                        <h2 className="text-black text-center">
                            Please enter the 6-digit verification code <br />
                            that was sent to your email
                        </h2>
                        <OTPInput
                            name="code"
                            maxLength={6}
                            containerClassName="group flex items-center has-[:disabled]:opacity-30"
                            render={({ slots }) => (
                                <div className="flex">
                                    {slots.slice(0, 6).map((slot, idx) => (
                                        <Slot key={idx} {...slot} />
                                    ))}
                                </div>
                            )}
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        >
                            submit
                        </button>
                    </form>
                </div>
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
