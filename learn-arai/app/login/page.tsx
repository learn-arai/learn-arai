'use client';

import Image from 'next/image';
import Link from 'next/link';

import { GoPlus } from 'react-icons/go';

import { Icon } from '@iconify/react';

import sideLoginPicture from '@/public/login/teaching.jpeg';

import { EmailPasswordForm } from './email-password-form';
import './sign-in.css';

export default function Page() {
    return (
        <>
            <div className="flex">
                <div
                    className="flex h-screen 
                    w-1/2 items-center justify-center
                    bg-grey-main-100
                    pl-10"
                >
                    <div className="w-[55%]">
                        <h1 className="text-center">
                            Login to
                            <span className="text-red-logo-500">Learn</span>
                            <span className="text-blue-logo-500">Arai</span>
                        </h1>

                        <div id="input-field">
                            <EmailPasswordForm />
                        </div>

                        <p className="text-middle">
                            <span className="font-bold">or</span>
                        </p>

                        <div className="my-4 flex justify-center">
                            <div className="flex gap-6">
                                <Icon
                                    icon="logos:facebook"
                                    style={{ fontSize: '40px' }}
                                />
                                <Icon
                                    icon="devicon:apple"
                                    style={{ fontSize: '40px' }}
                                />
                                <Icon
                                    icon="icon-park:github"
                                    style={{ fontSize: '40px' }}
                                />
                                <Icon
                                    icon="cib:line"
                                    style={{
                                        fontSize: '40px',
                                        color: '#06C755',
                                    }}
                                />
                                <Icon
                                    icon="flat-color-icons:google"
                                    style={{ fontSize: '40px' }}
                                />{' '}
                            </div>
                        </div>

                        <button className="register" type="button">
                            <Link href="/register">
                                <div className="flex items-center justify-center">
                                    <GoPlus size={25} />
                                    <span className="font-bold">
                                        Register New Account
                                    </span>
                                </div>
                            </Link>
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
