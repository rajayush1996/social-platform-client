// hooks/useUploadProfile.ts
import { useBunnyUpload, BunnyUploadConfig, BunnyUploadResult } from './useUpload';

export interface UploadProfileResult {
  /** Call this to upload one File to the `profiles/` folder */
  uploadProfile: (file: File) => Promise<string>;
  uploading: boolean;
  progress: number;
  error: Error | null;
  /** URL of the last‐uploaded profile image */
  profileUrl: string;
}

export function useUploadProfile(config: BunnyUploadConfig): UploadProfileResult {
  const { uploadFiles, uploading, progress, error, urls } = useBunnyUpload(config);

  const uploadProfile = async (file: File): Promise<string> => {
    // we pass an array with one file, and prefix path "profiles"
    const [url] = await uploadFiles([file], 'profiles');
    return url;
  };

  return {
    uploadProfile,
    uploading,
    progress,
    error,
    profileUrl: urls[0] || '',
  };
}
