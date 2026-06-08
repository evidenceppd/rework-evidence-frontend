import { useEffect, useState } from 'react'
import { getPublicSitePage } from '../services/publicSiteContent.service'


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
      <div className="w-full sm:w-[45%] aspect-video sm:aspect-auto bg-zinc-800 shrink-0">
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
    <div className="w-full sm:w-[45%] aspect-video sm:aspect-auto bg-zinc-800 shrink-0 relative flex items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
        <svg className="w-5 h-5 text-zinc-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  )
}

function readTestimonials(pageContent) {
  const testimonialsBlock = pageContent?.blocks?.find((block) => block.id === 'depoimentos')

  if (!testimonialsBlock?.testimonialsJson) return []

  try {
    const parsed = JSON.parse(testimonialsBlock.testimonialsJson)
    if (!Array.isArray(parsed)) return []

    return parsed
      .map((item, index) => ({
        id: item?.id ?? `depoimento-${index}`,
        quote: String(item?.quote ?? '').trim(),
        name: String(item?.name ?? '').trim(),
        role: String(item?.company ?? item?.position ?? '').trim(),
        video: String(item?.video ?? item?.videoLink ?? '').trim(),
        hasVideo: Boolean(item?.video || item?.videoLink),
      }))
      .filter((item) => item.quote || item.name || item.role)
      .slice(0, 3)
  } catch (error) {
    console.warn('N?o foi poss?vel ler os depoimentos publicados.', error)
    return []
  }
}

export default function Depoimentos() {
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    let cancelled = false

    getPublicSitePage('content-depoimentos')
      .then((pageContent) => {
        if (!cancelled) setTestimonials(readTestimonials(pageContent))
      })
      .catch((error) => {
        console.warn('N?o foi poss?vel carregar os depoimentos publicados.', error)
        if (!cancelled) setTestimonials([])
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="bg-white py-16 border-t border-zinc-200">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-10">
          <p className="text-red-500 md:text-[20px] text-[17px] font-bold md:tracking-widest uppercase text-center sm:text-left">
            O QUE NOSSOS CLIENTES DIZEM
          </p>
          <a
            href="/depoimentos"
            className="cursor-pointer hidden sm:flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-bold transition-colors duration-200"
            style={{ fontSize: '14px' }}
          >
            VER TODOS OS DEPOIMENTOS
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className={`border border-zinc-200 flex flex-col overflow-hidden ${t.hasVideo ? '' : 'p-6'}`}>
              {t.hasVideo ? (
                <div className="flex flex-col sm:flex-row h-full">
                  <VideoBg video={t.video} />
                  <div className="flex flex-col justify-between p-5">
                    <p className="text-zinc-700 text-sm leading-relaxed mb-4">"{t.quote}"</p>
                    <div>
                      <p className="text-zinc-900 text-sm font-bold">{t.name}</p>
                      <p className="text-zinc-500 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4 h-full">
                  <div className="shrink-0">
                    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <div className="flex flex-col justify-between">
                    <p className="text-zinc-700 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                    <div>
                      <p className="text-zinc-900 text-sm font-bold">{t.name}</p>
                      <p className="text-zinc-500 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
