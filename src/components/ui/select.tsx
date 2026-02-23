import * as React from "react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { ChevronDown, Check } from "lucide-react"

/* ============================================================
 *  CustomSelect — 完全自定义的下拉选择组件
 *  替代原生 <select>，解决暗色主题下看不清的问题
 * ============================================================ */

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  group?: string
}

interface SelectProps {
  id?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  options: SelectOption[]
  className?: string
}

function Select({ id, value: controlledValue, defaultValue, onValueChange, placeholder, options, className }: SelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? "")
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)
  const searchRef = React.useRef<HTMLInputElement>(null)
  const { t } = useTranslation()

  const value = controlledValue ?? uncontrolledValue
  const selectedOption = options.find(o => o.value === value && !o.disabled)

  // 关闭下拉时重置搜索
  React.useEffect(() => {
    if (!open) setSearch("")
  }, [open])

  // 打开时聚焦搜索框
  React.useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus()
    }
  }, [open])

  // 点击外部关闭
  React.useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  // ESC 关闭
  React.useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open])

  const handleSelect = (optValue: string) => {
    setUncontrolledValue(optValue)
    onValueChange?.(optValue)
    setOpen(false)
  }

  // 过滤选项（搜索时）
  const filteredOptions = search
    ? options.filter(o =>
        !o.disabled && o.label.toLowerCase().includes(search.toLowerCase())
      )
    : options

  // 是否需要搜索框（选项 > 8 个时显示）
  const showSearch = options.filter(o => !o.disabled).length > 8

  return (
    <div ref={containerRef} className={cn("relative", className)} id={id}>
      {/* 触发按钮 */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm",
          "ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
          "text-foreground hover:bg-secondary/50 transition-colors"
        )}
      >
        <span className={cn("truncate", !selectedOption && "text-muted-foreground")}>
          {selectedOption?.label ?? placeholder ?? t('common.select')}
        </span>
        <ChevronDown className={cn(
          "ml-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform",
          open && "rotate-180"
        )} />
      </button>

      {/* 下拉面板 */}
      {open && (
        <div className={cn(
          "absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-lg",
          "animate-in fade-in-0 zoom-in-95 duration-100"
        )}>
          {/* 搜索框 */}
          {showSearch && (
            <div className="p-2 border-b border-border">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('common.search')}
                className="w-full h-7 rounded bg-muted px-2 text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
          )}

          {/* 选项列表 */}
          <div
            ref={listRef}
            className="max-h-[240px] overflow-y-auto overscroll-contain py-1 custom-scrollbar"
            role="listbox"
          >
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                {t('common.noMatch')}
              </div>
            )}
            {filteredOptions.map((opt, i) => {
              if (opt.disabled) {
                // 分组标题
                return (
                  <div
                    key={`${opt.value}-${i}`}
                    className="px-3 py-1.5 text-xs font-semibold text-accent uppercase tracking-wider select-none bg-muted/30 sticky top-0"
                  >
                    {opt.label}
                  </div>
                )
              }

              const isSelected = opt.value === value
              return (
                <button
                  key={`${opt.value}-${i}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-1.5 text-sm cursor-pointer transition-colors",
                    "text-popover-foreground hover:bg-accent/20",
                    isSelected && "bg-primary/15 text-primary font-medium"
                  )}
                >
                  <Check className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    isSelected ? "opacity-100" : "opacity-0"
                  )} />
                  <span className="truncate">{opt.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/* ============================================================
 *  SimpleSelect — 用于选项少的简单下拉（无搜索）
 * ============================================================ */
interface SimpleSelectProps {
  id?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  children: React.ReactNode
  className?: string
}

function SimpleSelect({ id, value: controlledValue, defaultValue, onValueChange, placeholder, children, className }: SimpleSelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? "")
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  const value = controlledValue ?? uncontrolledValue

  // 从 children 中提取选项
  const options = React.Children.toArray(children)
    .filter(React.isValidElement)
    .map((child) => ({
      value: (child.props as { value: string }).value,
      label: (child.props as { children: React.ReactNode }).children as string,
      disabled: (child.props as { disabled?: boolean }).disabled,
    }))

  const selectedOption = options.find(o => o.value === value && !o.disabled)

  // 点击外部关闭
  React.useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const handleSelect = (optValue: string) => {
    setUncontrolledValue(optValue)
    onValueChange?.(optValue)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className={cn("relative", className)} id={id}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm",
          "ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring",
          "cursor-pointer text-foreground hover:bg-secondary/50 transition-colors"
        )}
      >
        <span className={cn("truncate", !selectedOption && "text-muted-foreground")}>
          {selectedOption?.label ?? placeholder ?? t('common.select')}
        </span>
        <ChevronDown className={cn(
          "ml-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform",
          open && "rotate-180"
        )} />
      </button>

      {open && (
        <div className={cn(
          "absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-lg",
          "animate-in fade-in-0 zoom-in-95 duration-100"
        )}>
          <div className="max-h-[200px] overflow-y-auto py-1 custom-scrollbar" role="listbox">
            {options.map((opt, i) => {
              if (opt.disabled) {
                return (
                  <div key={`${opt.value}-${i}`} className="px-3 py-1.5 text-xs font-semibold text-accent uppercase tracking-wider select-none bg-muted/30">
                    {opt.label}
                  </div>
                )
              }
              const isSelected = opt.value === value
              return (
                <button
                  key={`${opt.value}-${i}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.value)}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-1.5 text-sm cursor-pointer transition-colors",
                    "text-popover-foreground hover:bg-accent/20",
                    isSelected && "bg-primary/15 text-primary font-medium"
                  )}
                >
                  <Check className={cn("h-3.5 w-3.5 shrink-0", isSelected ? "opacity-100" : "opacity-0")} />
                  <span className="truncate">{opt.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/* 保留 SelectOption 给 SimpleSelect 的 children 使用 */
interface SelectOptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {}

function SelectOption(_props: SelectOptionProps) {
  // 仅作为数据载体，不实际渲染 DOM
  return null
}

export { Select, SimpleSelect, SelectOption }
