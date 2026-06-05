import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { getPublicSitePage } from '../services/publicSiteContent.service'
import { noticiasService } from '../services/noticias.service'
import { resolveImageUrl } from '../services/api'

const POSTS_PER_PAGE = 6

function formatDate(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function readAdminBlock(blocks, id) {
  return blocks?.find((block) => block.id === id) ?? null
}

function normalizePost(post) {
  return {
    id: post.id,
    image: post.imagemCapa || post.imagemBanner || '/banner-blog.png',
    category: post.categoria || 'Blog',
    filterTag: post.categoria || 'Blog',
    date: formatDate(post.createdAt),
    title: post.titulo || 'Post sem título',
    excerpt: post.descricao || '',
  }
}

function PostImage({ src, title }) {
  return (
    <img
      src={resolveImageUrl(src)}
      alt={title}
      className="w-full object-cover"
      style={{ height: '220px', flexShrink: 0 }}
    />
  )
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px', flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

export function BlogHeroSection({ heroBlock, search = '', onSearchChange = () => {} }) {
  const heroImage = heroBlock?.imageUrl ? resolveImageUrl(heroBlock.imageUrl) : null

  return (
    <section
      className="relative"
      style={{ backgroundImage: heroImage ? `url(${heroImage})` : 'none', backgroundSize: 'unset', backgroundPosition: '100% center', backgroundRepeat: 'no-repeat', backgroundColor: '#f7f8f8' }}
    >
      <div className="absolute inset-0 lg:hidden" style={{ backgroundColor: 'rgba(247,248,248,0.78)' }} />
      <div className="relative max-w-368 mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24 text-center lg:text-left">
        <p className="text-red-600 font-bold tracking-widest uppercase mb-4" style={{ fontSize: '13px' }}>
          {heroBlock?.eyebrow || 'BLOG'}
        </p>
        <h1 className="font-poppins font-bold text-zinc-900 leading-tight mb-4 mx-auto lg:mx-0" style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', lineHeight: '1.15', maxWidth: '640px' }}>
          {heroBlock?.headline || 'Conteúdos sobre marketing, vendas e crescimento empresarial'}
        </h1>
        <p className="text-zinc-700 mx-auto lg:mx-0" style={{ fontSize: '16px', lineHeight: '1.6', maxWidth: '480px', marginBottom: '2rem' }}>
          {heroBlock?.description || 'Insights práticos para empresas que querem gerar mais demanda e aumentar suas vendas.'}
        </p>
        <div className="flex items-center gap-3 border border-zinc-300 rounded-md bg-white px-4 py-3 w-full mx-auto lg:mx-0" style={{ maxWidth: '480px' }}>
          <input type="text" placeholder="Buscar conteúdo..." value={search} onChange={onSearchChange} className="flex-1 outline-none bg-transparent text-zinc-700" style={{ fontSize: '14px' }} />
          <div className="text-zinc-400 shrink-0"><IconSearch /></div>
        </div>
      </div>
    </section>
  )
}

export function BlogCtaSection({ ctaBlock }) {
  return (
    <section className="bg-white pb-12 lg:pb-16">
      <div className="max-w-368 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-10 rounded-xl p-8 lg:p-10" style={{ border: '1px solid rgb(228, 228, 231)', boxShadow: 'rgba(0,0,0,0.06) 0px 2px 16px', display: 'flex', justifyContent: 'space-around', background: '#f6f6f6' }}>
          <div className="shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{ width: '140px', height: '140px', flexShrink: 0 }} fill="#dc2626">
              <path d="M488.399 492h-21.933V173.536c0-14.823-12.06-26.882-26.882-26.882H390.56c-14.823 0-26.882 12.06-26.882 26.882V492h-55.692V317.825c0-14.823-12.059-26.882-26.882-26.882H232.08c-14.823 0-26.882 12.06-26.882 26.882V492h-55.692v-90.204c0-14.823-12.06-26.882-26.882-26.882H73.599c-14.823 0-26.882 12.06-26.882 26.882V492H23.601c-5.523 0-10 4.477-10 10s4.477 10 10 10h464.798c5.523 0 10-4.477 10-10s-4.477-10-10-10z" />
            </svg>
          </div>
          <div className="flex-1 text-center lg:text-left" style={{ maxWidth: '610px' }}>
            <h2 className="font-poppins font-bold text-zinc-900 mb-2" style={{ fontSize: 'clamp(20px, 2.5vw, 30px)', lineHeight: '1.3' }}>
              {ctaBlock?.headline || 'Sua empresa está gerando demanda, mas não está vendendo como poderia?'}
            </h2>
            <p className="text-zinc-500" style={{ fontSize: '18px', lineHeight: '1.6' }}>
              {ctaBlock?.description || 'Receba uma análise inicial do seu marketing e vendas e identifique oportunidades reais de crescimento.'}
            </p>
          </div>
          <a href={ctaBlock?.buttonHref || '/analise'} className="cursor-pointer shrink-0 bg-red-600 hover:bg-red-700 text-white font-bold tracking-wide px-8 py-4 flex items-center gap-3 transition-colors duration-200 w-full lg:w-auto justify-center" style={{ borderRadius: '4px', fontSize: '15px', whiteSpace: 'nowrap', maxWidth: '285px' }}>
            {ctaBlock?.buttonPrimary || 'RECEBER ANÁLISE'}
          </a>
        </div>
      </div>
    </section>
  )
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [adminData, setAdminData] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const filterScrollRef = useRef(null)

  useEffect(() => {
    getPublicSitePage('content-blog').then(setAdminData).catch(() => setAdminData(null))
  }, [])

  useEffect(() => {
    let mounted = true
    noticiasService.getPublished()
      .then((items) => { if (mounted) setPosts(items.map(normalizePost)) })
      .catch(() => { if (mounted) setPosts([]) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  const adminBlocks = adminData?.blocks ?? null
  const heroBlock = readAdminBlock(adminBlocks, 'hero')
  const ctaBlock = readAdminBlock(adminBlocks, 'cta')
  const categories = useMemo(() => ['Todos', ...Array.from(new Set(posts.map((post) => post.filterTag).filter(Boolean)))], [posts])

  const filtered = posts.filter((post) => {
    const matchCat = activeCategory === 'Todos' || post.filterTag === activeCategory
    const query = search.trim().toLowerCase()
    const matchSearch = !query || post.title.toLowerCase().includes(query) || post.excerpt.toLowerCase().includes(query) || post.category.toLowerCase().includes(query)
    return matchCat && matchSearch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE))
  const paginated = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)
  const pageNumbers = () => totalPages <= 5 ? Array.from({ length: totalPages }, (_, i) => i + 1) : [1, 2, 3, '...', totalPages]
  const handleCategory = (cat) => { setActiveCategory(cat); setCurrentPage(1) }
  const handleSearch = (event) => { setSearch(event.target.value); setCurrentPage(1) }

  return (
    <>
      <main style={{ marginTop: '90px' }}>
        <BlogHeroSection heroBlock={heroBlock} search={search} onSearchChange={handleSearch} />

        <section className="bg-white border-t border-zinc-100 py-6" style={{ padding: '40px 0' }}>
          <div className="max-w-368 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex items-center gap-2">
              <button onClick={() => filterScrollRef.current?.scrollBy({ left: -160, behavior: 'smooth' })} className="lg:hidden shrink-0 flex items-center justify-center w-9 h-9 rounded-full border border-zinc-300 bg-white text-zinc-600" aria-label="Anterior">‹</button>
              <div ref={filterScrollRef} className="flex flex-1 overflow-x-auto" style={{ gap: '18px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {categories.map((cat) => (
                  <button key={cat} onClick={() => handleCategory(cat)} className={`cursor-pointer shrink-0 text-sm font-medium border transition-colors duration-200 ${activeCategory === cat ? 'bg-red-600 text-white border-red-600' : 'bg-white text-zinc-600 border-zinc-300 hover:border-zinc-500'}`} style={{ fontSize: '16px', borderRadius: '5px', padding: '13px 35px', whiteSpace: 'nowrap' }}>
                    {cat}
                  </button>
                ))}
              </div>
              <button onClick={() => filterScrollRef.current?.scrollBy({ left: 160, behavior: 'smooth' })} className="lg:hidden shrink-0 flex items-center justify-center w-9 h-9 rounded-full border border-zinc-300 bg-white text-zinc-600" aria-label="Próximo">›</button>
            </div>
          </div>
        </section>

        <section className="bg-white py-10 lg:py-12" style={{ paddingTop: 0 }}>
          <div className="max-w-368 mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <p className="text-zinc-500 text-center py-16" style={{ fontSize: '16px' }}>Carregando artigos...</p>
            ) : paginated.length === 0 ? (
              <p className="text-zinc-500 text-center py-16" style={{ fontSize: '16px' }}>Nenhum artigo encontrado.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map((post) => (
                  <article key={post.id} className="flex flex-col border border-zinc-200 rounded-xl overflow-hidden bg-white transition-shadow duration-200" style={{ borderRadius: '7px', borderColor: 'rgba(0,0,0,0.08)' }}>
                    <PostImage src={post.image} title={post.title} />
                    <div className="flex flex-col flex-1 p-5">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="text-red-600 font-bold tracking-widest uppercase" style={{ fontSize: '12px' }}>{post.category}</span>
                        <span className="flex items-center gap-1 text-zinc-400" style={{ fontSize: '12px' }}><IconClock />{post.date}</span>
                      </div>
                      <h2 className="font-poppins font-bold text-zinc-900 mb-2" style={{ fontSize: '21px', lineHeight: '1.35' }}>{post.title}</h2>
                      <p className="text-zinc-500 flex-1" style={{ fontSize: '17px', lineHeight: '1.6' }}>{post.excerpt}</p>
                      <Link to={`/blog/${post.id}`} className="cursor-pointer inline-flex items-center gap-2 text-red-600 font-medium mt-4 hover:text-red-700 transition-colors duration-200" style={{ fontSize: '17px' }}>Ler artigo →</Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <BlogCtaSection ctaBlock={ctaBlock} />

        {totalPages > 1 && (
          <section className="bg-white pb-16">
            <div className="max-w-368 mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center gap-2">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="cursor-pointer flex items-center justify-center w-9 h-9 rounded border border-zinc-300 text-zinc-600 disabled:opacity-40">‹</button>
                {pageNumbers().map((page, idx) => page === '...' ? <span key={`ellipsis-${idx}`} className="px-1 text-zinc-400">...</span> : <button key={page} onClick={() => setCurrentPage(page)} className={`cursor-pointer flex items-center justify-center w-9 h-9 rounded border font-medium ${currentPage === page ? 'bg-red-600 text-white border-red-600' : 'bg-white text-zinc-600 border-zinc-300'}`}>{page}</button>)}
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="cursor-pointer flex items-center justify-center w-9 h-9 rounded border border-zinc-300 text-zinc-600 disabled:opacity-40">›</button>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}

