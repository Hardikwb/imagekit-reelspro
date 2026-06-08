"use client"
import { ImageKitProvider,Image,Video } from "@imagekit/next";
import { SessionProvider } from "next-auth/react"
import { NotificationProvider } from "./Notification";
import { useRef, useState } from "react";
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;
const Provider = ({children}:{children:React.ReactNode}) => {
    
    const authenticator = async () => {
        try {
            const response = await fetch("/api/imagekit-auth");
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }
            const data = await response.json();
            const { signature, expire, token, publicKey } = data;
            return { signature, expire, token, publicKey };
        } 
        catch (error) {
            console.error("Authentication error:", error);
            throw new Error("Authentication request failed");
        }
    };

    return (
        <>
            <SessionProvider>
                <NotificationProvider>
                    <ImageKitProvider urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}>
                        {children}
                    </ImageKitProvider>
                </NotificationProvider>
            </SessionProvider>
        </>
    );
};


//     return (
//     <div>
//         <ImageKitProvider urlEndpoint={urlEndpoint} >
//             {children}
//         </ImageKitProvider>
//     </div>
//   )
// }

export default Provider