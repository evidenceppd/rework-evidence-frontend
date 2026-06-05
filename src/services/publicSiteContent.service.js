import { siteContentService } from './siteContent.service'

function htmlBreaksToNewlines(value) {
  if (typeof value === 'string') return value.replace(/<br\s*\/?\s*>/gi, '\n')
  if (Array.isArray(value)) return value.map((item) => htmlBreaksToNewlines(item))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, htmlBreaksToNewlines(item)]))
  }
  return value
}

export async function getPublicSitePage(pageId) {
  try {
    const row = await siteContentService.get(pageId)
    return htmlBreaksToNewlines(row?.content ?? null)
  } catch {
    return null
  }
}
