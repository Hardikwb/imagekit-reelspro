import { VideoSchema } from "@/models/video.models";

type fetchOptions={
    method? : "GET" | "PUT" | "POST" | "DELETE";
    body? : any
    headers? : Record<string,string>
}

export type VideoFormData = Omit<VideoSchema,"_id" | "userId">;

class APIClient{
    private async fetch<T>(
        endpoint:string,
        options:fetchOptions={}
    ):Promise<T>{
        const {method ="GET", body, headers={}}=options
        const defaultHeaders={
            "Content-Type":"application/json",
            ...headers
        }

        const response = await fetch(`/api/${endpoint}`,{
            method,
            headers:defaultHeaders,
            body: body? JSON.stringify(body): undefined
        })

        if(!response.ok){
            throw new Error(await response.text())
        }

        return response.json()
    }

    async getVideos(){
        return await this.fetch<VideoSchema[]>(`/videos`)
    }
    async getVideo(id:string){
        return await this.fetch<VideoSchema>(`/videos/${id}`)
    }
    
    async createVideo(videoData:VideoFormData){
        await this.fetch<VideoSchema>(`/videos`,{
            method:"POST",
            body:videoData
        })
        
    }
}

export const apiClient = new APIClient()
