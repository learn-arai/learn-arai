'use client'
import '@/app/register/register.css';
import { FormEvent } from 'react';
import { OTPInput, SlotProps } from 'input-otp'
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ClassValue } from "clsx";

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
                { 'outline-4 outline-accent-foreground': props.isActive },
            )}
        >
            {props.char !== null && <div>{props.char}</div>}
            {props.hasFakeCaret && <FakeCaret />}
        </div>
    )
}

// You can emulate a fake textbox caret!
function FakeCaret() {
    return (
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
            <div className="w-px h-8 bg-white" />
        </div>
    )
}

// Inspired by Stripe's MFA input.
function FakeDash() {
    return (
        <div className="flex w-10 justify-center items-center">
            <div className="w-3 h-1 rounded-full bg-border" />
        </div>
    )
}

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

async function submitVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await fetch('http://localhost:3000/auth/email-verification', {
        method: 'POST',
        body: formData,
        credentials: 'include'
    })
}

export default function cheack() {
    return (
        <div className='w-full h-[1000px] flex justify-center items-center'>
            <div className="border-4 w-[500px] h-[300px] flex flex-col gap-4 justify-center items-center rounded-xl ">
                <form onSubmit={(e) => submitVerification(e)} className='flex flex-col gap-4 justify-center items-center'>
                    <h1>Verification code</h1>
                    <OTPInput
                        name='code'
                        maxLength={6}
                        containerClassName="group flex items-center has-[:disabled]:opacity-30"
                        render={({ slots }) => (
                            <>
                                <div className="flex">
                                    {slots.slice(0, 3).map((slot, idx) => (
                                        <Slot key={idx} {...slot} />
                                    ))}
                                </div>
                                <FakeDash />
                                <div className="flex">
                                    {slots.slice(3).map((slot, idx) => (
                                        <Slot key={idx} {...slot} />
                                    ))}
                                </div>
                            </>
                        )}
                    />
                    <button type='submit' className='border-4' >
                        submit
                    </button>
                </form>
            </div>
        </div>
    )
}
