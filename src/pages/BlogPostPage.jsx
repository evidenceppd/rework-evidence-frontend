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
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 shrink-0"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
}

function IconArrowLeft() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M19 12H5" /><path d="M12 5l-7 7 7 7" /></svg>
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
      <main className="mt-[90px]">
        <section className="border-b border-zinc-100 bg-white pt-12 pb-0">
          <div className="max-w-368 mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="mb-8 flex items-center gap-2 text-[13px]">
              <Link to="/" className="text-zinc-400 hover:text-zinc-600 transition-colors">Home</Link><span className="text-zinc-300">/</span><Link to="/blog" className="text-zinc-400 hover:text-zinc-600 transition-colors">Blog</Link><span className="text-zinc-300">/</span><span className="max-w-[260px] truncate text-zinc-600">{article.categoria || 'Blog'}</span>
            </nav>
            <span className="mb-4 inline-block rounded bg-red-600/[0.07] px-2.5 py-1 text-[12px] font-bold uppercase tracking-widest text-red-600">{article.categoria || 'Blog'}</span>
            <h1 className="font-poppins mb-5 max-w-[860px] text-[clamp(26px,3.5vw,46px)] font-bold leading-[1.15] text-zinc-900">{article.titulo}</h1>
            <p className="mb-8 max-w-[760px] text-[18px] leading-[1.65] text-zinc-500">{article.descricao}</p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
              <div className="flex items-center gap-4 text-[13px] text-zinc-400"><span className="flex items-center gap-1.5"><IconClock />{formatDate(article.createdAt)}</span><span className="hidden sm:block w-1 h-1 rounded-full bg-zinc-300" /><span>{readTime} de leitura</span></div>
            </div>
          </div>
        </section>

        <div className="max-w-368 mx-auto px-4 pt-10 sm:px-6 lg:px-8">
          <div
            className="flex h-fit max-w-[1408px] items-center justify-center overflow-hidden rounded-xl lg:h-[580px]"
          >
            <img
              src={resolveImageUrl(cover)}
              alt={article.titulo}
              className="block w-full object-cover"
            />
          </div>
        </div>

        <div className="max-w-368 mx-auto px-4 pt-[5px] pb-12 sm:px-6 lg:px-8 lg:pt-12">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            <article className="flex-1 min-w-0">
              <BlogBlocksContent blocks={blocks} fallback={article.descricao} />
              <div className="mt-10 flex flex-col gap-4 sm:flex-row"><Link to="/blog" className="flex flex-1 items-center gap-2 rounded-lg border border-zinc-200 px-5 py-4 text-[14px] text-zinc-500 transition-colors hover:border-zinc-400 hover:text-zinc-800"><IconArrowLeft /><div><p className="mb-0.5 text-[11px] text-zinc-400">ANTERIOR</p><p className="font-medium text-zinc-700">Voltar ao Blog</p></div></Link></div>
            </article>
            <aside className="hidden w-[300px] shrink-0 lg:block"><div className="sticky top-[110px]">{tocItems.length > 0 && <div className="mb-7 rounded-[10px] border border-black/5 bg-[#f9f9f9] p-6"><p className="font-poppins mb-4 text-[14px] font-bold uppercase tracking-wide text-zinc-800">Neste artigo</p><ul className="space-y-2 text-[14px] text-zinc-500">{tocItems.map((item, index) => <li key={`${index}-${item}`} className="border-b border-black/5 pb-2 last:border-0"><span className="mr-2 text-red-600">▸</span>{item}</li>)}</ul></div>}<div className="rounded-[10px] bg-red-600 p-6"><p className="font-poppins mb-3 text-[16px] font-bold leading-[1.4] text-white">Quer resultados como esses na sua empresa?</p><p className="mb-5 text-[13px] leading-[1.6] text-white/85">Fale com um especialista da Evidence e descubra como alinhar marketing e vendas no seu negócio.</p><Link to="/analise" className="block rounded-[5px] bg-white px-5 py-[11px] text-center text-[14px] font-semibold text-red-600 transition-colors hover:bg-zinc-100">Receber análise</Link></div></div></aside>
          </div>
        </div>

        {relatedPosts.length > 0 && <section className="bg-white pb-[60px] pt-0 sm:pt-[60px]"><div className="max-w-368 mx-auto px-4 sm:px-6 lg:px-8"><h2 className="font-poppins mb-8 text-[clamp(20px,2vw,28px)] font-bold text-zinc-900">Artigos relacionados</h2><div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{relatedPosts.map((post) => <Link key={post.id} to={`/blog/${post.id}`} className="group flex flex-col overflow-hidden rounded-[7px] border border-black/[0.08] bg-white transition-shadow duration-200 hover:shadow-md"><div className="h-auto shrink-0 overflow-hidden"><img src={resolveImageUrl(post.imagemCapa || post.imagemBanner || '/banner-blog.png')} alt={post.titulo} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" /></div><div className="p-5"><span className="text-[11px] font-bold uppercase tracking-[0.06em] text-red-600">{post.categoria || 'Blog'}</span><h3 className="font-poppins mt-2 text-[16px] font-bold leading-[1.4] text-zinc-800 transition-colors group-hover:text-red-600">{post.titulo}</h3><p className="mt-3 flex items-center gap-1.5 text-[12px] text-zinc-400"><IconClock />{formatDate(post.createdAt)}</p></div></Link>)}</div></div></section>}
      </main>
      <Footer />
    </>
  )
}
