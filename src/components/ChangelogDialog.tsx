import { useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollText } from 'lucide-react'

interface ChangelogEntry {
  version: string
  date: string
  tag?: 'major' | 'feature' | 'fix' | 'ui'
  items: string[]
}

const changelog: ChangelogEntry[] = [
  {
    version: 'v26.0.7',
    date: '2026-02-22',
    tag: 'feature',
    items: [
      '批量图片选择改为拖拽上传区域，支持拖放和点击选择',
      '已选文件以标签列表展示，支持单个移除和清空全部',
      '多次拖入/选择自动按文件名去重',
    ],
  },
  {
    version: 'v26.0.6',
    date: '2026-02-22',
    tag: 'feature',
    items: [
      'CSV 映射数据新增「导入 CSV」按钮，支持上传 .csv / .txt 文件',
      '导入后自动填入文本框，保留手动编辑功能',
    ],
  },
  {
    version: 'v26.0.5',
    date: '2026-02-22',
    tag: 'ui',
    items: [
      '移动端标签页切换不再卸载子组件，保留上传图片和裁剪状态',
      '裁剪区域和预览 Canvas 改为响应式宽度，小屏不再溢出',
      '移动端标签页和图标按钮触摸区域增大至 40px',
    ],
  },
  {
    version: 'v26.0.4',
    date: '2026-02-22',
    tag: 'feature',
    items: [
      '新增导出格式选择：PNG 无损 / JPEG 有损',
      'JPEG 模式下可调节压缩质量（50%-100%），实时显示百分比',
      '单图下载和批量生成均支持格式和质量设置',
    ],
  },
  {
    version: 'v26.0.3',
    date: '2026-02-22',
    tag: 'fix',
    items: [
      '修复生成头像后修改参数再次生成弹出「请先上传图片」的问题',
      '裁剪图片数据现已缓存至全局状态，切换参数后可重复生成',
      '修复生成按钮点击一次后无法再次点击的问题',
      '修复 Canvas 渲染状态累积导致后续生成异常',
    ],
  },
  {
    version: 'v26.0.2',
    date: '2026-02-22',
    tag: 'fix',
    items: [
      '修复生成图片质量损耗严重的问题，中间编码改为 PNG 无损',
      '启用高质量图片平滑（imageSmoothingQuality: high）',
      '修复裁剪区域图片未占满、靠左留白的问题',
      '修复辅助线样式：从平行线改为交叉十字（红色水平 + 蓝色垂直）',
    ],
  },
  {
    version: 'v26.0.1',
    date: '2026-02-22',
    tag: 'ui',
    items: [
      '下拉框添加自定义暗色滚动条，悬停显示',
      '优化 SEO：添加 Open Graph、Twitter Card、meta 描述和关键词',
    ],
  },
  {
    version: 'v26.0.0',
    date: '2026-02-22',
    tag: 'major',
    items: [
      '项目从原生 HTML + jQuery 全面重构为 Vite 6 + React 19 + TypeScript',
      '使用 Tailwind CSS 4 构建暗色主题 UI',
      '手写全套 UI 组件：Button、Select、Tabs、Dialog、Toast、Slider 等',
      '8 层 Canvas 合成渲染管线（底图→滤镜→国旗→潜力→边框→名称→签名→水印）',
      'react-easy-crop 实现图片裁剪，支持缩放和旋转',
      'React Context + useReducer 全局状态管理',
      '批量生成功能：多图处理 + JSZip 打包下载',
      'CSV 映射支持：文件名→球员名批量对应',
      '响应式布局：桌面三栏 / 移动端标签页',
      'Portal 渲染 Toast 通知系统',
      '部署至 Cloudflare Pages',
    ],
  },
]

const tagStyle: Record<string, string> = {
  major: 'bg-primary/20 text-primary',
  feature: 'bg-emerald-500/20 text-emerald-400',
  fix: 'bg-amber-500/20 text-amber-400',
  ui: 'bg-violet-500/20 text-violet-400',
}

const tagLabel: Record<string, string> = {
  major: '重大更新',
  feature: '新功能',
  fix: '修复',
  ui: 'UI 优化',
}

export default function ChangelogDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
        >
          <ScrollText className="h-3.5 w-3.5" />
          更新日志
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>更新日志</DialogTitle>
        </DialogHeader>

        <div className="mt-4 -mr-2 pr-2 overflow-y-auto custom-scrollbar space-y-6 flex-1">
          {changelog.map((entry) => (
            <div key={entry.version} className="relative pl-4 border-l-2 border-border">
              {/* 时间线圆点 */}
              <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-muted-foreground/60" />

              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-sm font-semibold text-foreground">{entry.version}</span>
                {entry.tag && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${tagStyle[entry.tag]}`}>
                    {tagLabel[entry.tag]}
                  </span>
                )}
                <span className="text-xs text-muted-foreground/60">{entry.date}</span>
              </div>

              <ul className="space-y-1">
                {entry.items.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground leading-relaxed">
                    <span className="text-muted-foreground/40 mr-1.5">-</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
