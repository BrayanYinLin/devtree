import { isAxiosError } from "axios";
import api from "../config/axios";
import type { ProfileForm, User } from "../types";


export async function uploadImage(file:File) {
    let formData = new FormData()
    formData.append('file', file) //enviar al backend

    try{
        const {data: {image}} : {data: {image: string}} = await api.post('/user/image', formData)
        return image
    }catch(error){
      if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
    
}

export async function getUser() {
    try {
        const {data} = await api<User>(`/user`,)
        return data
        //console.log(data)
        //localStorage.setItem('AUTH_TOKEN', data)
        
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
    
}

export async function updateProfile(formData: ProfileForm) {
    try {
        
        const {data} = await api.patch<User>(`/user`,formData)
        return data

    } catch (error) {
        if(isAxiosError(error)&&error.response){
            throw new Error(error.response.data.error)
        }
    }
}
