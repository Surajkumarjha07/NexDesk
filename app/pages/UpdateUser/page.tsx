"use client"
import Logo from '@/app/components/Logo'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import User from '@/app/Interfaces/getUser';

export default function UpdateUser() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const router = useRouter();

  const UpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newEmail && !newName && !newPassword) {
      alert("Please provide at least one field to update.");
      return;
    }

    if (!currentPassword) {
      alert("Please provide your previous password");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/updateUser", {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, newEmail, newName, currentPassword, newPassword })
      })

      if (response.ok) {
        console.log(response);
        router.push("./Home");
      }
    } catch (error) {
      console.log("Internal Server Error", error);
    }
  }

  async function getUser(email: string) {
    const response = await fetch(`http://localhost:4000/getUser?email=${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    })

    if (response.ok) {
      let data = await response.json();
      setUser(data.user);
    }
  }
  
  useEffect(() => {
    let email = sessionStorage.getItem("email");
    if (email) {
      console.log(email);
      setEmail(email);
      getUser(email);
    }    
  }, [])

  useEffect(() => {
    console.log("User state updated:", user);
    if (user) { 
      setNewEmail(user!.email);
      setNewName(user!.name);
    }
  }, [user]);


  return (
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

          <input type="email" name="newEmail" className="w-96 py-3 outline-none border-b border-gray-400 focus:border-b-2 focus:border-b-blue-400 text-gray-700 placeholder:text-sm" autoFocus placeholder="New Email" onChange={e => setNewEmail(e.target.value)} value={newEmail}/>
          <br />

          <input type="text" name="newName" className="w-96 py-3 outline-none border-b border-gray-400 focus:border-b-2 focus:border-b-blue-400 text-gray-700 placeholder:text-sm" placeholder="New Name" onChange={e => setNewName(e.target.value)} value={newName}/>
          <br />

          <input type="password" name="newPassword" className="w-96 py-3 outline-none border-b border-gray-400 focus:border-b-2 focus:border-b-blue-400 text-gray-700 placeholder:text-sm" placeholder="New Password" onChange={e => setNewPassword(e.target.value)} value={newPassword}/>
          <br />

          <input type="password" name="currentPassword" className="w-96 py-3 outline-none border-b border-gray-400 focus:border-b-2 focus:border-b-blue-400 text-gray-700 placeholder:text-sm" placeholder="Current Password" onChange={e => setCurrentPassword(e.target.value)} value={currentPassword}/>

          <p className="text-gray-800 font-medium max-md:text-xs my-6">
            Don't want to update? go to
            <Link href={'/pages/LogIn'}>
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