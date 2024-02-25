import Link from 'next/link';

import { FormEvent, useState } from 'react';
import { FaRegUser } from 'react-icons/fa';
import { IoMdKey } from 'react-icons/io';

import { useAuth } from '@/app/hooks/useAuth';
import Input from '@/app/components/form/input';
import Submit from '@/app/components/form/submit';

export const EmailPasswordForm = () => {
    const [errorMessage, setErrorMessage] = useState<Promise<string> | null>();
    const { sendCredentialToServer, sendCookieRetriveUser } = useAuth();

    async function submitHandle(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const responseMessege = sendCredentialToServer(formData);

        if ( await responseMessege != 'succes') {
            setErrorMessage(responseMessege);
            return;
        }

        sendCookieRetriveUser();

        window.location.href = '/';
    }

    return (
        <form onSubmit={(e) => submitHandle(e)} className="my-8 py-4">
            <div className="flex flex-col gap-2">
                <div>
                    <Input type="text" placeholder="Email" name="email" children={<FaRegUser
                        fill="black"
                        className="icon-in-input-field"
                    />}/>
                    <br />
                </div>

                <div>
                    <label htmlFor="Password">Password</label> <br />
                    <Input type="password" placeholder="Password" name="password" children={<IoMdKey
                        fill="black"
                        className="icon-in-input-field z-0"
                    />}/>
                    <br />
                </div>

                <div className="flex justify-between">
                    <div className="flex gap-1">
                        <Input type="checkbox" name="is_remember_me"/>
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
                {errorMessage}
            </p>
            <Submit value='sign_in'/>
            <br />
        </form>
    );
};
