import React, { useState, useCallback } from 'react'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.REACT_APP_CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.REACT_APP_CLOUDFLARE_R2_ACCESS_KEY!,
        secretAccessKey: process.env.REACT_APP_CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
    },
})

interface UploadedFile {
    key: string
    type: 'image' | 'video'
    url: string
}

export default function R2Integration() {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
    const [isUploading, setIsUploading] = useState(false)
  
    const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return
  
      setIsUploading(true)
  
      try {
        const fileName = `${Date.now()}-${file.name}`
        const fileType = file.type.startsWith('image/') ? 'image' : 'video'
  
        const command = new PutObjectCommand({
          Bucket: process.env.REACT_APP_CLOUDFLARE_R2_BUCKET,
          Key: fileName,
          Body: file,
          ContentType: file.type,
        })
  
        await s3Client.send(command)
  
        const getObjectCommand = new GetObjectCommand({
          Bucket: process.env.REACT_APP_CLOUDFLARE_R2_BUCKET,
          Key: fileName,
        })
  
        const url = await getSignedUrl(s3Client, getObjectCommand, { expiresIn: 3600 })
  
        setUploadedFiles(prev => [...prev, { key: fileName, type: fileType, url }])
      } catch (error) {
        console.error('Error uploading file:', error)
      } finally {
        setIsUploading(false)
      }
    }, [])
  
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">R2 File Upload</h1>
        <div className="mb-4">
          <input
            type="file"
            onChange={handleFileUpload}
            accept="image/*,video/*"
            disabled={isUploading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {isUploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {uploadedFiles.map((file) => (
            <div key={file.key} className="border rounded-lg overflow-hidden">
              {file.type === 'image' ? (
                <img src={file.url} alt="Uploaded file" className="w-full h-48 object-cover" />
              ) : (
                <video src={file.url} controls className="w-full h-48 object-cover">
                  Your browser does not support the video tag.
                </video>
              )}
              <div className="p-2">
                <p className="text-sm text-gray-500 truncate">{file.key}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }