import { connectToDB } from "@/lib/db";
import videoModel from "@/models/video.models";
import { Video } from "@imagekit/next";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connectToDB();

  const { id } = await params;

  const video = await videoModel.findById(id);

  if (!video) {
    return <div>Video not found</div>;
  }

  return (
    <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
      <figure className="relative px-4 pt-4">
        <div
          className="rounded-xl overflow-hidden relative w-full"
          style={{ aspectRatio: "9/16" }}
        >
          {/* <video
            src={video.videoUrl}
            controls
            className="w-full h-full object-cover"
            /> */}
          <Video
            urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
            controls
            src={video.videoUrl}
            width={500}
            height={500}
          />
        </div>
      </figure>
    </div>
  );
}
