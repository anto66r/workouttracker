import { useI18n, LANGUAGES } from './i18n'

export default function LanguageSelector() {
  const { lang, setLang, t } = useI18n()

  return (
    <div className="lang-switch" role="group" aria-label={t('app.language')}>
      {LANGUAGES.map(l => (
        <button
          key={l.code}
          type="button"
          className={`lang-btn${lang === l.code ? ' active' : ''}`}
          aria-pressed={lang === l.code}
          onClick={() => setLang(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
