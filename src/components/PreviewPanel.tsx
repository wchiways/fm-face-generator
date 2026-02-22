import { useRef, useCallback, useState } from 'react'
import { useAppState } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Wand2, Download, Loader2 } from 'lucide-react'
import { renderFace } from '@/lib/render'
import { useToast } from '@/components/ui/toast'

export default function PreviewPanel() {
  const { state, dispatch } = useAppState()
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
        toast.warning('请先上传图片')
        return
      }

      const canvas = canvasRef.current
      if (!canvas) return

      await renderFace(imageData, state.settings, canvas)
      toast.success('头像生成成功')
    } catch (e) {
      console.error('头像生成失败:', e)
      toast.error('头像生成失败，请检查设置后重试')
    } finally {
      setGenerating(false)
    }
  }, [state.settings, state.croppedImage, generating, dispatch, toast])

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    const fileName = state.saveFileName || state.fileName || 'gunzo-face'
    link.download = fileName.endsWith('.png') ? fileName : `${fileName}.png`
    link.click()
    toast.success('图片已开始下载')
  }, [state.saveFileName, state.fileName, toast])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">预览效果</h3>
        <p className="text-xs text-muted-foreground">右键单击图像可另存为</p>
      </div>

      {/* Canvas 容器 */}
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={350}
          height={350}
          className="rounded-xl border border-border bg-muted/20"
        />
      </div>

      {/* 操作按钮 */}
      <Button onClick={handleGenerate} disabled={generating} className="w-full gap-2">
        {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
        {generating ? '生成中...' : '生成头像'}
      </Button>

      <div className="space-y-1.5">
        <Label htmlFor="save-filename">保存文件名</Label>
        <Input
          id="save-filename"
          placeholder="输入保存文件名"
          value={state.saveFileName}
          onChange={(e) => dispatch({ type: 'SET_SAVE_FILE_NAME', name: e.target.value })}
        />
      </div>

      <Button variant="secondary" onClick={handleDownload} className="w-full gap-2">
        <Download className="h-4 w-4" />
        下载图片
      </Button>
    </div>
  )
}
