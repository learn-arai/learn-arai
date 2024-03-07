'use client';

import { redirect } from 'next/navigation';
import '@/app/register/register.css';
import Input from '../components/form/input';
import { MdOutlineEmail } from "react-icons/md";
import { FaRegUser } from 'react-icons/fa';
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdKey } from 'react-icons/io';
import { FormEvent } from 'react';
import Link from 'next/link';

async function submitHandle(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  await fetch('http://localhost:3000/auth/sign-up', {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

}

function direct() {
  redirect('/login');
}

export default function Home() {
  return (
    <div className="flex">
      <div className="flex flex-col h-screen w-1/2 items-center justify-center bg-greymain-100 pl-10">
        <div className='w-[55%]'>
          <h1 className='text-center mb-12'>Register</h1>
          <div className="input-form">
            <form onSubmit={(e) => submitHandle(e)} className="flex flex-col gap-2 ">
              <div className='flex flex-row gap-4'>
                <Input htmlFor='name' label='name' type='text' placeholder='name' name='name' >
                  <FaRegUser className='icon-in-input-field' />
                </Input>
                <Input htmlFor='surname' label='Surname' type='text' placeholder='Surname' name='Surname'>
                  <FaRegUser className='icon-in-input-field' />
                </Input>
              </div>
              <Input htmlFor='Phone' label='Phone' type='text' placeholder='Phone' name='Phone'>
                <FaPhoneAlt className='icon-in-input-field' />
              </Input>
              <Input htmlFor='Email' label='Email' type='text' placeholder='Email' name='email'>
                <MdOutlineEmail className='icon-in-input-field' />
              </Input>
              <Input htmlFor='Password' label='Password' type='Password' placeholder='Password' name='password'>
                <IoMdKey className='icon-in-input-field' />
              </Input>
              <Input htmlFor='Confirm Password' label='Confirm Password' type='Password' placeholder='Confirm Password' name='password-confirmation'>
                <IoMdKey className='icon-in-input-field' />
              </Input>
              <div className="flex justify-center mt-4">
                <Link href="/checking" className='w-full'>
                  <button type='submit' onClick={direct} className="register-button">
                    register
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <img src="/register/teaching.jpeg" alt="tt" className='w-1/2 h-auto object-cover' />
    </div>
  );
}
