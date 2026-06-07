import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import userModel from "@/models/user.models";

export async function POST(request: NextRequest) {
  try {
    const {email,password} = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectToDB();

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const newUser = await userModel.create({
      email,
      password
    });

    console.log(newUser)
    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } 
  
  catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}