"use client"
import React, { useEffect, useState } from "react";
import { SocketProvider } from "./socketContext";
import Background from "./components/Background";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import ErrorPage from "./errorPage/page";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ClientLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isSmall, setIsSmall] = useState(false);

    const handleSize = () => {
        if (window.innerWidth < 768) {
            setIsSmall(true);
        }
        else {
            setIsSmall(false);
        }
    };

    useEffect(() => {

        handleSize();
        window.addEventListener("resize", handleSize);

        return () => {
            window.removeEventListener("resize", handleSize);
        }

    }, [isSmall]);

    <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
    />

    return (
        <SocketProvider>
            <Provider store={store}>
                <Background />
                <ToastContainer />
                {
                    isSmall ?
                        <ErrorPage /> :
                        children
                }
            </Provider>
        </SocketProvider>
    )
}