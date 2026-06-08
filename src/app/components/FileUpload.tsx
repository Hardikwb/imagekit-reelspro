"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { upload } from "@imagekit/next";

interface FileUploadProps {
  onSuccess?: (response: any) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

export default function FileUpload({
  onSuccess,
  onProgress,
  fileType = "image",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
        return false;
      }

      if (file.size > 100 * 1024 * 1024) {
        setError("Video size must be less than 100MB");
        return false;
      }
    } else {
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!validTypes.includes(file.type)) {
        setError(
          "Please upload a valid image file (JPEG, PNG, WebP)"
        );
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return false;
      }
    }

    return true;
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!validateFile(file)) return;

    try {
      setUploading(true);
      setError("");

      // Get ImageKit auth params from your API
      const authResponse = await fetch("/api/imagekit-auth");

      if (!authResponse.ok) {
        throw new Error("Failed to get upload credentials");
      }

      const {
        token,
        expire,
        signature,
        publicKey,
      } = await authResponse.json();

      const response = await upload({
        file,
        fileName: file.name,
        token,
        expire,
        signature,
        publicKey,

        folder:
          fileType === "video"
            ? "/videos"
            : "/images",

        useUniqueFileName: true,

        onProgress: (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = Math.round(
              (event.loaded / event.total) * 100
            );

            onProgress(progress);
          }
        },
      });

      onSuccess?.(response);
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Upload failed");
      }
    } finally {
      setUploading(false);

      // reset input so same file can be selected again
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept={
          fileType === "video"
            ? "video/*"
            : "image/*"
        }
        onChange={handleFileChange}
        className="file-input file-input-bordered w-full"
      />

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-primary">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}