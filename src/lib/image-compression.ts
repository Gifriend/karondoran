// Image compression utility for frontend
export async function compressImage(file: File, maxSizeInMB = 1): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        let width = img.width
        let height = img.height

        // Calculate new dimensions while maintaining aspect ratio
        const maxDimension = 1920
        if (width > height) {
          if (width > maxDimension) {
            height = (height * maxDimension) / width
            width = maxDimension
          }
        } else {
          if (height > maxDimension) {
            width = (width * maxDimension) / height
            height = maxDimension
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        // Start with high quality and reduce if needed
        let quality = 0.9
        let compressedSize = 0

        const compressWithQuality = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Could not compress image"))
                return
              }

              compressedSize = blob.size
              const sizeInMB = compressedSize / (1024 * 1024)

              if (sizeInMB > maxSizeInMB && quality > 0.1) {
                quality -= 0.1
                compressWithQuality()
              } else {
                const compressedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                })
                resolve(compressedFile)
              }
            },
            "image/jpeg",
            quality,
          )
        }

        compressWithQuality()
      }
      img.onerror = () => reject(new Error("Could not load image"))
    }
    reader.onerror = () => reject(new Error("Could not read file"))
    reader.readAsDataURL(file)
  })
}

// Get readable file size
export function getReadableFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}
