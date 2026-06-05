export const BLOG_BLOCKS_SCHEMA = 'evidence-blog-blocks/v1'

export const DEFAULT_BLOG_BLOCK_STYLE = {
  variant: 'paragraph',
  fontSize: '17px',
  color: '#52525b',
  fontWeight: '400',
  italic: false,
  lineHeight: '1.75',
  letterSpacing: '0px',
  align: 'left',
}

export function decodeHtmlEntities(value) {
  return String(value || '')
    .replace(/&#(\d+);/g, (_match, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#96;/g, '`')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

function makeBlockId(index) {
  return `content-block-${index + 1}`
}

export function normalizeBlogBlock(block, index = 0) {
  const type = ['text', 'quote', 'topics', 'list'].includes(block?.type) ? block.type : 'text'
  return {
    id: String(block?.id || makeBlockId(index)),
    type,
    text: String(block?.text || ''),
    author: block?.author ? String(block.author) : '',
    heading: block?.heading ? String(block.heading) : '',
    subtitle: block?.subtitle ? String(block.subtitle) : '',
    items: Array.isArray(block?.items)
      ? block.items.map((item) => ({ title: item?.title ? String(item.title) : '', text: String(item?.text || '') }))
      : type === 'topics' || type === 'list'
        ? [{ title: '', text: '' }]
        : [],
    style: { ...DEFAULT_BLOG_BLOCK_STYLE, ...(block?.style || {}) },
  }
}

export function serializeBlogBlocks(blocks) {
  return JSON.stringify({
    schema: BLOG_BLOCKS_SCHEMA,
    version: 1,
    blocks: (Array.isArray(blocks) ? blocks : []).map(normalizeBlogBlock),
  })
}

export function legacyContentToBlocks(content) {
  const normalized = decodeHtmlEntities(content).trim()
  if (!normalized) return []
  return normalized
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => normalizeBlogBlock({ id: makeBlockId(index), type: 'text', text: paragraph }, index))
}

export function parseBlogBlocks(content) {
  const decoded = decodeHtmlEntities(content).trim()
  if (!decoded) return []

  try {
    const parsed = JSON.parse(decoded)
    if (parsed?.schema === BLOG_BLOCKS_SCHEMA && Array.isArray(parsed.blocks)) {
      return parsed.blocks.map(normalizeBlogBlock)
    }
  } catch {
    // Plain legacy article content remains supported below.
  }

  return legacyContentToBlocks(decoded)
}

export function getBlogBlockTocItems(blocks) {
  return (Array.isArray(blocks) ? blocks : [])
    .flatMap((block) => {
      if (block.type === 'text' && block.style?.variant === 'title') {
        const text = decodeHtmlEntities(block.text).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
        return text ? [text] : []
      }
      if ((block.type === 'topics' || block.type === 'list') && block.heading) return [block.heading]
      return []
    })
    .slice(0, 6)
}
