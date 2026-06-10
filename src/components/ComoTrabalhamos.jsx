import React from 'react'

const defaultBlock = {
  eyebrow: 'COMO TRABALHAMOS',
  stepOneTitle: 'ANÁLISE DO CENÁRIO',
  stepOneText: 'Entendemos seu momento, seus desafios e avaliamos seus canais e resultados atuais.',
  stepTwoTitle: 'PLANEJAMENTO E EXECUÇÃO',
  stepTwoText: 'Criamos um plano personalizado e colocamos em prática com foco em demanda e conversão.',
  stepThreeTitle: 'ACOMPANHAMENTO E EVOLUÇÃO',
  stepThreeText: 'Monitoramos indicadores, ajustamos rotas e evoluímos continuamente os resultados.',
}

function StepIcon({ type }) {
  if (type === 'analysis') {
    return (
      <div className="flex items-center justify-center shrink-0 mt-2" style={{ width: 'auto', height: 'auto' }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 682.667 682.667"
          className="w-4 h-4 text-zinc-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="30"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          style={{ width: '45px', height: '45px' }}
        >
          <g transform="matrix(1.33333 0 0 -1.33333 0 682.667)">
            <path d="M0 0h-100v100Z" transform="translate(375 397)" />
          </g>
          <path d="M0 0h170" transform="matrix(1.33333 0 0 -1.33333 100 233.333)" />
          <path d="M0 0h130" transform="matrix(1.33333 0 0 -1.33333 100 313.333)" />
          <path d="M0 0h130" transform="matrix(1.33333 0 0 -1.33333 100 393.333)" />
          <path d="M0 0h130" transform="matrix(1.33333 0 0 -1.33333 100 473.333)" />
          <g transform="matrix(1.33333 0 0 -1.33333 0 682.667)">
            <path d="M0 0c35.146-35.147 35.146-92.132 0-127.279-35.147-35.147-92.133-35.147-127.279 0-35.148 35.147-35.148 92.132 0 127.279C-92.133 35.147-35.147 35.147 0 0Z" transform="translate(412.147 290.64)" />
            <path d="m0 0-84.853 84.853" transform="translate(497 78.508)" />
            <path d="M0 0v83.987l-99.996 100H-320c-22.092 0-40-17.909-40-40v-402c0-22.091 17.908-40 40-40h280c22.092 0 40 17.909 40 40v85.987" transform="translate(375 313.013)" />
          </g>
        </svg>
      </div>
    )
  }

  if (type === 'growth') {
    return (
      <div className="flex items-center justify-center shrink-0 mt-2" style={{ width: 'auto', height: 'auto' }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="w-4 h-4 text-zinc-400"
          fill="currentColor"
          style={{ width: '45px', height: '45px' }}
        >
          <path d="M3 24a1.059 1.059 0 0 0 .136-.009 77.375 77.375 0 0 0 21.274-6.079A77.1 77.1 0 0 0 43.248 5.884l-1.218 4.874a1 1 0 0 0 .727 1.212A1.025 1.025 0 0 0 43 12a1 1 0 0 0 .969-.758l2-8A1 1 0 0 0 45 2h-8a1 1 0 0 0 0 2h5.369A75.2 75.2 0 0 1 23.59 16.088a75.363 75.363 0 0 1-20.725 5.921A1 1 0 0 0 3 24zM45 44h-1V17a1 1 0 0 0-1-1H33a1 1 0 0 0-1 1v27h-2V23a1 1 0 0 0-1-1H19a1 1 0 0 0-1 1v21h-2V29a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v15H3a1 1 0 0 0 0 2h42a1 1 0 0 0 0-2zM34 18h8v26h-8zm-14 6h8v20h-8zM6 30h8v14H6z" />
        </svg>
      </div>
    )
  }

  return null
}

export default function ComoTrabalhamos({ block = null }) {
  const content = { ...defaultBlock, ...(block || {}) }
  if (content.eyebrow === 'Processo' || content.eyebrow === 'Como trabalhamos') content.eyebrow = defaultBlock.eyebrow
  const steps = [
    { num: '1', title: content.stepOneTitle, desc: content.stepOneText, icon: 'analysis' },
    { num: '2', title: content.stepTwoTitle, desc: content.stepTwoText },
    { num: '3', title: content.stepThreeTitle, desc: content.stepThreeText, icon: 'growth' },
  ]

  return (
    <section className="bg-zinc-950 py-8 border-t border-zinc-800">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-red-500 text-xs font-bold tracking-widest uppercase mb-6 text-center whitespace-pre-line" style={{ fontSize: '18px' }}>
          {content.eyebrow}
        </p>

        <div className="flex flex-col min-[802px]:flex-row items-stretch gap-6 min-[802px]:gap-0">
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div className="flex-1 py-4">
                <div className="flex flex-col items-center text-center min-[802px]:flex-row min-[802px]:items-start min-[802px]:text-left gap-4">
                  <span className="font-poppins text-6xl font-bold text-red-600 leading-none shrink-0">{step.num}</span>
                  <StepIcon type={step.icon} />
                  <div>
                    <h3 className="font-poppins text-sm font-bold text-white tracking-wide mb-2 whitespace-pre-line">{step.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">{step.desc}</p>
                  </div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div key={`arrow-${i}`} className="hidden min-[802px]:flex items-center px-2 text-zinc-600 shrink-0 self-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" style={{ width: '70px', height: '70px', transform: 'rotate(-90deg)' }} fill="currentColor">
                    <path d="M64 88a3.988 3.988 0 0 1-2.828-1.172l-40-40c-1.563-1.563-1.563-4.094 0-5.656s4.094-1.563 5.656 0L64 78.344l37.172-37.172c1.563-1.563 4.094-1.563 5.656 0s1.563 4.094 0 5.656l-40 40A3.988 3.988 0 0 1 64 88z" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
