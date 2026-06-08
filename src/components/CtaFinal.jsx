const defaultBlock = {
  headline: 'Quer resultados como esses na sua empresa?',
  description: 'Fale com nossos especialistas e descubra o que podemos fazer pelo seu crescimento.',
  buttonPrimary: 'RECEBER ANÁLISE',
  buttonHref: '#contato',
}

export default function CtaFinal({ block = null }) {
  const content = { ...defaultBlock, ...(block || {}) }

  return (
    <section
      className="bg-zinc-950 border-t border-zinc-800 py-8"
      style={{ border: 'medium', background: 'white', padding: '0px 16px 64px' }}
    >
      <div
        className="max-w-384 mx-auto px-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: 'var(--color-zinc-950)',
          maxWidth: '1472px',
          padding: 'clamp(28px, 4vw, 55px)',
          borderRadius: '9px',
        }}
      >
        <div
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-6 items-center lg:items-stretch"
          style={{ alignItems: 'center' }}
        >
          <div className="shrink-0">
            <svg width="587" height="587" viewBox="0 0 587 587" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-20 lg:h-[133px] w-auto">
              <g clipPath="url(#clip0_3004_2)">
                <path d="M406.163 553.363V180.971H33.7717V318.658H268.476V553.363H406.163Z" stroke="#CB2C30" strokeWidth="9" />
                <path d="M582.194 524.021V4.94043H63.1139V142.629H444.505V524.021H582.194Z" stroke="#CB2C30" strokeWidth="9" />
                <path d="M230.133 582.704V357H4.42932V582.704H230.133Z" stroke="#CB2C30" strokeWidth="9" />
              </g>
              <defs>
                <clipPath id="clip0_3004_2">
                  <rect width="587" height="587" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>

          <div className="hidden lg:block self-stretch w-px min-h-[48px]" style={{ backgroundColor: 'rgb(220, 38, 38)' }} />

          <div className="flex-1 lg:max-w-xl text-center lg:text-left w-full" style={{ maxWidth: '690px' }}>
            <h2 className="font-poppins font-bold text-white mb-3 leading-tight text-2xl sm:text-3xl lg:text-[29px] whitespace-pre-line">
              {content.headline}
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line" style={{ fontSize: '18px', maxWidth: '550px' }}>
              {content.description}
            </p>
          </div>

          <div className="flex flex-col items-center lg:items-stretch gap-4 shrink-0 w-full lg:w-auto">
            <a
              href={content.buttonHref || defaultBlock.buttonHref}
              className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide px-8 py-4 transition-colors duration-200 flex items-center justify-between gap-2"
              style={{ borderRadius: '4px', fontSize: '15px' }}
            >
              {content.buttonPrimary || defaultBlock.buttonPrimary}
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '22px', height: '22px', flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
