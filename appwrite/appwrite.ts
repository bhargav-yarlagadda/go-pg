import {Account, Client, Databases, Storage} from 'appwrite'
export const client = new Client() 
if(!process.env.NEXT_PUBLIC_APPWRITE_API_ENDPOINT || !process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID){
    throw Error("Missing Environment variables")
}

client
.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_API_ENDPOINT)
.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)  

export const account = new Account(client)
export const storage = new Storage(client)
export const database = new Databases(client)
