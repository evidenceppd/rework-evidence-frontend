import { X } from 'lucide-react'
import type { SidebarSize } from '../../pages/AdminPage'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  isDarkMode: boolean
  onToggleDarkMode: () => void
  sidebarSize: SidebarSize
  onSidebarSizeChange: (size: SidebarSize) => void
}

export default function SettingsPanel({ isOpen, onClose, isDarkMode, onToggleDarkMode, sidebarSize, onSidebarSizeChange }: SettingsPanelProps) {
  const optionTextStyle = { color: isDarkMode ? '#f1f2f4' : '#111318' }

  const handleReset = () => {
    if (isDarkMode) onToggleDarkMode()
    onSidebarSizeChange('default')
    localStorage.removeItem('theme')
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Settings Panel */}
      <div className={`fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-white dark:bg-[#07090c] border-l border-[#eb001a]/15 dark:border-[#eb001a]/20 shadow-2xl shadow-black/10 dark:shadow-black/60 z-50 flex flex-col transition-transform duration-300 rounded-l-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="bg-[#f7f8fa] dark:bg-[#111111] border-b border-[#eb001a]/15 px-6 py-4 flex items-center justify-between rounded-tl-2xl">
          <h2 className="text-[#eb001a] font-semibold text-lg">Configurações do tema</h2>
          <button
            onClick={onClose}
            className="text-[#111111]/55 dark:text-[#f1f2f4]/60 hover:bg-[#eb001a]/10 rounded-lg p-1 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto !text-slate-900 dark:!text-slate-100">
          {/* Color Scheme */}
          <div className="mb-8">
            <h3 className="text-[#eb001a] font-semibold mb-4">Esquema de cores</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer !text-slate-900 dark:!text-slate-100">
                <input
                  type="radio"
                  name="theme"
                  checked={!isDarkMode}
                  onChange={() => !isDarkMode || onToggleDarkMode()}
                  className="w-4 h-4 accent-[#eb001a] cursor-pointer"
                />
                <span className="font-semibold" style={optionTextStyle}>Claro</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer !text-slate-900 dark:!text-slate-100">
                <input
                  type="radio"
                  name="theme"
                  checked={isDarkMode}
                  onChange={() => isDarkMode || onToggleDarkMode()}
                  className="w-4 h-4 accent-[#eb001a] cursor-pointer"
                />
                <span className="font-semibold" style={optionTextStyle}>Escuro</span>
              </label>
            </div>
          </div>

          {/* Sidebar Size */}
          <div className="mb-8">
            <h3 className="text-[#eb001a] font-semibold mb-4">Tamanho da barra lateral</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer !text-slate-900 dark:!text-slate-100">
                <input
                  type="radio"
                  name="sidebar"
                  checked={sidebarSize === 'default'}
                  onChange={() => onSidebarSizeChange('default')}
                  className="w-4 h-4 accent-[#eb001a] cursor-pointer"
                />
                <span className="font-semibold" style={optionTextStyle}>Padrão</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer !text-slate-900 dark:!text-slate-100">
                <input
                  type="radio"
                  name="sidebar"
                  checked={sidebarSize === 'condensed'}
                  onChange={() => onSidebarSizeChange('condensed')}
                  className="w-4 h-4 accent-[#eb001a] cursor-pointer"
                />
                <span className="font-semibold" style={optionTextStyle}>Compacta</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer !text-slate-900 dark:!text-slate-100">
                <input
                  type="radio"
                  name="sidebar"
                  checked={sidebarSize === 'hidden'}
                  onChange={() => onSidebarSizeChange('hidden')}
                  className="w-4 h-4 accent-[#eb001a] cursor-pointer"
                />
                <span className="font-semibold" style={optionTextStyle}>Oculta</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer !text-slate-900 dark:!text-slate-100">
                <input
                  type="radio"
                  name="sidebar"
                  checked={sidebarSize === 'small-hover'}
                  onChange={() => onSidebarSizeChange('small-hover')}
                  className="w-4 h-4 accent-[#eb001a] cursor-pointer"
                />
                <span className="font-semibold" style={optionTextStyle}>Pequena no hover</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#eb001a]/12">
          <button
            onClick={handleReset}
            className="w-full bg-[#eb001a] hover:bg-[#c90015] text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer"
          >
            Restaurar padrão
          </button>
        </div>
      </div>
    </>
  )
}
