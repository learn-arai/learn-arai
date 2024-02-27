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
    const { signIn  } = useAuth();

    async function submitHandle(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const response = await signIn(formData);
        const responseStatus = response.status;
        const responseMessege = response.message;

        if (responseStatus != 'success') {
            setErrorMessage(responseMessege);
            return;
        }

        history.back();
    }

    return (
        <form onSubmit={(e) => submitHandle(e)} className="my-8 py-4">
            <div className="flex flex-col gap-2">
                <Input
                    label="Email"
                    type="text"
                    placeholder="Email"
                    name="email"
                    children={
                        <FaRegUser
                            fill="black"
                            className="icon-in-input-field"
                        />
                    }
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="Password"
                    name="password"
                    children={
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
