import { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import { getPublicSitePage } from '../services/publicSiteContent.service'

/* Data */
const defaultTestimonials = [
  {
    id: 1,
    quote: 'A Evidence reorganizou nosso marketing e nos ajudou a gerar oportunidades com muito mais qualidade. Nosso time comercial nunca teve leads tão prontos para a compra.',
    name: 'João Paulo B.',
    company: 'Agroforte Soluções Agrícolas',
    since: '2021',
  },
  {
    id: 2,
    quote: 'Tivemos um aumento significativo na geração de leads e na taxa de conversão. O processo ficou muito mais previsível.',
    name: 'Mariana T.',
    company: 'Indumax Indústria e Comércio',
    since: '2022',
  },
  {
    id: 3,
    quote: 'A equipe entendeu nosso negócio e trouxe uma estratégia que realmente fez diferença no faturamento.',
    name: 'Ricardo A.',
    company: 'Ribeirão Ferramentas',
    since: '2021',
  },
  {
    id: 4,
    quote: 'Organizaram nosso marketing, alinharam com o comercial e os resultados apareceram de forma consistente.',
    name: 'Juliana P.',
    company: 'Saúde Prime Clínica Especializada',
    since: '2023',
  },
  {
    id: 5,
    quote: 'O trabalho da Evidence trouxe clareza para o nosso posicionamento e aumentou muito a qualidade das oportunidades que recebemos.',
    name: 'Fernando C.',
    company: 'Nutrivet Saúde Animal',
    since: '2022',
  },
  {
    id: 6,
    quote: 'Mais do que uma agência, se tornaram parceiros estratégicos do nosso crescimento.',
    name: 'Leonardo S.',
    company: 'Engepro Construções',
    since: '2021',
  },
]

function readAdminBlock(blocks, id) {
  return blocks?.find((block) => block.id === id) ?? null
}

function readTestimonials(block) {
  if (block?.testimonialsJson) {
    try {
      const parsed = JSON.parse(block.testimonialsJson)
      if (Array.isArray(parsed)) {
        const testimonials = parsed
          .map((item, index) => ({
            id: index + 1,
            quote: String(item?.quote ?? ''),
            name: String(item?.name ?? ''),
            company: String(item?.company ?? ''),
            since: String(item?.since ?? ''),
            video: String(item?.video ?? item?.videoLink ?? ''),
          }))
          .filter((item) => item.quote || item.name || item.company || item.since || item.video)
        if (testimonials.length) return testimonials
      }
    } catch {
      return defaultTestimonials
    }
  }
  return defaultTestimonials
}

function formatClientSince(since) {
  const text = String(since ?? '').trim()
  if (!text) return ''
  return /^cliente desde/i.test(text) ? text : `Cliente desde ${text}`
}

function makeStats(heroBlock) {
  return [
    {
      maxWidth: '175px',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '45px', height: '45px' }}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      value: heroBlock?.statOne || '+20',
      label: heroBlock?.statOneLabel || 'empresas atendidas',
    },
    {
      maxWidth: '175px',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{ width: '45px', height: '45px' }} fill="currentColor">
          <path d="M488.399 492h-21.933V173.536c0-14.823-12.06-26.882-26.882-26.882H390.56c-14.823 0-26.882 12.06-26.882 26.882V492h-55.692V317.825c0-14.823-12.059-26.882-26.882-26.882H232.08c-14.823 0-26.882 12.06-26.882 26.882V492h-55.692v-90.204c0-14.823-12.06-26.882-26.882-26.882H73.599c-14.823 0-26.882 12.06-26.882 26.882V492H23.601c-5.523 0-10 4.477-10 10s4.477 10 10 10h464.798c5.523 0 10-4.477 10-10s-4.477-10-10-10zm-358.895 0H66.716v-90.204a6.89 6.89 0 0 1 6.882-6.882h49.024a6.89 6.89 0 0 1 6.882 6.882V492zm158.481 0h-62.788V317.825a6.89 6.89 0 0 1 6.882-6.882h49.024a6.89 6.89 0 0 1 6.882 6.882V492zm158.481 0h-62.788V173.536a6.89 6.89 0 0 1 6.882-6.882h49.024a6.89 6.89 0 0 1 6.882 6.882V492zM466.442 10.516A9.965 9.965 0 0 0 455.95.024c-.161-.007-.32-.024-.484-.024h-60.5c-5.523 0-10 4.477-10 10s4.477 10 10 10h37.357l-98.857 98.858-37.28-37.28a10.001 10.001 0 0 0-14.142 0l-179.769 179.77c-3.905 3.905-3.905 10.237 0 14.143 1.953 1.951 4.512 2.927 7.071 2.927s5.119-.976 7.071-2.929L289.115 102.79l37.28 37.28c3.905 3.905 10.237 3.905 14.143 0L446.466 34.143v33.81c0 5.523 4.477 10 10 10s10-4.477 10-10V11c0-.163-.017-.322-.024-.484z" />
          <circle cx="75.64" cy="303.31" r="10" />
        </svg>
      ),
      value: heroBlock?.statTwo || 'milhões',
      label: heroBlock?.statTwoLabel || 'em vendas geradas',
    },
    {
      maxWidth: '185px',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: '45px', height: '45px' }} fill="currentColor">
          <path d="M10 24C4.5 24 0 19.5 0 14S4.5 4 10 4s10 4.5 10 10-4.5 10-10 10zm0-19c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9z" />
          <path d="M10 20.5c-3.6 0-6.5-2.9-6.5-6.5S6.4 7.5 10 7.5s6.5 2.9 6.5 6.5-2.9 6.5-6.5 6.5zm0-12C7 8.5 4.5 11 4.5 14S7 19.5 10 19.5s5.5-2.5 5.5-5.5S13 8.5 10 8.5z" />
          <path d="M10 17c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zm0-5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          <path d="M10 14.5c-.1 0-.3 0-.4-.1-.2-.2-.2-.5 0-.7l7.5-7.5c.2-.2.5-.2.7 0s.2.5 0 .7l-7.5 7.5c0 .1-.2.1-.3.1z" />
          <path d="M20 7h-2.5c-.3 0-.5-.2-.5-.5V4c0-.1.1-.3.1-.4L20.6.1c.2-.1.4-.1.6-.1.2.1.3.3.3.5v2h2c.2 0 .4.1.5.3 0 .2 0 .4-.1.6l-3.5 3.5c-.1 0-.3.1-.4.1zm-2-1h1.8l2.5-2.5H21c-.3 0-.5-.2-.5-.5V1.7L18 4.2z" />
        </svg>
      ),
      value: heroBlock?.statThree || 'diversos',
      label: heroBlock?.statThreeLabel || 'segmentos atendidos',
    },
    {
      maxWidth: '195px',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" style={{ width: '45px', height: '45px' }} fill="currentColor">
          <path d="M53.933 10.617h-2.38v-3.11a3.508 3.508 0 0 0-7.016 0v3.11H35.59v-3.11a3.508 3.508 0 1 0-7.016 0v3.11h-8.947v-3.11a3.508 3.508 0 1 0-7.016 0v3.11h-2.544a5.345 5.345 0 0 0-5.319 5.358v38.667A5.345 5.345 0 0 0 10.068 60h43.865a5.345 5.345 0 0 0 5.319-5.358V15.975a5.345 5.345 0 0 0-5.32-5.358zm-7.396-3.11a1.508 1.508 0 0 1 3.016 0v3.11h-3.016zm-15.963 0a1.508 1.508 0 0 1 3.016 0v3.11h-3.016zm-15.963 0a1.508 1.508 0 0 1 3.016 0v3.11H14.61zm-4.544 5.11h2.544v1.934a3.526 3.526 0 0 0 4.658 3.315 1 1 0 0 0-.655-1.89 1.517 1.517 0 0 1-2.003-1.425v-1.934h13.963v1.934a3.512 3.512 0 0 0 3.508 3.508c.861.043 2.122-.382 1.768-1.465a1 1 0 0 0-1.273-.617 1.517 1.517 0 0 1-2.003-1.426v-1.934h13.963v1.934a3.526 3.526 0 0 0 4.657 3.315 1 1 0 0 0-.654-1.89 1.516 1.516 0 0 1-2.003-1.425v-1.934h7.396a3.343 3.343 0 0 1 3.319 3.358v5.035a.972.972 0 0 0-.49-.146l-50.014.052v-4.94a3.343 3.343 0 0 1 3.32-3.36zM53.933 58H10.067a3.343 3.343 0 0 1-3.319-3.358V22.916l50.016-.052a.973.973 0 0 0 .488-.146v31.924A3.343 3.343 0 0 1 53.932 58z" />
          <path d="M20.063 27.505h-6.452a1 1 0 0 0-1 1v5.828a1 1 0 0 0 1 1h6.452a1 1 0 0 0 1-1v-5.828a1 1 0 0 0-1-1zm-1 5.828h-4.452v-3.828h4.452zM34.253 27.505H27.8a1 1 0 0 0-1 1v5.828a1 1 0 0 0 1 1h6.452a1 1 0 0 0 1-1v-5.828a1 1 0 0 0-1-1zm-1 5.828H28.8v-3.828h4.452zM48.442 27.505H41.99a1 1 0 0 0-1 1v5.828a1 1 0 0 0 1 1h6.453a1 1 0 0 0 1-1v-5.828a1 1 0 0 0-1-1zm-1 5.828H42.99v-3.828h4.453zM20.063 41.694h-6.452a1 1 0 0 0-1 1v5.828a1 1 0 0 0 1 1h6.452a1 1 0 0 0 1-1v-5.828a1 1 0 0 0-1-1zm-1 5.828h-4.452v-3.828h4.452zM34.253 41.694H27.8a1 1 0 0 0-1 1v5.828a1 1 0 0 0 1 1h6.452a1 1 0 0 0 1-1v-5.828a1 1 0 0 0-1-1zm-1 5.828H28.8v-3.828h4.452zM48.442 41.694H41.99a1 1 0 0 0-1 1v5.828a1 1 0 0 0 1 1h6.453a1 1 0 0 0 1-1v-5.828a1 1 0 0 0-1-1zm-1 5.828H42.99v-3.828h4.453z" />
        </svg>
      ),
      value: heroBlock?.statFour || 'desde 2020',
      label: heroBlock?.statFourLabel || 'gerando resultados',
    },
  ]
}

/* Video Placeholder */
function getYoutubeEmbedUrl(url) {
  const value = String(url ?? '').trim()
  if (!value) return ''
  const match = value.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : ''
}

function VideoBg({ video }) {
  const embedUrl = getYoutubeEmbedUrl(video)
  if (embedUrl) {
    return (
      <div className="w-full sm:w-[280px] shrink-0 bg-zinc-200" style={{ minHeight: '220px' }}>
        <iframe
          src={embedUrl}
          title="V?deo do depoimento"
          className="h-full min-h-[220px] w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    )
  }
  return (
    <div className="w-full sm:w-[280px] shrink-0" style={{ minHeight: '220px' }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', minHeight: '220px', display: 'block' }}
        preserveAspectRatio="none"
      >
        <rect width="100%" height="100%" fill="#d4d4d8" />
      </svg>
    </div>
  )
}

/* Calendar Icon */
function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', flexShrink: 0 }}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

export function DepoimentosHeroSection({ heroBlock }) {
  const stats = makeStats(heroBlock)

  return (
    <>
      {/* HERO */}
      <section className="bg-white overflow-hidden" style={{ paddingTop: '56px', paddingBottom: '56px' }}>
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 text-center lg:text-left">
            {/* Left text */}
            <div style={{ maxWidth: '750px' }}>
              <p className="text-red-600 font-bold tracking-widest uppercase mb-4" style={{ fontSize: '13px' }}>
                {heroBlock?.eyebrow || 'DEPOIMENTOS'}
              </p>
              <h1
                className="font-poppins font-bold text-zinc-900"
                style={{ fontSize: 'clamp(28px, 3.5vw, 50px)', lineHeight: '1.1', marginBottom: '20px' }}
              >
                {heroBlock?.headline || 'Resultados que falam por si.'}
              </h1>
              <p className="text-zinc-500 mx-auto lg:mx-0" style={{ fontSize: '17px', lineHeight: '1.65', maxWidth: '420px', color: 'var(--color-zinc-900)' }}>
                {heroBlock?.description || 'Empresas que confiaram na Evidence para transformar seus desafios em crescimento real.'}
              </p>
            </div>

            {/* Right decorative SVG */}
            <div className="hidden lg:block shrink-0" style={{ width: '220px', height: '220px' }}>
              <svg width="220" height="220" viewBox="0 0 587 587" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_3006_2)">
                  <path d="M407.663 554.863V179.471H32.2717V320.158H266.976V554.863H407.663Z" stroke="#CB2C30" strokeOpacity="0.1" strokeWidth="6"/>
                  <path d="M583.694 525.521V3.44043H61.6138V144.129H443.005V525.521H583.694Z" stroke="#CB2C30" strokeOpacity="0.1" strokeWidth="6"/>
                  <path d="M231.633 584.204V355.5H2.9292V584.204H231.633Z" stroke="#CB2C30" strokeOpacity="0.1" strokeWidth="6"/>
                </g>
                <defs>
                  <clipPath id="clip0_3006_2">
                    <rect width="587" height="587" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-white" style={{ paddingBottom: '40px' }}>
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 place-items-center lg:flex lg:flex-wrap lg:justify-between lg:place-items-start gap-y-8 gap-x-6" style={{ maxWidth: '1171px' }}>
            {stats.map((stat, i) => (
              <div key={i} className="contents">
                <div
                  className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4"
                  style={{ padding: 0 }}
                >
                  <div className="text-red-600 shrink-0">{stat.icon}</div>
                  <div className="text-center sm:text-left">
                    <p className="font-poppins font-bold text-zinc-900" style={{ fontSize: 'clamp(16px, 2vw, 22px)', lineHeight: '1.2' }}>
                      {stat.value}
                    </p>
                    <p className="text-zinc-500" style={{ fontSize: '13px' }}>{stat.label}</p>
                  </div>
                </div>
                {i < stats.length - 1 && (
                  <div className="hidden lg:block self-stretch" style={{ width: '1px', background: 'rgba(0,0,0,0.09)', margin: '16px 0' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export function DepoimentosGridSection({ testimonials }) {
  return (
    <section className="bg-white" style={{ paddingBottom: '60px' }}>
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="flex flex-col sm:flex-row overflow-hidden items-center sm:items-stretch"
              style={{ border: '1px solid rgba(0,0,0,0.09)', borderRadius: '8px', background: '#fff' }}
            >
              {/* Video placeholder */}
              <VideoBg video={t.video} />

              {/* Content */}
              <div className="flex flex-col justify-between p-6 flex-1 text-center sm:text-left items-center sm:items-start">
                {/* Quote mark */}
                <div>
                  <svg viewBox="0 0 40 30" fill="#dc2626" className="mx-auto sm:mx-0" style={{ width: '32px', height: '24px', marginBottom: '10px', opacity: 0.9 }}>
                    <path d="M0 30V18.182C0 9.697 5.333 3.636 16 0l2.909 4.545C13.576 6.364 10.788 9.697 10.182 14.545H18V30H0zm22 0V18.182C22 9.697 27.333 3.636 38 0l2.909 4.545C35.576 6.364 32.788 9.697 32.182 14.545H40V30H22z" />
                  </svg>
                  <p className="text-zinc-700" style={{ fontSize: '15px', lineHeight: '1.7' }}>
                    {t.quote}
                  </p>
                </div>

                {/* Divider + name */}
                <div style={{ marginTop: '20px' }}>
                  <div className="mx-auto sm:mx-0" style={{ width: '28px', height: '2px', background: '#dc2626', marginBottom: '12px' }} />
                  <p className="font-poppins font-bold text-zinc-900" style={{ fontSize: '15px', marginBottom: '2px' }}>
                    {t.name}
                  </p>
                  <p className="text-zinc-400" style={{ fontSize: '13px', marginBottom: '10px' }}>
                    {t.company}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-zinc-400" style={{ fontSize: '12px' }}>
                    <IconCalendar />
                    {formatClientSince(t.since)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function DepoimentosCtaSection({ ctaBlock }) {
  return (
    <section className="bg-zinc-950 border-t border-zinc-800 py-8 px-4 sm:px-6 lg:px-8" style={{ border: 'medium', background: 'white', paddingTop: '0px', paddingBottom: '64px' }}>
      <div className="max-w-384 mx-auto px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-zinc-950)', maxWidth: '1472px', padding: 'clamp(28px, 4vw, 55px)', borderRadius: '10px' }}>
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

          {/* Separator */}
          <div className="hidden lg:block self-stretch w-px min-h-[48px]" style={{ backgroundColor: 'rgb(220, 38, 38)' }} />

          {/* Text */}
          <div className="flex-1 lg:max-w-xl text-center lg:text-left w-full flex flex-col items-center lg:items-start" style={{ maxWidth: '690px' }}>
            <h2 className="font-poppins font-bold text-white mb-3 leading-tight text-2xl sm:text-3xl lg:text-[29px]">
              {ctaBlock?.headline || 'Quer resultados como esses na sua empresa?'}
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mx-auto lg:mx-0" style={{ fontSize: '19px', maxWidth: '600px' }}>
              {ctaBlock?.description || 'Fale com nossos especialistas e descubra o que podemos fazer pelo seu crescimento.'}
            </p>
          </div>

          {/* CTA */}
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
  )
}

/* Page */
export default function DepoimentosPage() {
  const [adminData, setAdminData] = useState(null)
  useEffect(() => {
    getPublicSitePage('content-depoimentos').then(setAdminData)
  }, [])

  const adminBlocks = adminData?.blocks ?? null
  const heroBlock = readAdminBlock(adminBlocks, 'hero')
  const testimonialsBlock = readAdminBlock(adminBlocks, 'depoimentos')
  const ctaBlock = readAdminBlock(adminBlocks, 'cta')
  const testimonials = readTestimonials(testimonialsBlock)

  return (
    <>
      <main style={{ marginTop: '90px' }}>
        <DepoimentosHeroSection heroBlock={heroBlock} />
        <DepoimentosGridSection testimonials={testimonials} />
        <DepoimentosCtaSection ctaBlock={ctaBlock} />
      </main>
      <Footer />
    </>
  )
}
