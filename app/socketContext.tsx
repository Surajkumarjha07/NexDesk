"use client"
import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket} from 'socket.io-client'

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: {children: React.ReactNode}) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    useEffect(() => {
        const socket = io('http://localhost:4000');
        setSocket(socket);
        socket.on("connect", () => {
            console.log("user connected: ", socket.id);
        });

        return () => {
            socket.disconnect();
            console.log("user disconnected");            
        }
    }, [])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => {
    return useContext(SocketContext);
}