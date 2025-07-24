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


export interface UploadDocumentsResult {
  uploadDocuments: (files: File[]) => Promise<string[]>
  uploading:      boolean
  progress:       number
  error:          Error | null
  documentUrls:   string[]      // all the URLs from the last batch
}

export function useUploadDocuments(
  config: BunnyUploadConfig
): UploadDocumentsResult {
  const { uploadFiles, uploading, progress, error, urls } = useBunnyUpload(config)
//   console.log("🚀 ~ :45 ~ urls:", urls);

  // files → ["doc1.pdf","doc2.png",...] → Promise< ["…/documents/doc1.pdf", "…/documents/doc2.png", …] >
  const uploadDocuments = async (files: File[]): Promise<string[]> => {
    return await uploadFiles(files, "documents")
  }

  return {
    uploadDocuments,
    uploading,
    progress,
    error,
    documentUrls: urls,
  }
}

