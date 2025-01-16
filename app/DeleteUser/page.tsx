"use client"
import Logo from '@/app/components/Logo';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import { setIsDarkMode } from '@/app/Redux/slices/darkMode';
import { useAppDispatch } from '@/app/Redux/hooks';
import Cookies from "js-cookie";

export default function DeleteUser() {
  const [password, setPassword] = useState<string>('');
  const router = useRouter();
  const [visibleContent, setVisibleContent] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [cookie, setCookie] = useState<string>("");

  useEffect(() => {
    const fetchedCookie = Cookies.get("authtoken");
    if (fetchedCookie) {
      setCookie(fetchedCookie);
    }
    else {
      router.push("/");
    }
    dispatch(setIsDarkMode(false));
  }, [dispatch, router])

  useEffect(() => {
    const authorized = async () => {
      try {
        await fetch("https://nexdesk-backend.onrender.com/userAuthenticated", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`
          },
          credentials: "include"
        })
          .then(response => {
            if (response.status === 200 || response.ok) {
              setVisibleContent(true);
            }
            else {
              router.push("/");
            }
          })
      } catch (error) {
        console.error("error: ", error);
        toast.error("Unable to authorize. Please try again later.", {
          hideProgressBar: true,
          autoClose: 2000,
          position: "top-center",
        });
        router.push("/")
      }
    };

    if (cookie) {
      authorized();
    }
  }, [router, cookie]);

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
      const response = await fetch("https://nexdesk-backend.onrender.com/deleteUser", {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`
        },
        body: JSON.stringify({ password }),
        credentials: "include"
      })

      if (response.ok) {
        const response = await fetch("https://nexdesk-backend.onrender.com/signOut", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie}`
          },
          credentials: "include",
        })

        if (response.status === 200 || response.ok) {
          Cookies.remove("authtoken");
          window.location.reload();
        }
      }

      switch (Number(response.status)) {
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
            <Link href={'/Home'}>
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