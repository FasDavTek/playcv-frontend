import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';

import { toast } from "react-toastify"
import { FileRejection, useDropzone } from 'react-dropzone';

const baseStyle = (
  borderColor: string,
  borderStyle: string,
  borderWidth: number,
  color: string
) => ({
  flex: 1,
  display: 'flex',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  flexDirection: 'column' as any,
  alignItems: 'center',
  justifyContent: 'center',
  padding: '15px',
  borderWidth: borderWidth,
  borderRadius: 4,
  borderColor: borderColor,
  borderStyle: borderStyle,
  backgroundColor: '#fafafa',
  color: color,
  outline: 'none',
  transition: 'border .24s ease-in-out',
  cursor: 'pointer',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  textAlign: 'center' as any,
  height: '100%',
  minHeight: '150px',
});

const focusedStyle = {
  borderColor: '#9ABDDC',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

const thumbsContainer = {
  display: 'flex',
  // flexDirection: 'row',
  // flexWrap: 'wrap',
  marginTop: 16,
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: '50%',
  height: 'auto',
  padding: 4,
  // boxSizing: 'border-box',
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%',
};

interface FileUploadProps {
  containerClass?: string;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed';
  uploadIcon?: any;
  uploadLabel?: string;
  uploadRestrictionText?: string;
  borderWidth?: number;
  color?: string;
  setFile?: (file: File | File[]) => void;
  onFilesChange?: (files: File[] | File) => void;
  setVideoUrl?: (url: string) => void;
  videoUrl?: string;
  imageUrl?: string;
  accept?: string
}

interface PreviewFile extends File {
  preview: string;
}


const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(({
  containerClass,
  borderColor = '#9ABDDC',
  borderStyle = 'dashed',
  uploadIcon,
  uploadLabel = "Drag 'n' drop some files here, or click to select files",
  uploadRestrictionText,
  color = '#9ABDDC',
  borderWidth = 2,
  setFile = () => {},
  onFilesChange = () => {},
  setVideoUrl = () => {},
  videoUrl,
  imageUrl,
  accept,
}, ref) => {
  const [files, setFiles] = useState<PreviewFile[]>([]);

  useEffect(() => {
    if ((videoUrl || imageUrl) && !files.length) {
      const previewFile = {
        name: videoUrl ? 'video-preview' : 'image-preview',
        preview: videoUrl || imageUrl,
        type: videoUrl ? 'video/mp4' : 'image/jpeg',
      } as PreviewFile;
      setFiles([previewFile]);
    }
  }, [videoUrl, imageUrl]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length) {
      rejectedFiles.forEach((rejectedFile) => {
        if (rejectedFile.errors[0]?.code === "file-too-large") {
          toast.error(`File ${rejectedFile.file.name} is too large. Maximum size is 15MB.`)
        } else {
          toast.error(`File ${rejectedFile.file.name} was rejected. Please try again.`)
        }
      })
      return;
    }

    const newFiles = acceptedFiles.map((file: File) => {
      return Object.assign(file, { preview: (URL as any).createObjectURL(file) }) as PreviewFile;
    });
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...newFiles];
      onFilesChange(updatedFiles);
      return updatedFiles;
    });
  }, [onFilesChange]);

  const { getRootProps, getInputProps, acceptedFiles, isFocused, isDragAccept, isDragReject, } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : { 'image/*': [], 'video/*': [] },
    maxFiles: 10,
    maxSize: 15388608,
  });

  const handleDelete = useCallback((fileToDelete: PreviewFile) => {
    setFiles(prevFiles => {
      const updatedFiles = prevFiles.filter(file => file !== fileToDelete);
      onFilesChange(updatedFiles);
      return updatedFiles;
    });
  }, [onFilesChange]);

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  useEffect(() => {
    setFile(files);
  }, [files]);

  // const handleSubmit = async () => {
  //   if (files.length === 0) {
  //     alert('No file selected');
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('file', files[0]);

  //   try {
  //     const response = await axios.post('/api/upload', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     setVideoUrl(response.data.url);
  //     alert('File uploaded successfully');
  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //     alert('Failed to upload file');
  //   }
  // };

  const style = useMemo(
    () => ({
      ...baseStyle(borderColor, borderStyle, borderWidth, color),
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [borderColor, borderStyle, borderWidth, color, isFocused, isDragAccept, isDragReject]
  );

  const thumbs = files.map((file: PreviewFile) => (
    <div key={file.name} className="relative" style={thumb}>
      <div className="">
        <button
          className="absolute text-sm text-red-600 top-0 right-0 z-10 border bg-white p-0.5 rounded"
          onClick={() => handleDelete(file)}
          title="delete file"
        >
          X
        </button>
        <div style={thumbInner}>
          {file.type.startsWith('image/') ? (
            <img src={file.preview} style={{ display: 'block', width: 'auto', height: '100%' }} alt='preview' />
          ) : file.type.startsWith('video/') ? (
            <video controls style={{ display: 'block', width: 'auto', height: '100%' }}><source src={file.preview} type={file.type} /></video>
          ): null}
        </div>
      </div>
    </div>
  ));

  return (
    <div className={containerClass}>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        {files.length > 0 ? (
          <div style={thumbsContainer}>
            {thumbs}
          </div>
        ) : (
          <>
            {uploadIcon && uploadIcon}
            <p dangerouslySetInnerHTML={{ __html: uploadLabel }} className="mt-2" />
            <p className="text-[#D00000]">{uploadRestrictionText}</p>
          </>
        )}
      </div>
    </div>
  );
});

export default FileUpload;
