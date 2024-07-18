import React, { useCallback, useMemo, useState } from 'react';

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
  setFile?: (file: File | null) => void;
}

const FileUpload = ({
  containerClass,
  borderColor = '#9ABDDC',
  borderStyle = 'dashed',
  uploadIcon,
  uploadLabel = "Drag 'n' drop some files here, or click to select files",
  uploadRestrictionText,
  color = '#9ABDDC',
  borderWidth = 2,
  setFile = () => {},
}: FileUploadProps) => {
  const [files, setFiles] = useState<any>([]);

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
    onDrop: (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // TODO: Add alert to handle rejection
      console.log('rejectedFiles', rejectedFiles);
      setFiles(
        acceptedFiles.map((file: File) => {
          setFile(file);
          return Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        })
      );
    },
    accept: { 'video/*': [] },
    maxFiles: 1,
    maxSize: 8388608,
  });

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setFiles([]);
    setFile(null);
    e.stopPropagation();
  };

  const style = useMemo(
    () => ({
      ...baseStyle(borderColor, borderStyle, borderWidth, color),
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const thumbs = files.map((file: File & any) => (
    <div style={thumb} key={file.name} className="relative">
      <div style={thumbInner} className="">
        <button
          className="absolute text-sm text-red-600 top-0 right-0 z-10 border bg-white p-0.5 rounded"
          onClick={handleDelete}
          title="delete image"
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
        {thumbs.length > 0 ? (
          <p style={thumbsContainer}>{thumbs}</p>
        ) : (
          <>
            {uploadIcon && uploadIcon}
            <p
              dangerouslySetInnerHTML={{ __html: uploadLabel }}
              className="mt-2"
            />
            <p className="text-secondary-300">{uploadRestrictionText}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
