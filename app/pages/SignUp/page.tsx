"use client"
import Logo from '@/app/components/Logo'
import React, { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [email, setEmail] = useState<string | null>('');
  const [name, setName] = useState<string | null>('');
  const [password, setPassword] = useState<string | null>('');
  const router = useRouter();

  const SignUpUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/signUp", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({email,name,password})
      })

      if (response.ok) {
        console.log(response);        
        router.push("./Home");
      }
    } catch (error) {
      console.log("Internal Server Error", error);      
    }
  }

  return (
    <>
      <section className='w-screen h-screen relative flex justify-center items-center'>
        <form className="w-auto bg-white px-14 py-8 flex flex-col justify-center rounded-md shadow-md" method="post" onSubmit={SignUpUser}>
          <div className='flex justify-start items-center gap-1'>
            <Logo />
            <p className='text-gray-400 font-medium text-2xl'>
              NexDesk
            </p>
          </div>

          <p className='text-2xl text-black font-semibold my-4'> Create account </p>

          <input type="email" name="email" className="w-96 py-3 outline-none border-b border-gray-400 focus:border-b-2 focus:border-b-blue-400 text-gray-700 placeholder:text-sm" autoFocus placeholder="Email" onChange={e => setEmail(e.target.value)}/>
          <br />

          <input type="text" name="name" className="w-96 py-3 outline-none border-b border-gray-400 focus:border-b-2 focus:border-b-blue-400 text-gray-700 placeholder:text-sm" placeholder="Name" onChange={e => setName(e.target.value)}/>
          <br />

          <input type="password" name="password" className="w-96 py-3 outline-none border-b border-gray-400 focus:border-b-2 focus:border-b-blue-400 text-gray-700 placeholder:text-sm" placeholder="Password" onChange={e => setPassword(e.target.value)}/>

          <p className="text-gray-800 font-medium max-md:text-xs my-6">
            have an account?
            <Link href={'/pages/LogIn'}>
            <span className="text-blue-600 cursor-pointer ml-2">
              Log In
            </span>
            </Link>
          </p>

          <input type="submit" value="Sign Up" className="bg-blue-500 w-32 cursor-pointer text-white py-2 rounded-md self-end" />
        </form>
      </section>
    </>
  )
}