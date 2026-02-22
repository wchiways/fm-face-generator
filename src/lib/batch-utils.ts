const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function validateImageFile(file: File): string | null {
  if (ALLOWED_TYPES.indexOf(file.type) === -1) {
    return `文件 "${file.name}" 格式不支持，请仅上传图片文件`
  }
  if (file.size > MAX_FILE_SIZE) {
    return `文件 "${file.name}" 超过 10MB 大小限制`
  }
  return null
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target!.result as string)
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

export function centerCropToSquare(dataUrl: string, size: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')!
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      const scale = Math.max(size / img.width, size / img.height)
      const scaledW = img.width * scale
      const scaledH = img.height * scale
      const offsetX = (size - scaledW) / 2
      const offsetY = (size - scaledH) / 2

      ctx.drawImage(img, offsetX, offsetY, scaledW, scaledH)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = dataUrl
  })
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg' = 'png',
  quality?: number
): Promise<Blob> {
  return new Promise((resolve) => {
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png'
    canvas.toBlob((blob) => {
      resolve(blob!)
    }, mimeType, format === 'jpeg' ? quality : undefined)
  })
}

export function parseCsvMapping(csvText: string): Record<string, string> {
  const map: Record<string, string> = {}
  const lines = csvText.trim().split('\n')
  for (const line of lines) {
    const parts = line.split(',')
    if (parts.length >= 2) {
      map[parts[0].trim()] = parts.slice(1).join(',').trim()
    }
  }
  return map
}

export function getFileNameWithoutExt(fileName: string): string {
  return fileName.split('.').slice(0, -1).join('.') || fileName
}
