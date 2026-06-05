import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Footer from '../components/Footer'
import { noticiasService } from '../services/noticias.service'
import { resolveImageUrl } from '../services/api'
import { getBlogBlockTocItems, parseBlogBlocks } from '../utils/blogBlocks'
import { BlogBlocksContent } from '../utils/blogBlocks.jsx'

function formatDate(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function IconClock() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', flexShrink: 0 }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
}

function IconArrowLeft() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}><path d="M19 12H5" /><path d="M12 5l-7 7 7 7" /></svg>
}

export default function BlogPostPage() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    Promise.all([
      noticiasService.getById(id),
      noticiasService.getPublished().catch(() => []),
    ])
      .then(([post, posts]) => {
        if (!mounted) return
        setError('')
        setArticle(post)
        setRelatedPosts(posts.filter((item) => item.id !== post.id).slice(0, 3))
      })
      .catch(() => {
        if (!mounted) return
        setArticle(null)
        setRelatedPosts([])
        setError('Post n?o encontrado.')
      })
      .finally(() => { if (mounted) setLoading(false) })

    return () => { mounted = false }
  }, [id])

  const blocks = useMemo(() => parseBlogBlocks(article?.materia || article?.descricao), [article])
  const tocItems = useMemo(() => getBlogBlockTocItems(blocks), [blocks])

  if (loading) {
    return <><main className="bg-white" style={{ marginTop: '90px', minHeight: '60vh', display: 'grid', placeItems: 'center' }}><p className="text-zinc-500">Carregando artigo...</p></main><Footer /></>
  }

  if (error || !article) {
    return <><main className="bg-white" style={{ marginTop: '90px', minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '24px' }}><div className="text-center"><h1 className="font-poppins font-bold text-zinc-900" style={{ fontSize: 'clamp(24px, 4vw, 40px)' }}>{error || 'Post n?o encontrado.'}</h1><Link to="/blog" className="mt-5 inline-flex items-center gap-2 text-red-600 font-semibold"><IconArrowLeft /> Voltar ao Blog</Link></div></main><Footer /></>
  }

  const cover = article.imagemBanner || article.imagemCapa || '/banner-blog.png'
  const readTime = article.tempoLeitura || '5 min'

  return (
    <>
      <main style={{ marginTop: '90px' }}>
        <section className="bg-white border-b border-zinc-100" style={{ paddingTop: '48px', paddingBottom: '0' }}>
          <div className="max-w-368 mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 mb-8" style={{ fontSize: '13px' }}>
              <Link to="/" className="text-zinc-400 hover:text-zinc-600 transition-colors">Home</Link><span className="text-zinc-300">/</span><Link to="/blog" className="text-zinc-400 hover:text-zinc-600 transition-colors">Blog</Link><span className="text-zinc-300">/</span><span className="text-zinc-600 truncate" style={{ maxWidth: '260px' }}>{article.categoria || 'Blog'}</span>
            </nav>
            <span className="inline-block text-red-600 font-bold tracking-widest uppercase mb-4" style={{ fontSize: '12px', background: 'rgba(220,38,38,0.07)', borderRadius: '4px', padding: '4px 10px' }}>{article.categoria || 'Blog'}</span>
            <h1 className="font-poppins font-bold text-zinc-900" style={{ fontSize: 'clamp(26px, 3.5vw, 46px)', lineHeight: '1.15', maxWidth: '860px', marginBottom: '20px' }}>{article.titulo}</h1>
            <p className="text-zinc-500" style={{ fontSize: '18px', lineHeight: '1.65', maxWidth: '760px', marginBottom: '32px' }}>{article.descricao}</p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
              <div className="flex items-center gap-4 text-zinc-400" style={{ fontSize: '13px' }}><span className="flex items-center gap-1.5"><IconClock />{formatDate(article.createdAt)}</span><span className="hidden sm:block w-1 h-1 rounded-full bg-zinc-300" /><span>{readTime} de leitura</span></div>
            </div>
          </div>
        </section>

        <div className="max-w-368 mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '40px' }}><div className="rounded-xl overflow-hidden" style={{ borderRadius: '12px' }}><img src={resolveImageUrl(cover)} alt={article.titulo} className="w-full object-cover" style={{ height: 'clamp(220px, 40vw, 480px)', display: 'block' }} /></div></div>

        <div className="max-w-368 mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            <article className="flex-1 min-w-0">
              <BlogBlocksContent blocks={blocks} fallback={article.descricao} />
              <div className="flex flex-col sm:flex-row gap-4 mt-10"><Link to="/blog" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-800 border border-zinc-200 hover:border-zinc-400 rounded-lg px-5 py-4 transition-colors flex-1" style={{ fontSize: '14px' }}><IconArrowLeft /><div><p style={{ fontSize: '11px', color: '#a1a1aa', marginBottom: '2px' }}>ANTERIOR</p><p className="font-medium text-zinc-700">Voltar ao Blog</p></div></Link></div>
            </article>
            <aside className="hidden lg:block shrink-0" style={{ width: '300px' }}><div className="sticky" style={{ top: '110px' }}>{tocItems.length > 0 && <div className="mb-7 rounded-[10px] border border-black/5 bg-[#f9f9f9] p-6"><p className="font-poppins mb-4 text-[14px] font-bold uppercase tracking-wide text-zinc-800">Neste artigo</p><ul className="space-y-2 text-[14px] text-zinc-500">{tocItems.map((item, index) => <li key={`${index}-${item}`} className="border-b border-black/5 pb-2 last:border-0"><span className="mr-2 text-red-600">▸</span>{item}</li>)}</ul></div>}<div style={{ padding: '24px', background: '#dc2626', borderRadius: '10px' }}><p className="font-poppins font-bold text-white" style={{ fontSize: '16px', lineHeight: '1.4', marginBottom: '12px' }}>Quer resultados como esses na sua empresa?</p><p style={{ fontSize: '13px', lineHeight: '1.6', color: 'rgba(255,255,255,0.85)', marginBottom: '20px' }}>Fale com um especialista da Evidence e descubra como alinhar marketing e vendas no seu negócio.</p><Link to="/analise" className="block text-center font-semibold text-red-600 bg-white hover:bg-zinc-100 transition-colors" style={{ fontSize: '14px', padding: '11px 20px', borderRadius: '5px' }}>Receber análise</Link></div></div></aside>
          </div>
        </div>

        {relatedPosts.length > 0 && <section className="bg-white" style={{ padding: '60px 0' }}><div className="max-w-368 mx-auto px-4 sm:px-6 lg:px-8"><h2 className="font-poppins font-bold text-zinc-900 mb-8" style={{ fontSize: 'clamp(20px, 2vw, 28px)' }}>Artigos relacionados</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{relatedPosts.map((post) => <Link key={post.id} to={`/blog/${post.id}`} className="flex flex-col border bg-white overflow-hidden hover:shadow-md transition-shadow duration-200 group" style={{ borderRadius: '7px', borderColor: 'rgba(0,0,0,0.08)' }}><div className="overflow-hidden" style={{ height: '180px', flexShrink: 0 }}><img src={resolveImageUrl(post.imagemCapa || post.imagemBanner || '/banner-blog.png')} alt={post.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /></div><div style={{ padding: '20px' }}><span className="text-red-600 font-bold uppercase" style={{ fontSize: '11px', letterSpacing: '0.06em' }}>{post.categoria || 'Blog'}</span><h3 className="font-poppins font-bold text-zinc-800 mt-2 group-hover:text-red-600 transition-colors" style={{ fontSize: '16px', lineHeight: '1.4' }}>{post.titulo}</h3><p className="text-zinc-400 mt-3 flex items-center gap-1.5" style={{ fontSize: '12px' }}><IconClock />{formatDate(post.createdAt)}</p></div></Link>)}</div></div></section>}
      </main>
      <Footer />
    </>
  )
}
