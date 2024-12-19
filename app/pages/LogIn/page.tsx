"use client"
import Logo from '@/app/components/Logo'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

export default function LogIn() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const LogInUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/login", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({email,password})
      })

      if (response.ok) {
        console.log(response);  
        sessionStorage.setItem("email", email)      
        router.push("./pages/Home");
      }
    } catch (error) {
      console.log("Internal Server Error", error);      
    }
  }

  return (
    <>
      <section className='w-screen h-screen relative flex justify-center items-center'>
        <form className="w-auto bg-white px-14 py-8 flex flex-col justify-center rounded-md shadow-md" method="post" onSubmit={LogInUser}>
          <div className='flex justify-start items-center gap-1'>
            <Logo />
            <p className='text-gray-400 font-medium text-2xl'>
              NexDesk
            </p>
          </div>

          <p className='text-2xl text-black font-semibold my-4'> Sign In </p>

          <input type="email" name="email" className="w-96 py-3 outline-none border-b border-gray-400 focus:border-b-2 focus:border-b-blue-400 text-gray-700 placeholder:text-sm" autoFocus placeholder="Email" onChange={e => setEmail(e.target.value)}/>
          <br />

          <input type="password" name="password" className="w-96 py-3 outline-none border-b border-gray-400 focus:border-b-2 focus:border-b-blue-400 text-gray-700 placeholder:text-sm" placeholder="Password"  onChange={e => setPassword(e.target.value)}/>

          <p className="text-gray-800 font-medium max-md:text-xs my-6">
            Don't have an account? 
            <Link href={'/pages/SignUp'}>
            <span className="text-blue-600 cursor-pointer ml-2">
              Create one!
            </span>
            </Link>
          </p>

          <input type="submit" value="Sign In" className="bg-blue-500 w-32 cursor-pointer text-white py-2 rounded-md self-end" />
        </form>
      </section>
    </>
  )
}