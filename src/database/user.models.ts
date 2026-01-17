import mongoose from "mongoose"
export type User=mongoose.InferSchemaType<typeof UserModelSchema>

 const UserModelSchema=new mongoose.Schema({
    firstname:{type:String, required:true},
    lastname:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:false}
},
{
    timestamps:true
})

export const UserModel=mongoose.model("user",UserModelSchema)

