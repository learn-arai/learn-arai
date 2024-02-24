import Link from 'next/link';

import { FormEvent, useState } from 'react';
import { FaRegUser } from 'react-icons/fa';
import { IoMdKey } from 'react-icons/io';

import { useAuth } from '../hooks/useAuth';

export const EmailPasswordForm = () => {
    const [isSignInSuccess, setIsSignInSuccess] = useState<boolean | null>();
    const { sendCredentialToServer, sendCookieRetriveUser } = useAuth();

    async function submitHandle(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const responseMessege = sendCredentialToServer(formData);

        if ((await responseMessege) != 'success') {
            setIsSignInSuccess(false);
            return;
        }

        sendCookieRetriveUser();

        window.location.href = '/';
    }

    return (
        <form onSubmit={(e) => submitHandle(e)} className="my-8 py-4">
            <div className="flex flex-col gap-2">
                <div>
                    <label htmlFor="Email">Email</label> <br />
                    <div className="relative">
                        <FaRegUser
                            fill="black"
                            className="icon-in-input-field"
                        />
                        <input
                            type="text"
                            className="w-full"
                            placeholder="Email"
                            name="email"
                        />{' '}
                        <br />
                    </div>
                </div>

                <div>
                    <label htmlFor="Password">Password</label> <br />
                    <div className="relative">
                        <IoMdKey
                            fill="black"
                            className="icon-in-input-field z-0"
                        />
                        <input
                            type="password"
                            className="z-10 w-full"
                            placeholder="Password"
                            name="password"
                        />{' '}
                        <br />
                    </div>
                </div>

                <div className="flex justify-between">
                    <div className="flex gap-1">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            name="isRememberMe"
                        />{' '}
                        <br />
                        <label htmlFor="rememberMe" id="rememberMe">
                            <span className="font-medium">Remember Me</span>
                        </label>
                    </div>

                    <Link href={'#'} className="forget-password font-medium">
                        Forget Password
                    </Link>
                </div>
            </div>
            <p className="text-red-400">
                {isSignInSuccess == false && 'email or password is incorrect'}
            </p>
            <input
                type="submit"
                className="sign-in-button mt-10 font-bold"
                value="Sign In"
            />{' '}
            <br />
        </form>
    );
};
