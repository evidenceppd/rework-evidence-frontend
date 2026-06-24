import React from 'react'

const defaultBlock = {
  eyebrow: 'O CENÁRIO',
  headline: 'Muitas empresas investem em marketing, mas as vendas não acompanham.',
  problemOne: 'Falta de alinhamento entre marketing, posicionamento e processo comercial.',
  problemTwo: 'Desperdício de investimento e oportunidades perdidas.',
  problemThree: 'Crescimento travado e metas não alcançadas.',
}

const icons = [
  (
    <svg className="text-red-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ width: '55px', height: '55px' }}>
      <circle cx="10" cy="10" r="8" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 5.5v9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12.5 7.5c-.5-.8-1.3-1-2.5-1-1.5 0-2.5.7-2.5 1.8 0 1 .8 1.5 2.5 1.7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 12c.5.8 1.3 1.3 2.5 1.3 1.5 0 2.5-.7 2.5-1.8 0-1-.8-1.4-2.5-1.7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 14l7 7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21h-5M21 21v-5" />
    </svg>
  ),
  (
    <svg className="text-red-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ width: '55px', height: '55px' }}>
      <circle cx="9" cy="6" r="3" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 20c0-3.314 2.686-6 6-6" />
      <circle cx="16" cy="16" r="4" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 14.5l3 3M17.5 14.5l-3 3" />
    </svg>
  ),
  (
    <svg className="text-red-500" viewBox="0 0 24 24" style={{ width: '55px', height: '55px' }}>
      <rect x="1" y="18" width="4" height="5" rx="0.4" fill="currentColor" />
      <rect x="7" y="13" width="4" height="10" rx="0.4" fill="currentColor" />
      <rect x="13" y="8" width="4" height="15" rx="0.4" fill="currentColor" />
      <path d="M 2 16 L 20 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 16 1 L 20 1 L 20 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
]

export default function Cenario({ block = null }) {
  const content = { ...defaultBlock, ...(block || {}) }
  if (content.eyebrow === 'Contexto') content.eyebrow = defaultBlock.eyebrow
  if (content.headline?.startsWith('O mercado mudou')) content.headline = defaultBlock.headline
  if (!block?.problemOne) content.problemOne = defaultBlock.problemOne
  const problems = [content.problemOne, content.problemTwo, content.problemThree]

  return (
    <section id="cenario" className="bg-white py-20">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <p className="text-red-600 text-xs font-bold tracking-widest uppercase mb-4 whitespace-pre-line" style={{ fontSize: '17px' }}>{content.eyebrow}</p>
            <h2 className="font-poppins md:text-3xl text-[20px] font-bold text-zinc-900 leading-tight mb-6 whitespace-pre-line">
              {content.headline}
            </h2>
            <div className="w-12 h-1 bg-red-600 mx-auto lg:mx-0" />
          </div>

          <div className="flex flex-col sm:flex-row">
            {problems.map((text, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="hidden sm:block w-px self-stretch bg-zinc-200 mx-8" />}
                <div className="flex-1 flex flex-col items-center text-center sm:items-start sm:text-left gap-4 py-4 sm:py-0">
                  <div className="w-14 h-14 flex items-center justify-center">
                    {icons[i]}
                  </div>
                  <p className="text-zinc-800 text-sm leading-relaxed whitespace-pre-line" style={{ fontSize: '17px', fontWeight: 'normal', lineHeight: '22px' }}>
                    {text}
                  </p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
