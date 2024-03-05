'use client';

import '@/app/register/register.css';
import Input from '../components/form/input';
import { MdOutlineEmail } from "react-icons/md";
import { FaRegUser } from 'react-icons/fa';
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdKey } from 'react-icons/io';
import { FormEvent } from 'react';

async function submitHandle(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  await fetch('http://localhost:3000/auth/sign-up',{
    method:'POST',
    body:formData,
    credentials : 'include'
  })
}


export default function Home() {
  return (
    <div className="flex">
      <div className="flex flex-col h-screen w-1/2 items-center justify-center bg-greymain-100 pl-10">
        <div className='w-[55%]'>
          <h1 className='text-center'>Register</h1>
          <div className="input-form">
            <form onSubmit={(e) => submitHandle(e) } className="flex flex-col gap-2 ">
              <Input htmlFor='name' label='name' type='text' placeholder='name' name='name'>
                <FaRegUser className='icon-in-input-field'/>
              </Input>
              <Input htmlFor='Sirname' label='Sirname' type='text' placeholder='Sirname' name='Sirname'>
                <FaRegUser className='icon-in-input-field'/>
              </Input>
              <Input htmlFor='Phone' label='Phone' type='text' placeholder='Phone' name='Phone'>
                <FaPhoneAlt className='icon-in-input-field'/>
              </Input>
              <Input htmlFor='Email' label='Email' type='text' placeholder='Email' name='email'>
                <MdOutlineEmail className='icon-in-input-field'/>
              </Input>
              <Input htmlFor='Password' label='Password' type='Password' placeholder='Password' name='password'>
                <IoMdKey className='icon-in-input-field'/>
              </Input>
              <Input htmlFor='Password' label='Password' type='Password' placeholder='Confirm Password' name='password-confirmation'>
                <IoMdKey className='icon-in-input-field'/>
              </Input>
              <div className="flex justify-center mt-4">
                <button type='submit' className="register-button">
                  register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <img src="/register/teaching.jpeg" alt="tt" className='w-1/2 h-auto object-cover'/>

    </div>
  );
}
