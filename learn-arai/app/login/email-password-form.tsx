import Link from 'next/link';

import { FormEvent, useState } from 'react';
import { FaRegUser } from 'react-icons/fa';
import { IoMdKey } from 'react-icons/io';

import Checkbox from '../components/form/checkbox';

import '@/app/components/form/form.css';
import Input from '@/app/components/form/input';
import Submit from '@/app/components/form/submit';
import { useAuth } from '@/app/hooks/useAuth';

export const EmailPasswordForm = () => {
    const [errorMessage, setErrorMessage] = useState<Promise<string> | null>();
    const { sendCredentialToServer, sendCookieRetriveUser } = useAuth();

    async function submitHandle(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const response = sendCredentialToServer(formData);
        const responseStatus = (await response).status;
        const responseMessege = (await response).message;

        if (await responseStatus != 'success') {
            setErrorMessage(responseMessege);
            return;
        }

        sendCookieRetriveUser();

        window.location.href = '/';
    }

    return (
        <form onSubmit={(e) => submitHandle(e)} className="my-8 py-4">
            <div className="flex flex-col gap-2">
                <Input
                    htmlFor="Email"
                    label="Email"
                    type="text"
                    placeholder="Email"
                    name="email"
                    icon={
                        <FaRegUser
                            fill="black"
                            className="icon-in-input-field"
                        />
                    }
                />

                <Input
                    htmlFor="Password"
                    label="Password"
                    type="password"
                    placeholder="Password"
                    name="password"
                    icon={
                        <IoMdKey
                            fill="black"
                            className="icon-in-input-field z-0"
                        />
                    }
                />

                <div className="flex justify-between">
                    <Checkbox name="is_remember_me" label="remember me" />

                    <Link href={'#'} className="forget-password font-medium">
                        Forget Password
                    </Link>
                </div>

            </div>
            <p className="text-red-400 font-semibold text-center pt-2">
                {errorMessage}
            </p>
            <Submit value="sign_in" />
            <br />
        </form>
    );
};
