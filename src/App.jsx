import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import './index.css'
import Navbar from './components/Navbar'
import AnalisePage from './pages/AnalisePage'
import Hero from './components/Hero'
import Cenario from './components/Cenario'
import Gargalos from './components/Gargalos'
import ComoAtuamos from './components/ComoAtuamos'
import ComoTrabalhamos from './components/ComoTrabalhamos'
import Depoimentos from './components/Depoimentos'
import Clientes from './components/Clientes'
import Blog from './components/Blog'
import CtaFinal from './components/CtaFinal'
import Footer from './components/Footer'
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton'
import ComoTrabalhamosPage from './pages/ComoTrabalhamosPage'
import ServicosPage from './pages/ServicosPage'
import ClientesPage from './pages/ClientesPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import DepoimentosPage from './pages/DepoimentosPage'
import AdminPage from './pages/AdminPage'
import { getPublicSitePage } from './services/publicSiteContent.service'
import { analyticsService } from './services/analytics.service'


const PUBLIC_PAGE_TITLES = {
  '/': 'P\u00e1gina inicial',
  '/como-trabalhamos': 'Como trabalhamos',
  '/servicos': 'Servi\u00e7os',
  '/clientes': 'Clientes',
  '/blog': 'Blog',
  '/depoimentos': 'Depoimentos',
  '/analise': 'An\u00e1lise',
}

function getPublicPageTitle(pathname) {
  if (pathname.startsWith('/blog/')) return 'Post do blog'
  return PUBLIC_PAGE_TITLES[pathname] || 'P\u00e1gina p\u00fablica'
}

function formatDocumentTitle(pageTitle) {
  return `${pageTitle} | Ag\u00eancia Evidence`
}

function getAnalyticsSessionId() {
  const key = 'evidence_analytics_session_id'
  const existing = sessionStorage.getItem(key)
  if (existing) return existing

  const next = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
  sessionStorage.setItem(key, next)
  return next
}

function useHomeBlocks() {
  const [blocks, setBlocks] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    getPublicSitePage('content-home').then((pageContent) => {
      if (!mounted) return
      const blockList = Array.isArray(pageContent?.blocks) ? pageContent.blocks : []
      setBlocks(Object.fromEntries(blockList.map((block) => [block.id, block])))
      setIsLoading(false)
    }).catch(() => {
      if (mounted) setIsLoading(false)
    })

    return () => {
      mounted = false
    }
  }, [])

  return { blocks, isLoading }
}

function HomePage() {
  const { blocks: homeBlocks, isLoading } = useHomeBlocks()
  const blocks = useMemo(() => ({
    hero: homeBlocks.hero,
    cenario: homeBlocks.cenario,
    gargalos: homeBlocks.gargalos,
    atuacao: homeBlocks.atuacao,
    comoTrabalhamos: homeBlocks['como-trabalhamos'],
    ctaHome: homeBlocks['cta-home'],
  }), [homeBlocks])

  if (isLoading) {
    return (
      <>
        <main
          aria-busy="true"
          aria-label="Carregando conteúdo da página inicial"
          style={{ marginTop: '90px' }}
        >
          <section className="grid min-h-screen place-items-center bg-black text-white">
            <span className="sr-only">Carregando conteúdo da página inicial</span>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <main style={{ marginTop: '90px' }}>
        <Hero block={blocks.hero} />
        <Cenario block={blocks.cenario} />
        <Gargalos block={blocks.gargalos} />
        <ComoAtuamos block={blocks.atuacao} />
        <ComoTrabalhamos block={blocks.comoTrabalhamos} />
        <Depoimentos />
        <Clientes />
        <Blog />
        <CtaFinal block={blocks.ctaHome} />
      </main>
      <Footer />
    </>
  )
}


function ScrollToTop() {
  const { pathname, search } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, search])

  return null
}

function App() {
  const location = useLocation()
  const hideNav = location.pathname.startsWith('/analise') || location.pathname.startsWith('/admin')

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return

    const pageTitle = getPublicPageTitle(location.pathname)
    document.title = formatDocumentTitle(pageTitle)

    analyticsService.track({
      page: `${location.pathname}${location.search}`,
      referrer: document.referrer,
      sessionId: getAnalyticsSessionId(),
      title: pageTitle,
    }).catch(() => {
      // Analytics must never break site navigation.
    })
  }, [location.pathname, location.search])

  return (
    <div className="font-sans antialiased">
      <ScrollToTop />
      {!hideNav && <Navbar />}
      {!hideNav && <WhatsAppFloatingButton />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/como-trabalhamos" element={<ComoTrabalhamosPage />} />
        <Route path="/servicos" element={<ServicosPage />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPostPage />} />
        <Route path="/depoimentos" element={<DepoimentosPage />} />
        <Route path="/analise" element={<AnalisePage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </div>
  )
}

export default App
