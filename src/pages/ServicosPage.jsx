import React from 'react';
import {
  BadgeCheck,
  BarChart3,
  BookOpen,
  Bot,
  Boxes,
  Brain,
  Briefcase,
  Calendar,
  Camera,
  ChartColumn,
  Clapperboard,
  Cloud,
  Code2,
  Cpu,
  Database,
  Eye,
  FileText,
  Flag,
  Funnel,
  Gauge,
  Gem,
  Globe,
  Handshake,
  Laptop,
  Layers,
  Lightbulb,
  LineChart,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  Monitor,
  MousePointer2,
  MousePointerClick,
  Network,
  Newspaper,
  Palette,
  PenTool,
  Phone,
  PieChart,
  Pencil,
  Presentation,
  Radio,
  Rocket,
  Search,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Target,
  Trophy,
  Users,
  Video,
  Workflow,
  Wrench,
  Zap,
} from 'lucide-react'
import Footer from '../components/Footer'
import { getPublicSitePage } from '../services/publicSiteContent.service'

/* ── Icons: service cards ── */
function IconBroadcast() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: 'auto', height: '60px' }} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M9.6 22.6c-1.8 0-3.5-.6-5-1.8-1.9-1.5-3-3.7-3.2-6.2-.1-2.6.8-5.1 2.7-7l6.1-6.1c.2-.2.6-.2.8 0l2.6 2.6c.1.1.2.3.2.4 0 .2-.1.3-.2.4l-6.2 6.2c-.8.8-1.3 2-1.2 3.2.1 1.1.6 2 1.4 2.7 2.3 1.8 4.7-.2 5.7-1.2l5.7-5.6c.2-.2.6-.2.8 0l2.6 2.6c.1.1.2.3.2.4 0 .2-.1.3-.2.4l-5.7 5.6c-2.1 2.3-4.7 3.4-7.1 3.4zm-4.3-2.7c3.1 2.4 7.3 1.8 10.6-1.4l5.2-5.2-1.7-1.7-5.2 5.2C11.7 19.2 9 19.7 6.9 18c-1.1-.9-1.8-2.1-1.9-3.6s.5-3 1.6-4.1l5.8-5.8-1.7-1.7-5.8 5.8c-1.6 1.6-2.5 3.8-2.3 6.1.1 2 1.1 3.9 2.7 5.2z" />
        <path d="M10.7 7.8c-.2 0-.3-.1-.4-.2L7.7 5c-.2-.1-.2-.3-.2-.4 0-.2.1-.3.2-.4l2.6-2.6c.2-.2.6-.2.8 0l2.6 2.6c.1.1.2.3.2.4 0 .2-.1.3-.2.4l-2.6 2.6c-.1.1-.3.2-.4.2zM8.9 4.6l1.7 1.7 1.7-1.7-1.7-1.7zM19.4 16.4c-.2 0-.3-.1-.4-.2l-2.6-2.6c-.1-.1-.2-.3-.2-.4 0-.2.1-.3.2-.4l2.6-2.6c.2-.2.6-.2.8 0l2.6 2.6c.1.1.2.3.2.4 0 .2-.1.3-.2.4l-2.6 2.6c-.1.2-.2.2-.4.2zm-1.7-3.1 1.7 1.7 1.7-1.7-1.7-1.7z" />
      </g>
    </svg>
  )
}
function IconFunnel() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 'auto', height: '60px' }}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}
function IconVideo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 'auto', height: '60px' }}>
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  )
}
function IconLayers() {
  return (
    <svg viewBox="0 0 512.001 512.001" fill="currentColor" style={{ width: 'auto', height: '60px' }} xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M435 271.718c-.996 0-1.97.097-2.912.282H240V77c0-8.284-6.716-15-15-15C100.643 62 0 162.633 0 287.001c0 124.358 100.632 225 225 225 124.358 0 225-100.632 225-225v-.282c0-8.285-6.714-15.001-15-15.001zM225 482.001c-107.523 0-195-87.477-195-195 0-102.477 79.458-186.745 180-194.43v194.43c0 8.284 6.716 15 15 15h194.43c-7.685 100.541-91.953 180-194.43 180z" />
        <path d="M446.099 65.901C403.602 23.404 347.101 0 287 0c-8.284 0-15 6.716-15 15v210.001c0 8.284 6.716 15 15 15h210c8.284 0 15-6.716 15-15 0-60.1-23.404-116.603-65.901-159.1zM302 210.001V30.571c95.59 7.306 172.123 83.839 179.429 179.43H302z" />
      </g>
    </svg>
  )
}
function IconDiamond() {
  return (
    <svg viewBox="0 0 468 468" fill="currentColor" style={{ width: 'auto', height: '60px' }} xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M185.078 468C83.026 468 0 384.989 0 282.955S83.026 97.91 185.078 97.91c33.729 0 66.768 9.202 95.547 26.611l-15.536 25.674c-24.093-14.574-51.76-22.278-80.011-22.278-85.503 0-155.065 69.55-155.065 155.038s69.562 155.038 155.065 155.038 155.065-69.55 155.065-155.038c0-28.245-7.704-55.907-22.281-79.995l25.679-15.533c17.412 28.773 26.615 61.807 26.615 95.528C370.156 384.989 287.13 468 185.078 468z" />
        <path d="M185.078 385.722c-56.676 0-102.785-46.101-102.785-102.767s46.109-102.767 102.785-102.767c10.934 0 21.703 1.711 32.01 5.086l-9.34 28.517a72.726 72.726 0 0 0-22.67-3.596c-40.127 0-72.772 32.64-72.772 72.759s32.646 72.759 72.772 72.759 72.772-32.64 72.772-72.759a72.638 72.638 0 0 0-3.907-23.594l28.393-9.725c3.667 10.704 5.527 21.914 5.527 33.319 0 56.666-46.109 102.768-102.785 102.768z" />
        <path d="m455.435 57.62-39.072-5.91-5.911-39.065C408.65.733 393.548-4.265 385.004 4.28l-56.197 56.187a15.005 15.005 0 0 0-4.233 12.812l6.29 42.371-138.05 138.313a29.962 29.962 0 0 0-7.736-1.016c-16.549 0-30.013 13.461-30.013 30.007s13.464 30.007 30.013 30.007 30.013-13.461 30.013-30.007c0-2.696-.363-5.307-1.033-7.794l138-138.263 42.651 6.572c4.677.722 9.55-.873 12.897-4.219l56.197-56.187c5.645-4.408 7.896-23.413-8.368-25.443zm-63.673 55.034-31.727-4.889-4.664-31.421 29.85-29.844 3.122 20.634a15.003 15.003 0 0 0 12.593 12.59l20.638 3.122z" />
      </g>
    </svg>
  )
}
function IconMonitor() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 'auto', height: '60px' }}>
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}
function IconBarChart2() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 'auto', height: '60px' }}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  )
}
function IconGear() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 'auto', height: '60px' }}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

/* ── Icons: acelerador items ── */
function IconAcelSearch() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" style={{ width: '40px', height: '40px' }}>
      <path d="m27.414 24.586-5.077-5.077A9.932 9.932 0 0 0 24 14c0-5.514-4.486-10-10-10S4 8.486 4 14s4.486 10 10 10a9.932 9.932 0 0 0 5.509-1.663l5.077 5.077a2 2 0 1 0 2.828-2.828zM7 14c0-3.86 3.14-7 7-7s7 3.14 7 7-3.14 7-7 7-7-3.14-7-7z" />
    </svg>
  )
}
function IconAcelPlan() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '40px', height: '40px' }}>
      <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm5 14H7v-2h10v2zm0-4H7v-2h10v2zm0-4H7V7h10v2z" />
    </svg>
  )
}
function IconAcelExec() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '40px', height: '40px' }}>
      <path d="M13 2 4.09 12.97 11 12l-2 8L20 9l-7 .01L13 2z" />
    </svg>
  )
}
function IconAcelScale() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '40px', height: '40px' }}>
      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
    </svg>
  )
}

/* ── Icons: stats ── */
function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '50px', height: '50px' }}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
function IconTrendingUp() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '50px', height: '50px' }}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}
function IconGrid() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '50px', height: '50px' }}>
      <path d="M10 24C4.5 24 0 19.5 0 14S4.5 4 10 4s10 4.5 10 10-4.5 10-10 10zm0-19c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9z" />
      <path d="M10 20.5c-3.6 0-6.5-2.9-6.5-6.5S6.4 7.5 10 7.5s6.5 2.9 6.5 6.5-2.9 6.5-6.5 6.5zm0-12C7 8.5 4.5 11 4.5 14S7 19.5 10 19.5s5.5-2.5 5.5-5.5S13 8.5 10 8.5z" />
      <path d="M10 17c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zm0-5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
      <path d="M10 14.5c-.1 0-.3 0-.4-.1-.2-.2-.2-.5 0-.7l7.5-7.5c.2-.2.5-.2.7 0s.2.5 0 .7l-7.5 7.5c0 .1-.2.1-.3.1z" />
      <path d="M20 7h-2.5c-.3 0-.5-.2-.5-.5V4c0-.1.1-.3.1-.4L20.6.1c.2-.1.4-.1.6-.1.2.1.3.3.3.5v2h2c.2 0 .4.1.5.3 0 .2 0 .4-.1.6l-3.5 3.5c-.1 0-.3.1-.4.1zm-2-1h1.8l2.5-2.5H21c-.3 0-.5-.2-.5-.5V1.7L18 4.2z" />
    </svg>
  )
}
function IconTrophy() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.999 511.999" fill="currentColor" style={{ width: '50px', height: '50px' }}>
      <path d="M466.45 49.374a37.048 37.048 0 0 0-28.267-13.071H402.41v-11.19C402.41 11.266 391.143 0 377.297 0H134.705c-13.848 0-25.112 11.266-25.112 25.112v11.19H73.816a37.05 37.05 0 0 0-28.267 13.071c-6.992 8.221-10.014 19.019-8.289 29.624 9.4 57.8 45.775 108.863 97.4 136.872 4.717 11.341 10.059 22.083 16.008 32.091 19.002 31.975 42.625 54.073 68.627 64.76 2.635 26.644-15.094 51.885-41.794 57.9-.057.013-.097.033-.153.046-5.211 1.245-9.09 5.921-9.09 11.513v54.363h-21.986c-19.602 0-35.549 15.947-35.549 35.549v28.058c0 6.545 5.305 11.85 11.85 11.85H390.56c6.545 0 11.85-5.305 11.85-11.85v-28.058c0-19.602-15.947-35.549-35.549-35.549h-21.988V382.18c0-5.603-3.893-10.286-9.118-11.52-.049-.012-.096-.028-.145-.04-26.902-6.055-44.664-31.55-41.752-58.394 25.548-10.86 48.757-32.761 67.479-64.264 5.949-10.009 11.29-20.752 16.008-32.095 51.622-28.01 87.995-79.072 97.395-136.87 1.725-10.605-1.297-21.402-8.29-29.623zM60.652 75.192c-.616-3.787.431-7.504 2.949-10.466A13.388 13.388 0 0 1 73.815 60h35.777v21.802c0 34.186 4.363 67.3 12.632 97.583-32.496-25.679-54.87-62.982-61.572-104.193zm306.209 385.051c6.534 0 11.85 5.316 11.85 11.85v16.208H134.422v-16.208c0-6.534 5.316-11.85 11.85-11.85h220.589zm-45.688-66.213v42.513H191.96V394.03h129.213zm-98.136-23.699a78.449 78.449 0 0 0 8.002-10.46c7.897-12.339 12.042-26.357 12.228-40.674 4.209.573 8.457.88 12.741.88a94.34 94.34 0 0 0 13.852-1.036c.27 19.239 7.758 37.45 20.349 51.289h-67.172zM378.709 81.803c0 58.379-13.406 113.089-37.747 154.049-23.192 39.03-53.364 60.525-84.956 60.525-31.597 0-61.771-21.494-84.966-60.523-24.342-40.961-37.748-95.671-37.748-154.049V25.112c0-.78.634-1.413 1.412-1.413h242.591c.78 0 1.414.634 1.414 1.413v56.691zm72.639-6.611c-6.702 41.208-29.074 78.51-61.569 104.191 8.268-30.283 12.631-63.395 12.631-97.58V60.001h35.773c3.938 0 7.66 1.723 10.214 4.726 2.518 2.961 3.566 6.678 2.951 10.465z" />
      <path d="M327.941 121.658a11.857 11.857 0 0 0-9.566-8.064l-35.758-5.196-15.991-32.402a11.852 11.852 0 0 0-21.252 0l-15.991 32.402-35.758 5.196a11.849 11.849 0 0 0-6.567 20.213l25.875 25.221-6.109 35.613a11.848 11.848 0 0 0 17.193 12.492L256 190.32l31.982 16.813a11.843 11.843 0 0 0 12.478-.903 11.848 11.848 0 0 0 4.714-11.59l-6.109-35.613 25.875-25.221a11.849 11.849 0 0 0 3.001-12.148zm-49.877 24.747a11.847 11.847 0 0 0-3.408 10.489l3.102 18.09-16.245-8.541a11.86 11.86 0 0 0-11.028 0l-16.245 8.541 3.102-18.09a11.849 11.849 0 0 0-3.408-10.489l-13.141-12.81 18.162-2.64a11.849 11.849 0 0 0 8.922-6.482L256 108.015l8.122 16.458a11.851 11.851 0 0 0 8.922 6.482l18.162 2.64-13.142 12.81z" />
    </svg>
  )
}

/* ── Defaults ── */
const defaultServices = [
  { icon: <IconBroadcast />, title: 'Geração de Demanda', desc: 'Atraímos as pessoas certas para o seu negócio com estratégias multicanais focadas em aumentar o volume e a qualidade de leads.', items: ['Tráfego Pago (Ads)', 'SEO e Conteúdo', 'Mídias Sociais', 'Inbound Marketing', 'Landing Pages', 'Automação de Marketing'] },
  { icon: <IconFunnel />, title: 'Gestão de Leads', desc: 'Capturamos, qualificamos e nutrimos leads de forma inteligente até que estejam prontos para comprar.', items: ['Qualificação de Leads', 'Nutrição e Relacionamento', 'Scoring e Segmentação', 'Automação e Fluxos', 'CRM e Integrações'] },
  { icon: <IconVideo />, title: 'Produtora de Vídeos', desc: 'Produzimos conteúdos audiovisuais que conectam, engajam e fortalecem a imagem da sua marca.', items: ['Cobertura de Eventos', 'Vídeos Institucionais', 'Vídeos Comerciais', 'Depoimentos', 'Vídeos para Mídias Sociais', 'Edição e Finalização Profissional'] },
  { icon: <IconLayers />, title: 'Gestão de Mídias e Conteúdo', desc: 'Criamos conteúdo estratégico que posiciona sua marca, gera autoridade e impulsiona resultados.', items: ['Planejamento de Conteúdo', 'Produção de Conteúdo', 'Gestão de Mídias Sociais', 'Copywriting', 'Design e Criativos'] },
  { icon: <IconDiamond />, title: 'Posicionamento e Marca', desc: 'Desenvolvemos marcas fortes e posicionamentos claros que diferenciam sua empresa no mercado e geram valor.', items: ['Estratégia de Posicionamento', 'Identidade Visual', 'Mensagem e Tom de Voz', 'Branding', 'Arquétipos de Marca'] },
  { icon: <IconMonitor />, title: 'Sites e Experiência', desc: 'Criamos sites rápidos, modernos e otimizados para conversão, oferecendo a melhor experiência para seu cliente.', items: ['Sites Institucionais', 'Landing Pages', 'Blog e SEO Técnico', 'UX / UI Design', 'Otimização de Conversão'] },
  { icon: <IconBarChart2 />, title: 'BI e Performance', desc: 'Transformamos dados em insights para você tomar decisões melhores e crescer com previsibilidade.', items: ['Dashboards e Relatórios', 'KPIs e Métricas', 'Análise de Campanhas', 'BI de Marketing e Vendas', 'Previsão de Resultados'] },
  { icon: <IconGear />, title: 'Automação e Tecnologia', desc: 'Implementamos automações e integrações que tornam seus processos mais eficientes e escaláveis.', items: ['Automação de Marketing', 'Integrações (CRM, Ads, Email)', 'Workflows e Processos', 'Chatbots e Atendimento', 'Ferramentas e Plataformas'] },
]

const serviceIconOptions = [
  { key: 'broadcast', icon: Megaphone },
  { key: 'funnel', icon: Funnel },
  { key: 'video', icon: Video },
  { key: 'layers', icon: Layers },
  { key: 'diamond', icon: Gem },
  { key: 'monitor', icon: Monitor },
  { key: 'chart', icon: ChartColumn },
  { key: 'gear', icon: Settings },
  { key: 'target', icon: Target },
  { key: 'users', icon: Users },
  { key: 'search', icon: Search },
  { key: 'lightbulb', icon: Lightbulb },
  { key: 'rocket', icon: Rocket },
  { key: 'globe', icon: Globe },
  { key: 'laptop', icon: Laptop },
  { key: 'smartphone', icon: Smartphone },
  { key: 'mail', icon: Mail },
  { key: 'message', icon: MessageCircle },
  { key: 'bot', icon: Bot },
  { key: 'workflow', icon: Workflow },
  { key: 'database', icon: Database },
  { key: 'line-chart', icon: LineChart },
  { key: 'pie-chart', icon: PieChart },
  { key: 'bar-chart', icon: BarChart3 },
  { key: 'cart', icon: ShoppingCart },
  { key: 'briefcase', icon: Briefcase },
  { key: 'handshake', icon: Handshake },
  { key: 'badge-check', icon: BadgeCheck },
  { key: 'zap', icon: Zap },
  { key: 'click', icon: MousePointerClick },
  { key: 'pointer', icon: MousePointer2 },
  { key: 'share', icon: Share2 },
  { key: 'file', icon: FileText },
  { key: 'pencil', icon: Pencil },
  { key: 'palette', icon: Palette },
  { key: 'code', icon: Code2 },
  { key: 'cpu', icon: Cpu },
  { key: 'cloud', icon: Cloud },
  { key: 'wrench', icon: Wrench },
  { key: 'calendar', icon: Calendar },
  { key: 'phone', icon: Phone },
  { key: 'map-pin', icon: MapPin },
  { key: 'shield', icon: ShieldCheck },
  { key: 'trophy', icon: Trophy },
  { key: 'flag', icon: Flag },
  { key: 'eye', icon: Eye },
  { key: 'network', icon: Network },
  { key: 'gauge', icon: Gauge },
  { key: 'presentation', icon: Presentation },
  { key: 'book', icon: BookOpen },
  { key: 'newspaper', icon: Newspaper },
  { key: 'pen-tool', icon: PenTool },
  { key: 'camera', icon: Camera },
  { key: 'clapperboard', icon: Clapperboard },
  { key: 'radio', icon: Radio },
  { key: 'send', icon: Send },
  { key: 'brain', icon: Brain },
  { key: 'boxes', icon: Boxes },
]

function getServiceIcon(iconKey, index) {
  const Icon = serviceIconOptions.find((option) => option.key === iconKey)?.icon || serviceIconOptions[index % serviceIconOptions.length].icon
  return <Icon strokeWidth={1.6} style={{ width: 'auto', height: '60px' }} />
}

function splitServiceItems(raw, fallback = []) {
  const source = raw ? raw.split(/\r?\n|,(?=\s)/) : fallback
  return source.map((item) => item.trim()).filter(Boolean)
}

function readServiceCards(gridBlock) {
  if (!gridBlock) return defaultServices

  if (gridBlock.servicesJson) {
    try {
      const parsed = JSON.parse(gridBlock.servicesJson)
      if (Array.isArray(parsed)) {
        const services = parsed
          .map((item, index) => ({
            icon: getServiceIcon(item?.iconKey, index),
            iconKey: typeof item?.iconKey === 'string' ? item.iconKey : undefined,
            title: String(item?.title ?? ''),
            desc: String(item?.desc ?? ''),
            items: Array.isArray(item?.items) ? item.items.map(String).filter(Boolean) : splitServiceItems(String(item?.items ?? '')),
          }))
          .filter((item) => item.title || item.desc || item.items.length)

        if (services.length) return services
      }
    } catch {
      return defaultServices
    }
  }

  return defaultServices.map((def, i) => {
    const k = `s${i + 1}`
    return {
      ...def,
      title: gridBlock[`${k}Title`] || def.title,
      desc: gridBlock[`${k}Desc`] || def.desc,
      items: gridBlock[`${k}Items`] ? splitServiceItems(gridBlock[`${k}Items`]) : def.items,
    }
  })
}

const defaultAceleradorItems = [
  { icon: <IconAcelSearch />, title: 'Diagnóstico Estratégico', desc: 'Analisamos seu cenário atual, identificando pontos e oportunidades de crescimento.' },
  { icon: <IconAcelPlan />, title: 'Plano de Crescimento', desc: 'Criamos um plano personalizado com metas claras, estratégias e ações priorizadas.' },
  { icon: <IconAcelExec />, title: 'Execução Inteligente', desc: 'Colocamos o plano em prática com métodos ágeis, focados em resultados e acompanhamento contínuo.' },
  { icon: <IconAcelScale />, title: 'Escala e Resultados', desc: 'Otimizamos continuamente para acelerar o que funciona e gerar resultados cada vez maiores.' },
]

const defaultStats = [
  { icon: <IconUsers />, value: '+20', label: 'empresas aceleradas' },
  { icon: <IconTrendingUp />, value: 'milhões', label: 'em vendas geradas' },
  { icon: <IconGrid />, value: 'diversos', label: 'segmentos atendidos' },
  { icon: <IconTrophy />, value: 'resultados', label: 'comprovados' },
]

const acelIcons = [<IconAcelSearch />, <IconAcelPlan />, <IconAcelExec />, <IconAcelScale />]
const statIcons = [<IconUsers />, <IconTrendingUp />, <IconGrid />, <IconTrophy />]

function readAdminBlock(blocks, id) {
  return blocks?.find((b) => b.id === id) ?? null
}

/* ── Page ── */
export default function ServicosPage() {
  const [adminData, setAdminData] = React.useState(null)

  React.useEffect(() => {
    getPublicSitePage('content-servicos').then(setAdminData)
  }, [])

  const adminBlocks = adminData?.blocks ?? null

  const gridBlock = readAdminBlock(adminBlocks, 'grid-servicos')
  const acelBlock = readAdminBlock(adminBlocks, 'acelerador')
  const statBlock = readAdminBlock(adminBlocks, 'estatisticas')
  const heroBlock = readAdminBlock(adminBlocks, 'hero')
  const ctaBlock = readAdminBlock(adminBlocks, 'cta')

  const services = readServiceCards(gridBlock)

  const aceleradorItems = defaultAceleradorItems.map((def, i) => {
    const keys = ['cardOne', 'cardTwo', 'cardThree', 'cardFour']
    const k = keys[i]
    if (!acelBlock) return def
    return {
      ...def,
      title: acelBlock[`${k}Title`] || def.title,
      desc: acelBlock[`${k}Text`] || def.desc,
    }
  })

  const stats = defaultStats.map((def, i) => {
    const valKeys = ['statOne', 'statTwo', 'statThree', 'statFour']
    const lblKeys = ['statOneLabel', 'statTwoLabel', 'statThreeLabel', 'statFourLabel']
    if (!statBlock) return def
    return {
      ...def,
      value: statBlock[valKeys[i]] || def.value,
      label: statBlock[lblKeys[i]] || def.label,
    }
  })

  return (
    <>
      <main style={{ marginTop: '90px' }}>

        {/* ── SECTION 1: HERO ── */}
        <section
          className="relative py-16 lg:py-24 overflow-hidden"
          style={{
            backgroundImage: `url(${heroBlock?.imageUrl || '/crescimento1.png'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Overlay para legibilidade do texto */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.92) 50%, rgba(255,255,255,0.3) 90%)' }} />

          <div className="relative z-10 max-w-384 mx-auto px-4 sm:px-6 lg:px-8">
            {/* Left */}
              <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0 flex flex-col items-center lg:items-start">
              <p className="text-zinc-900 text-xs font-bold tracking-widest uppercase mb-5" style={{ fontSize: '13px' }}>
                {heroBlock?.eyebrow || 'NOSSOS SERVIÇOS'}
              </p>
              <h1 className="font-poppins text-3xl sm:text-4xl lg:text-[46px] font-bold text-zinc-900 leading-tight mb-6" style={{ lineHeight: '1.12' }}>
                {heroBlock?.headline || <>Soluções completas para<br className="hidden lg:block" />{' '}gerar demanda e acelerar vendas.</>}
              </h1>
              <p className="text-zinc-500 leading-relaxed" style={{ fontSize: '18px', maxWidth: '560px' }}>
                {heroBlock?.description || 'Atuamos em todas as frentes do marketing e vendas para estruturar, executar e escalar o crescimento da sua empresa.'}
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: NOSSOS SERVIÇOS GRID ── */}
        <section className="bg-white py-14 border-t border-zinc-200">
          <div className="max-w-384 mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header row */}
            <div className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-16 mb-10" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="flex items-center justify-center lg:justify-start gap-3 shrink-0">
                <div className="w-1 bg-red-600 self-stretch rounded-full hidden lg:block" style={{ minHeight: '20px' }} />
                <p className="text-zinc-900 text-lg font-bold tracking-widest uppercase" style={{ fontSize: '15px', letterSpacing: '0.12em' }}>
                  {gridBlock?.eyebrow || 'NOSSOS SERVIÇOS'}
                </p>
              </div>
              <p className="text-zinc-500 leading-relaxed lg:max-w-xl text-center lg:text-left" style={{ fontSize: '15px', maxWidth: '542px' }}>
                {gridBlock?.description || 'Estratégia, execução e tecnologia trabalhando juntas para atrair as pessoas certas, converter oportunidades e acelerar resultados reais.'}
              </p>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 p-6 items-center text-center lg:items-start lg:text-left"
                  style={{ border: '1px solid var(--color-zinc-200)', borderRadius: '8px' }}
                >
                  <div className="text-red-600 mb-1">{s.icon}</div>
                  <p className="font-poppins font-bold text-zinc-900" style={{ fontSize: '17px' }}>{s.title}</p>
                  <p className="text-zinc-500 leading-relaxed" style={{ fontSize: '16px' }}>{s.desc}</p>
                  <ul className="flex flex-col gap-1 mt-1">
                    {s.items.map((item, j) => (
                      <li key={j} className="text-zinc-400" style={{ fontSize: '14px', color: 'var(--color-zinc-500)' }}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── SECTION 3: ACELERADOR DE NEGÓCIOS ── */}
        <section className="bg-zinc-950 py-16 lg:py-20 px-4 sm:px-6 lg:px-[33px]" style={{ background: 'white', paddingTop: '24px' }}>
          <div className="max-w-384 mx-auto px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-zinc-950)', padding: 'clamp(20px, 4vw, 40px)', borderRadius: '15px', maxWidth: '1472px' }}>

            {/* Main content row */}
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center lg:items-start">

              {/* Left: rocket illustration */}
              <div className="shrink-0 flex items-center justify-center" style={{ width: '240px', minHeight: '300px' }}>
                <img src="/foguete.png" alt="Foguete" style={{ width: '220px', height: '280px', objectFit: 'contain' }} />
              </div>

              {/* Right: text + 4 items */}
              <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                <p className="text-red-600 text-xs font-bold tracking-widest uppercase mb-5" style={{ fontSize: '13px' }}>
                  {acelBlock?.eyebrow || 'ACELERADOR DE NEGÓCIOS'}
                </p>

                <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-10 mb-8 items-center lg:justify-between">
                  <h2 className="font-poppins text-2xl sm:text-3xl lg:text-[34px] font-bold text-white leading-tight" style={{ lineHeight: '1.2', maxWidth: '612px' }}>
                    {acelBlock?.headline || 'O programa que impulsiona seu crescimento de forma estruturada e contínua.'}
                  </h2>
                  <p className="text-zinc-400 leading-relaxed" style={{ fontSize: '16px', maxWidth: '480px' }}>
                    {acelBlock?.description || 'Nosso Acelerador de Negócios é um programa completo que alia estratégia, execução e performance para gerar crescimento previsível e sustentável.'}
                  </p>
                </div>

                {/* 4 sub-items */}
                <div className="w-full flex flex-col lg:flex-row gap-[18px] lg:gap-0 items-center lg:items-stretch lg:justify-around" style={{ gap: '18px' }}>
                  {aceleradorItems.map((item, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <div className="hidden lg:block w-px bg-zinc-800 self-stretch" style={{ opacity: '65%' }} />}
                      <div className="flex flex-col gap-2 flex-1 px-5 py-2 text-center lg:text-left items-center lg:items-start" style={{ padding: 0, maxWidth: '250px', width: '100%' }}>
                        <div className="text-red-600 mb-1">{acelIcons[i]}</div>
                        <p className="font-poppins font-bold text-white" style={{ fontSize: '14px' }}>{item.title}</p>
                        <p className="text-zinc-400" style={{ fontSize: '13px', lineHeight: '1.5' }}>{item.desc}</p>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ── SECTION 3B: STATS ── */}
        <section style={{ background: 'white', border: 'medium', borderRadius: '0px' }} className="bg-white border border-gray-300 rounded-lg shadow-md px-4 sm:px-6 lg:px-[33px]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10" style={{ border: '1px solid var(--color-gray-300)', borderRadius: '15px', maxWidth: '1472px', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 5vw, 70px)' }}>
            <div style={{ justifyContent: 'space-between' }} className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row justify-items-center items-center gap-6 lg:gap-0">
              {stats.map((stat, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <div className="hidden lg:block w-px self-stretch bg-gray-300" />}
                  <div className="flex flex-row items-center gap-3" style={{ gap: '20px' }}>
                    <div className="text-red-600 shrink-0">{statIcons[i]}</div>
                    <div className="flex flex-col">
                      <p className="font-poppins font-bold text-black" style={{ fontSize: '22px', lineHeight: '1.2' }}>{stat.value}</p>
                      <p className="text-gray-600" style={{ fontSize: '13px' }}>{stat.label}</p>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 4: CTA ── */}
        <section style={{ border: 'medium', background: 'white', paddingTop: '64px', paddingBottom: '64px' }} className="px-4 sm:px-6 lg:px-[33px]">
          <div className="max-w-384 mx-auto px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-zinc-950)', maxWidth: '1472px', padding: 'clamp(28px, 4vw, 55px)', borderRadius: '20px' }}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-6 items-center" style={{ alignItems: 'center' }}>

              {/* Logo */}
              <div className="shrink-0">
                <svg width="587" height="587" viewBox="0 0 587 587" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-20 lg:h-33.25 w-auto">
                  <g clipPath="url(#clip0_cta_servicos)">
                    <path d="M406.163 553.363V180.971H33.7717V318.658H268.476V553.363H406.163Z" stroke="#CB2C30" strokeWidth="9"/>
                    <path d="M582.194 524.021V4.94043H63.1139V142.629H444.505V524.021H582.194Z" stroke="#CB2C30" strokeWidth="9"/>
                    <path d="M230.133 582.704V357H4.42932V582.704H230.133Z" stroke="#CB2C30" strokeWidth="9"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_cta_servicos">
                      <rect width="587" height="587" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>

              {/* Divider 1 */}
              <div className="hidden lg:block self-stretch w-px min-h-12" style={{ backgroundColor: 'rgb(220, 38, 38)' }} />

              {/* Text */}
              <div className="flex-1 lg:max-w-xl text-center lg:text-left w-full" style={{ maxWidth: '650px' }}>
                <h2 className="font-poppins font-bold text-white mb-3 leading-tight text-2xl sm:text-3xl lg:text-[29px]">
                  Pronto para acelerar o crescimento da sua empresa?
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed" style={{ fontSize: '15px' }}>
                  Fale com nossos especialistas e descubra como podemos gerar mais demanda, mais oportunidades e mais vendas para o seu negócio.
                </p>
              </div>

              {/* Divider 2 */}
              {/* <div className="hidden lg:block self-stretch w-px min-h-12" style={{ backgroundColor: 'rgba(63, 63, 70, 0.68)' }} /> */}

              {/* CTA button */}
              <div className="flex flex-col items-center lg:items-stretch gap-4 shrink-0 w-full lg:w-auto">
                <a
                  href="#contato"
                  className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide px-8 py-4 transition-colors duration-200 flex items-center justify-between gap-2"
                  style={{ borderRadius: '4px', fontSize: '15px' }}
                >
                  {ctaBlock?.buttonPrimary || 'RECEBER ANÁLISE'}
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '22px', height: '22px', flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                {/* <div className="flex items-center justify-center lg:justify-start gap-3">
                  <div className="flex -space-x-2 shrink-0">
                    <img src="/peoples/men1.jpg" alt="Cliente 1" className="w-8 h-8 rounded-full border-2 border-zinc-900 object-cover" />
                    <img src="/peoples/men2.jpg" alt="Cliente 2" className="w-8 h-8 rounded-full border-2 border-zinc-900 object-cover" />
                    <img src="/peoples/men3.jpg" alt="Cliente 3" className="w-8 h-8 rounded-full border-2 border-zinc-900 object-cover" />
                    <img src="/peoples/men4.jpg" alt="Cliente 4" className="w-8 h-8 rounded-full border-2 border-zinc-900 object-cover" />
                  </div>
                  <p className="text-zinc-400 text-center lg:text-left" style={{ maxWidth: '131px', fontSize: '13px', lineHeight: '1.4' }}>
                    {ctaBlock?.statOne || '+60 empresas já confiam na Evidence'}
                  </p>
                </div> */}
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
