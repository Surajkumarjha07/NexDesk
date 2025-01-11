"use client"
import Logo from '@/app/components/Logo';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";

export default function DeleteUser() {
  const [password, setPassword] = useState<string>('');
  const router = useRouter();
  const [visibleContent, setVisibleContent] = useState<boolean>(false);

  useEffect(() => {
    const cookies = document.cookie.split(";");
    const cookie = cookies.find((cookie) => cookie.startsWith("authtoken="));
    const mainCookie = cookie ? cookie.split("=")[1] : null;

    const authorized = async () => {
      if (!mainCookie) {
        router.push("/");
        return;
      }

      try {
        const response = await fetch("http://localhost:4000/userAuthenticated", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${mainCookie}`
          },
          credentials: "include"
        })

        if (!response.ok) {
          router.push("/");

        }
        else {
          setVisibleContent(true);
        }
      } catch (error) {
        console.log("error: ", error);
        router.push("/")
      }
    };

    authorized();
  }, [router]);

  const DeleteUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password) {
      toast.error("Enter password to delete account!", {
        hideProgressBar: true,
        autoClose: 1500,
        type: 'error',
        position: 'top-center',
      });
      return;
    }

    try {
      const cookies = document.cookie.split(";");
      const targetCookie = cookies.find(cookie => cookie.startsWith("authtoken="));
      const cookie = targetCookie ? targetCookie.split("=")[1] : null;

      const response = await fetch("http://localhost:4000/deleteUser", {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`
        },
        body: JSON.stringify({ password })
      })

      if (response.ok) {
        const response = await fetch("http://localhost:4000/signOut", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
        })

        if (response.ok) {
          window.location.reload();
        }
      }

      switch (response.status) {
        case 404:
          toast.error("Password not matched!", {
            hideProgressBar: true,
            autoClose: 1500,
            type: 'error',
            position: 'top-center',
          })
          break;

        case 500:
          toast.error("Internal server error!", {
            hideProgressBar: true,
            autoClose: 1500,
            type: 'error',
            position: 'top-center',
          })
          break;
      }

    } catch (error) {
      console.log("Internal Server Error", error);
    }
  }

  return (
    visibleContent &&
    <>
      <section className='w-screen h-screen relative flex justify-center items-center'>
        <form className="w-auto bg-white px-14 py-8 flex flex-col justify-center rounded-md shadow-md" method="post" onSubmit={DeleteUser}>
          <div className='flex justify-start items-center gap-1'>
            <Logo />
            <p className='text-gray-400 font-medium text-2xl'>
              NexDesk
            </p>
          </div>

          <p className='text-2xl text-black font-semibold my-4'> Delete account </p>

          <input type="password" name="password" className="w-96 py-3 outline-none border-b border-gray-400 focus:border-b-2 focus:border-b-blue-400 text-gray-700 placeholder:text-sm" placeholder="Password" onChange={e => setPassword(e.target.value)} />

          <p className="text-gray-800 font-medium max-md:text-xs my-6">
            Change your mind? go to
            <Link href={'/pages/Home'}>
              <span className="text-blue-600 cursor-pointer ml-2">
                Home!
              </span>
            </Link>
          </p>

          <input type="submit" value="Delete" className="bg-red-500 w-32 cursor-pointer text-white py-2 rounded-md self-end" />
        </form>
      </section>
    </>
  )
}