import { useEffect, useState } from 'react'
import { getPublicSitePage } from '../services/publicSiteContent.service'

function readClients(pageContent) {
  const clientsBlock = pageContent?.blocks?.find((block) => block.id === 'logos')

  if (!clientsBlock?.clientsJson) return []

  try {
    const parsed = JSON.parse(clientsBlock.clientsJson)
    if (!Array.isArray(parsed)) return []

    return parsed
      .map((item, index) => ({
        id: item?.id ?? `cliente-${index}`,
        name: String(item?.name ?? '').trim(),
        sub: String(item?.segment ?? item?.description ?? '').trim(),
        imageUrl: typeof item?.imageUrl === 'string' ? item.imageUrl : '',
      }))
      .filter((client) => client.name || client.sub || client.imageUrl)
      .slice(0, 6)
  } catch (error) {
    console.warn('N?o foi poss?vel ler os clientes publicados.', error)
    return []
  }
}

function LogoPlaceholder() {
  return (
    <svg className="h-16 w-32 md:h-20 md:w-40 lg:h-22 lg:w-44" viewBox="0 0 112 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="110" height="62" rx="4" stroke="currentColor" strokeOpacity="0.28" />
      <rect x="16" y="17" width="28" height="18" rx="2" fill="currentColor" fillOpacity="0.22" />
      <rect x="52" y="18" width="42" height="4" rx="2" fill="currentColor" fillOpacity="0.36" />
      <rect x="52" y="29" width="30" height="3" rx="1.5" fill="currentColor" fillOpacity="0.22" />
      <rect x="16" y="43" width="78" height="3" rx="1.5" fill="currentColor" fillOpacity="0.16" />
    </svg>
  )
}

function ClientLogo({ client }) {
  if (!client.imageUrl) return <LogoPlaceholder />

  return (
    <img
      src={client.imageUrl}
      alt={client.name}
      loading="lazy"
      decoding="async"
      className="h-16 w-32 object-contain md:h-20 md:w-40 lg:h-22 lg:w-44"
    />
  )
}
export default function Clientes() {
  const [clients, setClients] = useState([])

  useEffect(() => {
    let cancelled = false

    getPublicSitePage('content-clientes')
      .then((pageContent) => {
        if (!cancelled) setClients(readClients(pageContent))
      })
      .catch((error) => {
        console.warn('N?o foi poss?vel carregar os clientes publicados.', error)
        if (!cancelled) setClients([])
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="clientes" className="bg-zinc-950 py-10 border-t border-zinc-800">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-red-500 text-[17px] md:text-[18px] font-bold tracking-widest uppercase mb-8 text-center md:text-left" style={{fontWeight: 500 }}>
          EMPRESAS QUE CONFIAM <br className='md:hidden'/> NA EVIDENCE
        </p>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="md:hidden overflow-hidden w-full" style={{ contain: 'layout paint' }}>
            <div className="animate-marquee gap-3">
              {[...clients, ...clients].map((client, index) => (
                <div
                  key={`${client.id}-mobile-${index}`}
                  className="flex shrink-0 items-center justify-center opacity-70 mx-2"
                >
                  <ClientLogo client={client} />
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:flex flex-nowrap items-center gap-6 lg:gap-8 xl:gap-10">
            {clients.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-200"
              >
                <ClientLogo client={client} />
              </div>
            ))}
          </div>

          <a
            href="/clientes"
            className="cursor-pointer text-sm text-zinc-200 font-semibold border border-zinc-200 px-5 py-2.5 hover:bg-red-500 hover:text-white transition-colors duration-200 w-full md:w-auto text-center"
            style={{ borderColor: 'var(--color-red-500)' }}
          >
            VER TODOS OS CLIENTES
          </a>
        </div>
      </div>
    </section>
  )
}
