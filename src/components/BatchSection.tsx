import { useRef, useCallback } from 'react'
import { useAppState } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { SimpleSelect, SelectOption } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Cog, Images } from 'lucide-react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { validateImageFile, readFileAsDataURL, centerCropToSquare, canvasToBlob, parseCsvMapping, getFileNameWithoutExt } from '@/lib/batch-utils'
import { renderFace } from '@/lib/render'
import { useToast } from '@/components/ui/toast'

export default function BatchSection() {
  const { state, dispatch } = useAppState()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const handleBatchGenerate = useCallback(async () => {
    const files = fileInputRef.current?.files
    if (!files || files.length === 0) {
      toast.warning('请先选择要批量处理的图片文件')
      return
    }

    // 验证所有文件
    for (let i = 0; i < files.length; i++) {
      const error = validateImageFile(files[i])
      if (error) {
        toast.error(error)
        return
      }
    }

    // 解析 CSV 映射
    let csvMap: Record<string, string> = {}
    if (state.batchNameMode === 'csv') {
      if (!state.batchCsvText.trim()) {
        toast.warning('请填写 CSV 映射数据')
        return
      }
      csvMap = parseCsvMapping(state.batchCsvText)
    }

    const total = files.length
    dispatch({
      type: 'SET_BATCH_PROGRESS',
      progress: { status: 'processing', total, current: 0, successCount: 0, currentFile: '' },
    })

    const zip = new JSZip()
    const imgFolder = zip.folder('faces')!
    let successCount = 0

    for (let i = 0; i < total; i++) {
      const file = files[i]
      dispatch({
        type: 'SET_BATCH_PROGRESS',
        progress: { current: i, currentFile: file.name },
      })

      try {
        const dataUrl = await readFileAsDataURL(file)
        const croppedDataUrl = await centerCropToSquare(dataUrl, 350)

        let playerName: string
        if (state.batchNameMode === 'filename') {
          playerName = getFileNameWithoutExt(file.name)
        } else if (state.batchNameMode === 'csv') {
          playerName = csvMap[file.name] || getFileNameWithoutExt(file.name)
        } else {
          playerName = state.settings.name
        }

        const offCanvas = document.createElement('canvas')
        offCanvas.width = 350
        offCanvas.height = 350

        const settings = { ...state.settings, name: playerName }
        await renderFace(croppedDataUrl, settings, offCanvas)

        const blob = await canvasToBlob(offCanvas, state.exportFormat, state.exportQuality)
        const ext = state.exportFormat === 'jpeg' ? '.jpg' : '.png'
        imgFolder.file(getFileNameWithoutExt(file.name) + ext, blob)
        successCount++
      } catch (err) {
        console.error('处理文件失败:', file.name, err)
      }
    }

    dispatch({
      type: 'SET_BATCH_PROGRESS',
      progress: { status: 'packing', current: total, successCount },
    })

    try {
      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, 'gunzo-faces-batch.zip')
      dispatch({
        type: 'SET_BATCH_PROGRESS',
        progress: { status: 'done', successCount },
      })
      toast.success(`批量完成！成功生成 ${successCount}/${total} 张头像`)
    } catch (err) {
      console.error('ZIP 生成失败:', err)
      dispatch({
        type: 'SET_BATCH_PROGRESS',
        progress: { status: 'error', errorMessage: 'ZIP 打包失败，请重试' },
      })
      toast.error('ZIP 打包失败，请重试')
    }
  }, [state.batchNameMode, state.batchCsvText, state.settings, state.exportFormat, state.exportQuality, dispatch, toast])

  const { batchProgress } = state
  const progressPct = batchProgress.total > 0
    ? Math.round((batchProgress.current / batchProgress.total) * 100)
    : 0

  const statusText = (() => {
    switch (batchProgress.status) {
      case 'processing':
        return `正在处理: ${batchProgress.currentFile} (${batchProgress.current + 1}/${batchProgress.total})`
      case 'packing':
        return '正在打包 ZIP 文件...'
      case 'done':
        return `完成! 成功生成 ${batchProgress.successCount}/${batchProgress.total} 张头像`
      case 'error':
        return batchProgress.errorMessage || '处理失败'
      default:
        return ''
    }
  })()

  return (
    <div className="flex flex-col gap-4">
      <Separator />
      <h4 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Images className="h-4 w-4" />
        批量生成
      </h4>

      <div className="space-y-1.5">
        <Label htmlFor="batch-input">选择多张图片</Label>
        <input
          ref={fileInputRef}
          id="batch-input"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="batch-name-mode">名称模式</Label>
        <SimpleSelect
          id="batch-name-mode"
          value={state.batchNameMode}
          onValueChange={(v) => dispatch({ type: 'SET_BATCH_NAME_MODE', mode: v as 'filename' | 'fixed' | 'csv' })}
        >
          <SelectOption value="filename">使用文件名作为球员名称</SelectOption>
          <SelectOption value="fixed">所有图片使用上方填写的名称</SelectOption>
          <SelectOption value="csv">CSV 映射（文件名,球员名）</SelectOption>
        </SimpleSelect>
      </div>

      {state.batchNameMode === 'csv' && (
        <div className="space-y-1.5">
          <Label htmlFor="batch-csv">CSV 映射数据</Label>
          <Textarea
            id="batch-csv"
            rows={4}
            placeholder={'每行格式: 文件名,球员名\n例如:\nphoto1.jpg,Messi\nphoto2.jpg,Ronaldo'}
            value={state.batchCsvText}
            onChange={(e) => dispatch({ type: 'SET_BATCH_CSV', text: e.target.value })}
          />
        </div>
      )}

      {batchProgress.status !== 'idle' && (
        <div className="space-y-2">
          <Progress value={batchProgress.status === 'done' ? 100 : progressPct} />
          <p className="text-xs text-muted-foreground">{statusText}</p>
        </div>
      )}

      <Button
        onClick={handleBatchGenerate}
        disabled={batchProgress.status === 'processing' || batchProgress.status === 'packing'}
        className="w-full gap-2"
        variant="secondary"
      >
        <Cog className="h-4 w-4" />
        {batchProgress.status === 'processing' ? '正在处理...' : '批量生成并下载 ZIP'}
      </Button>
    </div>
  )
}
