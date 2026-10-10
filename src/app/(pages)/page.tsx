"use client"
import { apiClient } from '@/lib/api-client'
import { VideoSchema } from '@/models/video.models'
import React, { useEffect, useState } from 'react'
import VideoFeed from '../components/VideoFeed'

const Home = () => {
    const [videos, setVideos] = useState<VideoSchema[]>([])
    
    useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);
    
    return (
    <div>
        <main className="container mx-auto px-4 py-8">
        <VideoFeed videos={videos} />
    </main>
    </div>
  )
}

export default Home