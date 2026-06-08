import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/db";
import videoModel from "@/models/video.models";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try {
        await connectToDB()
        const videos = await videoModel.find({}).sort({createdAt: -1}).lean()  
        if(videos.length == 0) return NextResponse.json([],{status:200})
        return NextResponse.json(videos,{status:200})
    } 
    
    catch (error) {
      return NextResponse.json({error:error},{status:400})
    }
}

export async function POST(request:NextRequest){
  try {
      const session = await getServerSession(authOptions)  
      if(!session) return NextResponse.json({error:"Not Authorized"},{status:401})
        await connectToDB();
      
      const body = await request.json();

    // Validate required fields
    if (
      !body.title ||
      !body.description ||
      !body.videoUrl ||
      !body.thumbnailUrl
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new video with default values
    const videoData = {
      ...body,
      userId: session?.user?.id,
      controls: body.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality ?? 100,
      },
    };

    const newVideo = await videoModel.create(videoData);
    return NextResponse.json(newVideo);
  } 
  
  
  
  catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}

