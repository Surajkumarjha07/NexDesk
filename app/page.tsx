"use client"
import { useRouter } from "next/navigation";
import LogIn from "./pages/LogIn/page";
import { useEffect, useState } from "react";

export default function Home() {
  const [visibleContent, setVisibleContent] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const authorized = async () => {
      const cookies = document.cookie.split(";");
      const cookie = cookies.find((cookie) => cookie.startsWith("authtoken="));
      const mainCookie = cookie ? cookie.split("=")[1] : null;

      if (!mainCookie) {
        setVisibleContent(true);
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
          setVisibleContent(true);
        }
        else {
          setVisibleContent(false);
          router.push("./pages/Home");
        }
      } catch (error) {
        console.log("error: ", error);
        setVisibleContent(true)
      }
    };

    authorized();
  }, [router]);

  return (
    visibleContent &&
    <>
      <LogIn />
    </>
  );
}
