'use client';

import Image from 'next/image';
import { GoPlus } from 'react-icons/go';
import { GoogleIcon } from '../components/icons/google';
import { LineIcon } from '../components/icons/line';
import { FacebookIcon } from '../components/icons/facebook';
import { AppleIcon } from '../components/icons/apple';
import { GitHubIcon } from '../components/icons/github';

import '@/app/login/login.css';

import { EmailPasswordForm } from './email-password-form';

export default function Page() {

    return (
        <>
            <div className="flex">
                <div
                    className="flex h-screen 
                    w-1/2 items-center justify-center
                    bg-greymain-100
                    pl-10"
                >
                    <div className="w-[55%]">
                        <h1 className="text-center">
                            Login to
                            <span className="text-redLogo-500">Learn</span>
                            <span className="text-blueLogo-500">Arai</span>
                        </h1>

                        <div id="input-field">
                            <EmailPasswordForm/>
                        </div>

                        <p className="text-middle">
                            <span className="font-bold">or</span>
                        </p>

                        <div className="my-4 flex justify-center">
                            <div className="flex gap-6">
                                <FacebookIcon />
                                <GoogleIcon />
                                <GitHubIcon />
                                <AppleIcon />
                                <LineIcon />
                            </div>
                        </div>

                        <button className="register">
                            <div className="flex items-center justify-center">
                                <GoPlus size={25} />
                                <span className="font-bold">
                                    Register New Account
                                </span>
                            </div>
                        </button>
                    </div>
                </div>

                <Image
                    src={'/login/teaching.jpeg'}
                    alt="hello"
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
        </>
    );
}
