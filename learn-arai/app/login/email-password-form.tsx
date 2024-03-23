'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { FormEvent, useState } from 'react';
import { FaRegUser } from 'react-icons/fa';
import { IoMdKey } from 'react-icons/io';

import { useAuth } from '@/components/hooks/useAuth';
import Checkbox from '@/components/module/form/checkbox';
import '@/components/module/form/form.css';
import Input from '@/components/module/form/input';
import Submit from '@/components/module/form/submit';

export const EmailPasswordForm = () => {
    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState<string | null>();
    const [isBlink, setIsBlink] = useState<boolean>(false);

    const { signIn } = useAuth();

    async function submitHandle(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const response = await signIn(formData);
        const responseStatus = response.status;
        const responseMessege = response.message;

        if (responseStatus != 'success') {
            setErrorMessage(await responseMessege);
            setIsBlink(true);
            return;
        }

        const previousPage = new URLSearchParams(window.location.search).get(
            `redirect`
        );

        router.push(previousPage || '/');
    }

    return (
        <form onSubmit={(e) => submitHandle(e)} className="my-8 py-4">
            <div className="flex flex-col gap-2">
                <Input
                    label="Email"
                    type="text"
                    placeholder="Email"
                    name="email"
                >
                    <FaRegUser fill="black" className="icon-in-input-field" />
                </Input>

                <Input
                    label="Password"
                    type="password"
                    placeholder="Password"
                    name="password"
                >
                    <IoMdKey fill="black" className="icon-in-input-field z-0" />
                </Input>

                <div className="flex justify-between">
                    <Checkbox name="is-remember-me" label="remember me" />

                    <Link href={'#'} className="forget-password font-medium">
                        Forget Password
                    </Link>
                </div>
            </div>
            <p className={`text-red-400 font-semibold text-center pt-2 ${isBlink && 'blink'}`}
                onAnimationEnd={ () => setIsBlink( false) }>
                {errorMessage}
            </p>
            <Submit value="sign_in" />
            <br />
        </form>
    );
};
