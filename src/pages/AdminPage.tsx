import { useState, useEffect, useRef, lazy, Suspense, type ReactNode } from 'react'
import '../styles/admin.css'
import { useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../components/admin/Sidebar'
import AdminHeader from '../components/admin/Header'
import SettingsPanel from '../components/admin/SettingsPanel'
import ChartCard from '../components/admin/ChartCard'
import { Activity, ArrowLeft, BarChart3, CalendarDays, ClipboardList, ExternalLink, Eye, EyeOff, Flame, LogIn, MessageSquare, Newspaper, RefreshCw, ShieldCheck, Smartphone, TrendingUp, Users } from 'lucide-react'
import { authService } from '../services/auth.service'
import { analyticsService, type AnalyticsDeviceMonth, type AnalyticsLast7Day, type AnalyticsTopPage } from '../services/analytics.service'
import { diagnosisService, type DiagnosisLeadSummary } from '../services/diagnosis.service'
import { noticiasService } from '../services/noticias.service'
import { toast, Toaster } from 'sonner'
import RedefinirSenha from './admin/RedefinirSenha'
import logo from '../assets/08b9f6fbf9cc1d9a447971e440ecc78dda81d8a2.png'
import SiteContentPage from './admin/SiteContentPage'
const siteLogoUrl = '/Logo - Agência Evidence.png'

// Lazy-load all admin pages for code splitting
const Usuarios = lazy(() => import('./admin/Usuarios'))
const EditarPerfil = lazy(() => import('./admin/EditarPerfil'))
const BlogCreatorPage = lazy(() => import('./admin/BlogCreatorPage'))
const AnaliseBuilderPage = lazy(() => import('./admin/AnaliseBuilderPage'))
const AnaliseLeadsPage = lazy(() => import('./admin/AnaliseLeadsPage'))
const FaleConosco = lazy(() => import('./admin/FaleConosco'))

export type SidebarSize = 'default' | 'condensed' | 'hidden' | 'small-hover-active' | 'small-hover'

interface DashboardBlogItem {
  id: string
  categoria: string
  titulo: string
  createdAt: string
}

type LocalBlogArticle = {
  id?: string
  category?: string
  title?: string
  date?: string
}

const adminBlogArticlesKey = 'evidence_admin_blog_articles'
const editorRestrictedPages = new Set(['usuarios', 'conteudos-analise', 'conteudos-analise-leads'])

function isEditorRestrictedPage(pageId: string | null | undefined) {
  return !!pageId && editorRestrictedPages.has(pageId)
}

function formatDashboardDate(dateIso: string) {
  const parsed = new Date(dateIso)
  if (Number.isNaN(parsed.getTime())) return '--/--/----'
  return parsed.toLocaleDateString('pt-BR')
}

function getLocalAdminBlogs(): DashboardBlogItem[] {
  try {
    const saved = localStorage.getItem(adminBlogArticlesKey)
    if (!saved) return []

    const articles = JSON.parse(saved) as LocalBlogArticle[]
    if (!Array.isArray(articles)) return []

    return articles.map((post, index) => ({
      id: post.id || `local-blog-${index}`,
      categoria: post.category || 'Blog',
      titulo: post.title || 'Sem título',
      createdAt: post.date || new Date().toISOString(),
    }))
  } catch {
    return []
  }
}

function mapLatestBlogs(items: Awaited<ReturnType<typeof noticiasService.getAll>>): DashboardBlogItem[] {
  const apiBlogs = items.map((post) => ({
    id: post.id,
    categoria: post.categoria || 'Blog',
    titulo: post.titulo || 'Sem título',
    createdAt: post.createdAt || new Date().toISOString(),
  }))

  return [...apiBlogs, ...getLocalAdminBlogs()]
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)
}

function normalizeDeviceName(device: string) {
  switch (device.toLowerCase()) {
    case 'desktop': return 'Desktop'
    case 'mobile': return 'Mobile'
    case 'tablet': return 'Tablet'
    default: return device || 'Outro'
  }
}

function formatDeviceDetails(devices: AnalyticsDeviceMonth[]): string[] {
  if (devices.length === 0) return ['Sem dados de dispositivo no período.']

  return devices
    .slice()
    .sort((a, b) => b.count - a.count)
    .map((item) => `${normalizeDeviceName(item.device)}: ${item.count} acessos`)
}

function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatLast7DaysChart(last7Days: AnalyticsLast7Day[]) {
  const countsByDate = new Map(last7Days.map((item) => [item.date.slice(0, 10), item.count]))
  const labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
  const result: Array<{ name: string; value: number }> = []

  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const key = toDateKey(date)
    result.push({
      name: labels[date.getDay()],
      value: countsByDate.get(key) ?? 0,
    })
  }

  return result
}

function formatTopPageLabel(path: string): string {
  if (!path) return 'Página não identificada'

  const safePath = path.split('?')[0].split('#')[0]
  const normalized = safePath === '/' ? '/' : safePath.replace(/\/+$/, '')

  if (normalized === '/') return 'Início'
  if (normalized === '/blog') return 'Blog'
  if (normalized === '/projetos') return 'Projetos'
  if (normalized.startsWith('/blog/')) return 'Detalhe do Blog'
  if (normalized.startsWith('/projetos/')) return 'Detalhe de Projeto'
  if (normalized === '/admin') return 'Painel Administrativo'

  const clean = normalized.replace(/^\//, '')
  if (!clean) return 'Página não identificada'

  return clean
    .split('/')
    .map((segment) => decodeURIComponent(segment).replace(/[-_]/g, ' '))
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' / ')
}

function maskEmail(email: string): string {
  const [user, domain] = email.split('@')
  if (!domain) return email
  return `${user.slice(0, 2)}**@${domain}`
}

// â”€â”€ Login Form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [awaitingMfa, setAwaitingMfa] = useState(false)
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const mfaCode = otpDigits.join('')

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...otpDigits]
    next[index] = digit
    setOtpDigits(next)
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const next = [...otpDigits]
    pasted.split('').forEach((char, i) => { next[i] = char })
    setOtpDigits(next)
    const lastFilled = Math.min(pasted.length, 5)
    otpRefs.current[lastFilled]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setLoginError('')
    try {
      if (awaitingMfa) {
        await authService.verifyMfa(mfaCode)
      } else {
        await authService.login(email, senha)
      }
      onLogin()
    } catch (err: unknown) {
      const mfaErr = err as { code?: string; message?: string }
      if (mfaErr.code === 'MFA_REQUIRED') {
        setAwaitingMfa(true)
        toast.info(mfaErr.message ?? 'Digite o codigo MFA enviado por e-mail.')
      } else {
        const e = err as { response?: { status?: number; data?: { error?: string } } }
        const message = e.response?.status === 401
          ? 'E-mail ou senha incorretos.'
          : e.response?.data?.error || 'Não foi possível entrar. Tente novamente.'
        setLoginError(message)
        toast.error(message)
      }
    } finally {
      setLoading(false)
    }
  }

  if (awaitingMfa) {
    return (
      <div className="min-h-screen bg-[#07090c] flex items-center justify-center p-4">
        <Toaster position="top-right" richColors />
        <div className="w-full max-w-md bg-[#111111] border border-[#eb001a]/15 rounded-2xl shadow-xl shadow-black/60 overflow-hidden">
          {/* Header â€” mesma identidade do login */}
          <div className="bg-[#07090c] border-b border-[#eb001a]/15 px-6 py-8 flex flex-col items-center">
            <img src={siteLogoUrl} alt="Agência Evidence" className="h-14 w-auto" />
            <p className="mt-3 rounded-full bg-[#eb001a]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#eb001a]">Painel Administrativo</p>
          </div>

          {/* Body */}
          <div className="px-4 sm:px-8 py-8 flex flex-col items-center">
            {/* Ícone escudo */}
            <div className="w-14 h-14 rounded-full bg-[#eb001a]/10 border border-[#eb001a]/20 flex items-center justify-center mb-4">
              <ShieldCheck size={28} className="text-[#eb001a]" />
            </div>

            <h2 className="text-[#f1f2f4] text-xl font-semibold mb-2 text-center">
              Verificação em duas etapas
            </h2>
            <p className="text-sm text-center text-[#f1f2f4]/55 mb-6 leading-relaxed">
              Digite o código de 6 dígitos enviado para{' '}
              <span className="text-[#eb001a] font-medium break-all">{maskEmail(email)}</span>
            </p>

            {/* 6 OTP inputs */}
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex gap-2 justify-center mb-6">
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    onPaste={i === 0 ? handleOtpPaste : undefined}
                    className="w-10 h-12 sm:w-11 sm:h-13 text-center text-lg font-semibold border-2 border-[#eb001a]/25 dark:border-[#eb001a]/20 rounded-lg bg-[#f7f8fa] dark:bg-[#1A1A1A] text-[#f1f2f4] focus:outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/20 transition-colors"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || mfaCode.length < 6}
                className="w-full py-2.5 bg-[#eb001a] hover:bg-[#c90015] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Verificando...' : 'Verificar código'}
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setAwaitingMfa(false)
                setOtpDigits(['', '', '', '', '', ''])
              }}
              className="mt-4 flex items-center gap-1 text-sm text-[#f1f2f4]/45 hover:text-[#eb001a] transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              Voltar ao login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#07090c] flex items-center justify-center p-4">
      <Toaster position="top-right" richColors />
      <div className="w-full max-w-md bg-[#111111] border border-[#eb001a]/15 rounded-2xl shadow-xl shadow-black/60 overflow-hidden">
        <div className="bg-[#07090c] border-b border-[#eb001a]/15 px-8 py-8 flex flex-col items-center">
          <img src={siteLogoUrl} alt="Agência Evidence" className="h-14 w-auto" />
          <p className="mt-3 rounded-full bg-[#eb001a]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#eb001a]">Painel Administrativo</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#f1f2f4]/70 mb-1">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => { setEmail(e.target.value); setLoginError('') }}
              aria-invalid={!!loginError}
              className="w-full px-3 py-2 border border-[#eb001a]/20 rounded-lg text-sm bg-[#f7f8fa] dark:bg-[#1A1A1A] text-[#f1f2f4] focus:outline-none focus:ring-2 focus:ring-[#eb001a]/30 placeholder:text-[#f1f2f4]/35"
              placeholder="master@evidence.local"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#f1f2f4]/70 mb-1">Senha</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                required
                value={senha}
                onChange={e => { setSenha(e.target.value); setLoginError('') }}
                aria-invalid={!!loginError}
                className="w-full px-3 py-2 pr-10 border border-[#eb001a]/20 rounded-lg text-sm bg-[#f7f8fa] dark:bg-[#1A1A1A] text-[#f1f2f4] focus:outline-none focus:ring-2 focus:ring-[#eb001a]/30 placeholder:text-[#f1f2f4]/35"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShow(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f1f2f4]/40 hover:text-[#eb001a] cursor-pointer"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {loginError && (
            <div className="rounded-lg border border-[#eb001a]/25 bg-[#eb001a]/10 px-3 py-2 text-sm font-medium text-[#ff5364]" role="alert">
              {loginError}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#eb001a] hover:bg-[#c90015] text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <LogIn size={18} />
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

// â”€â”€ Dashboard Home â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function DashboardMetricCard({ label, value, detail, icon, tone = 'red' }: { label: string; value: string | number; detail: string; icon: ReactNode; tone?: 'red' | 'dark' | 'green' | 'amber' }) {
  const toneClasses = {
    red: 'bg-[#fff1f3] text-[#eb001a]',
    dark: 'bg-[#111318] text-white',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
  }

  return (
    <div className="rounded-[26px] border border-[#e3e7ee] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a93a3]">{label}</p>
          <strong className="mt-3 block text-[34px] font-black leading-none tracking-tight text-[#111318]">{value}</strong>
          <span className="mt-3 block text-[13px] font-semibold text-[#6b7280]">{detail}</span>
        </div>
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${toneClasses[tone]}`}>{icon}</div>
      </div>
    </div>
  )
}

const DASHBOARD_PANEL_LOAD_ERROR = 'Não foi possível carregar todos os dados do painel agora.'
const LEGACY_DASHBOARD_PANEL_LOAD_ERROR = 'N?o foi poss?vel carregar todos os dados do painel agora.'

function normalizeDashboardMessage(message: string) {
  return message === LEGACY_DASHBOARD_PANEL_LOAD_ERROR ? DASHBOARD_PANEL_LOAD_ERROR : message
}

function DashboardHome() {
  const navigate = useNavigate()
  const [latestBlogs, setLatestBlogs] = useState<DashboardBlogItem[]>([])
  const [topPages, setTopPages] = useState<AnalyticsTopPage[]>([])
  const [recentLeads, setRecentLeads] = useState<DiagnosisLeadSummary[]>([])
  const [viewsMonth, setViewsMonth] = useState(0)
  const [dailyAverage, setDailyAverage] = useState(0)
  const [totalViews, setTotalViews] = useState(0)
  const [deviceDetails, setDeviceDetails] = useState<string[]>([])
  const [chartData, setChartData] = useState<Array<{ name: string; value: number }>>([])
  const [loading, setLoading] = useState(true)
  const [cleanupLoading, setCleanupLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const currentUser = authService.getUsuario()
  const currentRole = currentUser?.role?.toLowerCase()
  const canCleanup = currentRole === 'master'
  const canViewLeads = currentRole !== 'editor'

  const loadDashboardData = async (showToast = false) => {
    setLoading(true)
    setErrorMessage('')

    try {
      const [stats, month, devices, average, last7Days, pages, blogs, leads] = await Promise.all([
        analyticsService.getStats(),
        analyticsService.getViewsMonth(),
        analyticsService.getDevicesMonth(),
        analyticsService.getDailyAverage(),
        analyticsService.getLast7Days(),
        analyticsService.getTopPages(5),
        noticiasService.getAll(),
        canViewLeads ? diagnosisService.listLeads() : Promise.resolve([]),
      ])

      setTotalViews(stats.totalViews)
      setViewsMonth(month.count)
      setDeviceDetails(formatDeviceDetails(devices))
      setDailyAverage(average.average)
      setChartData(formatLast7DaysChart(last7Days))
      setTopPages(pages)
      setLatestBlogs(mapLatestBlogs(blogs))
      setRecentLeads(leads.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5))
    } catch {
      setErrorMessage(DASHBOARD_PANEL_LOAD_ERROR)
      setDeviceDetails(['Sem dados de dispositivo no período.'])
      setChartData(formatLast7DaysChart([]))
      setTopPages([])
      setLatestBlogs([])
      setRecentLeads([])
      if (showToast) toast.error('Falha ao atualizar o painel')
    } finally {
      setLoading(false)
    }
  }

  const handleCleanup = async () => {
    if (!canCleanup || cleanupLoading) return

    setCleanupLoading(true)
    try {
      const result = await analyticsService.cleanup(90)
      toast.success(result.message || 'Limpeza de dados concluída')
      await loadDashboardData(false)
    } catch {
      toast.error('Não foi possível limpar os dados antigos')
    } finally {
      setCleanupLoading(false)
    }
  }

  useEffect(() => { loadDashboardData(false) }, [])

  const hotLeads = recentLeads.filter(lead => String(lead.leadTemperature || '').toLowerCase() === 'hot').length
  const newLeads = recentLeads.filter(lead => lead.status === 'new').length

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[30px] border border-[#111318] bg-[#07090c] p-6 text-white shadow-[0_24px_80px_rgba(7,9,12,0.22)] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#eb001a]/15 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#ff5364]"><Activity className="h-3.5 w-3.5" /> Central de controle</p>
            <h1 className="mt-4 text-[clamp(30px,4vw,50px)] font-black leading-tight">Visão geral da operação</h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/70">Acompanhe analytics do site, respostas recentes da análise e conteúdos publicados em um painel mais legível e acionável.</p>
          </div>
          <button type="button" onClick={() => loadDashboardData(true)} className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/15 bg-white px-4 text-[13px] font-black text-[#111318] transition hover:bg-[#fff1f3]"><RefreshCw className="h-4 w-4 text-[#eb001a]" />Atualizar</button>
        </div>
      </section>

      {errorMessage && <div className="rounded-2xl border border-[#eb001a]/20 bg-[#fff1f3] px-4 py-3 text-sm font-bold text-[#eb001a]">{normalizeDashboardMessage(errorMessage)}</div>}

      <section className={`grid gap-4 md:grid-cols-2 ${canViewLeads ? 'xl:grid-cols-4' : 'xl:grid-cols-2'}`}>
        <DashboardMetricCard label="Acessos no mês" value={loading ? '...' : viewsMonth} detail={`Total geral: ${totalViews}`} icon={<Users className="h-5 w-5" />} />
        <DashboardMetricCard label="Média diária" value={loading ? '...' : dailyAverage} detail="Últimos 30 dias" icon={<TrendingUp className="h-5 w-5" />} tone="green" />
        {canViewLeads && <DashboardMetricCard label="Novas análises" value={loading ? '...' : recentLeads.length} detail={`${newLeads} ainda como novas`} icon={<MessageSquare className="h-5 w-5" />} tone="dark" />}
        {canViewLeads && <DashboardMetricCard label="Leads quentes" value={loading ? '...' : hotLeads} detail="Prioridade comercial" icon={<Flame className="h-5 w-5" />} tone="amber" />}
      </section>

      <section className={`grid gap-5 ${canViewLeads ? 'xl:grid-cols-[minmax(0,1.45fr)_minmax(380px,0.8fr)]' : ''}`}>
        <div className="space-y-5">
          <div className="rounded-[28px] border border-[#e3e7ee] bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div><p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#eb001a]">Analytics do site</p><h2 className="mt-1 text-xl font-black text-[#111318]">Acessos nos últimos 7 dias</h2></div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#f8fafc] px-3 py-1.5 text-[12px] font-bold text-[#5f6672]"><BarChart3 className="h-4 w-4 text-[#eb001a]" />{viewsMonth} no mês</div>
            </div>
            <ChartCard title="" data={chartData} />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-[28px] border border-[#e3e7ee] bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#fff1f3] text-[#eb001a]"><Smartphone className="h-5 w-5" /></div><div><p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a93a3]">Dispositivos</p><h3 className="text-lg font-black text-[#111318]">Acessos por dispositivo</h3></div></div>
              <div className="space-y-3">{deviceDetails.map((detail) => <div key={detail} className="rounded-2xl bg-[#f8fafc] px-4 py-3 text-sm font-bold text-[#5f6672]">{detail}</div>)}</div>
            </div>

            <div className="rounded-[28px] border border-[#e3e7ee] bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#fff1f3] text-[#eb001a]"><Eye className="h-5 w-5" /></div><div><p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a93a3]">Tráfego</p><h3 className="text-lg font-black text-[#111318]">Páginas mais visitadas</h3></div></div>
              {topPages.length === 0 ? <p className="text-sm font-semibold text-[#6b7280]">Sem dados de páginas mais visitadas.</p> : <div className="space-y-3">{topPages.map((page, index) => <div key={`${page.page}-${index}`} className="flex items-center justify-between gap-3 rounded-2xl bg-[#f8fafc] px-4 py-3"><p className="truncate text-sm font-bold text-[#111318]">{page.title ?? formatTopPageLabel(page.page)}</p><span className="rounded-full bg-white px-2.5 py-1 text-[12px] font-black text-[#eb001a]">{page.views}</span></div>)}</div>}
              {canCleanup && <button type="button" onClick={handleCleanup} disabled={cleanupLoading} className="mt-4 w-full rounded-2xl border border-[#eb001a]/25 px-3 py-2.5 text-sm font-black text-[#eb001a] transition hover:bg-[#eb001a]/5 disabled:opacity-60">{cleanupLoading ? 'Limpando dados antigos...' : 'Limpar dados antigos (+90 dias)'}</button>}
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          {canViewLeads && (
            <div className="rounded-[28px] border border-[#e3e7ee] bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div><p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#eb001a]">Novas respostas das análises</p><h2 className="mt-1 text-xl font-black text-[#111318]">Chegadas recentes</h2><p className="mt-1 text-sm font-semibold text-[#6b7280]">Leads enviados pelo formulário /analise.</p></div>
                <button type="button" onClick={() => navigate('/admin?page=conteudos-analise-leads')} className="inline-flex h-10 items-center gap-2 rounded-2xl bg-[#111318] px-3 text-[12px] font-black text-white transition hover:bg-[#eb001a]">Ver todos <ExternalLink className="h-3.5 w-3.5" /></button>
              </div>
              {recentLeads.length === 0 ? <p className="rounded-2xl bg-[#f8fafc] p-4 text-sm font-semibold text-[#6b7280]">Nenhuma resposta de análise recebida ainda.</p> : <div className="space-y-3">{recentLeads.map((lead) => <button key={lead.id} type="button" onClick={() => navigate('/admin?page=conteudos-analise-leads')} className="w-full rounded-2xl border border-[#e3e7ee] p-4 text-left transition hover:border-[#eb001a]/40 hover:bg-[#fffafb]"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-[15px] font-black text-[#111318]">{lead.companyName || lead.name || 'Lead sem nome'}</p><p className="mt-1 text-[12px] font-bold text-[#6b7280]">{lead.name} - {lead.formType}</p></div><span className="rounded-full bg-[#fff1f3] px-2.5 py-1 text-[11px] font-black text-[#eb001a]">Score {lead.score ?? 0}</span></div><div className="mt-3 flex flex-wrap gap-2 text-[12px] font-semibold text-[#6b7280]"><span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{formatDashboardDate(lead.createdAt)}</span><span>{lead.city || '--'} / {lead.state || '--'}</span><span className="text-[#eb001a]">{lead.status}</span></div></button>)}</div>}
            </div>
          )}

          <div className="rounded-[28px] border border-[#e3e7ee] bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#fff1f3] text-[#eb001a]"><Newspaper className="h-5 w-5" /></div><div><p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#8a93a3]">Conteúdo</p><h3 className="text-lg font-black text-[#111318]">Últimos blogs</h3></div></div>
            {latestBlogs.length === 0 ? <p className="text-sm font-semibold text-[#6b7280]">Nenhum blog publicado ainda.</p> : <div className="space-y-3">{latestBlogs.map((post) => <div key={post.id} className="rounded-2xl bg-[#f8fafc] p-4"><p className="text-[11px] font-black uppercase tracking-wide text-[#eb001a]">{post.categoria}</p><p className="mt-1 font-bold leading-snug text-[#111318]">{post.titulo}</p><p className="mt-2 text-xs font-semibold text-[#8a93a3]">{formatDashboardDate(post.createdAt)}</p></div>)}</div>}
          </div>
        </aside>
      </section>
    </div>
  )
}

// Admin Dashboard
export default function AdminPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(location.search)
  const pageFromUrl = searchParams.get('page')
  const blockFromUrl = searchParams.get('block')
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated())
  const [isFirstLogin, setIsFirstLogin] = useState(() => !!authService.getUsuario()?.first_login)
  const [activePage, setActivePage] = useState(pageFromUrl || 'dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [sidebarSize, setSidebarSize] = useState<SidebarSize>('default')
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const currentUser = authService.getUsuario()
  const isEditor = currentUser?.role?.toLowerCase() === 'editor'

  useEffect(() => {
    const onAuthExpired = () => setIsAuthenticated(false)
    window.addEventListener('auth:expired', onAuthExpired)
    return () => window.removeEventListener('auth:expired', onAuthExpired)
  }, [])

  useEffect(() => {
    const nextPage = pageFromUrl || 'dashboard'

    if (isEditor && isEditorRestrictedPage(nextPage)) {
      setActivePage('dashboard')
      navigate('/admin', { replace: true })
      return
    }

    setActivePage(nextPage)
  }, [pageFromUrl, isEditor, navigate])

  useEffect(() => {
    // Always start in light mode â€” remove any previously saved dark preference
    localStorage.removeItem('theme')
    const html = document.querySelector('html')
    if (html) html.classList.remove('dark')
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 1024
      setIsMobile(mobileView)
      if (!mobileView) setIsMobileSidebarOpen(false)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!isAuthenticated) {
    return <LoginForm onLogin={() => {
      setIsAuthenticated(true)
      setIsFirstLogin(!!authService.getUsuario()?.first_login)
    }} />
  }

  if (isFirstLogin) {
    return <RedefinirSenha onComplete={() => setIsFirstLogin(false)} />
  }

  const toggleDarkMode = () => {
    const newDark = !isDarkMode
    setIsDarkMode(newDark)
    const html = document.querySelector('html')
    if (html) {
      newDark ? html.classList.add('dark') : html.classList.remove('dark')
      localStorage.setItem('theme', newDark ? 'dark' : 'light')
    }
  }

  const handleToggleSidebar = () => {
    if (isMobile) { setIsMobileSidebarOpen(v => !v); return }
    setIsSidebarOpen(v => !v)
  }

  const handleNavigate = (pageId: string) => {
    if (isEditor && isEditorRestrictedPage(pageId)) return

    setActivePage(pageId)
    navigate(pageId === 'dashboard' ? '/admin' : `/admin?page=${encodeURIComponent(pageId)}`)
    if (isMobile) setIsMobileSidebarOpen(false)
  }

  const renderPage = () => {
    if (isEditor && isEditorRestrictedPage(activePage)) return <DashboardHome />

    if (activePage === 'content-contato') return <FaleConosco />

    if (activePage.startsWith('content-')) {
      return (
        <SiteContentPage
          pageId={activePage}
          editBlockId={blockFromUrl || undefined}
          onBackToBlocks={() => navigate(`/admin?page=${encodeURIComponent(activePage)}`)}
        />
      )
    }

    switch (activePage) {
      case 'conteudos-blog': return <BlogCreatorPage />
      case 'conteudos-analise': return <AnaliseBuilderPage />
      case 'conteudos-analise-leads': return <AnaliseLeadsPage />
      case 'usuarios': return <Usuarios />
      case 'editar-perfil': return <EditarPerfil onBack={() => setActivePage('dashboard')} />
      default: return <DashboardHome />
    }
  }

  const isDesktopVisible = !isMobile && isSidebarOpen && sidebarSize !== 'hidden'
  const mainOffsetClass = isMobile || !isDesktopVisible ? 'ml-0' : sidebarSize === 'default' ? 'lg:ml-64' : 'ml-0'
  const mainPaddingLeftClass = !isMobile && sidebarSize !== 'hidden' ? (sidebarSize === 'default' && isSidebarOpen ? '' : 'lg:pl-20') : ''

  return (
    <div className="admin-panel min-h-screen bg-[#f7f8fa] dark:bg-[#07090c] overflow-x-hidden">
      <Toaster position="top-right" richColors />

      {(sidebarSize !== 'hidden' || isMobile) && (
        <Sidebar
          isOpen={isDesktopVisible && sidebarSize === 'default'}
          hoverMode={!isMobile && sidebarSize === 'small-hover'}
          isMobile={isMobile}
          isMobileOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          onNavigate={handleNavigate}
          activePage={activePage}
        />
      )}

      {isMobile && isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-10" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      <div className={`${mainOffsetClass} ${mainPaddingLeftClass} min-h-screen flex flex-col transition-all duration-300`}>
        <AdminHeader
          onToggleSidebar={handleToggleSidebar}
          isSidebarOpen={isSidebarOpen}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onToggleSettings={() => setIsSettingsOpen(v => !v)}
          sidebarSize={sidebarSize}
          isMobile={isMobile}
          onNavigate={handleNavigate}
        />

        <main className="flex-1 pt-20 lg:pt-20 p-4 sm:p-6 lg:p-8">
          <Suspense fallback={<div className="flex items-center justify-center h-64 text-[#eb001a]/60">Carregando...</div>}>
            <div className="pt-2 sm:pt-4">
              {renderPage()}
            </div>
          </Suspense>
        </main>

        <footer className="py-4 text-center text-sm text-black border-t border-[#eb001a]/10">
          2026 © Criado por Agência Evidence{' '}
          <a
            href="https://agenciaevidence.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-[#c90015] underline underline-offset-2"
          >
            Agência Evidence
          </a>
        </footer>
      </div>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        sidebarSize={sidebarSize}
        onSidebarSizeChange={setSidebarSize}
      />
    </div>
  )
}
