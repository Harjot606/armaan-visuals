import { handleUpload } from '@vercel/blob/client'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'armaan-dev-secret-change-me'

function verifyAuth(req) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    throw new Error('Authentication required.')
  }
  return jwt.verify(header.slice(7), JWT_SECRET)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  try {
    verifyAuth(req)
  } catch {
    return res.status(401).json({ error: 'Authentication required.' })
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
    return res.status(503).json({
      error: 'Blob storage is not configured. Connect Vercel Blob and redeploy.',
    })
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
          'video/mp4',
          'video/webm',
          'video/quicktime',
          'video/x-msvideo',
        ],
        maximumSizeInBytes: 100 * 1024 * 1024,
        addRandomSuffix: true,
      }),
      onUploadCompleted: async () => {},
    })

    return res.status(200).json(jsonResponse)
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Upload failed.' })
  }
}
