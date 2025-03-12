import { ID } from "appwrite";
import { storage } from "./appwrite"; 

const STORAGE_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_STAYIMAGE_ID 
if(!STORAGE_ID){
    throw  Error("Missing Env Variables")
}
export const uploadStayImage = async (image:File)=>{
    try{
        const resp = await storage.createFile(STORAGE_ID,ID.unique(),image)
        return {status:true,data:resp}
    }catch(error:any){
        console.log(error.message)
        return {status:false}
    }
}
export const getPropertyUrl= async (propertyId:string)=>{
    try{
        const resp = await storage.getFile(STORAGE_ID,propertyId)
        return {status:true,data:resp}
    }catch(error:any){
        console.log(error.message)
        return {status:false}
    }
}