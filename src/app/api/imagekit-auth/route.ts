import { NextResponse } from "next/server";
import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {
  try {
    const { token, expire, signature } = getUploadAuthParams({
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      })
      return NextResponse.json({ token, expire, signature, publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY })
    } 
    
  catch (error) {
    return NextResponse.json({error:error},{status:400})  
  }
}