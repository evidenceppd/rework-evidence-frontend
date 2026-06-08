import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Mail, Phone } from 'lucide-react'
import { toWhatsAppHref, useContatoInfo, CONTATO_INFO_DEFAULTS } from '../services/contatoInfo.service'

const footerNavLinks = [
  { label: 'In\u00edcio', to: '/' },
  { label: 'Como Trabalhamos', to: '/como-trabalhamos' },
  { label: 'Servi\u00e7os', to: '/servicos' },
  { label: 'Clientes', to: '/clientes' },
  { label: 'Depoimentos', to: '/depoimentos' },
  { label: 'Blog', to: '/blog' },
]

export default function Footer() {
  const contato = useContatoInfo() || CONTATO_INFO_DEFAULTS
  const whatsappHref = toWhatsAppHref(contato.whatsapp)
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    if (showMap) return undefined

    const loadMap = () => setShowMap(true)
    const idleId = window.requestIdleCallback
      ? window.requestIdleCallback(loadMap, { timeout: 1800 })
      : window.setTimeout(loadMap, 900)

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idleId)
      else window.clearTimeout(idleId)
    }
  }, [showMap])

  return (
    <footer id="contato" className="overflow-x-hidden bg-zinc-950 border-t border-zinc-800 pt-16 pb-8" style={{ borderColor: 'var(--color-red-700)' }}>
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,285px)_minmax(0,170px)_minmax(0,260px)_1px_minmax(0,405px)] lg:gap-8 xl:gap-12 mb-12 items-start justify-center lg:justify-between">

          {/* Brand */}
          <div className="min-w-0 text-center lg:text-left w-full max-w-[285px] mx-auto lg:mx-0">
            <div className="mb-4 flex justify-center lg:justify-start">
              <img
                src="/Logo - Agência Evidence.png"
                alt="Agência Evidence"
                className="h-10 w-auto object-contain"
                style={{ maxWidth: '190px', width: '100%', height: 'auto' }}
              />
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed" style={{ fontSize: '14px' }}>
              Ajudamos empresas a atrair clientes, gerar oportunidades e aumentar suas vendas com estratégia, marketing e execução.
            </p>
            <div className="flex gap-3 mt-5 justify-center lg:justify-start">
              {/* Instagram */}
              <a href={contato.link_instagram || '#'} target={contato.link_instagram && contato.link_instagram !== '#' ? '_blank' : undefined} rel={contato.link_instagram && contato.link_instagram !== '#' ? 'noopener noreferrer' : undefined} className="cursor-pointer w-8 h-8 flex items-center justify-center transition-colors duration-200" aria-label="instagram">
                <svg className="w-4 h-4 text-zinc-400" fill="currentColor" viewBox="0 0 24 24" style={{ width: '23px', height: '23px' }}>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href={contato.link_linkedin || '#'} target={contato.link_linkedin && contato.link_linkedin !== '#' ? '_blank' : undefined} rel={contato.link_linkedin && contato.link_linkedin !== '#' ? 'noopener noreferrer' : undefined} className="cursor-pointer w-8 h-8 flex items-center justify-center transition-colors duration-200" aria-label="linkedin">
                <svg className="w-4 h-4 text-zinc-400" fill="currentColor" viewBox="0 0 24 24" style={{ width: '23px', height: '23px' }}>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              {/* WhatsApp */}
              <a href={whatsappHref} target={whatsappHref !== '#' ? '_blank' : undefined} rel={whatsappHref !== '#' ? 'noopener noreferrer' : undefined} className="cursor-pointer w-8 h-8 flex items-center justify-center transition-colors duration-200" aria-label="whatsapp">
                <svg className="w-4 h-4 text-zinc-400" fill="currentColor" viewBox="0 0 24 24" style={{ width: '23px', height: '23px' }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Nav */}
          <div className="min-w-0 text-center lg:text-left w-full max-w-[170px] mx-auto lg:mx-0">
            <p className="text-white text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--color-red-500)' }}>{'MENU'}</p>
            <ul className="flex flex-col gap-2" style={{ gap: '5px' }}>
              {footerNavLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="cursor-pointer text-zinc-400 hover:text-white text-xs transition-colors duration-200" style={{ fontSize: '14px' }}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="min-w-0 text-center lg:text-left w-full max-w-[260px] mx-auto lg:mx-0">
            <p className="text-white text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--color-red-500)' }}>FALE CONOSCO</p>
            <ul className="flex flex-col gap-3">
              {contato.whatsapp && (
                <li className="flex items-center justify-center lg:justify-start gap-2 text-zinc-400 text-xs" style={{ fontSize: '14px' }}>
                  <Phone className="h-5 w-5 shrink-0 text-zinc-400" />
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{contato.whatsapp}</a>
                </li>
              )}
              {contato.email && (
                <li className="flex items-center justify-center lg:justify-start gap-2 text-zinc-400 text-xs" style={{ fontSize: '14px' }}>
                  <Mail className="h-5 w-5 shrink-0 text-zinc-400" />
                  <a href={`mailto:${contato.email}`} className="min-w-0 break-all hover:text-white transition-colors">{contato.email}</a>
                </li>
              )}
            </ul>
          </div>

          {/* Separator */}
          <div className="hidden lg:block self-stretch bg-zinc-700/40" style={{ width: '1px', minHeight: '48px'}} />

          {/* Location */}
          <div className="min-w-0 text-center lg:text-left w-full max-w-[405px] mx-auto lg:mx-0">
            <p className="text-white text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--color-red-500)' }}>ONDE ESTAMOS</p>
            <p className="break-words text-zinc-400 text-xs mb-1" style={{ fontSize: '14px' }}>{contato.endereco || 'Osvaldo Cruz - SP'}</p>
            <p className="text-zinc-400 text-xs mb-3" style={{ fontSize: '14px' }}>Atendemos todo o Brasil</p>
            <div className="relative w-full max-w-full overflow-hidden bg-zinc-900" style={{ height: '150px' }}>
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-center text-[12px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                AGENCIA EVIDENCE
              </div>
              {showMap && (
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10478.692249045629!2d-50.87932725723093!3d-21.788883335092176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x949425d96adc880b%3A0xdddb190e31968103!2sAg%C3%AAncia%20Evidence%20-%20Publicidade%20e%20Propaganda%20Digital!5e0!3m2!1spt-BR!2sbr!4v1777464958018!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0, position: 'absolute', inset: 0, zIndex: 1 }}
                allowFullScreen=""
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
                title="Agência Evidence - Localização"
              />
              )}
              <a
                href="https://maps.google.com/?q=Agencia+Evidence"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2 tracking-wide transition-colors duration-200 whitespace-nowrap"
                style={{ marginBottom: '10px' }}
              >
                VER NO MAPA
              </a>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-zinc-800 pt-6 flex min-w-0 flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-zinc-600 text-xs" style={{ textAlign: 'center' }}>© {new Date().getFullYear()} Agência Evidence. Todos os direitos reservados.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="cursor-pointer text-zinc-600 hover:text-zinc-400 text-xs transition-colors">CNPJ: 22.341.901/0001-80</span>
            {/* <span className="text-zinc-600 text-xs">|</span>
            <a href="#" className="cursor-pointer text-zinc-600 hover:text-zinc-400 text-xs transition-colors">Termos de Uso</a> */}
          </div>
        </div>
      </div>
    </footer>
  )
}
