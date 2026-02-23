import { useRef, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppState } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Wand2, Download, Loader2 } from 'lucide-react'
import { renderFace } from '@/lib/render'
import { useToast } from '@/components/ui/toast'

export default function PreviewPanel() {
  const { state, dispatch } = useAppState()
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [generating, setGenerating] = useState(false)
  const toast = useToast()

  const handleGenerate = useCallback(async () => {
    if (generating) return
    setGenerating(true)

    try {
      // 尝试获取最新裁剪图片
      let imageData: string | null = null
      const exportFn = (window as unknown as Record<string, () => Promise<string | null>>).__exportCroppedImage
      if (exportFn) {
        imageData = await exportFn()
      }

      // 如果获取到了新图片，缓存到 context
      if (imageData) {
        dispatch({ type: 'SET_CROPPED_IMAGE', image: imageData })
      } else {
        // 没获取到则使用上次缓存的裁剪图片
        imageData = state.croppedImage
      }

      if (!imageData) {
        toast.warning(t('preview.uploadFirst'))
        return
      }

      const canvas = canvasRef.current
      if (!canvas) return

      await renderFace(imageData, state.settings, canvas)
      toast.success(t('preview.success'))
    } catch (e) {
      console.error('Face generation failed:', e)
      toast.error(t('preview.failed'))
    } finally {
      setGenerating(false)
    }
  }, [state.settings, state.croppedImage, generating, dispatch, toast, t])

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const isPng = state.exportFormat === 'png'
    const mimeType = isPng ? 'image/png' : 'image/jpeg'
    const ext = isPng ? '.png' : '.jpg'

    const link = document.createElement('a')
    link.href = isPng
      ? canvas.toDataURL(mimeType)
      : canvas.toDataURL(mimeType, state.exportQuality)
    const baseName = state.saveFileName || state.fileName || 'gunzo-face'
    // 去掉已有后缀再加正确的
    const nameWithoutExt = baseName.replace(/\.(png|jpe?g)$/i, '')
    link.download = `${nameWithoutExt}${ext}`
    link.click()
    toast.success(t('preview.downloadStarted'))
  }, [state.saveFileName, state.fileName, state.exportFormat, state.exportQuality, toast, t])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{t('preview.title')}</h3>
        <p className="text-xs text-muted-foreground">{t('preview.rightClickHint')}</p>
      </div>

      {/* Canvas 容器 */}
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={350}
          height={350}
          className="rounded-xl border border-border bg-muted/20 w-full max-w-[350px] h-auto"
        />
      </div>

      {/* 操作按钮 */}
      <Button onClick={handleGenerate} disabled={generating} className="w-full gap-2">
        {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
        {generating ? t('preview.generating') : t('preview.generate')}
      </Button>

      <div className="space-y-1.5">
        <Label htmlFor="save-filename">{t('preview.saveFileName')}</Label>
        <Input
          id="save-filename"
          placeholder={t('preview.fileNamePlaceholder')}
          value={state.saveFileName}
          onChange={(e) => dispatch({ type: 'SET_SAVE_FILE_NAME', name: e.target.value })}
        />
      </div>

      <Button variant="secondary" onClick={handleDownload} className="w-full gap-2">
        <Download className="h-4 w-4" />
        {t('preview.download')}
      </Button>
    </div>
  )
}
