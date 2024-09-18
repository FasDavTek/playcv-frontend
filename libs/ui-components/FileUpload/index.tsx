import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';

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
  width: 100,
  height: 100,
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
}, ref) => {
  const [files, setFiles] = useState<PreviewFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length) {
        // TODO: Add alert to handle rejection
        console.log('rejectedFiles', rejectedFiles);
        return;
      }
    
      if (acceptedFiles.length === 1) {
        // Single file upload
        setFile(acceptedFiles[0]); // Pass the original File object
      } else {
        // Multiple file upload
        const newFiles = acceptedFiles.map((file: File) => {
          return Object.assign(file, { preview: URL.createObjectURL(file) }) as PreviewFile;
        });
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        onFilesChange(newFiles);
      }
    }, [onFilesChange, setFiles]);

  const {
    getRootProps,
    getInputProps,
    // isDragActive,
    acceptedFiles,
    isFocused,
    isDragAccept,
    isDragReject,
    // isFileDialogActive,
  } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'video/*': [] },
    maxFiles: 1,
    maxSize: 8388608,
  });

  const handleDelete = (fileToDelete: PreviewFile) => {
    const updatedFiles = files.filter((file) => file !== fileToDelete);
    setFiles(updatedFiles);
    setFiles(updatedFiles);
  };

  useEffect(() => {
    // Cleanup file preview URLs to avoid memory leaks
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
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
    <div style={{ display: 'inline-flex', margin: '8px', width: '100px', height: '100px' }} key={file.name} className="relative">
      <div style={{ display: 'flex', minWidth: 0, overflow: 'hidden' }} className="">
        <button
          className="absolute text-sm text-red-600 top-0 right-0 z-10 border bg-white p-0.5 rounded"
          onClick={() => handleDelete(file)}
          title="delete file"
        >
          X
        </button>
        <img
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  return (
    <div className={containerClass}>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        {files.length > 0 ? (
          <div style={thumbsContainer}>
            {files.map((file: PreviewFile) => (
              <div key={file.name} className="relative">
                <div className="">
                  <button
                    className="absolute text-sm text-red-600 top-0 right-0 z-10 border bg-white p-0.5 rounded"
                    onClick={() => handleDelete(file)}
                    title="delete file"
                  >
                    X
                  </button>
                  <img src={file.preview} style={img} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {uploadIcon && uploadIcon}
            <p dangerouslySetInnerHTML={{ __html: uploadLabel }} className="mt-2" />
            <p className="text-secondary-300">{uploadRestrictionText}</p>
          </>
        )}
      </div>
    </div>
  );
});

export default FileUpload;
