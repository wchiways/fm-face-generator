import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

/* ============================================================
 *  Dialog — 模态弹窗组件
 *  特性：毛玻璃遮罩、弹入动画、ESC/外部点击关闭、Portal 渲染
 * ============================================================ */

interface DialogContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue>({
  open: false,
  onOpenChange: () => {},
})

interface DialogProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

function Dialog({ open: controlledOpen, defaultOpen = false, onOpenChange, children }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = controlledOpen ?? uncontrolledOpen
  const handleOpenChange = (v: boolean) => {
    setUncontrolledOpen(v)
    onOpenChange?.(v)
  }

  // ESC 关闭
  React.useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleOpenChange(false)
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open])

  // 打开时锁定 body 滚动
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <DialogContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

function DialogTrigger({ children, asChild, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { onOpenChange } = React.useContext(DialogContext)
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      onClick: () => onOpenChange(true),
    })
  }
  return (
    <button type="button" onClick={() => onOpenChange(true)} {...props}>
      {children}
    </button>
  )
}

const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(DialogContext)

    if (!open) return null

    return createPortal(
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        {/* 遮罩层 — 毛玻璃 */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-200"
          onClick={() => onOpenChange(false)}
        />

        {/* 弹窗主体 */}
        <div
          ref={ref}
          className={cn(
            "relative z-10 w-[calc(100%-2rem)] max-w-lg",
            "rounded-2xl border border-border/50",
            "bg-gradient-to-b from-card to-card/95",
            "p-6 shadow-2xl shadow-black/40",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-200",
            className
          )}
          {...props}
        >
          {children}

          {/* 关闭按钮 */}
          <button
            type="button"
            className={cn(
              "absolute right-3 top-3 rounded-lg p-1.5",
              "text-muted-foreground/60 hover:text-foreground",
              "hover:bg-muted/60 transition-all cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-ring/40"
            )}
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">关闭</span>
          </button>
        </div>
      </div>,
      document.body
    )
  }
)
DialogContent.displayName = "DialogContent"

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 pr-8", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn("text-lg font-semibold text-foreground leading-tight", className)} {...props} />
  )
)
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground leading-relaxed", className)} {...props} />
  )
)
DialogDescription.displayName = "DialogDescription"

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center justify-end gap-2 pt-2", className)} {...props} />
)
DialogFooter.displayName = "DialogFooter"

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
}
