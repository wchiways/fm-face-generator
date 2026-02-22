import ChangelogDialog from '@/components/ChangelogDialog'

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
      <div className="flex items-center gap-3">
        <img src="/filter/flayus.svg" alt="Flayus Logo" className="h-10" />
        <h1 className="text-lg font-bold text-foreground">
          GZ生成器 <span className="text-xs text-muted-foreground font-normal">V26.0.7</span>
        </h1>
        <ChangelogDialog />
      </div>
      <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
        <span>制作 <a href="http://mrpotato.tistory.com" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Mr.Potato</a></span>
        <span>感谢 <a href="http://fmgunzo.tistory.com" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">FMGUNZO</a></span>
        <span>汉化/二改 <a href="https://chiway.blog" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Chiway Wang</a></span>
      </div>
    </header>
  )
}
