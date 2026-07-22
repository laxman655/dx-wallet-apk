// Cloudflare R2 File Upload Service
// Used for storing KYC documents and other file uploads securely

const R2_API_BASE = import.meta.env.VITE_R2_API_BASE || "https://api.g00pay.com"
const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL || "https://files.g00pay.com"

interface UploadResult {
  success: boolean
  url?: string
  key?: string
  error?: string
}

interface UploadOptions {
  folder?: string
  maxSizeMB?: number
  allowedTypes?: string[]
}

/**
 * Upload a file to Cloudflare R2 via the backend API
 * Files are stored securely and only accessible via signed URLs
 */
export async function uploadFileToR2(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const {
    folder = "kyc",
    maxSizeMB = 10,
    allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  } = options

  // Validate file size
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { success: false, error: `File size exceeds ${maxSizeMB}MB limit` }
  }

  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: `Invalid file type. Allowed: ${allowedTypes.map((t) => t.split("/")[1].toUpperCase()).join(", ")}`,
    }
  }

  try {
    // Get upload URL from backend (presigned URL for direct R2 upload)
    const token = sessionStorage.getItem("token") || ""
    const presignRes = await fetch(`${R2_API_BASE}/api/r2/presign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
        folder,
        size: file.size,
      }),
    })

    if (!presignRes.ok) {
      const err = await presignRes.json().catch(() => ({}))
      throw new Error(err.error || "Failed to get upload URL")
    }

    const { uploadUrl, publicUrl, key } = await presignRes.json()

    // Upload file directly to R2 using presigned URL
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    })

    if (!uploadRes.ok) {
      throw new Error("Failed to upload file to storage")
    }

    return {
      success: true,
      url: publicUrl,
      key,
    }
  } catch (err) {
    console.error("R2 upload error:", err)
    return {
      success: false,
      error: err instanceof Error ? err.message : "Upload failed",
    }
  }
}

/**
 * Upload KYC document (ID front, ID back, selfie)
 */
export async function uploadKYCDocument(
  file: File,
  type: "id_front" | "id_back" | "selfie"
): Promise<UploadResult> {
  const folder = `kyc/${type}`
  const result = await uploadFileToR2(file, {
    folder,
    maxSizeMB: 5,
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  })

  if (result.success) {
    // Notify backend about the uploaded document
    try {
      const token = sessionStorage.getItem("token") || ""
      await fetch(`${R2_API_BASE}/api/kyc/document`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          type,
          url: result.url,
          key: result.key,
        }),
      })
    } catch {
      // Non-critical, backend can poll for updates
    }
  }

  return result
}

/**
 * Delete a file from R2
 */
export async function deleteFileFromR2(key: string): Promise<boolean> {
  try {
    const token = sessionStorage.getItem("token") || ""
    const res = await fetch(`${R2_API_BASE}/api/r2/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ key }),
    })

    return res.ok
  } catch {
    return false
  }
}

/**
 * Get a signed URL for temporary access to a private file
 */
export async function getSignedUrl(key: string): Promise<string | null> {
  try {
    const token = sessionStorage.getItem("token") || ""
    const res = await fetch(`${R2_API_BASE}/api/r2/signed-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ key }),
    })

    if (!res.ok) return null
    const { url } = await res.json()
    return url
  } catch {
    return null
  }
}

/**
 * Compress image before upload (client-side optimization)
 */
export async function compressImage(
  file: File,
  maxWidth = 1920,
  quality = 0.85
): Promise<File> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      resolve(file)
      return
    }

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      let { width, height } = img

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        resolve(file)
        return
      }

      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressed = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })
            resolve(compressed)
          } else {
            resolve(file)
          }
        },
        file.type,
        quality
      )
    }
    img.onerror = () => resolve(file)
    img.src = URL.createObjectURL(file)
  })
}
