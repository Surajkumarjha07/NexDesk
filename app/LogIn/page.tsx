"use client"
import Logo from '@/app/components/Logo'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export default function LogIn() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const LogInUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter details correctly!", {
        hideProgressBar: true,
        autoClose: 1500,
        type: 'error',
        position: 'top-center',
      });
      return;
    }

    try {
      const response = await fetch("https://nexdesk-backend.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      })

      if (response.status === 200 || response.ok) {
        const res = await response.json();

        if (res.token) {
          console.log(res);
          Cookies.set("authtoken", res.token, { expires: 1 / 1440, path: "/" });
        }
        console.log(Cookies.get("authtoken"));
        toast.success("Congrats! You are logged in", {
          hideProgressBar: true,
          autoClose: 1500,
          type: 'success',
          position: 'top-center',
        });
        router.push("/Home");
      }
      else {
        const err = await response.json();
        console.log(err);
        toast.error("Login Failed!", {
          hideProgressBar: true,
          autoClose: 1500,
          type: 'error',
          position: 'top-center',
        });
      }

    } catch (error) {
      console.error("error: ", error);
      toast.error("Internal server error!", {
        hideProgressBar: true,
        autoClose: 1500,
        type: 'error',
        position: 'top-center',
      });
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

          <input type="email" name="email" className="w-96 py-3 outline-none border-b border-gray-400 focus:border-b-2 focus:border-b-blue-400 text-gray-700 placeholder:text-sm" autoFocus placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <br />

          <input type="password" name="password" className="w-96 py-3 outline-none border-b border-gray-400 focus:border-b-2 focus:border-b-blue-400 text-gray-700 placeholder:text-sm" placeholder="Password" onChange={e => setPassword(e.target.value)} />

          <p className="text-gray-800 font-medium max-md:text-xs my-6">
            Don&apos;t have an account?
            <Link href={'/SignUp'}>
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