const defaultBlock = {
  headline: 'Marketing que gera demanda.\nEstratégia que gera vendas.',
  description: 'A Agência Evidence ajuda empresas a atrair os clientes certos, fortalecer sua presença e aumentar a conversão comercial de forma consistente.',
  buttonPrimary: 'RECEBER ANÁLISE',
  buttonSecondary: 'VER COMO FUNCIONA',
  imageUrl: '/banner-home.png',
  statOne: 'Foco em geração de demanda qualificada',
  statTwo: 'Estratégias alinhadas com seu processo comercial',
  statThree: 'Mais oportunidades e conversões para sua empresa',
}

function splitHeadline(headline) {
  const text = headline || defaultBlock.headline
  if (text.includes('\n')) {
    const [first, ...rest] = text.split('\n')
    return { first, second: rest.join(' ') }
  }

  const marker = 'Estratégia'
  const index = text.indexOf(marker)
  if (index > 0) {
    return { first: text.slice(0, index).trim(), second: text.slice(index).trim() }
  }

  return { first: text, second: '' }
}

export default function Hero({ block = null }) {
  const content = { ...defaultBlock, ...(block || {}) }
  const splitTitle = splitHeadline(content.headline)
  const first = splitTitle.first
  const second = content.eyebrow || splitTitle.second
  const stats = [content.statOne, content.statTwo, content.statThree]

  return (
    <section
      id="inicio"
      className="relative h-screen bg-black flex items-center sm:pt-[76px]"
      style={{ paddingTop: 0 }}
    >
      <div className="absolute inset-0">
        <img src={content.imageUrl || defaultBlock.imageUrl} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:py-20 lg:py-28 w-full [@media(max-height:710px)]:flex [@media(max-height:710px)]:flex-col [@media(max-height:710px)]:justify-between [@media(max-height:710px)]:pb-6 [@media(max-height:710px)]:h-full" style={{ paddingTop: 0 }}>
        <div className="[@media(max-height:710px)]:flex [@media(max-height:710px)]:items-center [@media(max-height:710px)]:flex-1">
          <div
            className="max-w-2xl mx-auto sm:mx-0 text-center sm:text-left [@media(max-height:710px)]:h-[calc(100vh-90px)] [@media(max-height:710px)]:flex [@media(max-height:710px)]:flex-col [@media(max-height:710px)]:justify-center"
          >
            <h1 className="font-poppins text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-2 whitespace-pre-line">
              {first}
            </h1>
            {second && (
              <h2 className="font-poppins text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-red-500 leading-tight mb-6 whitespace-pre-line">
                {second}
              </h2>
            )}
            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 max-w-xl whitespace-pre-line">
              {content.description || defaultBlock.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:justify-start">
              <a
                href={content.buttonHref || '#contato'}
                className="cursor-pointer inline-flex w-full max-w-[288px] items-center justify-center gap-2 self-center bg-red-600 px-6 py-4 text-center text-sm font-bold sm:text-left tracking-wide text-white transition-colors duration-200 hover:bg-red-700 sm:w-auto sm:min-w-[256px] sm:max-w-[360px] sm:self-auto whitespace-pre-line"
              >
                {content.buttonPrimary || defaultBlock.buttonPrimary}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href={content.buttonSecondaryHref || '#como-trabalhamos'}
                className="cursor-pointer inline-flex w-full max-w-[288px] items-center justify-center gap-2 self-center border border-white/30 px-6 py-4 text-center text-sm font-semibold sm:text-left tracking-wide text-white transition-colors duration-200 hover:border-white/60 sm:w-auto sm:min-w-[224px] sm:max-w-[320px] sm:self-auto whitespace-pre-line"
              >
                {content.buttonSecondary || defaultBlock.buttonSecondary}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-16 flex flex-row gap-4 sm:gap-8 items-start justify-center sm:justify-start [@media(max-height:710px)]:mt-0">
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-2 sm:gap-3 flex-1 sm:flex-none">
            <div className="shrink-0">
              <svg className="text-red-500 w-10 h-10 sm:w-[50px] sm:h-[50px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5V21h4V13.5H3zm7-6V21h4V7.5h-4zm7 3V21h4V10.5h-4z" />
              </svg>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px] sm:text-[14px] whitespace-pre-line" style={{ lineHeight: '18px', maxWidth: '113px' }}>{stats[0] || defaultBlock.statOne}</p>
          </div>

          <div className="w-px self-stretch bg-zinc-700" />

          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-2 sm:gap-3 flex-1 sm:flex-none">
            <div className="shrink-0">
              <svg className="text-red-500 w-10 h-10 sm:w-[50px] sm:h-[50px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px] sm:text-[14px] whitespace-pre-line" style={{ lineHeight: '18px', maxWidth: '130px' }}>{stats[1] || defaultBlock.statTwo}</p>
          </div>

          <div className="w-px self-stretch bg-zinc-700" />

          <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-2 sm:gap-3 flex-1 sm:flex-none">
            <div className="shrink-0">
              <svg className="text-red-500 w-10 h-10 sm:w-[50px] sm:h-[50px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px] sm:text-[14px] whitespace-pre-line" style={{ lineHeight: '18px', maxWidth: '132px' }}>{stats[2] || defaultBlock.statThree}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
