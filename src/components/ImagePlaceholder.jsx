export default function ImagePlaceholder({ width = '100%', height = '100%', className = '', label = 'Imagem' }) {
  return (
    <div className={`flex items-center justify-center bg-zinc-800 ${className}`} style={{ width, height }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="w-12 h-12 text-zinc-600"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      <span className="ml-2 text-xs text-zinc-600 uppercase tracking-widest">{label}</span>
    </div>
  )
}
