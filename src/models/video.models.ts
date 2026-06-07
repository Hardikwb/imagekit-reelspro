import bcrypt from "bcryptjs";
import mongoose,{ Schema } from "mongoose";


export interface VideoSchema{
    _id?: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    controls?: boolean;
    transformation?: {
        height: number;
        width: number;
        quality?: number;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

export const VIDEO_DIMENSIONS = {
  width: 1080,
  height: 1920,
} as const;

const videoSchema = new Schema<VideoSchema>({
    userId: { type:mongoose.Types.ObjectId, ref:"user", required:true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    controls: { type: Boolean, default: true },
    transformation: {
      height: { type: Number, default: VIDEO_DIMENSIONS.height },
      width: { type: Number, default: VIDEO_DIMENSIONS.width },
      quality: { type: Number, min: 1, max: 100 },
    },
},{timestamps:true})


const videoModel = mongoose.models.video || mongoose.model("video",videoSchema) 
export default videoModel