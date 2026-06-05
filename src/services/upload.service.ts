import { api } from './api'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/pjpeg']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

const FORMAT_TIP = 'Use JPG, PNG ou WebP, máximo 5MB.'

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `Formato não suportado (${file.type || 'desconhecido'}). ${FORMAT_TIP}`
  }
  if (file.size > MAX_SIZE_BYTES) {
    return `Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(1)}MB). ${FORMAT_TIP}`
  }
  return null
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('Não foi possível ler a imagem selecionada.'))
    reader.readAsDataURL(file)
  })
}

export const uploadService = {
  async uploadImage(file: File, folder: string): Promise<{ url: string }> {
    const error = validateImageFile(file)
    if (error) throw new Error(error)

    const image = await fileToDataUrl(file)
    return api.post<{ url: string }>('/uploads/image', { image, folder })
  },
}
