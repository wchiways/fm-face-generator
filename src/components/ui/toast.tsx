import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { X, CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react"

/* ============================================================
 *  Toast 通知系统
 *  用法：
 *    import { useToast } from '@/components/ui/toast'
 *    const toast = useToast()
 *    toast.success('操作成功')
 *    toast.error('出错了')
 *    toast.warning('请先上传图片')
 *    toast.info('提示信息')
 * ============================================================ */

type ToastType = "success" | "error" | "warning" | "info"

interface ToastItem {
  id: number
  type: ToastType
  message: string
  duration: number
}

interface ToastContextValue {
  addToast: (type: ToastType, message: string, duration?: number) => void
}

const ToastContext = React.createContext<ToastContextValue>({
  addToast: () => {},
})

let nextId = 0

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />,
  error: <XCircle className="h-5 w-5 text-red-400 shrink-0" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />,
  info: <Info className="h-5 w-5 text-blue-400 shrink-0" />,
}

const borderColorMap: Record<ToastType, string> = {
  success: "border-l-emerald-500",
  error: "border-l-red-500",
  warning: "border-l-amber-500",
  info: "border-l-blue-500",
}

function ToastContainer({ toasts, onRemove }: { toasts: ToastItem[]; onRemove: (id: number) => void }) {
  if (toasts.length === 0) return null

  return createPortal(
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 w-[360px] max-w-[calc(100vw-2rem)]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "relative flex items-start gap-3 p-4 rounded-xl border border-border/50 border-l-4",
            borderColorMap[toast.type],
            "bg-popover/95 backdrop-blur-md shadow-xl shadow-black/30",
            "animate-in slide-in-from-right-5 fade-in-0 duration-300"
          )}
        >
          {iconMap[toast.type]}
          <p className="text-sm text-foreground leading-relaxed flex-1 pt-0.5">{toast.message}</p>
          <button
            type="button"
            onClick={() => onRemove(toast.id)}
            className="shrink-0 rounded-md p-0.5 text-muted-foreground/50 hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>,
    document.body
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  const removeToast = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = React.useCallback((type: ToastType, message: string, duration = 3500) => {
    const id = nextId++
    setToasts((prev) => [...prev, { id, type, message, duration }])

    // 自动消失
    setTimeout(() => removeToast(id), duration)
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const { addToast } = React.useContext(ToastContext)
  return {
    success: (msg: string, duration?: number) => addToast("success", msg, duration),
    error: (msg: string, duration?: number) => addToast("error", msg, duration),
    warning: (msg: string, duration?: number) => addToast("warning", msg, duration),
    info: (msg: string, duration?: number) => addToast("info", msg, duration),
  }
}
