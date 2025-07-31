import { useState, useCallback } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid'; 

export interface BunnyStreamConfig {
  libraryId: string;
  apiKey: string;
}

export interface BunnyStreamUploadResult {
  uploadVideo: (file: File) => Promise<string>;
  uploading: boolean;
  progress: number;
  error: Error | null;
}

export function useBunnyStreamUpload(
  config: BunnyStreamConfig
): BunnyStreamUploadResult {
  const { libraryId, apiKey } = config;
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const uploadVideo = useCallback(
    async (file: File): Promise<string> => {
      setUploading(true);
      setProgress(0);
      setError(null);
      try {
        // ✅ Generate a unique title using UUID and original file extension
        const extension = file.name.split(".").pop();
        const uniqueTitle = `${uuidv4()}.${extension}`;

        // Step 1: create the video entry with unique title
        const createRes = await axios.post(
          `https://video.bunnycdn.com/library/${libraryId}/videos`,
          { title: uniqueTitle },
          { headers: { AccessKey: apiKey } }
        );

        const guid: string =
          createRes.data.guid || createRes.data.videoGuid || createRes.data.id;

        // Step 2: upload the actual file
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open(
            "PUT",
            `https://video.bunnycdn.com/library/${libraryId}/videos/${guid}`
          );
          xhr.setRequestHeader("AccessKey", apiKey);
          xhr.upload.onprogress = (e: ProgressEvent) => {
            if (e.lengthComputable) {
              setProgress(Math.round((e.loaded / e.total) * 100));
            }
          };
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(
                new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`)
              );
            }
          };
          xhr.onerror = () => reject(new Error("Network error during upload"));
          xhr.send(file);
        });

        setUploading(false);
        setProgress(100);
        return guid;
      } catch (err) {
        setError(err as Error);
        setUploading(false);
        throw err;
      }
    },
    [libraryId, apiKey]
  );

  return { uploadVideo, uploading, progress, error };
}
