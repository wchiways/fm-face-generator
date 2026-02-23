import { useTranslation } from 'react-i18next'
import ChangelogDialog from '@/components/ChangelogDialog'

const LANGS = ['zh', 'en', 'es'] as const

export default function Header() {
  const { t, i18n } = useTranslation()

  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('lang', lng)
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
      <div className="flex items-center gap-3">
        <img src="/filter/flayus.svg" alt="Flayus Logo" className="h-10" />
        <h1 className="text-lg font-bold text-foreground">
          {t('header.title')} <span className="text-xs text-muted-foreground font-normal">V26.0.9</span>
        </h1>
        <ChangelogDialog />
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
          <span>{t('header.madeBy')} <a href="http://mrpotato.tistory.com" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Mr.Potato</a></span>
          <span>{t('header.thanks')} <a href="http://fmgunzo.tistory.com" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">FMGUNZO</a></span>
          <span>{t('header.localized')} <a href="https://chiway.blog" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Chiway Wang</a></span>
        </div>
        <div className="flex items-center rounded-md border border-border overflow-hidden">
          {LANGS.map((lng) => (
            <button
              key={lng}
              type="button"
              onClick={() => changeLang(lng)}
              className={`px-2 py-1 text-xs font-medium transition-colors cursor-pointer ${
                i18n.language === lng
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              {lng.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
