const defaultBlock = {
  eyebrow: 'COMO A EVIDENCE ATUA',
  headline: 'Unimos marketing e estratégia comercial para transformar esforço em resultado.',
  description: 'Nosso trabalho começa entendendo o cenário e o que está limitando o crescimento. A partir disso, estruturamos frentes que impactam diretamente suas vendas.',
  featureOne: 'Marketing estratégico para atrair o cliente certo',
  featureTwo: 'Geração de demanda qualificada para o seu time comercial',
  featureThree: 'Ajuste no processo comercial para aumentar a conversão',
  imageUrl: '/mesa.webp',
}

export default function ComoAtuamos({ block = null }) {
  const content = { ...defaultBlock, ...(block || {}) }
  if (content.eyebrow === 'Como atuamos') content.eyebrow = defaultBlock.eyebrow
  if (content.headline === 'Estratégia, execução e dados trabalhando juntos') content.headline = defaultBlock.headline
  if (content.description === 'Mostra os pilares da atuação da agência.') content.description = defaultBlock.description
  const items = [content.featureOne, content.featureTwo, content.featureThree].filter(Boolean)

  return (
    <section id="como-trabalhamos" className="bg-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
        <div className="flex justify-end">
          <div className="w-full max-w-[768px] py-20 px-4 sm:px-6 lg:px-8">
            <p className="text-red-600 text-xs font-bold tracking-widest uppercase mb-3 text-center lg:text-left whitespace-pre-line" style={{ fontSize: '16px', fontWeight: 700 }}>
              {content.eyebrow}
            </p>
            <h2 className="font-poppins md:text-3xl text-[20px] font-bold text-zinc-900 leading-tight mb-6 text-center lg:text-left whitespace-pre-line" style={{ maxWidth: '580px' }}>
              {content.headline}
            </h2>
            <p className="text-zinc-600 text-sm leading-relaxed mb-8 text-center lg:text-left whitespace-pre-line" style={{ fontSize: '16px', maxWidth: '510px' }}>
              {content.description}
            </p>

            <ul className="flex flex-col gap-4 mb-10 mx-auto sm:mx-0" style={{ maxWidth: '291px', width: '100%' }}>
              {items.map((item, i) => (
                <li key={i} className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-2 sm:gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-red-600 shrink-0 sm:mt-0.5" fill="currentColor" style={{ width: '22px', height: '22px' }}>
                    <path d="M12 1.25A10.75 10.75 0 1 0 22.75 12 10.762 10.762 0 0 0 12 1.25zm4.74 8.423-5 5.5a1.01 1.01 0 0 1-.716.327H11a1.005 1.005 0 0 1-.707-.293l-3-3a1 1 0 1 1 1.414-1.414l2.258 2.258 4.295-4.724A1.008 1.008 0 0 1 16 8.001a1 1 0 0 1 .74 1.672z" />
                  </svg>
                  <span className="text-zinc-700 text-sm whitespace-pre-line" style={{ fontSize: '16px' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="min-h-[400px] lg:min-h-0">
          <img
            src={content.imageUrl || defaultBlock.imageUrl}
            alt="Dashboard Evidence"
            className="w-full h-full object-cover object-center"
            style={{ objectPosition: 'center center' }}
          />
        </div>
      </div>
    </section>
  )
}
