'use client' 
import '@/app/register/register.css';
import Input from '../components/form/input';
import { FormEvent } from 'react';

async function submitVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await fetch('http://localhost:3000/auth/email-verification', {
        method: 'POST',
        body: formData,
        credentials: 'include'
    })
}

export default function cheack() {
    return (
        <div className='w-full h-[1000px] flex justify-center items-center'>
            <div className="border-4 w-[500px] h-[300px] flex flex-col gap-4 justify-center items-center rounded-xl ">
                <form  onSubmit={(e) => submitVerification(e)  } className='flex flex-col gap-4 justify-center items-center'>
                    <Input htmlFor='email-verification' label='Verify your email address' type='text' placeholder='code' name='code' />
                    <button type='submit' >
                        submit
                    </button>
                </form>
            </div>
        </div>
    )
}
