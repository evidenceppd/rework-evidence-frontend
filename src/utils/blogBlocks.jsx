import DOMPurify from 'dompurify'
import { legacyContentToBlocks, normalizeBlogBlock, parseBlogBlocks } from './blogBlocks'

function TextBlock({ block }) {
  const Tag = block.style.variant === 'title' ? 'h2' : block.style.variant === 'subtitle' ? 'h3' : 'div'
  return (
    <Tag
      style={{
        fontSize: block.style.fontSize,
        color: block.style.color,
        fontWeight: block.style.fontWeight,
        fontStyle: block.style.italic ? 'italic' : 'normal',
        lineHeight: block.style.lineHeight,
        letterSpacing: block.style.letterSpacing,
        textAlign: block.style.align,
        overflowWrap: 'anywhere',
        wordBreak: 'break-word',
        maxWidth: '100%',
      }}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(block.text || 'Texto do bloco') }}
    />
  )
}

function QuoteBlock({ block }) {
  return (
    <blockquote className="my-6 rounded-[10px] border border-[rgba(220,38,38,0.15)] bg-[rgba(220,38,38,0.05)] px-7 py-6">
      <p
        style={{
          fontSize: block.style.fontSize,
          color: block.style.color,
          fontWeight: block.style.fontWeight,
          fontStyle: block.style.italic ? 'italic' : 'normal',
          lineHeight: block.style.lineHeight,
          letterSpacing: block.style.letterSpacing,
          textAlign: block.style.align,
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
          maxWidth: '100%',
        }}
      >
        "{block.text || 'Texto da citação'}"
      </p>
      {block.author && <span className="mt-4 block text-[13px] text-zinc-400">- {block.author}</span>}
    </blockquote>
  )
}

function TopicsBlock({ block }) {
  return (
    <section className="my-8">
      <h2 className="font-poppins mb-5 text-[28px] font-bold leading-tight text-zinc-900">{block.heading || 'Título dos tópicos'}</h2>
      <p className="mb-6 text-[17px] leading-[1.75] text-zinc-600">{block.subtitle || 'Subtítulo dos tópicos.'}</p>
      <div className="space-y-4">
        {block.items?.map((item, itemIndex) => (
          <div key={`${itemIndex}-${item.title || item.text}`} className="flex gap-5 rounded-[10px] border border-black/10 bg-[#f9f9f9] p-6">
            <span className="font-poppins shrink-0 text-[30px] font-bold leading-none text-red-600">{String(itemIndex + 1).padStart(2, '0')}</span>
            <div className="min-w-0">
              {item.title && <h3 className="font-poppins text-[17px] font-bold text-zinc-800">{item.title}</h3>}
              <p className="mt-2 text-[16px] leading-[1.75] text-zinc-600">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ListBlock({ block }) {
  return (
    <section className="my-8">
      <h2 className="font-poppins mb-5 text-[28px] font-bold leading-tight text-zinc-900">{block.heading || 'Título da lista'}</h2>
      <p className="mb-6 text-[17px] leading-[1.75] text-zinc-600">{block.subtitle || 'Subtítulo da lista.'}</p>
      <ul className="space-y-4">
        {block.items?.filter((item) => item.text.trim()).map((item, itemIndex) => (
          <li key={`${itemIndex}-${item.text}`} className="flex gap-3 text-[17px] leading-[1.75] text-zinc-700">
            <span className="mt-[0.8em] h-0.5 w-5 shrink-0 bg-red-600" />
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function BlogBlocksContent({ blocks, fallback = '' }) {
  const normalizedBlocks = Array.isArray(blocks) ? blocks.map(normalizeBlogBlock) : parseBlogBlocks(fallback)
  const renderedBlocks = normalizedBlocks.length ? normalizedBlocks : legacyContentToBlocks(fallback)

  if (!renderedBlocks.length) return null

  return renderedBlocks.map((block, index) => {
    if (block.type === 'quote') return <QuoteBlock key={block.id || index} block={block} />
    if (block.type === 'topics') return <TopicsBlock key={block.id || index} block={block} />
    if (block.type === 'list') return <ListBlock key={block.id || index} block={block} />
    return <TextBlock key={block.id || index} block={block} />
  })
}
