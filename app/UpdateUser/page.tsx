"use client"
import Logo from '@/app/components/Logo'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/Redux/hooks';
import { toast } from "react-toastify";
import { setIsDarkMode } from '@/app/Redux/slices/darkMode';
import Cookies from 'js-cookie';

export default function UpdateUser() {
  const [newEmail, setNewEmail] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const router = useRouter();
  const [visibleContent, setVisibleContent] = useState<boolean>(false);
  const username = useAppSelector(state => state.UserCredential.username);
  const userEmail = useAppSelector(state => state.UserCredential.userEmail);
  const dispatch = useAppDispatch();
  const [cookie, setCookie] = useState<string>("");

  useEffect(() => {
    const fetchedCookie = Cookies.get("authtoken");
    if (fetchedCookie) {
      setCookie(fetchedCookie);
    }
    dispatch(setIsDarkMode(false));

    const authorized = async () => {
      if (!cookie) {
        router.push("/");
        return;
      }

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
            if (response.status === 200) {
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

    authorized();
  }, [router, dispatch, cookie]);

  const UpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newEmail && !newName && !newPassword) {
      toast.error("Provide atleast one field to update!", {
        hideProgressBar: true,
        autoClose: 1500,
        type: 'error',
        position: 'top-center',
      })
      return;
    }

    if (!currentPassword) {
      toast.error("Current password required", {
        hideProgressBar: true,
        autoClose: 1500,
        type: 'error',
        position: 'top-center',
      })
      return;
    }

    try {
      const response = await fetch("https://nexdesk-backend.onrender.com/updateUser", {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie}`
        },
        body: JSON.stringify({ newEmail, newName, currentPassword, newPassword }),
        credentials: "include"
      })

      if (response.ok) {
        //signOut ->
        const signOut = await fetch("https://nexdesk-backend.onrender.com/signOut", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
        })

        if (signOut.ok) {
          Cookies.remove("authtoken");
          window.location.reload();
        }
      }

      switch (response.status) {
        case 401:
          toast.error("Password not matched!", {
            hideProgressBar: true,
            autoClose: 1500,
            type: 'error',
            position: 'top-center',
          })
          break;

        case 410:
          toast.error("User not authorized!", {
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

  useEffect(() => {
    setNewEmail(userEmail);
    setNewName(username);
  }, [userEmail, username]);

  return (
    visibleContent &&
    <>
      <section className='w-screen h-screen relative flex justify-center items-center'>
        <form className="w-auto bg-white px-14 py-8 flex flex-col justify-center rounded-md shadow-md" method="post" onSubmit={UpdateUser}>
          <div className='flex justify-start items-center gap-1'>
            <Logo />
            <p className='text-gray-400 font-medium text-2xl'>
              NexDesk
            </p>
          </div>

          <p className='text-2xl text-black font-semibold my-4'> Update credentials </p>

          <input type="email" name="newEmail" className="w-96 py-3 outline-none border-b border-gray-400 focus:border-b-2 focus:border-b-blue-400 text-gray-700 placeholder:text-sm" autoFocus placeholder="Your Email" onChange={e => setNewEmail(e.target.value)} value={newEmail} />
          <br />

          <input type="text" name="newName" className="w-96 py-3 outline-none border-b border-gray-400 focus:border-b-2 focus:border-b-blue-400 text-gray-700 placeholder:text-sm" placeholder="Your Name" onChange={e => setNewName(e.target.value)} value={newName} />
          <br />

          <input type="password" name="newPassword" className="w-96 py-3 outline-none border-b border-gray-400 focus:border-b-2 focus:border-b-blue-400 text-gray-700 placeholder:text-sm" placeholder="New Password" onChange={e => setNewPassword(e.target.value)} value={newPassword} />
          <br />

          <input type="password" name="currentPassword" className="w-96 py-3 outline-none border-b border-gray-400 focus:border-b-2 focus:border-b-blue-400 text-gray-700 placeholder:text-sm" placeholder="Current Password" onChange={e => setCurrentPassword(e.target.value)} value={currentPassword} />

          <p className="text-gray-800 font-medium max-md:text-xs my-6">
            Don&apos;t want to update? go to
            <Link href={'/Home'}>
              <span className="text-blue-600 cursor-pointer ml-2">
                Home
              </span>
            </Link>
          </p>

          <input type="submit" value="Update" className="bg-blue-500 w-32 cursor-pointer text-white py-2 rounded-md self-end" />
        </form>
      </section>
    </>
  )
}