import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Menu, Moon, Sun, Maximize, Settings, User, LogOut, Pencil } from 'lucide-react'
import type { SidebarSize } from '../../pages/AdminPage'
import { authService } from '../../services/auth.service'

interface HeaderProps {
  onToggleSidebar: () => void
  isSidebarOpen: boolean
  isDarkMode: boolean
  onToggleDarkMode: () => void
  onToggleSettings: () => void
  sidebarSize: SidebarSize
  isMobile: boolean
  onNavigate?: (pageId: string) => void
}

export default function Header({ onToggleSidebar, isSidebarOpen, isDarkMode, onToggleDarkMode, onToggleSettings, sidebarSize, isMobile, onNavigate }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const usuario = authService.getUsuario()

  const handleEditProfile = () => {
    setIsUserMenuOpen(false)
    if (onNavigate) {
      onNavigate('editar-perfil')
    }
  }

  const handleLogout = () => {
    authService.logout()
    navigate('/', { replace: true })
  }

  useEffect(() => {
    if (!isUserMenuOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isUserMenuOpen])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  return (
    <header className={`bg-white dark:bg-[#07090c] border-b border-[#eb001a]/15 h-20 fixed top-0 right-0 left-0 z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm dark:shadow-none ${
      !isMobile && sidebarSize === 'default' && isSidebarOpen ? 'lg:pl-72' :
      !isMobile && sidebarSize !== 'hidden' ? 'lg:pl-20' :
      ''
    } transition-all duration-300`}>
      {/* Left Section */}
      <div className="flex items-center gap-6 flex-1">
        <button 
          onClick={onToggleSidebar}
          className="rounded-lg bg-[#eb001a]/10 p-2 text-[#eb001a] transition-colors hover:bg-[#eb001a]/15 dark:text-[#ff5364] cursor-pointer"
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </button>
        

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleDarkMode}
          className="rounded-lg border border-[#eb001a]/10 bg-[#eb001a]/5 p-2 text-[#eb001a] transition-colors hover:bg-[#eb001a]/12 cursor-pointer" 
          title="Toggle theme"
        >
          {isDarkMode ? (
            <Sun size={20} className="text-[#eb001a]" />
          ) : (
            <Moon size={20} className="text-[#eb001a]" />
          )}
        </button>
        <button 
          onClick={toggleFullscreen}
          className="rounded-lg border border-[#eb001a]/15 bg-[#eb001a]/5 p-2 text-[#eb001a] transition-colors hover:bg-[#eb001a]/12 cursor-pointer dark:bg-white/5" 
          title="Fullscreen"
        >
          <Maximize size={20} className="text-current" />
        </button>
        <button 
          onClick={onToggleSettings}
          className="rounded-lg border border-[#eb001a]/15 bg-[#eb001a]/5 p-2 text-[#eb001a] transition-colors hover:bg-[#eb001a]/12 cursor-pointer dark:bg-white/5" 
          title="Settings"
        >
          <Settings size={20} className="text-current" />
        </button>
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={isUserMenuOpen}
            className="ml-2 w-8 h-8 bg-[#eb001a]/20 border border-[#eb001a]/30 rounded-full flex items-center justify-center hover:bg-[#eb001a]/30 transition-colors cursor-pointer"
          >
            <User size={18} className="text-[#eb001a]" />
          </button>

          {isUserMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#111111] rounded-lg shadow-lg shadow-black/8 dark:shadow-black/50 border border-[#eb001a]/15 overflow-hidden z-50"
              style={{}}
            >
              <div className="px-4 py-3 text-xs text-[#eb001a] border-b border-[#eb001a]/10">
                Bem-vindo, {usuario?.nome ?? 'Usuário'}!
              </div>
              <button
                role="menuitem"
                onClick={handleEditProfile}
                className="w-full flex items-center gap-2 bg-[#eb001a]/8 px-4 py-2 text-sm font-medium text-[#eb001a] hover:bg-[#eb001a]/20 hover:text-[#eb001a] dark:text-[#ff5364] dark:hover:text-[#ff5364] transition-colors cursor-pointer"
              >
                <Pencil size={16} className="text-current" />
                Editar usuário
              </button>
              <button
                role="menuitem"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-600 dark:text-[#ff5364] dark:hover:bg-[#eb001a]/10 dark:hover:text-[#ff5364] transition-colors cursor-pointer"
              >
                <LogOut size={16} className="text-current" />
                Deslogar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
