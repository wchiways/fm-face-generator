import { useCallback, useRef, useState } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { useAppState } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Upload, RotateCcw, RotateCw, Eye, EyeOff } from 'lucide-react'
import { validateImageFile, readFileAsDataURL, getFileNameWithoutExt } from '@/lib/batch-utils'
import { useToast } from '@/components/ui/toast'

// 从裁剪区域生成裁剪后图片
async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<string> {
  const image = new Image()
  image.crossOrigin = 'anonymous'
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = reject
    image.src = imageSrc
  })

  const canvas = document.createElement('canvas')
  canvas.width = 350
  canvas.height = 350
  const ctx = canvas.getContext('2d')!
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  ctx.drawImage(
    image,
    pixelCrop.x, pixelCrop.y,
    pixelCrop.width, pixelCrop.height,
    0, 0, 350, 350
  )

  return canvas.toDataURL('image/png')
}

export default function ImageUploader() {
  const { state, dispatch } = useAppState()
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const toast = useToast()

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  // 导出裁剪后的图片
  const exportCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return null
    return getCroppedImg(imageSrc, croppedAreaPixels)
  }, [imageSrc, croppedAreaPixels])

  // 暴露给父组件
  ;(window as unknown as Record<string, unknown>).__exportCroppedImage = exportCroppedImage

  const handleFileSelect = async (file: File) => {
    const error = validateImageFile(file)
    if (error) {
      toast.error(error)
      return
    }
    const dataUrl = await readFileAsDataURL(file)
    setImageSrc(dataUrl)
    dispatch({ type: 'SET_FILE_NAME', name: file.name })
    dispatch({ type: 'SET_SAVE_FILE_NAME', name: getFileNameWithoutExt(file.name) })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dropZoneRef.current?.classList.remove('ring-2', 'ring-primary')
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    dropZoneRef.current?.classList.add('ring-2', 'ring-primary')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    dropZoneRef.current?.classList.remove('ring-2', 'ring-primary')
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 上传控制 */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="gap-1.5"
        >
          <Upload className="h-4 w-4" />
          选择图片
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          onChange={handleInputChange}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch({ type: 'SET_ROTATION', rotation: state.rotation - 90 })}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch({ type: 'SET_ROTATION', rotation: state.rotation + 90 })}
        >
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch({ type: 'TOGGLE_GUIDELINES' })}
        >
          {state.guidelinesVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>
      </div>

      {/* 裁剪区域 */}
      <div
        ref={dropZoneRef}
        className="relative w-full max-w-[350px] aspect-square rounded-xl border-2 border-dashed border-border bg-muted/30 transition-all overflow-hidden"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {imageSrc ? (
          <>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={state.zoom}
              rotation={state.rotation}
              aspect={1}
              objectFit="horizontal-cover"
              onCropChange={setCrop}
              onZoomChange={(z) => dispatch({ type: 'SET_ZOOM', zoom: z })}
              onCropComplete={onCropComplete}
              showGrid={false}
              style={{
                containerStyle: { borderRadius: '0.75rem' },
              }}
            />
            {/* 参考线 */}
            {state.guidelinesVisible && (
              <div className="absolute inset-0 pointer-events-none z-10">
                <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-red-500/60" />
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-blue-500/60" />
              </div>
            )}
          </>
        ) : (
          <div
            className="flex flex-col items-center justify-center h-full text-muted-foreground cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 mb-3 opacity-40" />
            <p className="text-sm">1. 点击选择文件</p>
            <p className="text-sm">2. 调整图片大小</p>
            <p className="text-sm">3. 设置参数</p>
            <p className="text-sm">4. 生成头像</p>
          </div>
        )}
      </div>

      {/* 缩放控制 */}
      <div className="flex items-center gap-3 w-full max-w-[350px]">
        <span className="text-xs text-muted-foreground">-</span>
        <Slider
          min={1}
          max={3}
          step={0.01}
          value={state.zoom}
          onValueChange={(v) => dispatch({ type: 'SET_ZOOM', zoom: v })}
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground">+</span>
      </div>
    </div>
  )
}
