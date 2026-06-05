import { useState } from 'react'
import {
  LayoutDashboard,
  FileStack,
  Inbox,
  PencilLine,
  Users,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react'
import { authService } from '../../services/auth.service'
const logo = '/Logo - Agência Evidence.png'

interface SubMenuItem {
  id: string
  label: string
}

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  isActive?: boolean
  hasSubmenu?: boolean
  submenu?: SubMenuItem[]
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Painel de Controle',
    icon: <LayoutDashboard size={20} />,
    isActive: true
  },
  {
    id: 'conteudos-analise-leads',
    label: 'Respostas Análise',
    icon: <Inbox size={20} />
  },
  {
    id: 'content',
    label: 'Edição',
    icon: <PencilLine size={20} />,
    hasSubmenu: true,
    submenu: [
      { id: 'content-home', label: 'Home' },
      { id: 'content-como-trabalhamos', label: 'Como trabalhamos' },
      { id: 'content-servicos', label: 'Serviços' },
      { id: 'content-clientes', label: 'Clientes' },
      { id: 'content-blog', label: 'Blog' },
      { id: 'content-depoimentos', label: 'Depoimentos' },
      { id: 'content-analise', label: 'Análise' },
      { id: 'content-contato', label: 'Contato' },
    ]
  },
  {
    id: 'conteudos',
    label: 'Conteúdos',
    icon: <FileStack size={20} />,
    hasSubmenu: true,
    submenu: [
      { id: 'conteudos-blog', label: 'Blog' },
      { id: 'conteudos-analise', label: 'Maker Análise' },
    ],
  },
  {
    id: 'usuarios',
    label: 'Usuários',
    icon: <Users size={20} />
  },
]

interface SidebarProps {
  isOpen: boolean
  hoverMode?: boolean
  isMobile?: boolean
  isMobileOpen?: boolean
  onClose?: () => void
  onNavigate?: (pageId: string) => void
  activePage?: string
}

export default function Sidebar({ isOpen, hoverMode = false, isMobile = false, isMobileOpen = false, onClose, onNavigate, activePage }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<string[]>([])
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  const effectiveIsOpen = isMobile ? true : (hoverMode ? isHovered : isOpen)
  const isSidebarVisible = isMobile ? isMobileOpen : true

  const currentRole = authService.getUsuario()?.role?.toLowerCase()
  const filteredMenuItems = menuItems.filter(item =>
    item.id === 'usuarios' ? currentRole !== 'editor' : true
  )

  const toggleMenu = (menuId: string) => {
    if (!effectiveIsOpen) {
      // Quando condensado, usa hover em vez de click
      return
    }
    setOpenMenus(prev =>
      prev.includes(menuId)
        ? []
        : [menuId]
    )
  }

  const handleMouseEnter = (menuId: string, hasSubmenu: boolean) => {
    if (!isOpen && hasSubmenu) {
      setHoveredMenu(menuId)
    }
  }

  const handleMouseLeave = () => {
    if (!isOpen) {
      setHoveredMenu(null)
    }
  }

  return (
    <aside
      className={`bg-[#07090c] text-white h-screen fixed left-0 top-0 transition-all duration-300 ${isMobile ? 'z-[2147483647]' : 'z-20'} border-r border-[#eb001a]/10 ${
        effectiveIsOpen ? 'w-64 overflow-y-auto' : 'w-16 overflow-visible'
      } ${isMobile ? `w-64 ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'}` : 'translate-x-0'}`}
      onMouseEnter={() => hoverMode && setIsHovered(true)}
      onMouseLeave={() => hoverMode && setIsHovered(false)}
    >
      {/* Mobile Close */}
      {isMobile && (
        <div className="flex items-center justify-end px-4 pt-4">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Fechar menu"
          >
            <X size={18} />
          </button>
        </div>
      )}
      {/* Logo */}
      <div className={`h-20 flex items-center border-b border-[#eb001a]/15 ${isMobile ? '' : 'bg-[#eb001a]/5'} ${effectiveIsOpen ? 'px-6' : 'px-3 justify-center'}`}>
        {effectiveIsOpen ? (
          <div className="flex items-center gap-3">
            <img src={logo} alt="Agência Evidence" className="h-11 w-auto" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#eb001a]/15 border border-[#eb001a]/30">
            <img src={logo} alt="Logo" className="w-7 h-7 object-contain" />
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="py-4">
        {effectiveIsOpen && (
          <div className="px-4 mb-2">
            <span className="text-xs uppercase tracking-wider opacity-60">MENU</span>
          </div>
        )}
        {filteredMenuItems.map((item) => (
          <div
            key={item.id}
            className="relative"
            onMouseEnter={() => handleMouseEnter(item.id, item.hasSubmenu || false)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => {
                if (item.hasSubmenu) {
                  toggleMenu(item.id)
                } else {
                  onNavigate?.(item.id)
                }
              }}
              className={`
                w-full flex items-center ${effectiveIsOpen ? 'justify-between px-6' : 'justify-center px-0'} py-3 transition-colors cursor-pointer
                ${activePage === item.id || (!activePage && item.isActive)
                  ? 'bg-[#eb001a]/10 border-l-4 border-[#eb001a] text-white'
                  : 'hover:bg-[#eb001a]/5 border-l-4 border-transparent text-white/70 hover:text-white'
                }
              `}
              title={!effectiveIsOpen ? item.label : undefined}
            >
              <div className={`flex items-center ${effectiveIsOpen ? 'gap-3' : ''}`}>
                {item.icon}
                {effectiveIsOpen && <span className="text-sm font-medium">{item.label}</span>}
              </div>
              {effectiveIsOpen && item.hasSubmenu && (
                openMenus.includes(item.id)
                  ? <ChevronDown size={16} />
                  : <ChevronRight size={16} />
              )}
            </button>

            {/* Submenu quando expandido */}
            {effectiveIsOpen && item.hasSubmenu && (
              <div className={`overflow-hidden transition-all duration-300 ${openMenus.includes(item.id) ? 'max-h-[520px]' : 'max-h-0'}`}>
                <div className="bg-[#eb001a]/5">
                  {item.submenu?.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => onNavigate?.(subItem.id)}
                      className={`w-full text-left px-6 pl-14 py-2 text-sm transition-colors cursor-pointer ${
                        activePage === subItem.id
                          ? 'text-[#eb001a] bg-[#eb001a]/10 font-medium'
                          : 'text-white/60 hover:text-white hover:bg-[#eb001a]/5'
                      }`}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submenu flutuante quando condensado */}
            {!effectiveIsOpen && item.hasSubmenu && hoveredMenu === item.id && (
              <div
                className="absolute left-full top-0 bg-[#111111] border border-[#eb001a]/15 rounded-lg shadow-2xl shadow-black/50 py-2 min-w-50 z-50"
                onMouseEnter={() => setHoveredMenu(item.id)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="px-4 py-2 border-b border-[#eb001a]/12">
                  <span className="text-sm font-semibold text-[#eb001a]">{item.label}</span>
                </div>
                {item.submenu?.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => onNavigate?.(subItem.id)}
                    className="w-full text-left px-4 py-2 text-sm text-white/75 hover:text-white hover:bg-[#eb001a]/8 transition-colors cursor-pointer"
                  >
                    {subItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}
