import { useRef, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppState } from '@/context/AppContext'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { SimpleSelect, SelectOption } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Cog, Images, FileUp, Upload, X } from 'lucide-react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { validateImageFile, readFileAsDataURL, centerCropToSquare, canvasToBlob, parseCsvMapping, getFileNameWithoutExt } from '@/lib/batch-utils'
import { renderFace } from '@/lib/render'
import { useToast } from '@/components/ui/toast'

export default function BatchSection() {
  const { state, dispatch } = useAppState()
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const csvInputRef = useRef<HTMLInputElement>(null)
  const [batchFiles, setBatchFiles] = useState<File[]>([])
  const [dragging, setDragging] = useState(false)
  const toast = useToast()

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const arr = Array.from(incoming)
    setBatchFiles((prev) => {
      // 按文件名去重
      const existing = new Set(prev.map((f) => f.name))
      const newFiles = arr.filter((f) => !existing.has(f.name))
      return [...prev, ...newFiles]
    })
  }, [])

  const removeFile = useCallback((name: string) => {
    setBatchFiles((prev) => prev.filter((f) => f.name !== name))
  }, [])

  const clearFiles = useCallback(() => {
    setBatchFiles([])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  const handleDropZoneDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files)
    }
  }, [addFiles])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files)
    }
    e.target.value = ''
  }, [addFiles])

  const handleCsvUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      toast.error(t('batch.csvUploadError'))
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      if (text) {
        dispatch({ type: 'SET_BATCH_CSV', text })
        toast.success(t('batch.csvImported', { name: file.name }))
      }
    }
    reader.onerror = () => toast.error(t('batch.csvReadFailed'))
    reader.readAsText(file)
    // 重置 input 以便重复选择同一文件
    e.target.value = ''
  }, [dispatch, toast, t])

  const handleBatchGenerate = useCallback(async () => {
    if (batchFiles.length === 0) {
      toast.warning(t('batch.selectFirst'))
      return
    }

    // 验证所有文件
    for (const file of batchFiles) {
      const error = validateImageFile(file)
      if (error) {
        toast.error(t(error.key, error.params))
        return
      }
    }

    // 解析 CSV 映射
    let csvMap: Record<string, string> = {}
    if (state.batchNameMode === 'csv') {
      if (!state.batchCsvText.trim()) {
        toast.warning(t('batch.csvEmpty'))
        return
      }
      csvMap = parseCsvMapping(state.batchCsvText)
    }

    const total = batchFiles.length
    dispatch({
      type: 'SET_BATCH_PROGRESS',
      progress: { status: 'processing', total, current: 0, successCount: 0, currentFile: '' },
    })

    const zip = new JSZip()
    const imgFolder = zip.folder('faces')!
    let successCount = 0

    for (let i = 0; i < total; i++) {
      const file = batchFiles[i]
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
        console.error('File processing failed:', file.name, err)
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
      toast.success(t('batch.batchDone', { success: successCount, total }))
    } catch (err) {
      console.error('ZIP generation failed:', err)
      dispatch({
        type: 'SET_BATCH_PROGRESS',
        progress: { status: 'error', errorMessage: t('batch.zipFailed') },
      })
      toast.error(t('batch.zipFailed'))
    }
  }, [batchFiles, state.batchNameMode, state.batchCsvText, state.settings, state.exportFormat, state.exportQuality, dispatch, toast, t])

  const { batchProgress } = state
  const progressPct = batchProgress.total > 0
    ? Math.round((batchProgress.current / batchProgress.total) * 100)
    : 0

  const statusText = (() => {
    switch (batchProgress.status) {
      case 'processing':
        return t('batch.processingFile', {
          file: batchProgress.currentFile,
          current: batchProgress.current + 1,
          total: batchProgress.total,
        })
      case 'packing':
        return t('batch.packing')
      case 'done':
        return t('batch.done', { success: batchProgress.successCount, total: batchProgress.total })
      case 'error':
        return batchProgress.errorMessage || t('batch.error')
      default:
        return ''
    }
  })()

  return (
    <div className="flex flex-col gap-4">
      <Separator />
      <h4 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Images className="h-4 w-4" />
        {t('batch.title')}
      </h4>

      <div className="space-y-1.5">
        <Label>{t('batch.selectImages')}</Label>
        <div
          className={`relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 transition-colors cursor-pointer ${
            dragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-muted-foreground/40'
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDropZoneDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={(e) => { e.preventDefault(); setDragging(false) }}
        >
          <Upload className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            {t('batch.dropHint')}
          </p>
          <p className="text-xs text-muted-foreground/60">
            {t('batch.formatHint')}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>

        {batchFiles.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {t('batch.selectedCount', { count: batchFiles.length })}
              </span>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={clearFiles}
              >
                {t('batch.clearAll')}
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {batchFiles.map((f) => (
                <span
                  key={f.name}
                  className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {f.name}
                  <button
                    type="button"
                    className="hover:text-foreground cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); removeFile(f.name) }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="batch-name-mode">{t('batch.nameMode')}</Label>
        <SimpleSelect
          id="batch-name-mode"
          value={state.batchNameMode}
          onValueChange={(v) => dispatch({ type: 'SET_BATCH_NAME_MODE', mode: v as 'filename' | 'fixed' | 'csv' })}
        >
          <SelectOption value="filename">{t('batch.nameMode.filename')}</SelectOption>
          <SelectOption value="fixed">{t('batch.nameMode.fixed')}</SelectOption>
          <SelectOption value="csv">{t('batch.nameMode.csv')}</SelectOption>
        </SimpleSelect>
      </div>

      {state.batchNameMode === 'csv' && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="batch-csv">{t('batch.csvData')}</Label>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => csvInputRef.current?.click()}
            >
              <FileUp className="h-3.5 w-3.5" />
              {t('batch.importCsv')}
            </Button>
            <input
              ref={csvInputRef}
              type="file"
              accept=".csv,.txt"
              className="hidden"
              onChange={handleCsvUpload}
            />
          </div>
          <Textarea
            id="batch-csv"
            rows={4}
            placeholder={t('batch.csvPlaceholder')}
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
        {batchProgress.status === 'processing' ? t('batch.processing') : t('batch.generate')}
      </Button>
    </div>
  )
}
