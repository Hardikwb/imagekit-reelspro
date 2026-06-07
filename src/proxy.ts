import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function proxy(){
        return NextResponse.next()
    },
    {
        callbacks:{
            authorized:({token,req})=>{
                const {pathname} = req.nextUrl;

                // allow auth related routes 
                if(
                    pathname.startsWith("/api/auth") ||
                    pathname === "/login" ||
                    pathname === "/register"
                ){
                    return true
                }

                //public path
                if(
                    pathname === '/' ||
                    pathname.startsWith("/api/videos")
                ) return true
                
                // private
                if(
                    pathname.startsWith('/api/imagekit-auth')
                ) return false

                return !!token
            }
        }
    }
)

export const config = {
    matcher: [
        //  "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    ]
}







