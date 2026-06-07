import { NextAuthOptions } from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import { connectToDB } from "./db";
import userModel from "@/models/user.models";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const authOptions:NextAuthOptions={
    providers:[
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                email:{label:"Email",type:"text"},
                password:{label:"Password",type:"text"}
            },   
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password){
                    throw new Error("Missing Email or Password")
                }
                await connectToDB()

                const user = await userModel.findOne({email:credentials.email}).select("+password");
                
                if(!user) throw new Error("No user with email exist")

                const isValid = await bcrypt.compare(credentials.password,user.password)

                if(!isValid) throw new Error("Wrong Credentials")

                return {
                    id: user._id.toString(),
                    email : user.email,
                }

            }
        })
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token.id=user.id
            }
            return token;
        },
        
        async session({session,token}){
            if(session.user){
                session.user.id = token.id as string;
            }
            return session;
        }
    },

    pages:{
        signIn:"/login",
        error:"/logout"
    },
    session:{
        strategy:"jwt",
        maxAge:30*24*60*60
    },
    secret: process.env.NEXTAUTH_SECRET
}
