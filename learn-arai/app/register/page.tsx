'use client';

import Image from 'next/image';

import { FormEvent, useState } from 'react';
import { FaRegUser } from 'react-icons/fa';
import { FaPhoneAlt } from 'react-icons/fa';
import { IoMdKey } from 'react-icons/io';
import { MdOutlineEmail } from 'react-icons/md';

import Input from '@/components/module/form/input';

import sideLoginPicture from '@/public/login/teaching.jpeg';

import '@/app/register/register.css';

export default function Home() {
    const [message, setMessage] = useState('');
    async function submitHandle(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const result = await fetch('http://localhost:3000/auth/sign-up', {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });
        const data = await result.json();
        if (data.status == 'error') {
            if (data.errors) {
                if (data.errors.password) {
                    setMessage(data.errors.password[0]);
                } else if (data.errors.email) {
                    setMessage(data.errors.email[0]);
                } else if (data.errors.passwordConfirmation[0]) {
                    setMessage(data.errors.passwordConfirmation[0]);
                }
            }
        } else {
            window.location.href = 'checking';
        }
    }
    return (
        <div className="flex">
            <div className="flex flex-col h-screen w-1/2 items-center justify-center bg-greymain-100 pl-10">
                <div className="w-[55%]">
                    <h1 className="text-center mb-12">Register</h1>
                    <div className="input-form">
                        <form
                            onSubmit={(e) => submitHandle(e)}
                            className="flex flex-col gap-2 "
                        >
                            <div className="flex flex-row gap-4">
                                <Input
                                    htmlFor="name"
                                    label="Name"
                                    type="text"
                                    placeholder="Name"
                                    name="name"
                                    isRequied={true}
                                >
                                    <FaRegUser className="icon-in-input-field" />
                                </Input>
                                <Input
                                    htmlFor="surname"
                                    label="Surname"
                                    type="text"
                                    placeholder="Surname"
                                    name="Surname"
                                    isRequied={true}
                                >
                                    <FaRegUser className="icon-in-input-field" />
                                </Input>
                            </div>
                            <Input
                                htmlFor="Phone"
                                label="Phone"
                                type="text"
                                placeholder="Phone"
                                name="Phone"
                                isRequied={true}
                            >
                                <FaPhoneAlt className="icon-in-input-field" />
                            </Input>
                            <Input
                                htmlFor="Email"
                                label="Email"
                                type="text"
                                placeholder="Email"
                                name="email"
                                isRequied={true}
                            >
                                <MdOutlineEmail className="icon-in-input-field" />
                            </Input>
                            <Input
                                htmlFor="Password"
                                label="Password"
                                type="Password"
                                placeholder="Password"
                                name="password"
                                isRequied={true}
                            >
                                <IoMdKey className="icon-in-input-field" />
                            </Input>
                            <Input
                                htmlFor="Confirm Password"
                                label="Confirm Password"
                                type="Password"
                                placeholder="Confirm Password"
                                name="password-confirmation"
                                isRequied={true}
                            >
                                <IoMdKey className="icon-in-input-field" />
                            </Input>
                            <p className="text-red-500">{message}</p>
                            <div className="flex justify-center mt-4">
                                <button
                                    type="submit"
                                    className="register-button"
                                >
                                    register
                                </button>
                            </div>
                        </form>
                    </div>
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
