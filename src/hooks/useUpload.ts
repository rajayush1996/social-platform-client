import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';


/**
 * Configuration options for the Bunny Upload hook.
 */
export interface BunnyUploadConfig {
  /** Your BunnyCDN storage zone name */
  storageZoneName: string;
  /** BunnyCDN Storage API Access Key */
  accessKey: string;
  /** Optional base URL (default: https://storage.bunnycdn.com) */
  baseURL?: string;
}

/**
 * Return values and utilities provided by the Bunny Upload hook.
 */
export interface BunnyUploadResult {
  /** Upload one or multiple files. 
   * @param files - FileList or array of File objects
   * @param path - Optional path prefix inside the storage zone
   * @returns Promise resolving to an array of public URLs
   */
  uploadFiles: (files: FileList | File[], path?: string) => Promise<string[]>;
  /** True while uploads are in progress */
  uploading: boolean;
  /** Progress of the current file upload (0–100) */
  progress: number;
  /** Captured error for failed uploads, if any */
  error: Error | null;
  /** List of successfully uploaded file URLs */
  urls: string[];
}

/**
 * Custom React hook to upload files to a BunnyCDN Storage Zone.
 * @param config - BunnyUploadConfig
 * @returns BunnyUploadResult
 */
export function useBunnyUpload(
  config: BunnyUploadConfig
): BunnyUploadResult {
  const { storageZoneName, accessKey, baseURL = 'https://storage.bunnycdn.com' } = config;
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  const [urls, setUrls] = useState<string[]>([]);
  const [name, setName] = useState<string[]>([]);
  const uploadFiles = useCallback<
    (files: FileList | File[], path?: string) => Promise<string[]>
  > (async (files, path = '') => {
    setUploading(true);
    setError(null);
    setProgress(0);
    const fileArray: File[] = Array.from(files as FileList);
    const uploadedUrls: string[] = [];

    for (const file of fileArray) {
      // generate random filename with original extension
      const ext = file.name.includes('.') ? `.${file.name.split('.').pop()}` : '';
      const randomName = `${uuidv4()}${ext}`;
      const newNameArr = [...name, randomName];
      setName(newNameArr);
      const filePath = path ? `${path}/${randomName}` : randomName;
      const uploadURL = `${baseURL}/${storageZoneName}/${filePath}`;

      try {
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', uploadURL);
          xhr.setRequestHeader('AccessKey', accessKey);

          xhr.upload.onprogress = (e: ProgressEvent<XMLHttpRequestEventTarget>) => {
            if (e.lengthComputable) {
              setProgress(Math.round((e.loaded / e.total) * 100));
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              uploadedUrls.push(uploadURL);
              resolve();
            } else {
              reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
            }
          };

          xhr.onerror = () => reject(new Error('Network error during upload'));
          xhr.send(file);
        });
      } catch (err) {
        setError(err as Error);
        setUploading(false);
        throw err;
      }
    }

    setUrls(uploadedUrls);
    setUploading(false);
    return name;
  }, [name, baseURL, storageZoneName, accessKey]);

  return { uploadFiles, uploading, progress, error, urls };
}
