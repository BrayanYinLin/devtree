//Parte 2 
export async function uploadImage(file:File){
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
