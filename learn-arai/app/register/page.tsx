'use client';

import '@/app/register/register.css';
import Input from '../components/form/input';
import { MdOutlineEmail } from "react-icons/md";
import { FaRegUser } from 'react-icons/fa';
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdKey } from 'react-icons/io';
import { FormEvent, useState } from 'react';

async function submitHandle(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  

}

export default function Home() {
  return (
    <div className="flex">
      <div className="flex flex-col h-screen w-1/2 items-center justify-center bg-greymain-100 pl-10">
        <div className='w-[55%]'>
          <h1 className='text-center'>Register</h1>
          <div className="input-form">
            <form onSubmit={(e) => submitHandle(e)} className="flex flex-col gap-2 ">
              <Input htmlFor='Name' label='Name' type='text' placeholder='Name' name='Name' children={<FaRegUser className='icon-in-input-field'/>} />
              <Input htmlFor='Sirname' label='Sirname' type='text' placeholder='Sirname' name='Sirname' children={<FaRegUser className='icon-in-input-field'/>} />
              <Input htmlFor='Phone' label='Phone' type='text' placeholder='Phone' name='Phone' children={<FaPhoneAlt className='icon-in-input-field'/>} />
              <Input htmlFor='Email' label='Email' type='text' placeholder='Email' name='Email' children={<MdOutlineEmail className='icon-in-input-field'/>} />
              <Input htmlFor='Password' label='Password' type='Password' placeholder='Password' name='Password' children={<IoMdKey className='icon-in-input-field'/>} />
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
