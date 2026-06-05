import { useState } from 'react'
import { Link } from 'react-router-dom'

const navLinks = [
  { label: 'Início', to: '/' },
  { label: 'Como Trabalhamos', to: '/como-trabalhamos' },
  { label: 'Serviços', to: '/servicos' },
  { label: 'Clientes', to: '/clientes' },
  { label: 'Depoimentos', to: '/depoimentos' },
  { label: 'Blog', to: '/blog' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur border-b border-zinc-800" style={{ padding: '13px 0' }}>
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="/Logo - Agência Evidence.png"
              alt="Agência Evidence"
              className="h-10 w-auto object-contain"
              style={{ height: '50px' }}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-zinc-300 hover:text-white transition-colors duration-200 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center">
            <Link
              to="/analise"
              className="cursor-pointer inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 transition-colors duration-200"
            >
              RECEBER ANÁLISE
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="lg:hidden cursor-pointer p-2 text-zinc-300 hover:text-white transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-zinc-900 border-t border-zinc-800 px-4 py-4">
          <nav className="flex flex-col items-center gap-3 text-center">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="w-full text-center text-sm text-zinc-300 hover:text-white py-1 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/analise"
              onClick={() => setOpen(false)}
              className="cursor-pointer mt-2 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 transition-colors duration-200 w-fit"
            >
              RECEBER ANÁLISE
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
