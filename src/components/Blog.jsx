import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { noticiasService } from '../services/noticias.service'
import { resolveImageUrl } from '../services/api'
import ImagePlaceholder from './ImagePlaceholder'

export default function Blog() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    let mounted = true
    noticiasService.getPublished()
      .then((items) => { if (mounted) setPosts(items.slice(0, 3)) })
      .catch(() => { if (mounted) setPosts([]) })
    return () => { mounted = false }
  }, [])

  return (
    <section id="blog" className="bg-white py-20 border-t border-zinc-100" style={{ padding: '65px 0' }}>
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8 sm:mb-12">
          <div className="text-center sm:text-left">
            <p className="text-red-600 text-xs font-bold tracking-widest uppercase mb-2" style={{ fontSize: '14px' }}>DO BLOG</p>
            <h2 className="font-poppins text-2xl sm:text-3xl font-bold text-zinc-900">Conteúdos que geram insights<br />e impulsionam resultados</h2>
          </div>
          <Link to="/blog" className="cursor-pointer hidden sm:flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-semibold transition-colors duration-200" style={{ fontSize: '14px', fontWeight: 700 }}>
            VER TODOS OS ARTIGOS →
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="rounded-xl border border-zinc-100 bg-zinc-50 px-5 py-8 text-center text-zinc-500">Nenhum artigo publicado ainda.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="group cursor-pointer flex flex-col border border-zinc-200">
                <Link to={`/blog/${post.id}`} className="aspect-video w-full overflow-hidden shrink-0 bg-zinc-100">
                  {post.imagemCapa ? <img src={resolveImageUrl(post.imagemCapa)} alt={post.titulo} className="h-full w-full object-cover group-hover:opacity-90 transition-opacity" /> : <ImagePlaceholder className="w-full h-full group-hover:opacity-90 transition-opacity" label="Blog post" />}
                </Link>
                <div className="flex flex-col justify-center p-4">
                  <p className="text-red-600 text-xs font-bold tracking-widest uppercase mb-2">{post.categoria || 'Blog'}</p>
                  <h3 className="font-poppins text-base font-bold text-zinc-900 leading-snug mb-3 group-hover:text-red-600 transition-colors duration-200">{post.titulo}</h3>
                  {post.descricao && (
                    <p className="text-zinc-500 text-sm leading-relaxed mb-4">{post.descricao}</p>
                  )}
                  <Link to={`/blog/${post.id}`} className="cursor-pointer text-xs font-bold text-red-600 hover:text-red-700 tracking-widest uppercase flex items-center gap-1 transition-colors duration-200">LEIA MAIS →</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
