"use client"
import Logo from '@/app/components/Logo'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify"

export default function SignUp() {
  const [email, setEmail] = useState<string | null>('');
  const [name, setName] = useState<string | null>('');
  const [password, setPassword] = useState<string | null>('');
  const router = useRouter();

  const SignUpUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !name || !password) {
      toast.success("Enter details correctly!", {
        hideProgressBar: true,
        autoClose: 1500,
        type: 'error',
        position: 'top-center',
      });
      return;
    }
    try {
      const response = await fetch("https://nexdesk-backend.onrender.com/signUp", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, name, password }),
        credentials: "include"
      })

      if (response.status === 200 || response.ok) {
        toast.success("Great! You are registered", {
          hideProgressBar: true,
          autoClose: 1500,
          type: 'success',
          position: 'top-center',
        })
        router.push("/");
      }

      else if (response.status === 409) {
        toast.error("Email already in use!", {
          hideProgressBar: true,
          autoClose: 1500,
          type: 'error',
          position: 'top-center',
        })
      }

      else {
        toast.error("Internal server error!", {
          hideProgressBar: true,
          autoClose: 1500,
          type: 'error',
          position: 'top-center',
        })
      }

    } catch (error) {
      console.error("Internal Server Error", error);
      toast.error("Something went wrong! Try again later", {
        hideProgressBar: true,
        autoClose: 1500,
        type: 'error',
        position: 'top-center',
      })
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

          <input type="email" name="email" className="w-96 py-3 outline-none border-b border-gray-400 focus:border-b-2 focus:border-b-blue-400 text-gray-700 placeholder:text-sm" autoFocus placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <br />

          <input type="text" name="name" className="w-96 py-3 outline-none border-b border-gray-400 focus:border-b-2 focus:border-b-blue-400 text-gray-700 placeholder:text-sm" placeholder="Name" onChange={e => setName(e.target.value)} />
          <br />

          <input type="password" name="password" className="w-96 py-3 outline-none border-b border-gray-400 focus:border-b-2 focus:border-b-blue-400 text-gray-700 placeholder:text-sm" placeholder="Password" onChange={e => setPassword(e.target.value)} />

          <p className="text-gray-800 font-medium max-md:text-xs my-6">
            have an account?
            <Link href={'/LogIn'}>
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