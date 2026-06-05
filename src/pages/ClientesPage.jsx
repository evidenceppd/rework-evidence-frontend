import { useEffect, useState, useRef } from 'react'
import Footer from '../components/Footer'
import { getPublicSitePage } from '../services/publicSiteContent.service'

/* ── Data ── */
const defaultClients = [
  { id: 1,  name: 'Agroforte Soluções Agrícolas',    description: 'Soluções completas para o agronegócio, com foco em produtividade e inovação.',                                          since: 2021, segment: 'Agronegócio' },
  { id: 2,  name: 'Indumax Indústria e Comércio',     description: 'Indústria especializada em soluções metálicas e componentes para diversos setores.',                                    since: 2020, segment: 'Indústria'   },
  { id: 3,  name: 'Saúde Prime Clínica Especializada',description: 'Clínica médica especializada em oferecer atendimento humanizado e de excelência.',                                     since: 2022, segment: 'Saúde'       },
  { id: 4,  name: 'Ribeirão Saneamento',              description: 'Soluções completas em saneamento para residências, empresas e indústrias.',                                             since: 2021, segment: 'Indústria'   },
  { id: 5,  name: 'Nutrivet Saúde Animal',            description: 'Produtos e soluções para a saúde e o bem-estar animal com alta qualidade.',                                             since: 2021, segment: 'Agronegócio' },
  { id: 6,  name: 'EngePro Construções',              description: 'Construção civil com foco em qualidade, prazos e responsabilidade em cada projeto.',                                    since: 2020, segment: 'Indústria'   },
  { id: 7,  name: 'FlexMaq Equipamentos',             description: 'Máquinas e equipamentos de alta performance para impulsionar a indústria.',                                             since: 2022, segment: 'Indústria'   },
  { id: 8,  name: 'Agroplant Biotecnologia',          description: 'Biotecnologia aplicada ao agronegócio com sementes de alta produtividade e qualidade.',                                 since: 2021, segment: 'Agronegócio' },
  { id: 9,  name: 'Dental Art Odontologia',           description: 'Clínica odontológica especializada em oferecer tratamentos modernos e personalizados.',                                 since: 2023, segment: 'Saúde'       },
  { id: 10, name: 'Connect Tecnologia',               description: 'Soluções tecnológicas que conectam empresas a melhores resultados e eficiência.',                                       since: 2022, segment: 'Tecnologia'  },
  { id: 11, name: 'MediLife Hospitalar',              description: 'Distribuição de produtos hospitalares com qualidade, segurança e agilidade.',                                           since: 2020, segment: 'Saúde'       },
  { id: 12, name: 'Velocitá Logística',               description: 'Logística inteligente e eficiente para otimizar operações e reduzir custos.',                                           since: 2021, segment: 'Serviços'    },
  { id: 13, name: 'Proativa Serviços',                description: 'Terceirização de serviços com foco em qualidade, gestão e excelência operacional.',                                     since: 2022, segment: 'Serviços'    },
  { id: 14, name: 'Impacto Comunicação Visual',       description: 'Soluções visuais que fortalecem marcas e geram impacto no mercado.',                                                    since: 2021, segment: 'Serviços'    },
  { id: 15, name: 'Laborclin Análises Clínicas',      description: 'Laboratório de análises clínicas com precisão, confiança e atendimento humanizado.',                                    since: 2023, segment: 'Saúde'       },
  { id: 16, name: 'Energy Soluções em Energia',       description: 'Soluções em energia solar e elétrica para empresas e residências.',                                                      since: 2022, segment: 'Tecnologia'  },
  { id: 17, name: 'Grupo Ágil',                       description: 'Consultoria e gestão empresarial para transformar negócios e gerar resultados.',                                        since: 2020, segment: 'Serviços'    },
  { id: 18, name: 'Ponto Certo Distribuição',         description: 'Distribuição ágil e eficiente com foco em qualidade e relacionamento duradouro.',                                       since: 2021, segment: 'Comércio'    },
]

function readAdminBlock(blocks, id) {
  return blocks?.find((block) => block.id === id) ?? null
}

function readClientCards(block) {
  if (block?.clientsJson) {
    try {
      const parsed = JSON.parse(block.clientsJson)
      if (Array.isArray(parsed)) {
        const clients = parsed
          .map((item, index) => ({
            id: index + 1,
            name: String(item?.name ?? ''),
            description: String(item?.description ?? ''),
            since: String(item?.since ?? ''),
            segment: String(item?.segment ?? ''),
            imageUrl: typeof item?.imageUrl === 'string' ? item.imageUrl : undefined,
          }))
          .filter((item) => item.name || item.description || item.since || item.segment)
        if (clients.length) return clients
      }
    } catch {
      return defaultClients
    }
  }
  return defaultClients
}

/* ── SVG Placeholders & Icons ── */
function LogoPlaceholder() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="168" height="90" viewBox="0 0 168 90" style={{ flexShrink: 0, width: 'clamp(80px, 18vw, 168px)', height: 'auto' }}>
      <rect width="168" height="90" rx="6" fill="#f4f4f5" stroke="#e4e4e7" strokeWidth="1.5" />
    </svg>
  )
}

function ClientLogo({ client }) {
  if (!client.imageUrl) return <LogoPlaceholder />
  return (
    <div className="grid shrink-0 place-items-center overflow-hidden rounded-md border border-zinc-200 bg-white" style={{ width: 'clamp(80px, 18vw, 168px)', aspectRatio: '168 / 90' }}>
      <img src={client.imageUrl} alt={client.name} className="h-full w-full object-cover" />
    </div>
  )
}

function formatClientSince(since) {
  const text = String(since ?? '').trim()
  if (!text) return ''
  return /^cliente desde/i.test(text) ? text : `Cliente desde ${text}`
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '40px', height: '40px' }}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconBarChart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '40px', height: '40px' }}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}

function IconTarget() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '40px', height: '40px' }}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '40px', height: '40px' }}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function IconCalendarSm() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', flexShrink: 0 }}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}


export function ClientesHeroSection({ heroBlock, preview = false }) {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative bg-zinc-950" style={preview ? { marginBottom: '72px' } : undefined}>
        {/* bg image overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroBlock?.imageUrl || '/2e8498a6-0a0c-474f-9b7f-a6fe475f0613.png'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'right 35%',
            backgroundRepeat: 'no-repeat',
            opacity: 0.35,
          }}
        />
        {/* Hero text */}
        <div className="relative py-16 lg:py-24 max-w-368 mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left" style={{ minHeight: '200px' }}>
          <p className="text-red-600 text-xs font-bold tracking-widest uppercase mb-4" style={{ fontSize: '16px' }}>
            {heroBlock?.eyebrow || 'NOSSOS CLIENTES'}
          </p>
          <h1
            className="font-poppins font-bold text-white leading-tight mb-4 mx-auto lg:mx-0"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)', maxWidth: '726px', lineHeight: '1.2' }}
          >
            {heroBlock?.headline || <>Empresas que confiam<br />na Evidence para <span className="text-red-600">crescer.</span></>}
          </h1>
          <p className="text-zinc-400 mx-auto lg:mx-0" style={{ fontSize: '20px', maxWidth: '457px', lineHeight: '1.6' }}>
            {heroBlock?.description || 'Parcerias construídas com estratégia, compromisso e foco em resultados reais.'}
          </p>
        </div>
        {/* Stats bar — normal flow on mobile, floats at bottom on desktop */}
        <div className="relative z-10 bg-zinc-900 mx-4 lg:mx-0 lg:absolute lg:bottom-[-52px] lg:left-1/2 lg:-translate-x-1/2 lg:w-[calc(100%-64px)] lg:max-w-[1408px]" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px' }}>
          <div className="max-w-368 mx-auto px-8 py-8">
            <div className="grid grid-cols-2 lg:flex lg:flex-row justify-items-center lg:justify-around items-center gap-6 lg:gap-0 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4">
                <div className="text-red-600 shrink-0"><IconUsers /></div>
                <div>
                  <p className="font-poppins font-bold text-white" style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', lineHeight: '1.2' }}>{heroBlock?.statOne || '+20'}</p>
                  <p className="text-zinc-400" style={{ fontSize: '13px' }}>{heroBlock?.statOneLabel || 'empresas atendidas'}</p>
                </div>
              </div>
              <div className="hidden lg:block w-px self-stretch bg-zinc-700" />
              <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4">
                <div className="text-red-600 shrink-0"><IconBarChart /></div>
                <div>
                  <p className="font-poppins font-bold text-white" style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', lineHeight: '1.2' }}>{heroBlock?.statTwo || 'diversos'}</p>
                  <p className="text-zinc-400" style={{ fontSize: '13px' }}>{heroBlock?.statTwoLabel || 'segmentos atendidos'}</p>
                </div>
              </div>
              <div className="hidden lg:block w-px self-stretch bg-zinc-700" />
              <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4">
                <div className="text-red-600 shrink-0"><IconTarget /></div>
                <div>
                  <p className="font-poppins font-bold text-white" style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', lineHeight: '1.2' }}>{heroBlock?.statThree || 'relacionamentos'}</p>
                  <p className="text-zinc-400" style={{ fontSize: '13px' }}>{heroBlock?.statThreeLabel || 'de longo prazo'}</p>
                </div>
              </div>
              <div className="hidden lg:block w-px self-stretch bg-zinc-700" />
              <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-4">
                <div className="text-red-600 shrink-0"><IconCalendar /></div>
                <div>
                  <p className="font-poppins font-bold text-white" style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', lineHeight: '1.2' }}>{heroBlock?.statFour || 'desde 2020'}</p>
                  <p className="text-zinc-400" style={{ fontSize: '13px' }}>{heroBlock?.statFourLabel || 'gerando resultados'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export function ClientesGridSection({ clients, compact = false }) {
  const [activeSegment, setActiveSegment] = useState('Todos os segmentos')
  const filterScrollRef = useRef(null)
  const segments = ['Todos os segmentos', ...Array.from(new Set(clients.map((client) => client.segment).filter(Boolean)))]

  const scrollFilters = (dir) => {
    if (filterScrollRef.current) {
      filterScrollRef.current.scrollBy({ left: dir * 160, behavior: 'smooth' })
    }
  }

  const filtered = activeSegment === 'Todos os segmentos'
    ? clients
    : clients.filter(c => c.segment === activeSegment)

  return (
    <>
      {/* ── FILTERS + GRID ── */}
      <section className={compact ? 'bg-white pt-8 pb-8' : 'bg-white pt-8 lg:pt-[120px] pb-12 lg:pb-16'}>
        <div className="max-w-368 mx-auto px-4 sm:px-6 lg:px-8">

          {/* Filter tabs */}
          <div className={`relative flex items-center gap-2 ${compact ? 'mb-6' : 'mb-10'}`}>
            {/* Arrow left */}
            <button
              onClick={() => scrollFilters(-1)}
              className="lg:hidden shrink-0 flex items-center justify-center w-9 h-9 rounded-full border border-zinc-300 bg-white text-zinc-600 hover:border-zinc-500 transition-colors duration-200"
              aria-label="Anterior"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Scrollable row */}
            <div
              ref={filterScrollRef}
              className="flex flex-1 overflow-x-auto"
              style={{ gap: '10px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {segments.map(seg => (
                <button
                  key={seg}
                  onClick={() => setActiveSegment(seg)}
                  className={`cursor-pointer shrink-0 text-sm font-medium border transition-colors duration-200 ${
                    activeSegment === seg
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-zinc-600 border-zinc-300 hover:border-zinc-500'
                  }`}
                  style={{ fontSize: '15px', borderRadius: '5px', padding: '11px 24px', whiteSpace: 'nowrap' }}
                >
                  {seg}
                </button>
              ))}
            </div>

            {/* Arrow right */}
            <button
              onClick={() => scrollFilters(1)}
              className="lg:hidden shrink-0 flex items-center justify-center w-9 h-9 rounded-full border border-zinc-300 bg-white text-zinc-600 hover:border-zinc-500 transition-colors duration-200"
              aria-label="Próximo"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(client => (
              <div key={client.id} className="flex flex-col border border-zinc-200 rounded-lg bg-white overflow-hidden">
                <div className="flex flex-col xl:flex-row gap-3 xl:gap-4 p-5 flex-1 items-center xl:items-start text-center xl:text-left">
                  <ClientLogo client={client} />
                  <div className="flex flex-col justify-center min-w-0">
                    <p className="font-poppins font-bold text-zinc-900 mb-1" style={{ fontSize: '14px', lineHeight: '1.3' }}>
                      {client.name}
                    </p>
                    <p className="text-zinc-500" style={{ fontSize: '13px', lineHeight: '1.5' }}>
                      {client.description}
                    </p>
                  </div>
                </div>
                <div className="border-t border-zinc-100 px-5 py-3 flex items-center justify-center xl:justify-start gap-2">
                  <div className="text-zinc-400"><IconCalendarSm /></div>
                  <p className="text-zinc-400" style={{ fontSize: '13px' }}>{formatClientSince(client.since)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export function ClientesCtaSection({ ctaBlock }) {

  return (
    <>
      {/* ── CTA ── */}
      <section className="bg-zinc-950 border-t border-zinc-800 py-8" style={{ border: 'medium', background: 'white', padding: '0px 16px 64px' }}>
        <div className="max-w-384 mx-auto px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-zinc-950)', maxWidth: '1408px', padding: 'clamp(28px, 4vw, 55px)', borderRadius: '9px' }}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-6 items-center lg:items-stretch" style={{ alignItems: 'center' }}>

            {/* Logo SVG */}
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

            {/* Divider */}
            <div className="hidden lg:block self-stretch w-px min-h-[48px]" style={{ backgroundColor: 'rgb(220, 38, 38)' }} />

            {/* Text */}
            <div className="flex-1 lg:max-w-xl text-center lg:text-left w-full" style={{ maxWidth: '690px' }}>
              <h2 className="font-poppins font-bold text-white mb-3 leading-tight text-2xl sm:text-3xl lg:text-[29px]">
                {ctaBlock?.headline || 'Sua empresa pode ser a próxima'}
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed" style={{ fontSize: '18px', maxWidth: '550px' }}>
                {ctaBlock?.description || 'Chamada para contato depois da lista de clientes.'}
              </p>
            </div>

            <div className="hidden lg:block self-stretch w-px min-h-[48px]" />

            {/* CTA button */}
            <div className="flex flex-col items-center lg:items-stretch gap-4 shrink-0 w-full lg:w-auto">
              <a
                href={ctaBlock?.buttonHref || '#contato'}
                className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide px-8 py-4 transition-colors duration-200 flex items-center justify-between gap-2"
                style={{ borderRadius: '4px', fontSize: '15px' }}
              >
                {ctaBlock?.buttonPrimary || 'RECEBER ANÁLISE'}
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '22px', height: '22px', flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

/* ?? Page ?? */
export default function ClientesPage() {
  const [adminData, setAdminData] = useState(null)
  useEffect(() => {
    getPublicSitePage('content-clientes').then(setAdminData)
  }, [])

  const adminBlocks = adminData?.blocks ?? null
  const heroBlock = readAdminBlock(adminBlocks, 'hero')
  const clientsBlock = readAdminBlock(adminBlocks, 'logos')
  const ctaBlock = readAdminBlock(adminBlocks, 'cta')
  const clients = readClientCards(clientsBlock)

  return (
    <>
      <main style={{ marginTop: '90px' }}>
        <ClientesHeroSection heroBlock={heroBlock} />
        <ClientesGridSection clients={clients} />
        <ClientesCtaSection ctaBlock={ctaBlock} />
      </main>
      <Footer />
    </>
  )
}
