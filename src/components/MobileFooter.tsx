import { Button } from '@/components/ui/button'
import { Wand2, Download } from 'lucide-react'

interface MobileFooterProps {
  onGenerate: () => void
  onDownload: () => void
}

export default function MobileFooter({ onGenerate, onDownload }: MobileFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex gap-2 p-3 bg-card border-t border-border md:hidden z-50">
      <Button onClick={onGenerate} className="flex-1 gap-2">
        <Wand2 className="h-4 w-4" />
        生成头像
      </Button>
      <Button variant="secondary" onClick={onDownload} className="flex-1 gap-2">
        <Download className="h-4 w-4" />
        下载图片
      </Button>
    </div>
  )
}
