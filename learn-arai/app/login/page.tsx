'use client';

import Image from 'next/image';

import { GoPlus } from 'react-icons/go';

import sideLoginPicture from '@/public/login/teaching.jpeg';

import { EmailPasswordForm } from './email-password-form';
import './login.css';
import AppleIcon from '@/app/components/icons/apple';
import FacebookIcon from '@/app/components/icons/facebook';
import GitHubIcon from '@/app/components/icons/github';
import GoogleIcon from '@/app/components/icons/google';
import LineIcon from '@/app/components/icons/line';

export default function Page() {
    return (
        <>
            <div className="flex">
                <div
                    className="flex h-screen 
                    w-1/2 items-center justify-center
                    bg-grey_main-100
                    pl-10"
                >
                    <div className="w-[55%]">
                        <h1 className="text-center">
                            Login to
                            <span className="text-red_logo-500">Learn</span>
                            <span className="text-blue_logo-500">Arai</span>
                        </h1>

                        <div id="input-field">
                            <EmailPasswordForm />
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
        </>
    );
}
