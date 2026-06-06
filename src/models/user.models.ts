import bcrypt from "bcryptjs";
import mongoose,{ Document,Models,Schema } from "mongoose";


interface UserSchema{
    email: string;
    password: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}


const userSchema = new Schema<UserSchema>({
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    }
},{timestamps:true})

userSchema.pre("save",async function (next){
    if(this.isModified("password")){
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password,salt);
    }
})

const userModel = mongoose.models.user || mongoose.model("user",userSchema) 
export default userModel