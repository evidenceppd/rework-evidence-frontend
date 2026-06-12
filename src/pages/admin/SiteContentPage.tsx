import { Fragment, useEffect, useMemo, useState, type ChangeEvent, type DragEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { siteContentService } from '../../services/siteContent.service'
import Hero from '../../components/Hero'
import { toast } from 'sonner'
import {
  BlogCtaSection,
  BlogHeroSection,
} from '../BlogPage'
import {
  ClientesCtaSection,
  ClientesGridSection,
  ClientesHeroSection,
} from '../ClientesPage'
import {
  DepoimentosCtaSection,
  DepoimentosGridSection,
  DepoimentosHeroSection,
} from '../DepoimentosPage'
import {
  ArrowLeft,
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
  ChevronDown,
  Clapperboard,
  Cloud,
  Code2,
  Cpu,
  Database,
  Edit3,
  Eye,
  ExternalLink,
  FileText,
  Flag,
  Funnel,
  Gauge,
  Gem,
  Globe,
  GripVertical,
  Handshake,
  Image as ImageIcon,
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
  Save,
  Search,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Target,
  Trash2,
  Trophy,
  Upload,
  Users,
  Video,
  Workflow,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'

type SiteBlock = {
  id: string
  title: string
  eyebrow: string
  headline: string
  description: string
  preview: string
  imageUrl?: string
  imageRecommendation?: string
  buttonPrimary?: string
  buttonSecondary?: string
  buttonHref?: string
  statOne?: string
  statTwo?: string
  statThree?: string
  problemOne?: string
  problemTwo?: string
  problemThree?: string
  cardOneTitle?: string
  cardOneText?: string
  cardTwoTitle?: string
  cardTwoText?: string
  cardThreeTitle?: string
  cardThreeText?: string
  cardFourTitle?: string
  cardFourText?: string
  featureOne?: string
  featureTwo?: string
  featureThree?: string
  stepOneTitle?: string
  stepOneText?: string
  stepTwoTitle?: string
  stepTwoText?: string
  stepThreeTitle?: string
  stepThreeText?: string
  stepFourTitle?: string
  stepFourText?: string
  stepFiveTitle?: string
  stepFiveText?: string
  stepSixTitle?: string
  stepSixText?: string
  s1Title?: string; s1Desc?: string; s1Items?: string
  s2Title?: string; s2Desc?: string; s2Items?: string
  s3Title?: string; s3Desc?: string; s3Items?: string
  s4Title?: string; s4Desc?: string; s4Items?: string
  s5Title?: string; s5Desc?: string; s5Items?: string
  s6Title?: string; s6Desc?: string; s6Items?: string
  s7Title?: string; s7Desc?: string; s7Items?: string
  s8Title?: string; s8Desc?: string; s8Items?: string
  servicesJson?: string
  clientsJson?: string
  testimonialsJson?: string
  statFour?: string
  statOneLabel?: string; statTwoLabel?: string; statThreeLabel?: string; statFourLabel?: string
}

type ServiceCard = {
  title: string
  desc: string
  items: string[]
  iconKey?: string
}

type ClientCard = {
  name: string
  description: string
  since: string
  segment: string
  imageUrl?: string
}

type TestimonialCard = {
  quote: string
  name: string
  company: string
  since: string
  video: string
}

type SitePage = {
  id: string
  label: string
  route: string
  description: string
  blocks: SiteBlock[]
}

const sitePages: Record<string, SitePage> = {
  'content-home': {
    id: 'content-home',
    label: 'Home',
    route: '/',
    description: 'Página inicial do site institucional.',
    blocks: [
      {
        id: 'hero',
        title: 'Hero',
        eyebrow: 'Página inicial',
        headline: 'Vamos acelerar o crescimento da sua empresa',
        description: 'Primeira dobra com proposta principal, botão de ação e imagem de impacto.',
        preview: 'Apresenta a promessa central da Evidence e direciona o usuário para o diagnóstico ou contato.',
        buttonPrimary: 'RECEBER ANÁLISE',
        buttonSecondary: 'VER COMO FUNCIONA',
        statOne: 'Foco em geração de demanda qualificada',
        statTwo: 'Estratégias alinhadas com seu processo comercial',
        statThree: 'Mais oportunidades e conversões para sua empresa',
      },
      {
        id: 'cenario',
        title: 'Cenário',
        eyebrow: 'Contexto',
        headline: 'O mercado mudou, e crescer exige método',
        description: 'Seção explicativa sobre o cenário de marketing, vendas e crescimento.',
        preview: 'Bloco branco com texto estratégico e dados de contexto para preparar a dor do visitante.',
      },
      {
        id: 'gargalos',
        title: 'Gargalos',
        eyebrow: 'Problemas comuns',
        headline: 'Os gargalos que travam o crescimento',
        description: 'Lista os principais obstáculos que impedem empresas de vender mais.',
        preview: 'Seção escura com cards objetivos sobre falta de previsibilidade, canais e posicionamento.',
      },
      {
        id: 'atuacao',
        title: 'Atuação',
        eyebrow: 'Como atuamos',
        headline: 'Estratégia, execução e dados trabalhando juntos',
        description: 'Mostra os pilares da atuação da agência.',
        preview: 'Bloco com texto e composição visual para explicar a forma de trabalho.',
        featureOne: 'Marketing estratégico para atrair o cliente certo',
        featureTwo: 'Geração de demanda qualificada para o seu time comercial',
        featureThree: 'Ajuste no processo comercial para aumentar a conversão',
      },
      {
        id: 'como-trabalhamos',
        title: 'Como trabalhamos',
        eyebrow: 'Processo',
        headline: 'Um processo claro para transformar objetivos em resultado',
        description: 'Resumo do método de trabalho apresentado na página institucional.',
        preview: 'Cards em sequência com etapas do processo comercial e estratégico.',
        stepOneTitle: 'ANÁLISE DO CENÁRIO',
        stepOneText: 'Entendemos seu momento, seus desafios e avaliamos seus canais e resultados atuais.',
        stepTwoTitle: 'PLANEJAMENTO E EXECUÇÃO',
        stepTwoText: 'Criamos um plano personalizado e colocamos em prática com foco em demanda e conversão.',
        stepThreeTitle: 'ACOMPANHAMENTO E EVOLUÇÃO',
        stepThreeText: 'Monitoramos indicadores, ajustamos rotas e evoluímos continuamente os resultados.',
      },
      {
        id: 'cta-home',
        title: 'CTA resultados',
        eyebrow: 'Conversão',
        headline: 'Sua empresa pode ser a próxima',
        description: 'Chamada para contato depois da lista de clientes.',
        preview: 'Card escuro com logo e botão para receber análise.',
        buttonPrimary: 'RECEBER ANÁLISE',
      },
    ],
  },
  'content-como-trabalhamos': {
    id: 'content-como-trabalhamos',
    label: 'Como trabalhamos',
    route: '/como-trabalhamos',
    description: 'Página institucional sobre método, equipe e valores.',
    blocks: [
      {
        id: 'sobre-nos',
        title: 'Sobre nós',
        eyebrow: 'Sobre nós',
        headline: 'Estratégia, criatividade e tecnologia para gerar resultados reais para o seu negócio.',
        description: 'Somos uma agência de marketing focada em performance e crescimento sustentável. Ajudamos empresas a atrair clientes, fortalecer sua marca e aumentar suas vendas com estratégias personalizadas e orientadas a dados.',
        preview: 'Layout com texto à esquerda, foto da equipe e card de credibilidade.',
        cardOneTitle: 'Focados em resultados',
        cardOneText: 'Estratégias com objetivo claro e mensurável.',
        cardTwoTitle: 'Time especializado',
        cardTwoText: 'Profissionais experientes em cada área.',
        cardThreeTitle: 'Abordagem data-driven',
        cardThreeText: 'Decisões baseadas em dados e performance.',
        cardFourTitle: 'Parceria de verdade',
        cardFourText: 'Nosso sucesso é ver o seu negócio crescer.',
        statOne: 'Compromisso com excelência e resultados desde o início.',
        statTwo: '+20',
        statThree: 'empresas atendidas',
      },
      {
        id: 'processo',
        title: 'Como trabalhamos',
        eyebrow: 'Como trabalhamos',
        headline: 'Um processo estratégico para transformar objetivos em resultados.',
        description: 'Acreditamos em um método claro, colaborativo e orientado a dados para entregar soluções personalizadas que geram impacto real no seu negócio.',
        preview: 'Linha de etapas com ícones, números e descrições curtas.',
        stepOneTitle: 'Diagnóstico',
        stepOneText: 'Entendemos seu negócio, seus desafios e analisamos o cenário atual para identificar oportunidades de crescimento.',
        stepTwoTitle: 'Planejamento',
        stepTwoText: 'Desenvolvemos uma estratégia personalizada com ações focadas nos objetivos e metas do seu negócio.',
        stepThreeTitle: 'Execução',
        stepThreeText: 'Colocamos o plano em prática com excelência, utilizando as melhores ferramentas e técnicas do mercado.',
        stepFourTitle: 'Monitoramento',
        stepFourText: 'Acompanhamos de perto os indicadores e analisamos os dados para garantir o melhor desempenho.',
        stepFiveTitle: 'Otimização',
        stepFiveText: 'Realizamos ajustes contínuos para melhorar os resultados e aumentar a eficiência das ações.',
        stepSixTitle: 'Resultados',
        stepSixText: 'Entregamos crescimento sustentável, com mais resultados, autoridade e vendas para o seu negócio.',
      },
      {
        id: 'missao-visao-valores',
        title: 'Missão, visão e valores',
        eyebrow: 'MISSÃO, VISÃO E VALORES',
        headline: 'Missão',
        description: 'Compreender negócios para evidenciar ideias com criatividade, tecnologia e visão estratégica.',
        preview: '• Amor a Deus e ao próximo;\n• Fazer ao próximo o que gostaria que fizessem por você;\n• Compromisso e amor com ideias inovadoras;\n• Equilíbrio e transparência no trabalho em equipe;\n• Responsabilidade na parceria com os clientes;\n• Oportunidade e prosperidade por meio do conhecimento e merecimento;',
        cardOneTitle: 'Missão',
        cardOneText: 'Compreender negócios para evidenciar ideias com criatividade, tecnologia e visão estratégica.',
        cardTwoTitle: 'Visão',
        cardTwoText: 'Consolidar-se como uma agência criativa e inovadora com conhecimento das marcas.',
        cardThreeTitle: 'Valores',
      },
      {
        id: 'cta',
        title: 'CTA',
        eyebrow: 'Conversão',
        headline: 'Pronto para transformar seus objetivos em resultados reais?',
        description: 'Fale com nossos especialistas e descubra como podemos criar estratégias personalizadas para acelerar o crescimento da sua empresa.',
        preview: 'Card escuro com logo, texto e botão para receber análise.',
        buttonPrimary: 'RECEBER ANÁLISE',
      },
    ],
  },
  'content-servicos': {
    id: 'content-servicos',
    label: 'Serviços',
    route: '/servicos',
    description: 'Página de ofertas e soluções da agência.',
    blocks: [
      {
        id: 'hero',
        title: 'Hero',
        eyebrow: 'NOSSOS SERVIÇOS',
        headline: 'Soluções completas para gerar demanda e acelerar vendas.',
        description: 'Atuamos em todas as frentes do marketing e vendas para estruturar, executar e escalar o crescimento da sua empresa.',
        preview: '',
      },
      {
        id: 'grid-servicos',
        title: 'Nossos serviços',
        eyebrow: 'NOSSOS SERVIÇOS',
        headline: 'Estratégia, execução e tecnologia trabalhando juntas',
        description: 'Estratégia, execução e tecnologia trabalhando juntas para atrair as pessoas certas, converter oportunidades e acelerar resultados reais.',
        preview: '',
        s1Title: 'Geração de Demanda',
        s1Desc: 'Atraímos as pessoas certas para o seu negócio com estratégias multicanais focadas em aumentar o volume e a qualidade de leads.',
        s1Items: 'Tráfego Pago (Ads), SEO e Conteúdo, Mídias Sociais, Inbound Marketing, Landing Pages, Automação de Marketing',
        s2Title: 'Gestão de Leads',
        s2Desc: 'Capturamos, qualificamos e nutrimos leads de forma inteligente até que estejam prontos para comprar.',
        s2Items: 'Qualificação de Leads, Nutrição e Relacionamento, Scoring e Segmentação, Automação e Fluxos, CRM e Integrações',
        s3Title: 'Produtora de Vídeos',
        s3Desc: 'Produzimos conteúdos audiovisuais que conectam, engajam e fortalecem a imagem da sua marca.',
        s3Items: 'Cobertura de Eventos, Vídeos Institucionais, Vídeos Comerciais, Depoimentos, Vídeos para Mídias Sociais, Edição e Finalização Profissional',
        s4Title: 'Gestão de Mídias e Conteúdo',
        s4Desc: 'Criamos conteúdo estratégico que posiciona sua marca, gera autoridade e impulsiona resultados.',
        s4Items: 'Planejamento de Conteúdo, Produção de Conteúdo, Gestão de Mídias Sociais, Copywriting, Design e Criativos',
        s5Title: 'Posicionamento e Marca',
        s5Desc: 'Desenvolvemos marcas fortes e posicionamentos claros que diferenciam sua empresa no mercado e geram valor.',
        s5Items: 'Estratégia de Posicionamento, Identidade Visual, Mensagem e Tom de Voz, Branding, Arquétipos de Marca',
        s6Title: 'Sites e Experiência',
        s6Desc: 'Criamos sites rápidos, modernos e otimizados para conversão, oferecendo a melhor experiência para seu cliente.',
        s6Items: 'Sites Institucionais, Landing Pages, Blog e SEO Técnico, UX / UI Design, Otimização de Conversão',
        s7Title: 'BI e Performance',
        s7Desc: 'Transformamos dados em insights para você tomar decisões melhores e crescer com previsibilidade.',
        s7Items: 'Dashboards e Relatórios, KPIs e Métricas, Análise de Campanhas, BI de Marketing e Vendas, Previsão de Resultados',
        s8Title: 'Automação e Tecnologia',
        s8Desc: 'Implementamos automações e integrações que tornam seus processos mais eficientes e escaláveis.',
        s8Items: 'Automação de Marketing, Integrações (CRM, Ads, Email), Workflows e Processos, Chatbots e Atendimento, Ferramentas e Plataformas',
      },
      {
        id: 'acelerador',
        title: 'Acelerador de negócios',
        eyebrow: 'ACELERADOR DE NEGÓCIOS',
        headline: 'O programa que impulsiona seu crescimento de forma estruturada e contínua.',
        description: 'Nosso Acelerador de Negócios é um programa completo que alia estratégia, execução e performance para gerar crescimento previsível e sustentável.',
        preview: '',
        cardOneTitle: 'Diagnóstico Estratégico',
        cardOneText: 'Analisamos seu cenário atual, identificando pontos e oportunidades de crescimento.',
        cardTwoTitle: 'Plano de Crescimento',
        cardTwoText: 'Criamos um plano personalizado com metas claras, estratégias e ações priorizadas.',
        cardThreeTitle: 'Execução Inteligente',
        cardThreeText: 'Colocamos o plano em prática com métodos ágeis, focados em resultados e acompanhamento contínuo.',
        cardFourTitle: 'Escala e Resultados',
        cardFourText: 'Otimizamos continuamente para acelerar o que funciona e gerar resultados cada vez maiores.',
      },
      {
        id: 'estatisticas',
        title: 'Estatísticas',
        eyebrow: 'RESULTADOS',
        headline: 'Números de autoridade',
        description: '',
        preview: '',
        statOne: '+20',
        statOneLabel: 'empresas aceleradas',
        statTwo: 'milhões',
        statTwoLabel: 'em vendas geradas',
        statThree: 'diversos',
        statThreeLabel: 'segmentos atendidos',
        statFour: 'resultados',
        statFourLabel: 'comprovados',
      },
      {
        id: 'cta',
        title: 'CTA',
        eyebrow: 'Contato',
        headline: 'Pronto para acelerar o crescimento da sua empresa?',
        description: 'Fale com nossos especialistas e descubra como podemos gerar mais demanda, mais oportunidades e mais vendas para o seu negócio.',
        preview: '',
        buttonPrimary: 'RECEBER ANÁLISE',
      },
    ],
  },
  'content-clientes': {
    id: 'content-clientes',
    label: 'Clientes',
    route: '/clientes',
    description: 'Página de clientes, marcas e prova social.',
    blocks: [
      {
        id: 'hero',
        title: 'Hero',
        eyebrow: 'NOSSOS CLIENTES',
        headline: 'Empresas que confiam na Evidence para crescer.',
        description: 'Parcerias construídas com estratégia, compromisso e foco em resultados reais.',
        preview: '',
        statOne: '+20',
        statOneLabel: 'empresas atendidas',
        statTwo: 'diversos',
        statTwoLabel: 'segmentos atendidos',
        statThree: 'relacionamentos',
        statThreeLabel: 'de longo prazo',
        statFour: 'desde 2020',
        statFourLabel: 'gerando resultados',
      },
      {
        id: 'logos',
        title: 'Lista de clientes',
        eyebrow: 'CLIENTES',
        headline: 'Marcas atendidas',
        description: 'Lista de clientes exibidos na página.',
        preview: '',
      },
      {
        id: 'cta',
        title: 'CTA',
        eyebrow: 'CONTATO',
        headline: 'Quer resultados como esses na sua empresa?',
        description: 'Fale com nossos especialistas e descubra o que podemos fazer pelo seu crescimento.',
        preview: '',
        buttonPrimary: 'RECEBER ANÁLISE',
        buttonHref: '#contato',
      },
    ],
  },
  'content-blog': {
    id: 'content-blog',
    label: 'Blog',
    route: '/blog',
    description: 'Página de listagem de conteúdos editoriais.',
    blocks: [
      {
        id: 'hero',
        title: 'Hero',
        eyebrow: 'BLOG',
        headline: 'Conteúdos sobre marketing, vendas e crescimento empresarial',
        description: 'Insights práticos para empresas que querem gerar mais demanda e aumentar suas vendas.',
        preview: 'Banner com título, descrição e imagem de fundo.',
        imageUrl: '/banner-blog.png',
      },
      {
        id: 'cta',
        title: 'CTA do blog',
        eyebrow: '',
        headline: 'Sua empresa está gerando demanda, mas não está vendendo como poderia?',
        description: 'Receba uma análise inicial do seu marketing e vendas e identifique oportunidades reais de crescimento.',
        preview: 'Chamada de conversão abaixo da lista de posts.',
        buttonPrimary: 'RECEBER ANÁLISE',
        buttonHref: '#contato',
      },
    ],
  },
  'content-depoimentos': {
    id: 'content-depoimentos',
    label: 'Depoimentos',
    route: '/depoimentos',
    description: 'Página dedicada a depoimentos e prova social.',
    blocks: [
      {
        id: 'hero',
        title: 'Hero',
        eyebrow: 'DEPOIMENTOS',
        headline: 'Resultados que falam por si.',
        description: 'Empresas que confiaram na Evidence para transformar seus desafios em crescimento real.',
        preview: 'Hero com chamada de prova social e métricas.',
        statOne: '+20',
        statOneLabel: 'empresas atendidas',
        statTwo: 'milhões',
        statTwoLabel: 'em vendas geradas',
        statThree: 'diversos',
        statThreeLabel: 'segmentos atendidos',
        statFour: 'desde 2020',
        statFourLabel: 'gerando resultados',
      },
      
      

      {
        id: 'depoimentos',
        title: 'Depoimentos',
        eyebrow: 'CLIENTES',
        headline: 'Depoimentos da página',
        description: 'Lista de relatos exibidos na página.',
        preview: 'Grid de depoimentos com vídeo, fala, nome, empresa e cliente desde.',
      },

      {
        id: 'cta',
        title: 'CTA',
        eyebrow: '',
        headline: 'Quer resultados como esses na sua empresa?',
        description: 'Fale com nossos especialistas e descubra o que podemos fazer pelo seu crescimento.',
        preview: 'Chamada final com botão de conversão.',
        buttonPrimary: 'RECEBER ANÁLISE',
        buttonHref: '#contato',
      },
    ],
  },
  'content-analise': {
    id: 'content-analise',
    label: 'Análise',
    route: '/analise',
    description: 'Fluxo de diagnóstico do negócio.',
    blocks: [
      {
        id: 'hero',
        title: 'Hero',
        eyebrow: 'análise',
        headline: 'Vamos começar a análise do seu negócio?',
        description: 'Para oferecer um diagnóstico preciso e estratégias personalizadas, precisamos entender melhor o contexto do seu negócio.',
        preview: 'Selecione o segmento que melhor representa sua empresa:',
      },
    ],
  },
}

const storageKey = 'evidence_admin_site_content'

function htmlBreaksToNewlines(value: unknown): unknown {
  if (typeof value === 'string') return value.replace(/<br\s*\/?\s*>/gi, '\n')
  if (Array.isArray(value)) return value.map((item) => htmlBreaksToNewlines(item))
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, htmlBreaksToNewlines(item)]),
    )
  }
  return value
}

const hiddenHomeBlockIds = new Set(['depoimentos', 'clientes', 'blog', 'cta-final'])

function normalizeContent(content: Record<string, SitePage>): Record<string, SitePage> {
  const normalized = { ...content }

  Object.entries(normalized).forEach(([pageId, page]) => {
    const defaultPage = sitePages[pageId]
    if (!defaultPage) return

    const defaultBlocks = new Map(defaultPage.blocks.map((block) => [block.id, block]))
    const savedBlocks = new Map(page.blocks.map((block) => [block.id, block]))
    const pageBlocks = pageId === 'content-analise'
      ? defaultPage.blocks.map((defaultBlock) => {
          const savedHero = savedBlocks.get('hero') || savedBlocks.get('segmento')
          return savedHero ? { ...savedHero, id: 'hero', title: 'Hero', eyebrow: savedHero.eyebrow === 'Etapa 1' ? defaultBlock.eyebrow : savedHero.eyebrow } : defaultBlock
        })
      : pageId === 'content-depoimentos'
      ? defaultPage.blocks.map((defaultBlock) => savedBlocks.get(defaultBlock.id) || defaultBlock)
      : pageId === 'content-home' || pageId === 'content-blog'
      ? [
          ...page.blocks,
          ...defaultPage.blocks.filter((defaultBlock) => !page.blocks.some((block) => block.id === defaultBlock.id)),
        ]
      : page.blocks

    normalized[pageId] = {
      ...page,
      blocks: pageBlocks
        .filter((block) => pageId !== 'content-home' || !hiddenHomeBlockIds.has(block.id))
        .filter((block) => pageId !== 'content-blog' || block.id === 'hero' || block.id === 'cta')
        .filter((block) => pageId !== 'content-depoimentos' || block.id === 'hero' || block.id === 'depoimentos' || block.id === 'cta')
        .filter((block) => pageId !== 'content-analise' || block.id === 'hero')
        .map((block) => {
          const nextBlock = htmlBreaksToNewlines({ ...defaultBlocks.get(block.id), ...block }) as SiteBlock

          if (nextBlock.id === 'sobre-nos') {
            return {
              ...nextBlock,
              headline: nextBlock.headline === 'Estratégia, criatividade e tecnologia para gerar resultados reais'
                ? 'Estratégia, criatividade e tecnologia para gerar resultados reais para o seu negócio.'
                : nextBlock.headline,
              description: nextBlock.description === 'Introduz a agência, imagem da equipe e principais diferenciais.'
                ? 'Somos uma agência de marketing focada em performance e crescimento sustentável. Ajudamos empresas a atrair clientes, fortalecer sua marca e aumentar suas vendas com estratégias personalizadas e orientadas a dados.'
                : nextBlock.description,
            }
          }

          if (pageId === 'content-como-trabalhamos' && nextBlock.id === 'processo') {
            const defaultProcess = defaultBlocks.get('processo')
            return {
              ...nextBlock,
              title: nextBlock.title === 'Processo de trabalho' ? 'Como trabalhamos' : nextBlock.title,
              headline: nextBlock.headline === 'Um processo estratégico para transformar objetivos em resultados'
                ? 'Um processo estratégico para transformar objetivos em resultados.'
                : nextBlock.headline,
              description: nextBlock.description === 'Explica as etapas de diagnóstico, planejamento, execução e otimização.'
                ? 'Acreditamos em um método claro, colaborativo e orientado a dados para entregar soluções personalizadas que geram impacto real no seu negócio.'
                : nextBlock.description,
              stepOneTitle: nextBlock.stepOneTitle || defaultProcess?.stepOneTitle,
              stepOneText: nextBlock.stepOneText || defaultProcess?.stepOneText,
              stepTwoTitle: nextBlock.stepTwoTitle || defaultProcess?.stepTwoTitle,
              stepTwoText: nextBlock.stepTwoText || defaultProcess?.stepTwoText,
              stepThreeTitle: nextBlock.stepThreeTitle || defaultProcess?.stepThreeTitle,
              stepThreeText: nextBlock.stepThreeText || defaultProcess?.stepThreeText,
              stepFourTitle: nextBlock.stepFourTitle || defaultProcess?.stepFourTitle,
              stepFourText: nextBlock.stepFourText || defaultProcess?.stepFourText,
              stepFiveTitle: nextBlock.stepFiveTitle || defaultProcess?.stepFiveTitle,
              stepFiveText: nextBlock.stepFiveText || defaultProcess?.stepFiveText,
              stepSixTitle: nextBlock.stepSixTitle || defaultProcess?.stepSixTitle,
              stepSixText: nextBlock.stepSixText || defaultProcess?.stepSixText,
            }
          }

          if (pageId === 'content-como-trabalhamos' && nextBlock.id === 'missao-visao-valores') {
            const defaultMvv = defaultBlocks.get('missao-visao-valores')
            return {
              ...nextBlock,
              eyebrow: nextBlock.eyebrow === 'Cultura' ? 'MISSÃO, VISÃO E VALORES' : nextBlock.eyebrow,
              headline: nextBlock.headline === 'Princípios que guiam cada projeto' ? defaultMvv?.headline || 'Missão' : nextBlock.headline,
              description: nextBlock.description === 'Blocos de missão, visão e valores da agência.'
                ? defaultMvv?.description || 'Compreender negócios para evidenciar ideias com criatividade, tecnologia e visão estratégica.'
                : nextBlock.description,
              preview: nextBlock.preview === 'Três cards com ícones e textos institucionais.' ? defaultMvv?.preview || nextBlock.preview : nextBlock.preview,
              cardOneTitle: !nextBlock.cardOneTitle || nextBlock.cardOneTitle === 'Princípios que guiam cada projeto' ? defaultMvv?.cardOneTitle : nextBlock.cardOneTitle,
              cardOneText: !nextBlock.cardOneText || nextBlock.cardOneText === 'Blocos de missão, visão e valores da agência.' ? defaultMvv?.cardOneText : nextBlock.cardOneText,
              cardTwoTitle: nextBlock.cardTwoTitle || defaultMvv?.cardTwoTitle,
              cardTwoText: nextBlock.cardTwoText || defaultMvv?.cardTwoText,
              cardThreeTitle: nextBlock.cardThreeTitle || defaultMvv?.cardThreeTitle,
            }
          }

          if (pageId === 'content-como-trabalhamos' && nextBlock.id === 'cta') {
            const defaultCta = defaultBlocks.get('cta')
            return {
              ...nextBlock,
              description: nextBlock.description === 'Bloco final de contato da página.' ? defaultCta?.description || nextBlock.description : nextBlock.description,
              buttonPrimary: nextBlock.buttonPrimary || defaultCta?.buttonPrimary,
              statOne: nextBlock.statOne || defaultCta?.statOne,
            }
          }

          return nextBlock
        }),
    }
  })

  return normalized
}

function getImageRecommendation(block: SiteBlock) {
  if (block.imageRecommendation) return block.imageRecommendation

  const label = `${block.id} ${block.title}`.toLowerCase()
  if (label.includes('hero')) return 'Recomendado: 1920 x 1080 px, JPG ou WebP, até 500 KB.'
  if (label.includes('logo') || label.includes('cliente')) return 'Recomendado: 320 x 160 px, PNG ou SVG com fundo transparente.'
  if (label.includes('depoimento')) return 'Recomendado: 800 x 800 px, JPG ou WebP, rosto centralizado.'
  if (label.includes('blog') || label.includes('post')) return 'Recomendado: 1200 x 675 px, JPG ou WebP, proporção 16:9.'
  if (label.includes('cta')) return 'Recomendado: 1440 x 720 px, JPG ou WebP, com área livre para texto.'
  return 'Recomendado: 1200 x 800 px, JPG ou WebP, até 500 KB.'
}

function loadContent(): Record<string, SitePage> {
  return normalizeContent(sitePages)
}

async function loadContentFromApi(): Promise<Record<string, SitePage>> {
  try {
    const rows = await siteContentService.list()
    const remote = Object.fromEntries(rows.map((row) => [row.pageId, row.content as SitePage]))
    return normalizeContent({ ...sitePages, ...remote })
  } catch {
    return normalizeContent(sitePages)
  }
}

function BlockPreview({ block }: { block: SiteBlock }) {
  const imageRecommendation = getImageRecommendation(block)

  return (
    <div className="rounded-xl border border-[#e7e9ee] bg-white p-5 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#eb001a]">{block.eyebrow}</p>
      <h4 className="mt-3 text-[20px] font-bold leading-tight text-[#111318]">{block.headline}</h4>
      <p className="mt-3 text-[13px] leading-relaxed text-[#5f6672]">{block.description}</p>
      <div className="mt-4 overflow-hidden rounded-lg border border-[#e7e9ee] bg-[#f7f8fa]">
        {block.imageUrl ? (
          <img src={block.imageUrl} alt={`Preview ${block.title}`} className="h-44 w-full object-cover" />
        ) : (
          <div className="grid h-36 place-items-center px-5 text-center">
            <div>
              <ImageIcon className="mx-auto h-8 w-8 text-[#eb001a]" />
              <p className="mt-2 text-[12px] font-semibold text-[#111318]">Imagem ainda não enviada</p>
            </div>
          </div>
        )}
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-[#5f6672]">{imageRecommendation}</p>
      <div className="mt-5 rounded-lg bg-[#07090c] p-4 text-white">
        <div className="h-1.5 w-16 rounded-full bg-[#eb001a]" />
        <p className="mt-3 text-[12px] leading-relaxed text-white/76">{block.preview}</p>
      </div>
    </div>
  )
}

function PreviewImage({ block, className = '' }: { block: SiteBlock; className?: string }) {
  return block.imageUrl ? (
    <img src={block.imageUrl} alt={`Preview ${block.title}`} className={`h-full w-full object-cover ${className}`} />
  ) : (
    <div className={`grid h-full min-h-[140px] w-full place-items-center bg-[#101114] text-white ${className}`}>
      <div className="text-center">
        <ImageIcon className="mx-auto h-7 w-7 text-[#eb001a]" />
        <p className="mt-2 text-[11px] font-semibold text-white/70">Imagem da seção</p>
      </div>
    </div>
  )
}

function HighlightedHeadline({ text }: { text: string }) {
  const lowerText = text.toLowerCase()
  const highlight = lowerText.includes('resultados reais') ? 'resultados reais' : 'resultados'
  const index = lowerText.indexOf(highlight)

  if (index < 0) return <>{text}</>

  return (
    <>
      {text.slice(0, index)}
      <span className="text-red-600">{text.slice(index, index + highlight.length)}</span>
      {text.slice(index + highlight.length)}
    </>
  )
}

function AboutSectionPreview({ block, imageSrc }: { block: SiteBlock; imageSrc: string }) {
  const benefits = [
    { icon: 'target', title: block.cardOneTitle || 'Focados em resultados', text: block.cardOneText || 'Estratégias com objetivo claro e mensurável.' },
    { icon: 'team', title: block.cardTwoTitle || 'Time especializado', text: block.cardTwoText || 'Profissionais experientes em cada área.' },
    { icon: 'growth', title: block.cardThreeTitle || 'Abordagem data-driven', text: block.cardThreeText || 'Decisões baseadas em dados e performance.' },
    { icon: 'partner', title: block.cardFourTitle || 'Parceria de verdade', text: block.cardFourText || 'Nosso sucesso é ver o seu negócio crescer.' },
  ]

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto flex max-w-[1536px] flex-col justify-between gap-12 px-4 sm:px-6 lg:flex-row lg:px-8">
        <div className="flex flex-1 flex-col gap-12">
          <div style={{ maxWidth: '800px' }}>
            <p className="mb-4 whitespace-pre-line text-center text-xs font-bold uppercase tracking-widest text-red-600 lg:text-left" style={{ fontSize: '13px' }}>{block.eyebrow || 'SOBRE NÓS'}</p>
            <h1 className="font-poppins mb-6 whitespace-pre-line text-center text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl lg:text-left lg:text-[42px]" style={{ lineHeight: 1.15 }}>
              {block.headline || 'Estratégia, criatividade e tecnologia para gerar resultados reais para o seu negócio.'}
            </h1>
            <p className="whitespace-pre-line text-center text-sm leading-relaxed text-zinc-500 lg:text-left" style={{ maxWidth: '685px', fontSize: '16px' }}>
              {block.description || 'Somos uma agência de marketing focada em performance e crescimento sustentável. Ajudamos empresas a atrair clientes, fortalecer sua marca e aumentar suas vendas com estratégias personalizadas e orientadas a dados.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-10 lg:grid-cols-4 lg:pt-0" style={{ maxWidth: '730px', gap: '40px' }}>
            {benefits.map((item) => (
              <div key={item.title} className="flex flex-col items-center gap-3 text-center lg:items-start lg:text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-red-600" style={{ width: 'fit-content' }}>
                  {item.icon === 'target' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '35px', height: '35px' }}>
                      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
                    </svg>
                  )}
                  {item.icon === 'team' && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '35px', height: '35px' }}>
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  )}
                  {item.icon === 'growth' && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 682.667 682.667" fill="none" style={{ width: '35px', height: '35px' }}>
                      <g clipPath="url(#about-icon-bar-clip)" transform="matrix(1.33333 0 0 -1.33333 0 682.667)">
                        <defs>
                          <clipPath id="about-icon-bar-clip" clipPathUnits="userSpaceOnUse">
                            <path d="M0 512h512V0H0Z" />
                          </clipPath>
                        </defs>
                        <path d="M0 0v152h60V0" transform="translate(46 15)" stroke="currentColor" strokeWidth="30" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" />
                        <path d="M0 0v182h60V0" transform="translate(286 15)" stroke="currentColor" strokeWidth="30" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" />
                        <path d="M0 0v242h60V0" transform="translate(166 15)" stroke="currentColor" strokeWidth="30" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" />
                        <path d="M0 0v302h60V0" transform="translate(406 15)" stroke="currentColor" strokeWidth="30" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" />
                        <path d="M0 0h512" transform="translate(0 15)" stroke="currentColor" strokeWidth="30" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" />
                        <path d="m0 0-181-180-120 120-181-180" transform="translate(497 497)" stroke="currentColor" strokeWidth="30" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" />
                        <path d="M0 0h106v-105" transform="translate(391 497)" stroke="currentColor" strokeWidth="30" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" />
                      </g>
                    </svg>
                  )}
                  {item.icon === 'partner' && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor" style={{ width: '40px', height: '40px' }}>
                      <path d="m60.78 31.12-9.266-16.873a1.004 1.004 0 0 0-1.359-.395l-4.164 2.286a1.002 1.002 0 0 0-.395 1.358l.387.705a5.46 5.46 0 0 1-4.604-.193c-3.073-1.257-7.984-1.328-15.014-.219a3.357 3.357 0 0 0-2.178 1.339l-.864 1.193c-3.251-.867-3.882-.743-5.537-1.7l.618-1.125a1.002 1.002 0 0 0-.395-1.358l-4.164-2.286a1.004 1.004 0 0 0-1.359.395L3.221 31.12a1.002 1.002 0 0 0 .395 1.359l4.164 2.286a1.001 1.001 0 0 0 1.359-.396l.089-.163q.865 1.07 1.779 2.076a2.982 2.982 0 0 0 3.088 4.507 2.98 2.98 0 0 0 4.413 3.318 2.981 2.981 0 0 0 4.72 2.262 2.98 2.98 0 0 0 4.97 2.293c3.909 1.676 8.892 2.888 10.95-.839a3.972 3.972 0 0 0 4.23-3.244 3.838 3.838 0 0 0 3.335-4.403 3.673 3.673 0 0 0 2.8-3.847 39.168 39.168 0 0 0 4.697-3.146l.651 1.186a1.001 1.001 0 0 0 1.359.396l4.164-2.287a1.002 1.002 0 0 0 .395-1.358zM7.865 32.53l-2.41-1.324 8.303-15.12 2.41 1.324-8.284 15.086zm4.91 4.686 1.673-2.042a1 1 0 0 1 1.548 1.267l-1.674 2.042c-.783.957-2.359-.272-1.547-1.267zm3.442 3.69 3.803-4.642a1 1 0 0 1 1.546 1.267l-3.802 4.642a1 1 0 0 1-1.547-1.268zm4.5 2.395 2.536-3.094a1 1 0 0 1 1.547 1.268l-2.535 3.093a1 1 0 0 1-1.547-1.267zm4.722 2.488 1.051-1.283a1 1 0 0 1 1.548 1.267l-1.052 1.284a1 1 0 0 1-1.547-1.268zm18.707-7.991-7.538-4.415a1 1 0 0 0-1.011 1.726l7.538 4.414a5.75 5.75 0 0 0 1.528.625 1.857 1.857 0 0 1-1.595 2.455l-7.356-3.939a1 1 0 0 0-.943 1.764l6.679 3.576a2.054 2.054 0 0 1-2.47 1.81l-5.624-2.502a1 1 0 0 0-.813 1.828l4.623 2.056c-1.496 1.965-5.302.79-7.597-.133l.018-.022a2.986 2.986 0 0 0-2.892-4.83 2.991 2.991 0 0 0-3.073-4.333 2.998 2.998 0 0 0-5.147-2.882l-.298.363a2.99 2.99 0 0 0-5.274-1.453l-.638.78q-1.029-1.154-1.99-2.384l6.55-11.929c1.839 1.054 2.862 1.087 5.242 1.686l-3.255 4.499a2.002 2.002 0 0 0 1.448 3.167 10.6 10.6 0 0 0 9.304-3.928 6.512 6.512 0 0 0 2.912.017c3.044 1.565 13.75 7.324 14.997 10.514.393 1.005-1.003 2.837-3.325 1.47zm4.585-3.329c-2.153-3.218-14.565-10.666-16.34-10.666l-.002-.016a4.64 4.64 0 0 1-2.905-.101 1.017 1.017 0 0 0-1.218.435 8.407 8.407 0 0 1-7.835 3.608l5.375-7.428a1.35 1.35 0 0 1 .87-.537c6.564-1.035 11.257-1.004 14.026.129a7.31 7.31 0 0 0 6.244.064l6.287 11.449a37.23 37.23 0 0 1-4.502 3.063zm7.402-1.939L47.83 17.41l2.41-1.324 8.303 15.12z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-poppins mb-1 whitespace-pre-line text-sm font-bold text-zinc-900">{item.title}</p>
                  <p className="whitespace-pre-line text-xs leading-relaxed text-zinc-500" style={{ fontSize: '13px' }}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full pb-10 lg:mx-0 lg:w-auto" style={{ maxWidth: '497px' }}>
          <div className="pointer-events-none absolute -right-4 -top-4 z-0 h-24 w-24">
            <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
              <path d="M96 0 A96 96 0 0 1 0 96" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6 5" fill="none" opacity="0.4" />
            </svg>
          </div>
          <div className="relative z-10 overflow-hidden" style={{ borderRadius: '12px' }}>
            <img alt="Equipe Agência Evidence" className="w-full object-cover" src={imageSrc || '/equipe.png'} style={{ minHeight: '420px', maxHeight: '460px' }} />
          </div>
          <div className="absolute bottom-0 left-4 right-4 z-20 mx-auto flex items-start gap-3 bg-white p-4 lg:left-6 lg:right-6" style={{ borderRadius: '10px', boxShadow: 'rgba(0, 0, 0, 0.13) 0px 8px 32px', maxWidth: '348px' }}>
            <div className="mt-0.5 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="text-red-600" fill="currentColor" style={{ width: '38px', height: '38px' }}>
                <path d="m36.561 31.048.017-.049a4.733 4.733 0 0 1 .569-1.304 4.538 4.538 0 0 1 1.104-.844 4.78 4.78 0 0 0 1.973-1.877 4.886 4.886 0 0 0 .205-2.703 4.82 4.82 0 0 1-.038-1.455 4.597 4.597 0 0 1 .626-1.233A4.921 4.921 0 0 0 42 19a4.928 4.928 0 0 0-.982-2.582 4.593 4.593 0 0 1-.627-1.234 4.814 4.814 0 0 1 .038-1.454 4.895 4.895 0 0 0-.204-2.703 4.786 4.786 0 0 0-1.972-1.876 4.542 4.542 0 0 1-1.106-.846A4.745 4.745 0 0 1 36.578 7a4.853 4.853 0 0 0-1.345-2.37 4.666 4.666 0 0 0-2.567-.82 4.464 4.464 0 0 1-1.363-.276 4.567 4.567 0 0 1-1.04-.904A4.756 4.756 0 0 0 28.01 1.07a4.633 4.633 0 0 0-2.635.401A4.561 4.561 0 0 1 24 1.833a4.549 4.549 0 0 1-1.374-.361 4.617 4.617 0 0 0-2.636-.4 4.75 4.75 0 0 0-2.253 1.558 4.519 4.519 0 0 1-1.039.903 4.464 4.464 0 0 1-1.363.278 4.666 4.666 0 0 0-2.568.82A4.862 4.862 0 0 0 11.422 7a4.733 4.733 0 0 1-.569 1.303 4.538 4.538 0 0 1-1.104.845 4.78 4.78 0 0 0-1.973 1.877 4.886 4.886 0 0 0-.205 2.703 4.82 4.82 0 0 1 .038 1.454 4.597 4.597 0 0 1-.626 1.234A4.921 4.921 0 0 0 6 19a4.928 4.928 0 0 0 .982 2.582 4.593 4.593 0 0 1 .627 1.234 4.814 4.814 0 0 1-.038 1.454 4.895 4.895 0 0 0 .204 2.703 4.786 4.786 0 0 0 1.972 1.876 4.542 4.542 0 0 1 1.106.847 4.745 4.745 0 0 1 .569 1.303l.018.054-.011.013L6.27 40a2 2 0 0 0 2.034 2.977l3.481-.53 1.283 3.282a1.985 1.985 0 0 0 1.712 1.265q.078.006.155.006a1.984 1.984 0 0 0 1.728-1l5.343-9.255c.212-.069.419-.144.619-.217A4.561 4.561 0 0 1 24 36.167a4.549 4.549 0 0 1 1.374.361c.2.074.41.146.622.215l.004.013L31.337 46a1.984 1.984 0 0 0 1.727 1q.078 0 .156-.006a1.986 1.986 0 0 0 1.713-1.265l1.282-3.282 3.48.53A2 2 0 0 0 41.73 40ZM14.931 45l-1.573-4.026a1.004 1.004 0 0 0-1.082-.624L8.003 41l4.541-7.866a2.692 2.692 0 0 0 .223.234 4.666 4.666 0 0 0 2.567.82 4.464 4.464 0 0 1 1.363.277 4.567 4.567 0 0 1 1.04.904 5.369 5.369 0 0 0 1.923 1.438ZM26.06 34.65a6.092 6.092 0 0 0-2.06-.483 6.069 6.069 0 0 0-2.06.482 3.282 3.282 0 0 1-1.498.332 3.406 3.406 0 0 1-1.266-.999 5.948 5.948 0 0 0-1.594-1.31 6.008 6.008 0 0 0-2.03-.472 3.243 3.243 0 0 1-1.52-.38 3.496 3.496 0 0 1-.714-1.456 6.147 6.147 0 0 0-.89-1.9 5.977 5.977 0 0 0-1.613-1.307 3.346 3.346 0 0 1-1.231-1.037 3.485 3.485 0 0 1-.025-1.62 6.414 6.414 0 0 0 .004-2.117 6.06 6.06 0 0 0-.884-1.86A3.458 3.458 0 0 1 8 19a3.454 3.454 0 0 1 .679-1.522 6.037 6.037 0 0 0 .883-1.86A6.414 6.414 0 0 0 9.56 13.5a3.47 3.47 0 0 1 .026-1.62 3.34 3.34 0 0 1 1.231-1.04 5.974 5.974 0 0 0 1.615-1.306 6.148 6.148 0 0 0 .887-1.898 3.507 3.507 0 0 1 .715-1.456 3.243 3.243 0 0 1 1.52-.38 6.008 6.008 0 0 0 2.03-.474 5.911 5.911 0 0 0 1.595-1.31 3.405 3.405 0 0 1 1.265-.998 3.304 3.304 0 0 1 1.497.332 6.092 6.092 0 0 0 2.06.483 6.069 6.069 0 0 0 2.06-.482 3.31 3.31 0 0 1 1.498-.332 3.406 3.406 0 0 1 1.266.999 5.948 5.948 0 0 0 1.594 1.31 6.008 6.008 0 0 0 2.03.472 3.243 3.243 0 0 1 1.52.38 3.496 3.496 0 0 1 .714 1.456 6.147 6.147 0 0 0 .89 1.9 5.977 5.977 0 0 0 1.613 1.307 3.346 3.346 0 0 1 1.231 1.037 3.485 3.485 0 0 1 .025 1.62 6.414 6.414 0 0 0-.004 2.117 6.06 6.06 0 0 0 .884 1.86A3.458 3.458 0 0 1 40 19a3.454 3.454 0 0 1-.679 1.522 6.037 6.037 0 0 0-.883 1.86 6.414 6.414 0 0 0 .003 2.118 3.47 3.47 0 0 1-.026 1.62 3.34 3.34 0 0 1-1.231 1.04 5.974 5.974 0 0 0-1.615 1.306 6.148 6.148 0 0 0-.887 1.898 3.507 3.507 0 0 1-.715 1.456 3.243 3.243 0 0 1-1.52.381 6.008 6.008 0 0 0-2.03.473 5.911 5.911 0 0 0-1.595 1.31 3.405 3.405 0 0 1-1.265.998 3.317 3.317 0 0 1-1.497-.333Zm9.665 5.7a1.006 1.006 0 0 0-1.082.623L33.069 45l-4.73-8.193a5.365 5.365 0 0 0 1.924-1.437 4.519 4.519 0 0 1 1.039-.903 4.464 4.464 0 0 1 1.363-.278 4.666 4.666 0 0 0 2.568-.82 2.697 2.697 0 0 0 .223-.235L39.997 41ZM36 19a12 12 0 1 0-12 12 12.013 12.013 0 0 0 12-12ZM24 29a10 10 0 1 1 10-10 10.012 10.012 0 0 1-10 10Zm4.555-13.832a1 1 0 0 1 .277 1.387l-4 6a1 1 0 0 1-.733.44A1.003 1.003 0 0 1 24 23a1 1 0 0 1-.707-.293l-3-3a1 1 0 0 1 1.414-1.414l2.138 2.138 3.323-4.986a1 1 0 0 1 1.387-.277Z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-1 whitespace-pre-line text-sm font-semibold leading-snug text-zinc-800" style={{ fontSize: '14px' }}>{block.statOne || 'Compromisso com excelência e resultados desde o início.'}</p>
              <p className="font-poppins whitespace-pre-line text-xl font-bold leading-none text-red-600" style={{ fontSize: '21px' }}>
                {block.statTwo || '+20'} <span className="whitespace-pre-line text-xs font-normal text-zinc-500" style={{ fontSize: '13px' }}>{block.statThree || 'empresas atendidas'}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProcessStepIcon({ icon }: { icon: string }) {
  if (icon === 'diagnostico') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    )
  }

  if (icon === 'planejamento') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor" fillRule="evenodd">
        <path d="M43 6a5 5 0 0 0-5-5H10a5 5 0 0 0-5 5v36a5 5 0 0 0 5 5h28a5 5 0 0 0 5-5zm-2 0v36a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h28a3 3 0 0 1 3 3z" />
        <path d="m11.293 12.707 2 2a.999.999 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L14 12.586l-1.293-1.293a1 1 0 0 0-1.414 1.414zM11.293 20.707l2 2a.999.999 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L14 20.586l-1.293-1.293a1 1 0 0 0-1.414 1.414zM11.293 28.707l2 2a.999.999 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L14 28.586l-1.293-1.293a1 1 0 0 0-1.414 1.414zM11.293 36.707l2 2a.999.999 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L14 36.586l-1.293-1.293a1 1 0 0 0-1.414 1.414zM22 13h14a1 1 0 0 0 0-2H22a1 1 0 0 0 0 2zM22 21h14a1 1 0 0 0 0-2H22a1 1 0 0 0 0 2zM22 29h14a1 1 0 0 0 0-2H22a1 1 0 0 0 0 2zM22 37h14a1 1 0 0 0 0-2H22a1 1 0 0 0 0 2z" />
      </svg>
    )
  }

  if (icon === 'execucao') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
        <path d="M497 0c-54.914 0-110.168 12.43-159.79 35.945-48.886 23.168-92.901 57.383-127.448 99.035-13.758-7.035-34.262-12.105-57.551-7.445-27.195 5.438-65.465 26.145-93.363 93.895l-3.809 9.246 7.07 7.074c16.38 16.379 39.286 23.324 61.578 19.148l12.672 12.672-42.43 42.426 10.637 10.637c-15.543 2.199-30.527 9.254-42.457 21.187C18.812 387.117 7.281 446.484 2.07 493.363L0 512l18.637-2.07c46.879-5.211 106.246-16.743 149.547-60.043 11.93-11.93 18.988-26.91 21.183-42.453l10.637 10.632 42.426-42.425 12.672 12.671c-4.176 22.29 2.77 45.196 19.152 61.575l7.07 7.074 9.246-3.809c68.493-28.203 89.23-65.93 94.567-92.613 4.644-23.238-.86-44.293-8.11-58.309 41.645-34.543 75.864-78.554 99.028-127.44C499.57 125.167 512 69.913 512 15V0zM91.086 222.582c17.594-37.742 40.621-60.352 67.008-65.629 12.73-2.547 23.91-.676 31.926 2.129l-54.774 66.945-2.937-2.937-8.797 2.93c-11.024 3.68-22.77 2.308-32.426-3.438zm55.883 206.094c-31.395 31.39-73.176 43.168-112.649 49.004 5.836-39.473 17.614-81.254 49.004-112.649 8.774-8.773 20.297-13.156 31.82-13.156 11.52 0 23.04 4.383 31.813 13.148l.02.02c17.535 17.547 17.53 46.09-.008 63.633zm53.035-53.035-63.645-63.645 21.215-21.21 63.64 63.64zm155.715-20.985c-5.149 25.739-27.992 48.516-66.293 66.266-5.754-9.656-7.125-21.406-3.446-32.434l2.93-8.797-2.937-2.937 67.035-54.848c3.074 8.29 5.277 19.906 2.71 32.75zm.433-74.086-91.5 74.864-108.086-108.086 74.864-91.5c30.43-37.192 67.648-67.004 109.144-88.262 8.067 24.043 21.598 45.941 39.746 64.09 18.153 18.152 40.051 31.683 64.094 39.75-21.258 41.496-51.07 78.715-88.262 109.144zm100.836-136.62c-20.847-6.454-39.84-17.876-55.453-33.485-15.61-15.613-27.031-34.606-33.484-55.453 35.777-14.485 74.117-22.93 113.61-24.672-1.74 39.492-10.188 77.832-24.673 113.61zm0 0" />
        <path d="M263.645 163.5c-23.395 23.395-23.395 61.46 0 84.855s61.46 23.399 84.855 0c23.395-23.394 23.395-61.46 0-84.855s-61.46-23.395-84.855 0zm63.64 63.64c-11.695 11.696-30.73 11.696-42.426 0-11.699-11.695-11.699-30.73 0-42.43 11.696-11.694 30.73-11.694 42.426 0 11.7 11.7 11.7 30.735 0 42.43zm0 0" />
      </svg>
    )
  }

  if (icon === 'monitoramento') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    )
  }

  if (icon === 'otimizacao') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="currentColor">
        <path d="M3 10h25.09a5.992 5.992 0 0 0 11.82 0H45a1 1 0 0 0 0-2h-5.09a5.992 5.992 0 0 0-11.82 0H3a1 1 0 0 0 0 2Zm31-5a4 4 0 1 1-4 4 4.004 4.004 0 0 1 4-4ZM45 23H19c-.031 0-.057.015-.088.018A5.992 5.992 0 0 0 7.09 23H3a1 1 0 0 0 0 2h4.09a5.992 5.992 0 0 0 11.822-.018c.03.003.057.018.088.018h26a1 1 0 0 0 0-2Zm-32 5a4 4 0 1 1 4-4 4.004 4.004 0 0 1-4 4ZM45 38H29.91a5.992 5.992 0 0 0-11.82 0H3a1 1 0 0 0 0 2h15.09a5.992 5.992 0 0 0 11.82 0H45a1 1 0 0 0 0-2Zm-21 5a4 4 0 1 1 4-4 4.004 4.004 0 0 1-4 4Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}

function ProcessArrow() {
  return (
    <div className="hidden lg:flex items-center justify-center shrink-0 px-1">
      <svg width="48" height="12" viewBox="0 0 48 12" fill="none">
        <path d="M0 6h38M38 6l-5-5M38 6l-5 5" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 3" />
      </svg>
    </div>
  )
}

function WorkProcessPreview({ block }: { block: SiteBlock }) {
  const steps = [
    { number: '01', icon: 'diagnostico', title: block.stepOneTitle || 'Diagnóstico', text: block.stepOneText || 'Entendemos seu negócio, seus desafios e analisamos o cenário atual para identificar oportunidades de crescimento.' },
    { number: '02', icon: 'planejamento', title: block.stepTwoTitle || 'Planejamento', text: block.stepTwoText || 'Desenvolvemos uma estratégia personalizada com ações focadas nos objetivos e metas do seu negócio.' },
    { number: '03', icon: 'execucao', title: block.stepThreeTitle || 'Execução', text: block.stepThreeText || 'Colocamos o plano em prática com excelência, utilizando as melhores ferramentas e técnicas do mercado.' },
    { number: '04', icon: 'monitoramento', title: block.stepFourTitle || 'Monitoramento', text: block.stepFourText || 'Acompanhamos de perto os indicadores e analisamos os dados para garantir o melhor desempenho.' },
    { number: '05', icon: 'otimizacao', title: block.stepFiveTitle || 'Otimização', text: block.stepFiveText || 'Realizamos ajustes contínuos para melhorar os resultados e aumentar a eficiência das ações.' },
    { number: '06', icon: 'resultados', title: block.stepSixTitle || 'Resultados', text: block.stepSixText || 'Entregamos crescimento sustentável, com mais resultados, autoridade e vendas para o seu negócio.' },
  ]

  return (
    <section className="border-t border-zinc-200 bg-zinc-50 py-16 lg:py-20">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:mb-14 lg:flex-row lg:gap-16">
          <div>
            <p className="mb-4 whitespace-pre-line text-center text-[13px] font-bold uppercase tracking-widest text-red-600 lg:text-left">{block.eyebrow || 'COMO TRABALHAMOS'}</p>
            <h2 className="font-poppins whitespace-pre-line text-center text-2xl font-bold leading-tight text-zinc-900 sm:text-3xl lg:text-left lg:text-[36px]">
              {block.headline || 'Um processo estratégico para transformar objetivos em resultados.'}
            </h2>
          </div>
          <div className="flex max-w-[512px] items-end">
            <p className="whitespace-pre-line text-center text-[17px] leading-relaxed text-zinc-500 lg:text-left">
              {block.description || 'Acreditamos em um método claro, colaborativo e orientado a dados para entregar soluções personalizadas que geram impacto real no seu negócio.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:gap-0">
          {steps.map((step, index) => (
            <div key={step.number} className="flex lg:contents">
              <div className="flex flex-1 flex-col items-center px-3 py-2 text-center">
                <div className="mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-red-600" style={{ width: '60px', height: '60px' }}>
                  <div style={{ width: '25px', height: '25px' }}>
                    <ProcessStepIcon icon={step.icon} />
                  </div>
                </div>
                <p className="font-poppins mb-1 text-sm font-bold text-red-600" style={{ fontSize: '20px' }}>{step.number}</p>
                <p className="font-poppins mb-2 whitespace-pre-line text-sm font-bold text-zinc-900" style={{ fontSize: '16px' }}>{step.title}</p>
                <p className="whitespace-pre-line text-xs leading-relaxed text-zinc-500" style={{ fontSize: '13px', width: '100%' }}>{step.text}</p>
              </div>
              {index < steps.length - 1 && <ProcessArrow />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MissionVisionValuesPreview({ block }: { block: SiteBlock }) {
  const eyebrow = block.eyebrow === 'Cultura' ? 'MISSÃO, VISÃO E VALORES' : block.eyebrow || 'MISSÃO, VISÃO E VALORES'
  const missionTitle = block.cardOneTitle && block.cardOneTitle !== 'Princípios que guiam cada projeto' ? block.cardOneTitle : 'Missão'
  const missionText = block.cardOneText && block.cardOneText !== 'Blocos de missão, visão e valores da agência.'
    ? block.cardOneText
    : 'Compreender negócios para evidenciar ideias com criatividade, tecnologia e visão estratégica.'
  const visionTitle = block.cardTwoTitle || 'Visão'
  const visionText = block.cardTwoText || 'Consolidar-se como uma agência criativa e inovadora com conhecimento das marcas.'
  const valuesTitle = block.cardThreeTitle || 'Valores'
  const defaultValues = [
    '• Amor a Deus e ao próximo;',
    '• Fazer ao próximo o que gostaria que fizessem por você;',
    '• Compromisso e amor com ideias inovadoras;',
    '• Equilíbrio e transparência no trabalho em equipe;',
    '• Responsabilidade na parceria com os clientes;',
    '• Oportunidade e prosperidade por meio do conhecimento e merecimento;',
  ]
  const values = (block.preview || defaultValues.join('\n'))
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
  const [valueOne, valueTwo, valueThree, valueFour, valueFive, valueSix] = defaultValues.map((fallback, index) => values[index] || fallback)

  return (
    <section className="bg-white py-16 border-t border-zinc-200">
      <div className="max-w-384 mx-auto px-4 sm:px-6 lg:px-8">
        <p className="mb-10 whitespace-pre-line text-center text-xs font-bold uppercase tracking-widest text-red-600 lg:text-left" style={{ fontSize: '13px' }}>
          {eyebrow}
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
          <div className="flex flex-col items-center lg:items-start gap-3 text-center lg:text-left" style={{ border: '1px solid rgba(0, 0, 0, 0.08)', padding: '19px 25px', borderRadius: '10px' }}>
            <div className="text-red-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '35px', height: '35px' }}>
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <p className="font-poppins whitespace-pre-line text-sm font-bold text-zinc-900" style={{ fontSize: '15px' }}>{missionTitle}</p>
            <p className="whitespace-pre-line text-xs leading-relaxed text-zinc-500" style={{ fontSize: '14px' }}>{missionText}</p>
          </div>

          <div className="flex flex-col items-center lg:items-start gap-3 text-center lg:text-left" style={{ border: '1px solid rgba(0, 0, 0, 0.08)', padding: '19px 25px', borderRadius: '10px' }}>
            <div className="text-red-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '35px', height: '35px' }}>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <p className="font-poppins whitespace-pre-line text-sm font-bold text-zinc-900" style={{ fontSize: '15px' }}>{visionTitle}</p>
            <p className="whitespace-pre-line text-xs leading-relaxed text-zinc-500" style={{ fontSize: '14px' }}>{visionText}</p>
          </div>

          <div className="flex flex-col items-center lg:items-start gap-3 text-center lg:text-left" style={{ border: '1px solid rgba(0, 0, 0, 0.08)', padding: '19px 25px', borderRadius: '10px' }}>
            <div className="text-red-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '35px', height: '35px' }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <p className="font-poppins whitespace-pre-line text-sm font-bold text-zinc-900" style={{ fontSize: '15px' }}>{valuesTitle}</p>
            <ul className="flex flex-col gap-1 whitespace-pre-line text-xs leading-relaxed text-zinc-500" style={{ fontSize: '14px' }}>
              <li>{valueOne}</li>
              <li>{valueTwo}</li>
              <li>{valueThree}</li>
              <li>{valueFour}</li>
              <li>{valueFive}</li>
              <li>{valueSix}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function CtaPreview({ block, pageId = '' }: { block: SiteBlock; pageId?: string }) {
  const isHomeCta = block.id === 'cta-home'
  const isClientesPage = pageId === 'content-clientes'

  return (
    <section className="bg-zinc-950 border-t border-zinc-800 py-8" style={{ borderWidth: 'medium', borderStyle: 'none', borderColor: 'currentcolor', borderImage: 'initial', background: 'white', padding: '0px 16px 64px' }}>
      <div className="max-w-384 mx-auto px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-zinc-950)', maxWidth: isHomeCta ? '1472px' : '1460px', padding: 'clamp(28px, 4vw, 55px)', borderRadius: isHomeCta ? '9px' : '20px' }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-6 items-center lg:items-stretch" style={{ alignItems: 'center' }}>
          <div className="shrink-0">
            <svg width="587" height="587" viewBox="0 0 587 587" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-20 lg:h-[133px] w-auto">
              <g clipPath="url(#cta-logo-clip)">
                <path d="M406.163 553.363V180.971H33.7717V318.658H268.476V553.363H406.163Z" stroke="#CB2C30" strokeWidth="9" />
                <path d="M582.194 524.021V4.94043H63.1139V142.629H444.505V524.021H582.194Z" stroke="#CB2C30" strokeWidth="9" />
                <path d="M230.133 582.704V357H4.42932V582.704H230.133Z" stroke="#CB2C30" strokeWidth="9" />
              </g>
              <defs>
                <clipPath id="cta-logo-clip">
                  <rect width="587" height="587" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="hidden lg:block self-stretch w-px min-h-[48px]" style={{ backgroundColor: 'rgb(220, 38, 38)' }} />
          <div className="flex-1 lg:max-w-xl text-center lg:text-left w-full" style={{ maxWidth: isHomeCta ? '690px' : '650px' }}>
            <h2 className="font-poppins mb-3 whitespace-pre-line text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-[29px]">
              {isHomeCta ? block.headline || 'Quer resultados como esses na sua empresa?' : block.headline || 'Pronto para transformar seus objetivos em resultados reais?'}
            </h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-400" style={isHomeCta ? { fontSize: '18px', maxWidth: '550px' } : { fontSize: '15px' }}>
              {block.description || (isHomeCta ? 'Fale com nossos especialistas e descubra o que podemos fazer pelo seu crescimento.' : 'Fale com nossos especialistas e descubra como podemos criar estratégias personalizadas para acelerar o crescimento da sua empresa.')}
            </p>
          </div>
          <div className="hidden lg:block self-stretch w-px min-h-[48px]" style={isHomeCta ? undefined : { backgroundColor: 'rgba(63, 63, 70, 0.37)' }} />
          <div className="flex flex-col items-center lg:items-stretch gap-4 shrink-0 w-full lg:w-auto">
            <a href={block.buttonHref || '#contato'} className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide px-8 py-4 transition-colors duration-200 flex items-center justify-between gap-2" style={{ borderRadius: '4px', fontSize: '15px' }}>
              {block.buttonPrimary || 'RECEBER ANÁLISE'}
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '22px', height: '22px', flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            {/*
            {!isHomeCta && !isClientesPage && (
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <div className="flex -space-x-2 shrink-0">
                  <img alt="Cliente 1" className="w-8 h-8 rounded-full border-2 border-zinc-900 object-cover" src="/peoples/men1.jpg" />
                  <img alt="Cliente 2" className="w-8 h-8 rounded-full border-2 border-zinc-900 object-cover" src="/peoples/men2.jpg" />
                  <img alt="Cliente 3" className="w-8 h-8 rounded-full border-2 border-zinc-900 object-cover" src="/peoples/men3.jpg" />
                  <img alt="Cliente 4" className="w-8 h-8 rounded-full border-2 border-zinc-900 object-cover" src="/peoples/men4.jpg" />
                </div>
                <p className="text-zinc-400 text-center lg:text-left" style={{ maxWidth: '131px', fontSize: '13px', lineHeight: 1.4 }}>{block.statOne || '+60 empresas já confiam na Evidence'}</p>
              </div>
            )}
            */}
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Serviços page – SVG icon helpers ──────────────────────────────────────

function SvcIconBroadcast() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: 'auto', height: '52px' }} fill="currentColor">
      <path d="M9.6 22.6c-1.8 0-3.5-.6-5-1.8-1.9-1.5-3-3.7-3.2-6.2-.1-2.6.8-5.1 2.7-7l6.1-6.1c.2-.2.6-.2.8 0l2.6 2.6c.1.1.2.3.2.4 0 .2-.1.3-.2.4l-6.2 6.2c-.8.8-1.3 2-1.2 3.2.1 1.1.6 2 1.4 2.7 2.3 1.8 4.7-.2 5.7-1.2l5.7-5.6c.2-.2.6-.2.8 0l2.6 2.6c.1.1.2.3.2.4 0 .2-.1.3-.2.4l-5.7 5.6c-2.1 2.3-4.7 3.4-7.1 3.4zm-4.3-2.7c3.1 2.4 7.3 1.8 10.6-1.4l5.2-5.2-1.7-1.7-5.2 5.2C11.7 19.2 9 19.7 6.9 18c-1.1-.9-1.8-2.1-1.9-3.6s.5-3 1.6-4.1l5.8-5.8-1.7-1.7-5.8 5.8c-1.6 1.6-2.5 3.8-2.3 6.1.1 2 1.1 3.9 2.7 5.2z"/><path d="M10.7 7.8c-.2 0-.3-.1-.4-.2L7.7 5c-.2-.1-.2-.3-.2-.4 0-.2.1-.3.2-.4l2.6-2.6c.2-.2.6-.2.8 0l2.6 2.6c.1.1.2.3.2.4 0 .2-.1.3-.2.4l-2.6 2.6c-.1.1-.3.2-.4.2zM8.9 4.6l1.7 1.7 1.7-1.7-1.7-1.7zM19.4 16.4c-.2 0-.3-.1-.4-.2l-2.6-2.6c-.1-.1-.2-.3-.2-.4 0-.2.1-.3.2-.4l2.6-2.6c.2-.2.6-.2.8 0l2.6 2.6c.1.1.2.3.2.4 0 .2-.1.3-.2.4l-2.6 2.6c-.1.2-.2.2-.4.2zm-1.7-3.1 1.7 1.7 1.7-1.7-1.7-1.7z"/>
    </svg>
  )
}
function SvcIconFunnel() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 'auto', height: '52px' }}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}
function SvcIconVideo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 'auto', height: '52px' }}>
      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  )
}
function SvcIconLayers() {
  return (
    <svg viewBox="0 0 512.001 512.001" fill="currentColor" style={{ width: 'auto', height: '52px' }}>
      <path d="M435 271.718c-.996 0-1.97.097-2.912.282H240V77c0-8.284-6.716-15-15-15C100.643 62 0 162.633 0 287.001c0 124.358 100.632 225 225 225 124.358 0 225-100.632 225-225v-.282c0-8.285-6.714-15.001-15-15.001zM225 482.001c-107.523 0-195-87.477-195-195 0-102.477 79.458-186.745 180-194.43v194.43c0 8.284 6.716 15 15 15h194.43c-7.685 100.541-91.953 180-194.43 180z"/><path d="M446.099 65.901C403.602 23.404 347.101 0 287 0c-8.284 0-15 6.716-15 15v210.001c0 8.284 6.716 15 15 15h210c8.284 0 15-6.716 15-15 0-60.1-23.404-116.603-65.901-159.1zM302 210.001V30.571c95.59 7.306 172.123 83.839 179.429 179.43H302z"/>
    </svg>
  )
}
function SvcIconDiamond() {
  return (
    <svg viewBox="0 0 468 468" fill="currentColor" style={{ width: 'auto', height: '52px' }}>
      <path d="M185.078 468C83.026 468 0 384.989 0 282.955S83.026 97.91 185.078 97.91c33.729 0 66.768 9.202 95.547 26.611l-15.536 25.674c-24.093-14.574-51.76-22.278-80.011-22.278-85.503 0-155.065 69.55-155.065 155.038s69.562 155.038 155.065 155.038 155.065-69.55 155.065-155.038c0-28.245-7.704-55.907-22.281-79.995l25.679-15.533c17.412 28.773 26.615 61.807 26.615 95.528C370.156 384.989 287.13 468 185.078 468z"/>
    </svg>
  )
}
function SvcIconMonitor() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 'auto', height: '52px' }}>
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}
function SvcIconBarChart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 'auto', height: '52px' }}>
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  )
}
function SvcIconGear() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 'auto', height: '52px' }}>
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )
}
function AcelSvgSearch() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" style={{ width: '36px', height: '36px' }}><path d="m27.414 24.586-5.077-5.077A9.932 9.932 0 0 0 24 14c0-5.514-4.486-10-10-10S4 8.486 4 14s4.486 10 10 10a9.932 9.932 0 0 0 5.509-1.663l5.077 5.077a2 2 0 1 0 2.828-2.828zM7 14c0-3.86 3.14-7 7-7s7 3.14 7 7-3.14 7-7 7-7-3.14-7-7z"/></svg>
}
function AcelSvgPlan() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '36px', height: '36px' }}><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm5 14H7v-2h10v2zm0-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
}
function AcelSvgExec() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '36px', height: '36px' }}><path d="M13 2 4.09 12.97 11 12l-2 8L20 9l-7 .01L13 2z"/></svg>
}
function AcelSvgScale() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '36px', height: '36px' }}><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/></svg>
}
function StSvgUsers() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '50px', height: '50px' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
}
function StSvgTrending() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '50px', height: '50px' }}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
}
function StSvgGrid() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '50px', height: '50px' }}><path d="M10 24C4.5 24 0 19.5 0 14S4.5 4 10 4s10 4.5 10 10-4.5 10-10 10zm0-19c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9z"/><path d="M10 20.5c-3.6 0-6.5-2.9-6.5-6.5S6.4 7.5 10 7.5s6.5 2.9 6.5 6.5-2.9 6.5-6.5 6.5zm0-12C7 8.5 4.5 11 4.5 14S7 19.5 10 19.5s5.5-2.5 5.5-5.5S13 8.5 10 8.5z"/><path d="M10 17c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zm0-5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><path d="M10 14.5c-.1 0-.3 0-.4-.1-.2-.2-.2-.5 0-.7l7.5-7.5c.2-.2.5-.2.7 0s.2.5 0 .7l-7.5 7.5c0 .1-.2.1-.3.1z"/><path d="M20 7h-2.5c-.3 0-.5-.2-.5-.5V4c0-.1.1-.3.1-.4L20.6.1c.2-.1.4-.1.6-.1.2.1.3.3.3.5v2h2c.2 0 .4.1.5.3 0 .2 0 .4-.1.6l-3.5 3.5c-.1 0-.3.1-.4.1zm-2-1h1.8l2.5-2.5H21c-.3 0-.5-.2-.5-.5V1.7L18 4.2z"/></svg>
}
function StSvgTrophy() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.999 511.999" fill="currentColor" style={{ width: '50px', height: '50px' }}><path d="M466.45 49.374a37.048 37.048 0 0 0-28.267-13.071H402.41v-11.19C402.41 11.266 391.143 0 377.297 0H134.705c-13.848 0-25.112 11.266-25.112 25.112v11.19H73.816a37.05 37.05 0 0 0-28.267 13.071c-6.992 8.221-10.014 19.019-8.289 29.624 9.4 57.8 45.775 108.863 97.4 136.872 4.717 11.341 10.059 22.083 16.008 32.091 19.002 31.975 42.625 54.073 68.627 64.76 2.635 26.644-15.094 51.885-41.794 57.9-.057.013-.097.033-.153.046-5.211 1.245-9.09 5.921-9.09 11.513v54.363h-21.986c-19.602 0-35.549 15.947-35.549 35.549v28.058c0 6.545 5.305 11.85 11.85 11.85H390.56c6.545 0 11.85-5.305 11.85-11.85v-28.058c0-19.602-15.947-35.549-35.549-35.549h-21.988V382.18c0-5.603-3.893-10.286-9.118-11.52-.049-.012-.096-.028-.145-.04-26.902-6.055-44.664-31.55-41.752-58.394 25.548-10.86 48.757-32.761 67.479-64.264 5.949-10.009 11.29-20.752 16.008-32.095 51.622-28.01 87.995-79.072 97.395-136.87 1.725-10.605-1.297-21.402-8.29-29.623zM60.652 75.192c-.616-3.787.431-7.504 2.949-10.466A13.388 13.388 0 0 1 73.815 60h35.777v21.802c0 34.186 4.363 67.3 12.632 97.583-32.496-25.679-54.87-62.982-61.572-104.193zm306.209 385.051c6.534 0 11.85 5.316 11.85 11.85v16.208H134.422v-16.208c0-6.534 5.316-11.85 11.85-11.85h220.589zm-45.688-66.213v42.513H191.96V394.03h129.213zm-98.136-23.699a78.449 78.449 0 0 0 8.002-10.46c7.897-12.339 12.042-26.357 12.228-40.674 4.209.573 8.457.88 12.741.88a94.34 94.34 0 0 0 13.852-1.036c.27 19.239 7.758 37.45 20.349 51.289h-67.172zM378.709 81.803c0 58.379-13.406 113.089-37.747 154.049-23.192 39.03-53.364 60.525-84.956 60.525-31.597 0-61.771-21.494-84.966-60.523-24.342-40.961-37.748-95.671-37.748-154.049V25.112c0-.78.634-1.413 1.412-1.413h242.591c.78 0 1.414.634 1.414 1.413v56.691zm72.639-6.611c-6.702 41.208-29.074 78.51-61.569 104.191 8.268-30.283 12.631-63.395 12.631-97.58V60.001h35.773c3.938 0 7.66 1.723 10.214 4.726 2.518 2.961 3.566 6.678 2.951 10.465z"/><path d="M327.941 121.658a11.857 11.857 0 0 0-9.566-8.064l-35.758-5.196-15.991-32.402a11.852 11.852 0 0 0-21.252 0l-15.991 32.402-35.758 5.196a11.849 11.849 0 0 0-6.567 20.213l25.875 25.221-6.109 35.613a11.848 11.848 0 0 0 17.193 12.492L256 190.32l31.982 16.813a11.843 11.843 0 0 0 12.478-.903 11.848 11.848 0 0 0 4.714-11.59l-6.109-35.613 25.875-25.221a11.849 11.849 0 0 0 3.001-12.148zm-49.877 24.747a11.847 11.847 0 0 0-3.408 10.489l3.102 18.09-16.245-8.541a11.86 11.86 0 0 0-11.028 0l-16.245 8.541 3.102-18.09a11.849 11.849 0 0 0-3.408-10.489l-13.141-12.81 18.162-2.64a11.849 11.849 0 0 0 8.922-6.482L256 108.015l8.122 16.458a11.851 11.851 0 0 0 8.922 6.482l18.162 2.64-13.142 12.81z"/></svg>
}

// ── Serviços page preview components ─────────────────────────────────────

function ServicosHeroPreview({ block }: { block: SiteBlock }) {
  return (
    <section
      className="relative py-16 overflow-hidden"
      style={{
        backgroundImage: block.imageUrl ? `url(${block.imageUrl})` : 'url(/crescimento1.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
        backgroundRepeat: 'no-repeat',
        minHeight: '260px',
      }}
    >
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.92) 50%, rgba(255,255,255,0.3) 90%)' }} />
      <div className="relative z-10 max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl flex flex-col items-start">
          <p className="text-red-600 font-bold tracking-widest uppercase mb-5" style={{ fontSize: '13px' }}>
            {block.eyebrow || 'NOSSOS SERVIÇOS'}
          </p>
          <h1 className="font-poppins text-3xl sm:text-4xl font-bold text-zinc-900 leading-tight mb-6" style={{ lineHeight: '1.12' }}>
            {block.headline || 'Soluções completas para gerar demanda e acelerar vendas.'}
          </h1>
          <p className="text-zinc-500 leading-relaxed" style={{ fontSize: '17px', maxWidth: '560px' }}>
            {block.description || 'Atuamos em todas as frentes do marketing e vendas para estruturar, executar e escalar o crescimento da sua empresa.'}
          </p>
        </div>
      </div>
    </section>
  )
}

const serviceIconOptions = [
  { key: 'broadcast', label: 'Megafone', icon: Megaphone },
  { key: 'funnel', label: 'Funil', icon: Funnel },
  { key: 'video', label: 'Vídeo', icon: Video },
  { key: 'layers', label: 'Camadas', icon: Layers },
  { key: 'diamond', label: 'Diamante', icon: Gem },
  { key: 'monitor', label: 'Monitor', icon: Monitor },
  { key: 'chart', label: 'Gráfico de barras', icon: ChartColumn },
  { key: 'gear', label: 'Engrenagem', icon: Settings },
  { key: 'target', label: 'Alvo', icon: Target },
  { key: 'users', label: 'Pessoas', icon: Users },
  { key: 'search', label: 'Busca', icon: Search },
  { key: 'lightbulb', label: 'Ideia', icon: Lightbulb },
  { key: 'rocket', label: 'Foguete', icon: Rocket },
  { key: 'globe', label: 'Globo', icon: Globe },
  { key: 'laptop', label: 'Notebook', icon: Laptop },
  { key: 'smartphone', label: 'Smartphone', icon: Smartphone },
  { key: 'mail', label: 'Email', icon: Mail },
  { key: 'message', label: 'Mensagem', icon: MessageCircle },
  { key: 'bot', label: 'Bot', icon: Bot },
  { key: 'workflow', label: 'Workflow', icon: Workflow },
  { key: 'database', label: 'Banco de dados', icon: Database },
  { key: 'line-chart', label: 'Gráfico de linha', icon: LineChart },
  { key: 'pie-chart', label: 'Gráfico pizza', icon: PieChart },
  { key: 'bar-chart', label: 'Gráfico colunas', icon: BarChart3 },
  { key: 'cart', label: 'Carrinho', icon: ShoppingCart },
  { key: 'briefcase', label: 'Maleta', icon: Briefcase },
  { key: 'handshake', label: 'Parceria', icon: Handshake },
  { key: 'badge-check', label: 'Selo check', icon: BadgeCheck },
  { key: 'zap', label: 'Raio', icon: Zap },
  { key: 'click', label: 'Clique', icon: MousePointerClick },
  { key: 'pointer', label: 'Ponteiro', icon: MousePointer2 },
  { key: 'share', label: 'Compartilhar', icon: Share2 },
  { key: 'file', label: 'Arquivo', icon: FileText },
  { key: 'pencil', label: 'Lápis', icon: Pencil },
  { key: 'palette', label: 'Paleta', icon: Palette },
  { key: 'code', label: 'Código', icon: Code2 },
  { key: 'cpu', label: 'Processador', icon: Cpu },
  { key: 'cloud', label: 'Nuvem', icon: Cloud },
  { key: 'wrench', label: 'Ferramenta', icon: Wrench },
  { key: 'calendar', label: 'Calendário', icon: Calendar },
  { key: 'phone', label: 'Telefone', icon: Phone },
  { key: 'map-pin', label: 'Localização', icon: MapPin },
  { key: 'shield', label: 'Escudo', icon: ShieldCheck },
  { key: 'trophy', label: 'Troféu', icon: Trophy },
  { key: 'flag', label: 'Bandeira', icon: Flag },
  { key: 'eye', label: 'Olho', icon: Eye },
  { key: 'network', label: 'Rede', icon: Network },
  { key: 'gauge', label: 'Velocímetro', icon: Gauge },
  { key: 'presentation', label: 'Apresentação', icon: Presentation },
  { key: 'book', label: 'Livro', icon: BookOpen },
  { key: 'newspaper', label: 'Jornal', icon: Newspaper },
  { key: 'pen-tool', label: 'Caneta', icon: PenTool },
  { key: 'camera', label: 'Câmera', icon: Camera },
  { key: 'clapperboard', label: 'Claquete', icon: Clapperboard },
  { key: 'radio', label: 'Rádio', icon: Radio },
  { key: 'send', label: 'Enviar', icon: Send },
  { key: 'brain', label: 'Cérebro', icon: Brain },
  { key: 'boxes', label: 'Caixas', icon: Boxes },
] satisfies { key: string; label: string; icon: LucideIcon }[]

function getServiceIcon(iconKey: string | undefined, index: number) {
  const Icon = serviceIconOptions.find((option) => option.key === iconKey)?.icon || serviceIconOptions[index % serviceIconOptions.length].icon
  return <Icon strokeWidth={1.6} style={{ width: 'auto', height: '52px' }} />
}

const defaultServiceCards: ServiceCard[] = [
  { iconKey: 'broadcast', title: 'Geração de Demanda', desc: 'Atraímos as pessoas certas para o seu negócio com estratégias multicanais focadas em aumentar o volume e a qualidade de leads.', items: ['Tráfego Pago (Ads)', 'SEO e Conteúdo', 'Mídias Sociais', 'Inbound Marketing', 'Landing Pages', 'Automação de Marketing'] },
  { iconKey: 'funnel', title: 'Gestão de Leads', desc: 'Capturamos, qualificamos e nutrimos leads de forma inteligente até que estejam prontos para comprar.', items: ['Qualificação de Leads', 'Nutrição e Relacionamento', 'Scoring e Segmentação', 'Automação e Fluxos', 'CRM e Integrações'] },
  { iconKey: 'video', title: 'Produtora de Vídeos', desc: 'Produzimos conteúdos audiovisuais que conectam, engajam e fortalecem a imagem da sua marca.', items: ['Cobertura de Eventos', 'Vídeos Institucionais', 'Vídeos Comerciais', 'Depoimentos', 'Vídeos para Mídias Sociais', 'Edição e Finalização Profissional'] },
  { iconKey: 'layers', title: 'Gestão de Mídias e Conteúdo', desc: 'Criamos conteúdo estratégico que posiciona sua marca, gera autoridade e impulsiona resultados.', items: ['Planejamento de Conteúdo', 'Produção de Conteúdo', 'Gestão de Mídias Sociais', 'Copywriting', 'Design e Criativos'] },
  { iconKey: 'diamond', title: 'Posicionamento e Marca', desc: 'Desenvolvemos marcas fortes e posicionamentos claros que diferenciam sua empresa no mercado e geram valor.', items: ['Estratégia de Posicionamento', 'Identidade Visual', 'Mensagem e Tom de Voz', 'Branding', 'Arquétipos de Marca'] },
  { iconKey: 'monitor', title: 'Sites e Experiência', desc: 'Criamos sites rápidos, modernos e otimizados para conversão, oferecendo a melhor experiência para seu cliente.', items: ['Sites Institucionais', 'Landing Pages', 'Blog e SEO Técnico', 'UX / UI Design', 'Otimização de Conversão'] },
  { iconKey: 'chart', title: 'BI e Performance', desc: 'Transformamos dados em insights para você tomar decisões melhores e crescer com previsibilidade.', items: ['Dashboards e Relatórios', 'KPIs e Métricas', 'Análise de Campanhas', 'BI de Marketing e Vendas', 'Previsão de Resultados'] },
  { iconKey: 'gear', title: 'Automação e Tecnologia', desc: 'Implementamos automações e integrações que tornam seus processos mais eficientes e escaláveis.', items: ['Automação de Marketing', 'Integrações (CRM, Ads, Email)', 'Workflows e Processos', 'Chatbots e Atendimento', 'Ferramentas e Plataformas'] },
]

function splitServiceItems(raw: string | undefined, fallback: string[] = []) {
  const source = raw ? raw.split(/\r?\n|,(?=\s)/) : fallback
  return source.map((item) => item.trim()).filter(Boolean)
}

function readServiceCards(block: SiteBlock): ServiceCard[] {
  if (block.servicesJson) {
    try {
      const parsed = JSON.parse(block.servicesJson)
      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => ({
            title: String(item?.title ?? ''),
            desc: String(item?.desc ?? ''),
            items: Array.isArray(item?.items) ? item.items.map(String) : splitServiceItems(String(item?.items ?? '')),
            iconKey: typeof item?.iconKey === 'string' ? item.iconKey : undefined,
          }))
          .filter((item) => item.title || item.desc || item.items.some(Boolean))
      }
    } catch {}
  }

  return defaultServiceCards.map((item, index) => {
    const key = `s${index + 1}`
    const record = block as Record<string, string | undefined>
    return {
      title: record[`${key}Title`] || item.title,
      desc: record[`${key}Desc`] || item.desc,
      items: splitServiceItems(record[`${key}Items`], item.items),
      iconKey: item.iconKey,
    }
  })
}

function ServicosGridPreview({ block }: { block: SiteBlock }) {
  const splitItems = (raw: string | undefined, fallback: string) =>
    (raw || fallback).split(/\r?\n|,(?=\s)/).map((s) => s.trim()).filter(Boolean)

  const services = [
    { icon: <SvcIconBroadcast />, title: block.s1Title || 'Geração de Demanda', desc: block.s1Desc || 'Atraímos as pessoas certas para o seu negócio com estratégias multicanais.', items: splitItems(block.s1Items, 'Tráfego Pago (Ads), SEO e Conteúdo, Mídias Sociais, Inbound Marketing, Landing Pages, Automação de Marketing') },
    { icon: <SvcIconFunnel />, title: block.s2Title || 'Gestão de Leads', desc: block.s2Desc || 'Capturamos, qualificamos e nutrimos leads de forma inteligente.', items: splitItems(block.s2Items, 'Qualificação de Leads, Nutrição e Relacionamento, Scoring e Segmentação, Automação e Fluxos, CRM e Integrações') },
    { icon: <SvcIconVideo />, title: block.s3Title || 'Produtora de Vídeos', desc: block.s3Desc || 'Produzimos conteúdos audiovisuais que conectam e engajam.', items: splitItems(block.s3Items, 'Cobertura de Eventos, Vídeos Institucionais, Vídeos Comerciais, Depoimentos, Vídeos para Mídias Sociais') },
    { icon: <SvcIconLayers />, title: block.s4Title || 'Gestão de Mídias e Conteúdo', desc: block.s4Desc || 'Criamos conteúdo estratégico que posiciona sua marca.', items: splitItems(block.s4Items, 'Planejamento de Conteúdo, Produção de Conteúdo, Gestão de Mídias Sociais, Copywriting, Design e Criativos') },
    { icon: <SvcIconDiamond />, title: block.s5Title || 'Posicionamento e Marca', desc: block.s5Desc || 'Desenvolvemos marcas fortes que diferenciam sua empresa.', items: splitItems(block.s5Items, 'Estratégia de Posicionamento, Identidade Visual, Mensagem e Tom de Voz, Branding, Arquétipos de Marca') },
    { icon: <SvcIconMonitor />, title: block.s6Title || 'Sites e Experiência', desc: block.s6Desc || 'Criamos sites modernos e otimizados para conversão.', items: splitItems(block.s6Items, 'Sites Institucionais, Landing Pages, Blog e SEO Técnico, UX / UI Design, Otimização de Conversão') },
    { icon: <SvcIconBarChart />, title: block.s7Title || 'BI e Performance', desc: block.s7Desc || 'Transformamos dados em insights para decisões melhores.', items: splitItems(block.s7Items, 'Dashboards e Relatórios, KPIs e Métricas, Análise de Campanhas, BI de Marketing e Vendas, Previsão de Resultados') },
    { icon: <SvcIconGear />, title: block.s8Title || 'Automação e Tecnologia', desc: block.s8Desc || 'Implementamos automações que tornam seus processos eficientes.', items: splitItems(block.s8Items, 'Automação de Marketing, Integrações (CRM, Ads, Email), Workflows e Processos, Chatbots e Atendimento') },
  ]
  const visibleServices = block.servicesJson ? readServiceCards(block) : services.map(({ title, desc, items }) => ({ title, desc, items }))

  return (
    <section className="bg-white py-10 border-t border-zinc-200">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-16 mb-8" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-1 bg-red-600 self-stretch rounded-full hidden lg:block" style={{ minHeight: '20px' }} />
            <p className="text-zinc-900 font-bold tracking-widest uppercase" style={{ fontSize: '14px', letterSpacing: '0.12em' }}>
              {block.eyebrow || 'NOSSOS SERVIÇOS'}
            </p>
          </div>
          <p className="text-zinc-500 leading-relaxed lg:max-w-xl" style={{ fontSize: '14px', maxWidth: '542px' }}>
            {block.description || 'Estratégia, execução e tecnologia trabalhando juntas para atrair as pessoas certas, converter oportunidades e acelerar resultados reais.'}
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {visibleServices.map((s, i) => (
            <div key={i} className="flex flex-col gap-2 p-4 items-start text-left" style={{ border: '1px solid #e4e4e7', borderRadius: '8px' }}>
              <div className="text-red-600 mb-1">{getServiceIcon(s.iconKey, i)}</div>
              <p className="font-poppins font-bold text-zinc-900" style={{ fontSize: '14px' }}>{s.title}</p>
              <p className="text-zinc-500 leading-relaxed" style={{ fontSize: '12px' }}>{s.desc}</p>
              <ul className="flex flex-col gap-0.5 mt-1">
                {s.items.filter(Boolean).slice(0, 5).map((item, j) => (
                  <li key={j} className="text-zinc-400" style={{ fontSize: '11px' }}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AceleradorPreview({ block }: { block: SiteBlock }) {
  const items = [
    { icon: <AcelSvgSearch />, title: block.cardOneTitle || 'Diagnóstico Estratégico', desc: block.cardOneText || 'Analisamos seu cenário atual, identificando pontos e oportunidades de crescimento.' },
    { icon: <AcelSvgPlan />, title: block.cardTwoTitle || 'Plano de Crescimento', desc: block.cardTwoText || 'Criamos um plano personalizado com metas claras, estratégias e ações priorizadas.' },
    { icon: <AcelSvgExec />, title: block.cardThreeTitle || 'Execução Inteligente', desc: block.cardThreeText || 'Colocamos o plano em prática com métodos ágeis, focados em resultados.' },
    { icon: <AcelSvgScale />, title: block.cardFourTitle || 'Escala e Resultados', desc: block.cardFourText || 'Otimizamos continuamente para acelerar o que funciona e gerar resultados maiores.' },
  ]

  return (
    <section style={{ background: 'white', paddingTop: '16px', paddingBottom: '0' }}>
      <div style={{ backgroundColor: '#09090b', padding: 'clamp(20px, 4vw, 40px)', borderRadius: '15px' }}>
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center lg:items-start">
          <div className="shrink-0 flex items-center justify-center" style={{ width: '240px', minHeight: '300px' }}>
            <img src="/foguete.png" alt="Foguete" style={{ width: '220px', height: '280px', objectFit: 'contain' }} />
          </div>
          <div className="flex-1 flex flex-col items-start text-left">
            <p className="text-red-600 font-bold tracking-widest uppercase mb-4" style={{ fontSize: '12px' }}>
              {block.eyebrow || 'ACELERADOR DE NEGÓCIOS'}
            </p>
            <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-10 mb-8 items-start lg:justify-between">
              <h2 className="font-poppins text-2xl sm:text-3xl lg:text-[34px] font-bold text-white leading-tight" style={{ lineHeight: '1.2', maxWidth: '612px' }}>
                {block.headline || 'O programa que impulsiona seu crescimento de forma estruturada e contínua.'}
              </h2>
              <p className="text-zinc-400 leading-relaxed" style={{ fontSize: '16px', maxWidth: '480px' }}>
                {block.description || 'Nosso Acelerador de Negócios é um programa completo que alia estratégia, execução e performance para gerar crescimento previsível e sustentável.'}
              </p>
            </div>
            <div className="w-full flex flex-col lg:flex-row gap-[18px] lg:gap-0 items-start lg:items-stretch lg:justify-around" style={{ gap: '18px' }}>
              {items.map((item, i) => (
                <Fragment key={i}>
                  <div className="flex flex-col gap-2 flex-1 text-left items-start" style={{ padding: 0, maxWidth: '250px', width: '100%' }}>
                    <div className="text-red-600 mb-1">{item.icon}</div>
                    <p className="font-poppins font-bold text-white" style={{ fontSize: '14px' }}>{item.title}</p>
                    <p className="text-zinc-400" style={{ fontSize: '13px', lineHeight: '1.5' }}>{item.desc}</p>
                  </div>
                  {i < 3 && <div className="hidden lg:block w-px bg-zinc-800 self-stretch" style={{ opacity: '65%' }} />}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function EstatisticasPreview({ block }: { block: SiteBlock }) {
  const stats = [
    { icon: <StSvgUsers />, value: block.statOne || '+20', label: block.statOneLabel || 'empresas aceleradas' },
    { icon: <StSvgTrending />, value: block.statTwo || 'milhões', label: block.statTwoLabel || 'em vendas geradas' },
    { icon: <StSvgGrid />, value: block.statThree || 'diversos', label: block.statThreeLabel || 'segmentos atendidos' },
    { icon: <StSvgTrophy />, value: block.statFour || 'resultados', label: block.statFourLabel || 'comprovados' },
  ]

  return (
    <section style={{ background: 'white', paddingTop: '8px' }}>
      <div style={{ border: '1px solid #d1d5db', borderRadius: '15px', padding: 'clamp(16px, 3vw, 32px) clamp(16px, 4vw, 56px)' }}>
        <div className="flex flex-row flex-wrap justify-between items-center gap-4">
          {stats.map((stat, i) => (
            <Fragment key={i}>
              <div className="flex flex-row items-center gap-4">
                <div className="text-red-600 shrink-0">{stat.icon}</div>
                <div className="flex flex-col">
                  <p className="font-poppins font-bold text-black" style={{ fontSize: '20px', lineHeight: '1.2' }}>{stat.value}</p>
                  <p className="text-gray-600" style={{ fontSize: '12px' }}>{stat.label}</p>
                </div>
              </div>
              {i < 3 && <div className="hidden lg:block w-px self-stretch bg-gray-300" />}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}

const defaultClientCards: ClientCard[] = [
  { name: 'Agroforte Soluções Agrícolas', description: 'Soluções completas para o agronegócio, com foco em produtividade e inovação.', since: '2021', segment: 'Agronegócio' },
  { name: 'Indumax Indústria e Comércio', description: 'Indústria especializada em soluções metálicas e componentes para diversos setores.', since: '2020', segment: 'Indústria' },
  { name: 'Saúde Prime Clínica Especializada', description: 'Clínica médica especializada em oferecer atendimento humanizado e de excelência.', since: '2022', segment: 'Saúde' },
  { name: 'Ribeirão Saneamento', description: 'Soluções completas em saneamento para residências, empresas e indústrias.', since: '2021', segment: 'Indústria' },
  { name: 'Nutrivet Saúde Animal', description: 'Produtos e soluções para a saúde e o bem-estar animal com alta qualidade.', since: '2021', segment: 'Agronegócio' },
  { name: 'EngePro Construções', description: 'Construção civil com foco em qualidade, prazos e responsabilidade em cada projeto.', since: '2020', segment: 'Indústria' },
  { name: 'FlexMaq Equipamentos', description: 'Máquinas e equipamentos de alta performance para impulsionar a indústria.', since: '2022', segment: 'Indústria' },
  { name: 'Agroplant Biotecnologia', description: 'Biotecnologia aplicada ao agronegócio com sementes de alta produtividade e qualidade.', since: '2021', segment: 'Agronegócio' },
  { name: 'Dental Art Odontologia', description: 'Clínica odontológica especializada em oferecer tratamentos modernos e personalizados.', since: '2023', segment: 'Saúde' },
  { name: 'Connect Tecnologia', description: 'Soluções tecnológicas que conectam empresas a melhores resultados e eficiência.', since: '2022', segment: 'Tecnologia' },
  { name: 'MediLife Hospitalar', description: 'Distribuição de produtos hospitalares com qualidade, segurança e agilidade.', since: '2020', segment: 'Saúde' },
  { name: 'Velocitá Logística', description: 'Logística inteligente e eficiente para otimizar operações e reduzir custos.', since: '2021', segment: 'Serviços' },
  { name: 'Proativa Serviços', description: 'Terceirização de serviços com foco em qualidade, gestão e excelência operacional.', since: '2022', segment: 'Serviços' },
  { name: 'Impacto Comunicação Visual', description: 'Soluções visuais que fortalecem marcas e geram impacto no mercado.', since: '2021', segment: 'Serviços' },
  { name: 'Laborclin Análises Clínicas', description: 'Laboratório de análises clínicas com precisão, confiança e atendimento humanizado.', since: '2023', segment: 'Saúde' },
  { name: 'Energy Soluções em Energia', description: 'Soluções em energia solar e elétrica para empresas e residências.', since: '2022', segment: 'Tecnologia' },
  { name: 'Grupo Ágil', description: 'Consultoria e gestão empresarial para transformar negócios e gerar resultados.', since: '2020', segment: 'Serviços' },
  { name: 'Ponto Certo Distribuição', description: 'Distribuição ágil e eficiente com foco em qualidade e relacionamento duradouro.', since: '2021', segment: 'Comércio' },
]

const clientSegmentOptions = ['Indústria', 'Agroindústria', 'Indústria Comércio', 'Saúde', 'Agronegócio', 'Serviços', 'Comércio', 'Tecnologia']

function readClientCards(block: SiteBlock): ClientCard[] {
  if (block.clientsJson) {
    try {
      const parsed = JSON.parse(block.clientsJson)
      if (Array.isArray(parsed)) {
        const clients = parsed
          .map((item) => ({
            name: String(item?.name ?? ''),
            description: String(item?.description ?? ''),
            since: String(item?.since ?? ''),
            segment: String(item?.segment ?? ''),
            imageUrl: typeof item?.imageUrl === 'string' ? item.imageUrl : undefined,
          }))
          .filter((item) => item.name || item.description || item.since || item.segment)
        if (clients.length) return clients
      }
    } catch {}
  }
  return defaultClientCards
}

const defaultTestimonialCards: TestimonialCard[] = [
  { quote: 'A Evidence reorganizou nosso marketing e nos ajudou a gerar oportunidades com muito mais qualidade. Nosso time comercial nunca teve leads tão prontos para a compra.', name: 'João Paulo B.', company: 'Agroforte Soluções Agrícolas', since: '2021', video: '' },
  { quote: 'Tivemos um aumento significativo na geração de leads e na taxa de conversão. O processo ficou muito mais previsível.', name: 'Mariana T.', company: 'Indumax Indústria e Comércio', since: '2022', video: '' },
  { quote: 'A equipe entendeu nosso negócio e trouxe uma estratégia que realmente fez diferença no faturamento.', name: 'Ricardo A.', company: 'Ribeirão Ferramentas', since: '2021', video: '' },
  { quote: 'Organizaram nosso marketing, alinharam com o comercial e os resultados apareceram de forma consistente.', name: 'Juliana P.', company: 'Saúde Prime Clínica Especializada', since: '2023', video: '' },
  { quote: 'O trabalho da Evidence trouxe clareza para o nosso posicionamento e aumentou muito a qualidade das oportunidades que recebemos.', name: 'Fernando C.', company: 'Nutrivet Saúde Animal', since: '2022', video: '' },
  { quote: 'Mais do que uma agência, se tornaram parceiros estratégicos do nosso crescimento.', name: 'Leonardo S.', company: 'Engepro Construções', since: '2021', video: '' },
]

function readTestimonialCards(block: SiteBlock): TestimonialCard[] {
  if (block.testimonialsJson) {
    try {
      const parsed = JSON.parse(block.testimonialsJson)
      if (Array.isArray(parsed)) {
        const testimonials = parsed
          .map((item) => ({
            quote: String(item?.quote ?? ''),
            name: String(item?.name ?? ''),
            company: String(item?.company ?? ''),
            since: String(item?.since ?? ''),
            video: String(item?.video ?? item?.videoLink ?? ''),
          }))
          .filter((item) => item.quote || item.name || item.company || item.since || item.video)
        if (testimonials.length) return testimonials
      }
    } catch {}
  }
  return defaultTestimonialCards
}

function SectionPreview({ block, compact = false, pageId = '' }: { block: SiteBlock; compact?: boolean; pageId?: string }) {
  const imageSrc = block.imageUrl || (
    block.id === 'hero' ? '/banner-home.png'
    : block.id === 'atuacao' ? '/mesa.webp'
    : block.id === 'sobre-nos' ? '/equipe.png'
    : block.id === 'acelerador' ? '/foguete.png'
    : block.id === 'grid-servicos' ? '/crescimento1.png'
    : ''
  )
  const previewHeight = compact ? 'min-h-[300px]' : 'min-h-[420px]'

  if (block.id === 'hero' && pageId === 'content-analise') {
    const cleanAnaliseCopy = (value: string | undefined, fallback: string) =>
      String(value || fallback).replace(/\s+teste\s*\d*\s*$/i, '').trim()
    const analiseHeadline = cleanAnaliseCopy(block.headline, 'Vamos começar a análise do seu negócio?')
    const analiseDescription = cleanAnaliseCopy(
      block.description,
      'Para oferecer um diagnóstico preciso e estratégias personalizadas, precisamos entender melhor o contexto do seu negócio.',
    )
    const analisePrompt = cleanAnaliseCopy(block.preview, 'Selecione o segmento que melhor representa sua empresa:')

    return (
      <section className="grid min-h-[290px] place-items-center bg-[#050608] px-4 py-10 text-center text-white">
        <div className="max-w-[760px]">
          <h1 className="font-poppins whitespace-pre-line text-[34px] font-bold leading-[1.05] sm:text-[42px]">
            {analiseHeadline}
          </h1>
          <p className="mx-auto mt-7 max-w-[620px] whitespace-pre-line text-[16px] leading-[1.8] text-white">
            {analiseDescription}
          </p>
          <p className="mt-10 text-[15px] font-bold text-white">
            {analisePrompt}
          </p>
        </div>
      </section>
    )
  }

  if (block.id === 'hero' && pageId === 'content-servicos') {
    return <ServicosHeroPreview block={block} />
  }

  if (block.id === 'hero' && pageId === 'content-blog') {
    return <BlogHeroSection heroBlock={block} />
  }

  if (block.id === 'cta' && pageId === 'content-blog') {
    return <BlogCtaSection ctaBlock={block} />
  }

  if (block.id === 'hero' && pageId === 'content-clientes') {
    return <ClientesHeroSection heroBlock={block} preview />
  }

  if (block.id === 'logos' && pageId === 'content-clientes') {
    return <ClientesGridSection clients={readClientCards(block).map((client, index) => ({ ...client, id: index + 1 }))} compact />
  }

  if (block.id === 'cta' && pageId === 'content-clientes') {
    return <ClientesCtaSection ctaBlock={block} />
  }

  if (block.id === 'hero' && pageId === 'content-depoimentos') {
    return <DepoimentosHeroSection heroBlock={block} />
  }

  if (block.id === 'depoimentos' && pageId === 'content-depoimentos') {
    return <DepoimentosGridSection testimonials={readTestimonialCards(block).map((item, index) => ({ ...item, id: index + 1 }))} />
  }

  if (block.id === 'cta' && pageId === 'content-depoimentos') {
    return <DepoimentosCtaSection ctaBlock={block} />
  }

  if (block.id === 'grid-servicos') {
    return <ServicosGridPreview block={block} />
  }

  if (block.id === 'acelerador') {
    return <AceleradorPreview block={block} />
  }

  if (block.id === 'estatisticas') {
    return <EstatisticasPreview block={block} />
  }

  if (block.id === 'hero') {
    return <Hero block={block} />
  }

  if (block.id === 'sobre-nos') {
    return <AboutSectionPreview block={block} imageSrc={imageSrc} />
  }

  if (block.id === 'cenario') {
    const cenarioEyebrow = block.eyebrow === 'Contexto' ? 'O CENÁRIO' : block.eyebrow || 'O CENÁRIO'
    const cenarioHeadline = block.headline.startsWith('O mercado mudou') ? 'Muitas empresas investem em marketing, mas as vendas não acompanham.' : block.headline || 'Muitas empresas investem em marketing, mas as vendas não acompanham.'
    const cenarioProblemOne = block.problemOne || (block.description.startsWith('Se') ? 'Falta de alinhamento entre marketing, posicionamento e processo comercial.' : block.description) || 'Falta de alinhamento entre marketing, posicionamento e processo comercial.'

    return (
      <section id="cenario" className="bg-white py-20">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <p className="text-red-600 text-xs font-bold tracking-widest uppercase mb-4" style={{ fontSize: '17px' }}>{cenarioEyebrow}</p>
              <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-zinc-900 leading-tight mb-6">{cenarioHeadline}</h2>
              <div className="w-12 h-1 bg-red-600 mx-auto lg:mx-0" />
            </div>
            <div className="flex flex-col sm:flex-row">
              <div className="flex-1 flex flex-col items-center text-center sm:items-start sm:text-left gap-4 py-4 sm:py-0">
                <div className="w-14 h-14 flex items-center justify-center" style={{ width: 'fit-content', height: 'fit-content' }}>
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ width: '55px', height: '55px' }}>
                    <circle cx="10" cy="10" r="8" strokeLinecap="round" strokeLinejoin="round" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 5.5v9" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12.5 7.5c-.5-.8-1.3-1-2.5-1-1.5 0-2.5.7-2.5 1.8 0 1 .8 1.5 2.5 1.7" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 12c.5.8 1.3 1.3 2.5 1.3 1.5 0 2.5-.7 2.5-1.8 0-1-.8-1.4-2.5-1.7" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 14l7 7" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21h-5M21 21v-5" />
                  </svg>
                </div>
                <p className="text-zinc-800 text-sm leading-relaxed" style={{ fontSize: '17px', fontWeight: 'normal', lineHeight: '22px' }}>{cenarioProblemOne}</p>
              </div>
              <div className="hidden sm:block w-px self-stretch bg-zinc-200 mx-8" />
              <div className="flex-1 flex flex-col items-center text-center sm:items-start sm:text-left gap-4 py-4 sm:py-0">
                <div className="w-14 h-14 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ width: '55px', height: '55px' }}>
                    <circle cx="9" cy="6" r="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 20c0-3.314 2.686-6 6-6" />
                    <circle cx="16" cy="16" r="4" strokeLinecap="round" strokeLinejoin="round" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 14.5l3 3M17.5 14.5l-3 3" />
                  </svg>
                </div>
                <p className="text-zinc-800 text-sm leading-relaxed" style={{ fontSize: '17px', fontWeight: 'normal', lineHeight: '22px' }}>{block.problemTwo || 'Desperdício de investimento e oportunidades perdidas.'}</p>
              </div>
              <div className="hidden sm:block w-px self-stretch bg-zinc-200 mx-8" />
              <div className="flex-1 flex flex-col items-center text-center sm:items-start sm:text-left gap-4 py-4 sm:py-0">
                <div className="w-14 h-14 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" style={{ width: '55px', height: '55px' }}>
                    <rect x="1" y="18" width="4" height="5" rx="0.4" fill="currentColor" />
                    <rect x="7" y="13" width="4" height="10" rx="0.4" fill="currentColor" />
                    <rect x="13" y="8" width="4" height="15" rx="0.4" fill="currentColor" />
                    <path d="M 2 16 L 20 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <path d="M 16 1 L 20 1 L 20 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
                <p className="text-zinc-800 text-sm leading-relaxed" style={{ fontSize: '17px', fontWeight: 'normal', lineHeight: '22px' }}>{block.problemThree || 'Crescimento travado e metas não alcançadas.'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (block.id === 'gargalos') {
    const eyebrow = block.eyebrow === 'Problemas comuns' ? 'ONDE NORMALMENTE ESTÃO OS' : block.eyebrow || 'ONDE NORMALMENTE ESTÃO OS'
    const headline = block.headline.startsWith('Os gargalos') ? 'GARGALOS' : block.headline || 'GARGALOS'
    const cards = [
      {
        title: block.cardOneTitle || 'POSICIONAMENTO',
        text: block.cardOneText || block.description || 'O mercado não entende claramente o valor da sua empresa ou o seu diferencial.',
      },
      {
        title: block.cardTwoTitle || 'GERAÇÃO DE DEMANDA',
        text: block.cardTwoText || 'Baixo volume ou baixa qualidade de oportunidades chegando até sua empresa.',
      },
      {
        title: block.cardThreeTitle || 'PROCESSO COMERCIAL',
        text: block.cardThreeText || 'Existem interesses, mas faltam método, acompanhamento e abordagem para converter em vendas.',
      },
    ]

    return (
      <section className="bg-zinc-950 py-16 border-t border-zinc-800">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-[13px] text-center md:mb-10 md:text-left">
            <p className="text-center text-[11px] font-bold uppercase leading-tight tracking-widest text-red-500 whitespace-pre-line">{eyebrow}</p>
            <h2 className="mt-1 text-center font-poppins text-[42px] font-bold text-white whitespace-pre-line">{headline}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
            {cards.map((card, index) => (
              <div key={card.title} className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-4 px-4 sm:px-8 py-6 md:py-0">
                <div className="shrink-0">
                  {index === 0 && (
                    <svg className="w-10 h-10 text-red-500" viewBox="0 0 2048 2048" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '75px', height: '75px' }}>
                      <path d="M 1041.5 233.626 C 1044.21 233.372 1042.94 233.035 1045.43 234.335 C 1045.94 238.99 1045.76 245.045 1045.71 249.818 C 1045.35 279.782 1046.17 310.029 1045.35 339.974 C 1082.75 340.531 1124.5 346.236 1161 353.985 C 1285.87 380.207 1400.99 440.679 1493.44 528.626 C 1623.81 652.315 1700.03 822.505 1705.51 1002.13 C 1741.25 1001.72 1778.57 1001.73 1814.29 1002.1 C 1813.68 1016.73 1813.82 1030.44 1814.03 1045.07 C 1777.75 1045.12 1741.46 1044.97 1705.17 1044.61 C 1705.18 1083.2 1699.34 1125.93 1691.18 1163.6 C 1665.12 1286.45 1605.68 1399.73 1519.41 1490.98 C 1396.04 1619.98 1224.57 1701.28 1045.29 1705.19 L 1045.17 1812.96 C 1037.5 1812.09 1019.44 1812.69 1010.87 1812.78 C 1007.6 1812.87 1007.28 1812.97 1003.97 1812.28 C 1001.26 1808.81 1001.98 1715.5 1002.71 1705.24 C 999.741 1705.22 996.773 1705.16 993.806 1705.06 C 678.957 1693.97 398.713 1447.56 351.306 1138.14 C 346.894 1109.35 341.259 1074.24 342.306 1045.17 C 306.171 1045 270.036 1045.01 233.902 1045.21 C 234.097 1030.89 233.943 1016.23 233.952 1001.89 C 269.849 1001.3 306.227 1002.14 342.257 1001.8 C 342.067 979.269 345.633 948.089 348.903 925.471 C 367.132 796.349 422.691 675.367 508.749 577.395 C 642.445 427.471 802.742 351.512 1002.59 339.97 C 1001.35 306.227 1002.21 268.144 1002.23 234.083 C 1015.32 234.128 1028.42 233.976 1041.5 233.626 z M 1045.7 472.266 C 1033.15 472.212 1014.28 471.582 1002.22 472.477 L 1002.14 412.135 C 1002.11 405.608 1002.47 389.871 1001.8 383.903 L 1001.22 383.605 C 825.829 392.755 668.442 464.471 550.283 595.381 C 467.987 686.021 413.57 798.467 393.554 919.246 C 388.882 947.28 387.079 973.623 384.917 1001.9 C 411.74 1001.38 445.916 1001.02 472.812 1001.79 C 472.835 1015.57 472.496 1031.39 473.064 1045.01 L 384.897 1045.04 C 386.81 1073.68 389.122 1102.43 394.216 1130.7 C 419.553 1273.29 491.983 1403.26 599.919 1499.83 C 688.89 1578.31 797.485 1631.18 914.133 1652.82 C 946.144 1658.61 971.249 1659.71 1002.94 1663.08 C 1001.96 1640.82 1001.2 1597.05 1002.82 1575.08 L 1045.74 1575.05 C 1044.79 1588.35 1045.2 1606.24 1045.21 1619.95 C 1045.23 1632.6 1044.72 1650.13 1045.59 1662.34 C 1048.86 1662.93 1048.84 1662.78 1052.19 1662.26 C 1083.94 1659.99 1110.31 1657.46 1141.73 1651.4 C 1284.23 1623.91 1413.3 1549.17 1508.07 1439.26 C 1585.71 1348.81 1636.84 1238.67 1655.82 1120.99 C 1659.91 1095.24 1661.69 1071.08 1663.07 1045.03 L 1575.84 1044.91 C 1575.61 1030.57 1575.61 1016.24 1575.87 1001.91 L 1663.96 1001.81 C 1662.16 989.583 1661.28 975.319 1659.97 962.82 C 1657.5 939.265 1654.39 917.65 1649.43 894.497 C 1617.59 740.696 1530.24 603.998 1404.05 510.488 C 1322.71 449.708 1228.12 409.073 1128.04 391.912 C 1099 387.041 1074.09 385.386 1045.16 382.896 C 1045.62 412.4 1044.9 443.212 1045.7 472.266 z"/>
                      <path d="M 989.035 555.846 C 1247.65 536.556 1472.85 730.774 1491.76 989.418 C 1510.68 1248.06 1316.14 1472.98 1057.47 1491.52 C 799.324 1510.02 574.967 1315.97 556.089 1057.85 C 537.212 799.735 730.947 575.097 989.035 555.846 z M 1047.47 1448.68 C 1282.42 1435.74 1462.3 1234.63 1449.05 999.695 C 1435.8 764.763 1234.44 585.152 999.528 598.715 C 765.054 612.253 585.854 813.146 599.08 1047.64 C 612.307 1282.13 812.962 1461.6 1047.47 1448.68 z"/>
                      <path d="M 1006.24 778.556 C 1141.33 768.753 1258.83 870.208 1268.82 1005.28 C 1278.81 1140.35 1177.52 1257.99 1042.46 1268.17 C 907.141 1278.37 789.216 1176.83 779.204 1041.5 C 769.193 906.161 870.893 788.378 1006.24 778.556 z M 1034.48 1225.21 C 1145.56 1219.44 1231.06 1124.93 1225.71 1013.83 C 1220.37 902.73 1126.18 816.872 1015.06 821.799 C 903.346 826.752 816.925 921.552 822.302 1033.25 C 827.679 1144.95 922.806 1231.01 1034.48 1225.21 z"/>
                      <path d="M 1014.21 955.733 C 1051.7 950.253 1086.51 976.281 1091.86 1013.79 C 1097.21 1051.31 1071.05 1086.02 1033.52 1091.23 C 996.18 1096.42 961.677 1070.43 956.358 1033.1 C 951.038 995.782 976.906 961.186 1014.21 955.733 z"/>
                    </svg>
                  )}
                  {index === 1 && (
                    <svg className="w-10 h-10 text-red-500" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '75px', height: '75px' }}>
                      <path d="M15.867 14.881a4.941 4.941 0 1 0-4.941-4.94 4.946 4.946 0 0 0 4.941 4.94zm0-7.881a2.941 2.941 0 1 1-2.941 2.941A2.945 2.945 0 0 1 15.867 7zM6.533 17.785a3.8 3.8 0 1 0-3.8-3.8 3.8 3.8 0 0 0 3.8 3.8zm0-5.6a1.8 1.8 0 1 1-1.8 1.8 1.8 1.8 0 0 1 1.8-1.8zM25.2 17.785a3.8 3.8 0 1 0-3.8-3.8 3.8 3.8 0 0 0 3.8 3.8zm0-5.6a1.8 1.8 0 1 1-1.8 1.8 1.8 1.8 0 0 1 1.8-1.8zM25.333 19.791a5.269 5.269 0 0 0-2.506.653A8.237 8.237 0 0 0 16 16.607a8.237 8.237 0 0 0-6.827 3.837 5.269 5.269 0 0 0-2.506-.653A5.963 5.963 0 0 0 1 26a1 1 0 0 0 2 0 3.971 3.971 0 0 1 3.667-4.209 3.272 3.272 0 0 1 1.577.419 10.085 10.085 0 0 0-.711 3.732 1 1 0 0 0 2 0c0-4.045 2.9-7.335 6.467-7.335s6.467 3.29 6.467 7.335a1 1 0 0 0 2 0 10.085 10.085 0 0 0-.711-3.732 3.272 3.272 0 0 1 1.577-.419A3.971 3.971 0 0 1 29 26a1 1 0 0 0 2 0 5.963 5.963 0 0 0-5.667-6.209z" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg className="w-10 h-10 text-red-500" viewBox="0 0 393 393.99" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '75px', height: '75px' }}>
                      <path d="M368.313 0H17.05A16.5 16.5 0 0 0 2.344 8.96a16.732 16.732 0 0 0 1.3 17.415l128.688 181.281c.043.063.09.121.133.184a36.769 36.769 0 0 1 7.219 21.816v147.797a16.429 16.429 0 0 0 16.433 16.535c2.227 0 4.426-.445 6.48-1.297l72.313-27.574c6.48-1.976 10.781-8.09 10.781-15.453V229.656a36.774 36.774 0 0 1 7.215-21.816c.043-.063.09-.121.133-.184L381.723 26.367a16.717 16.717 0 0 0 1.3-17.406A16.502 16.502 0 0 0 368.313 0zM236.78 195.992a56.931 56.931 0 0 0-11.097 33.664v117.578l-66 25.164V229.656a56.909 56.909 0 0 0-11.102-33.664L23.648 20h338.07zm0 0" />
                    </svg>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-poppins text-sm font-bold text-white tracking-widest uppercase" style={{ fontSize: '16px' }}>{card.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed" style={{ fontSize: '18px' }}>{card.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (block.id === 'atuacao') {
    const eyebrow = block.eyebrow === 'Como atuamos' ? 'COMO A EVIDENCE ATUA' : block.eyebrow || 'COMO A EVIDENCE ATUA'
    const headline = block.headline === 'Estratégia, execução e dados trabalhando juntos'
      ? 'Unimos marketing e estratégia comercial para transformar esforço em resultado.'
      : block.headline || 'Unimos marketing e estratégia comercial para transformar esforço em resultado.'
    const description = block.description === 'Mostra os pilares da atuação da agência.'
      ? 'Nosso trabalho começa entendendo o cenário e o que está limitando o crescimento. A partir disso, estruturamos frentes que impactam diretamente suas vendas.'
      : block.description || 'Nosso trabalho começa entendendo o cenário e o que está limitando o crescimento. A partir disso, estruturamos frentes que impactam diretamente suas vendas.'
    const items = [
      block.featureOne || 'Marketing estratégico para atrair o cliente certo',
      block.featureTwo || 'Geração de demanda qualificada para o seu time comercial',
      block.featureThree || 'Ajuste no processo comercial para aumentar a conversão',
    ]

    return (
      <section id="como-trabalhamos" className="bg-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
          <div className="flex justify-end">
            <div className="w-full max-w-[768px] py-20 px-4 sm:px-6 lg:px-8">
              <p className="text-red-600 text-xs font-bold tracking-widest uppercase mb-3 text-center lg:text-left" style={{ fontSize: '16px', fontWeight: 700 }}>{eyebrow}</p>
              <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-zinc-900 leading-tight mb-6 text-center lg:text-left" style={{ maxWidth: '580px' }}>{headline}</h2>
              <p className="text-zinc-600 text-sm leading-relaxed mb-8 text-center lg:text-left" style={{ fontSize: '16px', maxWidth: '510px' }}>{description}</p>
              <ul className="flex flex-col gap-4 mb-10 mx-auto sm:mx-0" style={{ maxWidth: '291px', width: '100%' }}>
                {items.map((item) => (
                  <li key={item} className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-2 sm:gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-red-600 shrink-0 sm:mt-0.5" fill="currentColor" style={{ width: '22px', height: '22px' }}>
                      <path d="M12 1.25A10.75 10.75 0 1 0 22.75 12 10.762 10.762 0 0 0 12 1.25zm4.74 8.423-5 5.5a1.01 1.01 0 0 1-.716.327H11a1.005 1.005 0 0 1-.707-.293l-3-3a1 1 0 1 1 1.414-1.414l2.258 2.258 4.295-4.724A1.008 1.008 0 0 1 16 8.001a1 1 0 0 1 .74 1.672z" />
                    </svg>
                    <span className="text-zinc-700 text-sm" style={{ fontSize: '16px' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="min-h-[400px] lg:min-h-0">
            <img
              alt="Dashboard Evidence"
              className="w-full h-full object-cover object-center"
              src={imageSrc || '/mesa.webp'}
              style={{ objectPosition: 'center center' }}
            />
          </div>
        </div>
      </section>
    )
  }

  if (block.id === 'processo') {
    return <WorkProcessPreview block={block} />
  }

  if (block.id === 'missao-visao-valores') {
    return <MissionVisionValuesPreview block={block} />
  }

  if (block.id === 'cta' || block.id === 'cta-home') {
    return <CtaPreview block={block} pageId={pageId} />
  }

  if (block.id === 'como-trabalhamos') {
    const eyebrow = block.eyebrow === 'Processo' || block.eyebrow === 'Como trabalhamos' ? 'COMO TRABALHAMOS' : block.eyebrow || 'COMO TRABALHAMOS'
    const steps = [
      {
        number: '1',
        title: block.stepOneTitle || block.headline || 'ANÁLISE DO CENÁRIO',
        text: block.stepOneText || block.description || 'Entendemos seu momento, seus desafios e avaliamos seus canais e resultados atuais.',
        icon: 'analysis',
      },
      {
        number: '2',
        title: block.stepTwoTitle || 'PLANEJAMENTO E EXECUÇÃO',
        text: block.stepTwoText || 'Criamos um plano personalizado e colocamos em prática com foco em demanda e conversão.',
      },
      {
        number: '3',
        title: block.stepThreeTitle || 'ACOMPANHAMENTO E EVOLUÇÃO',
        text: block.stepThreeText || 'Monitoramos indicadores, ajustamos rotas e evoluímos continuamente os resultados.',
        icon: 'growth',
      },
    ]

    return (
      <section className="bg-zinc-950 py-8 border-t border-zinc-800">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-red-500 text-xs font-bold tracking-widest uppercase mb-6 text-center md:text-left" style={{ fontSize: '18px' }}>{eyebrow}</p>
          <div className="flex flex-col md:flex-row items-stretch gap-6 md:gap-0">
            {steps.map((step, index) => (
              <Fragment key={step.number}>
                <div className="flex-1 py-4">
                  <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-4">
                    <span className="font-poppins text-6xl font-bold text-red-600 leading-none shrink-0">{step.number}</span>
                    {step.icon === 'analysis' && (
                      <div className="flex items-center justify-center shrink-0 mt-2" style={{ width: 'auto', height: 'auto' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 682.667 682.667" className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" style={{ width: '45px', height: '45px' }}>
                          <g transform="matrix(1.33333 0 0 -1.33333 0 682.667)"><path d="M0 0h-100v100Z" transform="translate(375 397)" /></g>
                          <path d="M0 0h170" transform="matrix(1.33333 0 0 -1.33333 100 233.333)" />
                          <path d="M0 0h130" transform="matrix(1.33333 0 0 -1.33333 100 313.333)" />
                          <path d="M0 0h130" transform="matrix(1.33333 0 0 -1.33333 100 393.333)" />
                          <path d="M0 0h130" transform="matrix(1.33333 0 0 -1.33333 100 473.333)" />
                          <g transform="matrix(1.33333 0 0 -1.33333 0 682.667)">
                            <path d="M0 0c35.146-35.147 35.146-92.132 0-127.279-35.147-35.147-92.133-35.147-127.279 0-35.148 35.147-35.148 92.132 0 127.279C-92.133 35.147-35.147 35.147 0 0Z" transform="translate(412.147 290.64)" />
                            <path d="m0 0-84.853 84.853" transform="translate(497 78.508)" />
                            <path d="M0 0v83.987l-99.996 100H-320c-22.092 0-40-17.909-40-40v-402c0-22.091 17.908-40 40-40h280c22.092 0 40 17.909 40 40v85.987" transform="translate(375 313.013)" />
                          </g>
                        </svg>
                      </div>
                    )}
                    {step.icon === 'growth' && (
                      <div className="flex items-center justify-center shrink-0 mt-2" style={{ width: 'auto', height: 'auto' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 text-zinc-400" fill="currentColor" style={{ width: '45px', height: '45px' }}>
                          <path d="M3 24a1.059 1.059 0 0 0 .136-.009 77.375 77.375 0 0 0 21.274-6.079A77.1 77.1 0 0 0 43.248 5.884l-1.218 4.874a1 1 0 0 0 .727 1.212A1.025 1.025 0 0 0 43 12a1 1 0 0 0 .969-.758l2-8A1 1 0 0 0 45 2h-8a1 1 0 0 0 0 2h5.369A75.2 75.2 0 0 1 23.59 16.088a75.363 75.363 0 0 1-20.725 5.921A1 1 0 0 0 3 24zM45 44h-1V17a1 1 0 0 0-1-1H33a1 1 0 0 0-1 1v27h-2V23a1 1 0 0 0-1-1H19a1 1 0 0 0-1 1v21h-2V29a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v15H3a1 1 0 0 0 0 2h42a1 1 0 0 0 0-2zM34 18h8v26h-8zm-14 6h8v20h-8zM6 30h8v14H6z" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <h3 className="font-poppins mb-2 whitespace-pre-line text-sm font-bold tracking-wide text-white">{step.title}</h3>
                      <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-400">{step.text}</p>
                    </div>
                  </div>
                </div>
                {index < 2 && (
                  <div className="hidden md:flex items-center px-2 text-zinc-600 shrink-0 self-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="currentColor" style={{ width: '70px', height: '70px', transform: 'rotate(-90deg)' }}>
                      <path d="M64 88a3.988 3.988 0 0 1-2.828-1.172l-40-40c-1.563-1.563-1.563-4.094 0-5.656s4.094-1.563 5.656 0L64 78.344l37.172-37.172c1.563-1.563 4.094-1.563 5.656 0s1.563 4.094 0 5.656l-40 40A3.988 3.988 0 0 1 64 88z" />
                    </svg>
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`overflow-hidden bg-white ${previewHeight}`}>
      <div className="grid grid-cols-1 items-stretch lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-12">
          <p className="text-[14px] font-bold uppercase tracking-widest text-red-600">{block.eyebrow}</p>
          <h2 className="font-poppins mt-3 text-3xl font-bold leading-tight text-zinc-900">{block.headline}</h2>
          <p className="mt-5 text-[16px] leading-relaxed text-zinc-600">{block.description}</p>
          <p className="mt-4 text-[14px] leading-relaxed text-zinc-500">{block.preview}</p>
        </div>
        <div className="min-h-[260px]">
          {imageSrc ? <img src={imageSrc} alt="" className="h-full w-full object-cover" /> : <PreviewImage block={block} />}
        </div>
      </div>
    </section>
  )
}

function getEditorLabels(block: SiteBlock) {
  if (block.id === 'hero') {
    return {
      title: 'Nome interno da seção',
      eyebrow: 'Título em vermelho',
      headline: 'Título principal',
      description: 'Texto de apoio do Hero',
      preview: 'Observação interna do Hero',
      image: 'Imagem de fundo do Hero',
    }
  }

  if (block.id === 'sobre-nos') {
    return {
      title: 'Nome interno da seção',
      eyebrow: 'Selo da seção',
      headline: 'Título principal',
      description: 'Texto de apresentação',
      preview: 'Diferenciais e card de credibilidade',
      image: 'Foto da equipe',
    }
  }

  if (block.id === 'cenario') {
    return {
      title: 'Nome interno da seção',
      eyebrow: 'Selo da seção',
      headline: 'Título principal do cenário',
      description: 'Problema 1',
      preview: 'Problemas do cenário',
      image: 'Imagem de apoio do cenário',
    }
  }

  if (block.id === 'gargalos') {
    return {
      title: 'Nome interno da seção',
      eyebrow: 'Linha superior da seção',
      headline: 'Título da seção',
      description: 'Texto do card 1',
      preview: 'Cards de gargalos',
      image: 'Ícones fixos da seção',
    }
  }

  if (block.id === 'atuacao') {
    return {
      title: 'Nome interno da seção',
      eyebrow: 'Linha superior da seção',
      headline: 'Título principal da atuação',
      description: 'Parágrafo explicativo',
      preview: 'Itens da lista de atuação',
      image: 'Imagem lateral da atuação',
    }
  }

  if (block.id === 'processo') {
    return {
      title: 'Nome interno da seção',
      eyebrow: 'Selo da seção',
      headline: 'Título principal',
      description: 'Texto de apoio',
      preview: 'Etapas do processo',
      image: 'Ícones fixos da seção',
    }
  }

  if (block.id === 'missao-visao-valores') {
    return {
      title: 'Nome interno da seção',
      eyebrow: 'Selo da seção',
      headline: 'Título do card de missão',
      description: 'Texto do card de missão',
      preview: 'Lista de valores',
      image: 'Ícones fixos da seção',
    }
  }

  if (block.id === 'como-trabalhamos') {
    return {
      title: 'Nome interno da seção',
      eyebrow: 'Linha superior da seção',
      headline: 'Título da etapa 1',
      description: 'Texto da etapa 1',
      preview: 'Etapas do processo',
      image: 'Ícones fixos da seção',
    }
  }

  if (block.id === 'blog' || block.id.includes('post')) {
    return {
      title: 'Nome interno da seção',
      eyebrow: 'Categoria/selo editorial',
      headline: 'Título editorial',
      description: 'Descrição da chamada',
      preview: 'Título dos cards de artigo',
      image: 'Imagem dos cards do blog',
    }
  }

  if (block.id === 'clientes' || block.id === 'logos') {
    return {
      title: 'Nome interno da seção',
      eyebrow: 'Chamada de clientes',
      headline: 'Título da lista de clientes',
      description: 'Texto de apoio da seção',
      preview: 'Descrição dos clientes/logos',
      image: 'Logo ou imagem de cliente',
    }
  }

  if (block.id.includes('depoimentos')) {
    return {
      title: 'Nome interno da seção',
      eyebrow: 'Chamada de depoimentos',
      headline: 'Título de prova social',
      description: 'Texto de apoio',
      preview: 'Texto do depoimento',
      image: 'Foto/vídeo do depoimento',
    }
  }

  if (block.id === 'grid-servicos') {
    return {
      title: 'Nome interno da seção',
      eyebrow: 'Chamada da seção',
      headline: 'Título da seção',
      description: 'Texto complementar (ao lado do título)',
      preview: 'Observação interna',
      image: 'Imagem de apoio',
    }
  }

  if (block.id === 'acelerador') {
    return {
      title: 'Nome interno da seção',
      eyebrow: 'Selo da seção',
      headline: 'Título do acelerador',
      description: 'Texto de apoio do acelerador',
      preview: 'Observação interna',
      image: 'Imagem de apoio',
    }
  }

  if (block.id === 'estatisticas') {
    return {
      title: 'Nome interno da seção',
      eyebrow: 'Selo da seção',
      headline: 'Título da seção',
      description: 'Texto de apoio',
      preview: 'Observação interna',
      image: 'Imagem de apoio',
    }
  }

  if (block.id === 'cta' || block.id === 'cta-home') {
    return {
      title: 'Nome interno da seção',
      eyebrow: 'Contexto do CTA',
      headline: 'Título da chamada',
      description: 'Texto de apoio',
      preview: block.id === 'cta-home' ? 'Botão do CTA' : 'Prova social',
      image: 'Logo e fotos fixas',
    }
  }

  if (block.id === 'cta-final') {
    return {
      title: 'Nome interno da seção',
      eyebrow: 'Contexto do CTA',
      headline: 'Título da chamada',
      description: 'Texto de apoio da chamada',
      preview: 'Observação interna do CTA',
      image: 'Imagem ou símbolo do CTA',
    }
  }

  return {
    title: 'Nome interno da seção',
    eyebrow: 'Selo da seção',
    headline: 'Título da seção',
    description: 'Texto principal da seção',
    preview: 'Conteúdo complementar do preview',
    image: 'Imagem da seção',
  }
}

function BlockEditor({
  block,
  pageId = '',
  onUpdate,
  onUpload,
  onSave,
  onClose,
}: {
  block: SiteBlock
  pageId?: string
  onUpdate: (field: keyof SiteBlock, value: string) => void
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void
  onSave: () => void
  onClose: () => void
}) {
  const labels = getEditorLabels(block)
  const isServicosPage = pageId === 'content-servicos'
  const isClientesPage = pageId === 'content-clientes'
  const isBlogPage = pageId === 'content-blog'
  const isDepoimentosPage = pageId === 'content-depoimentos'
  const isHero = block.id === 'hero'
  const isAnaliseHero = isHero && pageId === 'content-analise'
  const isHomeHero = isHero && pageId === 'content-home'
  const isBlogCta = block.id === 'cta' && isBlogPage
  const isDepoimentosCta = block.id === 'cta' && isDepoimentosPage
  const isClientesHero = block.id === 'hero' && isClientesPage
  const isClientesList = block.id === 'logos' && isClientesPage
  const isDepoimentosHero = block.id === 'hero' && isDepoimentosPage
  const isDepoimentosList = block.id === 'depoimentos' && isDepoimentosPage
  const isSobreNos = block.id === 'sobre-nos'
  const isMvv = block.id === 'missao-visao-valores'
  const isCta = block.id === 'cta' || block.id === 'cta-home'
  const isHomeCta = block.id === 'cta-home'
  const isCenario = block.id === 'cenario'
  const isGargalos = block.id === 'gargalos'
  const isAtuacao = block.id === 'atuacao'
  const isProcesso = block.id === 'como-trabalhamos' || block.id === 'processo'
  const isFullProcesso = block.id === 'processo'
  const isGridServicos = block.id === 'grid-servicos'
  const isAceleradorServicos = block.id === 'acelerador' && isServicosPage
  const isEstatisticas = block.id === 'estatisticas'
  const hasImageField = !isAnaliseHero && !isCenario && !isGargalos && !isProcesso && !isMvv && !isCta && !isGridServicos && !isClientesList && !isAceleradorServicos && !isEstatisticas && !isDepoimentosHero && !isDepoimentosList
  const cenarioEyebrow = block.eyebrow === 'Contexto' ? 'O CENÁRIO' : block.eyebrow
  const cenarioHeadline = block.headline.startsWith('O mercado mudou') ? 'Muitas empresas investem em marketing, mas as vendas não acompanham.' : block.headline
  const cenarioProblemOne = block.problemOne ?? (block.description.startsWith('Se') ? 'Falta de alinhamento entre marketing, posicionamento e processo comercial.' : block.description)
  const gargalosEyebrow = block.eyebrow === 'Problemas comuns' ? 'ONDE NORMALMENTE ESTÃO OS' : block.eyebrow
  const gargalosHeadline = block.headline.startsWith('Os gargalos') ? 'GARGALOS' : block.headline
  const atuacaoEyebrow = block.eyebrow === 'Como atuamos' ? 'COMO A EVIDENCE ATUA' : block.eyebrow
  const atuacaoHeadline = block.headline === 'Estratégia, execução e dados trabalhando juntos' ? 'Unimos marketing e estratégia comercial para transformar esforço em resultado.' : block.headline
  const atuacaoDescription = block.description === 'Mostra os pilares da atuação da agência.' ? 'Nosso trabalho começa entendendo o cenário e o que está limitando o crescimento. A partir disso, estruturamos frentes que impactam diretamente suas vendas.' : block.description
  const processoEyebrow = block.eyebrow === 'Processo' || block.eyebrow === 'Como trabalhamos' ? 'COMO TRABALHAMOS' : block.eyebrow
  const processoStepOneTitle = block.stepOneTitle || block.headline || 'ANÁLISE DO CENÁRIO'
  const processoStepOneText = block.stepOneText || block.description || 'Entendemos seu momento, seus desafios e avaliamos seus canais e resultados atuais.'
  const [serviceCardsDraft, setServiceCardsDraft] = useState<ServiceCard[]>(() => (isGridServicos ? readServiceCards(block) : []))
  useEffect(() => {
    setServiceCardsDraft(isGridServicos ? readServiceCards(block) : [])
  }, [isGridServicos, block.id, block.servicesJson])
  const serviceCards = isGridServicos ? serviceCardsDraft : []
  const [clientCardsDraft, setClientCardsDraft] = useState<ClientCard[]>(() => (isClientesList ? readClientCards(block) : []))
  useEffect(() => {
    setClientCardsDraft(isClientesList ? readClientCards(block) : [])
  }, [isClientesList, block.id, block.clientsJson])
  const clientCards = isClientesList ? clientCardsDraft : []
  const [testimonialCardsDraft, setTestimonialCardsDraft] = useState<TestimonialCard[]>(() => (isDepoimentosList ? readTestimonialCards(block) : []))
  useEffect(() => {
    setTestimonialCardsDraft(isDepoimentosList ? readTestimonialCards(block) : [])
  }, [isDepoimentosList, block.id, block.testimonialsJson])
  const testimonialCards = isDepoimentosList ? testimonialCardsDraft : []
  const [draggingServiceIndex, setDraggingServiceIndex] = useState<number | null>(null)
  const [serviceDropIndex, setServiceDropIndex] = useState<number | null>(null)
  const [draggingClientIndex, setDraggingClientIndex] = useState<number | null>(null)
  const [clientDropIndex, setClientDropIndex] = useState<number | null>(null)
  const [draggingTestimonialIndex, setDraggingTestimonialIndex] = useState<number | null>(null)
  const [testimonialDropIndex, setTestimonialDropIndex] = useState<number | null>(null)
  const [openIconPicker, setOpenIconPicker] = useState<string | null>(null)
  const [openClientSegmentPicker, setOpenClientSegmentPicker] = useState<string | null>(null)
  const editorAttrs = (field: string, scope = block.id) => ({
    name: `${pageId || 'site'}-${scope}-${field}`,
    'data-edit-html': 'true',
    'data-block-id': scope,
    'data-field': field,
  })
  const commitServiceCards = (nextCards = serviceCards) => {
    onUpdate('servicesJson', JSON.stringify(nextCards))
  }
  const updateServiceCards = (nextCards: ServiceCard[], shouldCommit = true) => {
    setServiceCardsDraft(nextCards)
    if (shouldCommit) {
      commitServiceCards(nextCards)
    }
  }
  const updateServiceCard = (index: number, field: keyof ServiceCard, value: string, shouldCommit = false) => {
    const nextCards = serviceCards.map((service, serviceIndex) => {
      if (serviceIndex !== index) return service
      return {
        ...service,
        [field]: field === 'items' ? value.split(/\r?\n/) : value,
      }
    })
    updateServiceCards(nextCards, shouldCommit)
  }
  const reorderServiceCards = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return

    const nextCards = [...serviceCards]
    const [movedCard] = nextCards.splice(fromIndex, 1)
    if (!movedCard) return

    nextCards.splice(toIndex, 0, movedCard)
    updateServiceCards(nextCards)
  }
  const handleServiceDragStart = (event: DragEvent<HTMLElement>, index: number) => {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(index))
    setDraggingServiceIndex(index)
  }
  const handleServiceDrop = (event: DragEvent<HTMLElement>, index: number) => {
    event.preventDefault()
    const fromIndex = Number(event.dataTransfer.getData('text/plain'))
    setDraggingServiceIndex(null)
    setServiceDropIndex(null)
    if (!Number.isInteger(fromIndex)) return
    reorderServiceCards(fromIndex, index)
  }
  const resetServiceDragState = () => {
    setDraggingServiceIndex(null)
    setServiceDropIndex(null)
  }
  const commitClientCards = (nextCards = clientCards) => {
    onUpdate('clientsJson', JSON.stringify(nextCards))
  }
  const updateClientCards = (nextCards: ClientCard[], shouldCommit = true) => {
    setClientCardsDraft(nextCards)
    if (shouldCommit) {
      commitClientCards(nextCards)
    }
  }
  const updateClientCard = (index: number, field: keyof ClientCard, value: string, shouldCommit = false) => {
    updateClientCards(clientCards.map((client, clientIndex) => (
      clientIndex === index ? { ...client, [field]: value } : client
    )), shouldCommit)
  }
  const reorderClientCards = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return

    const nextCards = [...clientCards]
    const [movedCard] = nextCards.splice(fromIndex, 1)
    if (!movedCard) return

    nextCards.splice(toIndex, 0, movedCard)
    updateClientCards(nextCards)
  }
  const handleClientDragStart = (event: DragEvent<HTMLElement>, index: number) => {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(index))
    setDraggingClientIndex(index)
  }
  const handleClientDrop = (event: DragEvent<HTMLElement>, index: number) => {
    event.preventDefault()
    const fromIndex = Number(event.dataTransfer.getData('text/plain'))
    setDraggingClientIndex(null)
    setClientDropIndex(null)
    if (!Number.isInteger(fromIndex)) return
    reorderClientCards(fromIndex, index)
  }
  const resetClientDragState = () => {
    setDraggingClientIndex(null)
    setClientDropIndex(null)
  }
  const handleClientImageUpload = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      updateClientCard(index, 'imageUrl', String(reader.result ?? ''))
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }
  const commitTestimonialCards = (nextCards = testimonialCards) => {
    onUpdate('testimonialsJson', JSON.stringify(nextCards))
  }
  const updateTestimonialCards = (nextCards: TestimonialCard[], shouldCommit = true) => {
    setTestimonialCardsDraft(nextCards)
    if (shouldCommit) {
      commitTestimonialCards(nextCards)
    }
  }
  const updateTestimonialCard = (index: number, field: keyof TestimonialCard, value: string) => {
    updateTestimonialCards(testimonialCards.map((testimonial, testimonialIndex) => (
      testimonialIndex === index ? { ...testimonial, [field]: value } : testimonial
    )), false)
  }
  const reorderTestimonialCards = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return

    const nextCards = [...testimonialCards]
    const [movedCard] = nextCards.splice(fromIndex, 1)
    if (!movedCard) return

    nextCards.splice(toIndex, 0, movedCard)
    updateTestimonialCards(nextCards)
  }
  const handleTestimonialDragStart = (event: DragEvent<HTMLElement>, index: number) => {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(index))
    setDraggingTestimonialIndex(index)
  }
  const handleTestimonialDrop = (event: DragEvent<HTMLElement>, index: number) => {
    event.preventDefault()
    const fromIndex = Number(event.dataTransfer.getData('text/plain'))
    setDraggingTestimonialIndex(null)
    setTestimonialDropIndex(null)
    if (!Number.isInteger(fromIndex)) return
    reorderTestimonialCards(fromIndex, index)
  }
  const resetTestimonialDragState = () => {
    setDraggingTestimonialIndex(null)
    setTestimonialDropIndex(null)
  }

  return (
    <div className="border-t border-[#eef0f3] bg-[#fbfbfc] p-5 sm:p-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {(!isAnaliseHero && !isHomeHero && (isHero || isSobreNos || isCenario || isGargalos || isAtuacao || isProcesso || isAceleradorServicos)) && (
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">{labels.eyebrow}</span>
          <textarea
            {...editorAttrs('eyebrow')}
            rows={2}
            className="min-h-[52px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-[14px] leading-5 outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
            value={isHero || isSobreNos || isAceleradorServicos ? block.eyebrow : isCenario ? cenarioEyebrow : isGargalos ? gargalosEyebrow : isAtuacao ? atuacaoEyebrow : processoEyebrow}
            onChange={(event) => onUpdate('eyebrow', event.target.value)}
          />
        </label>
        )}
        {!isProcesso && !isEstatisticas && !isGridServicos && !isClientesList && !isDepoimentosList && (
        <label className="block lg:col-span-2">
          <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">{labels.headline}</span>
          <textarea
            {...editorAttrs('headline')}
            className="min-h-[68px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
            value={isCenario ? cenarioHeadline : isGargalos ? gargalosHeadline : isAtuacao ? atuacaoHeadline : isFullProcesso ? block.headline : isProcesso ? processoStepOneTitle : block.headline}
            onChange={(event) => onUpdate(isFullProcesso ? 'headline' : isProcesso ? 'stepOneTitle' : 'headline', event.target.value)}
          />
        </label>
        )}
        {isHomeHero && (
          <label className="block lg:col-span-2">
            <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">{labels.eyebrow}</span>
            <textarea
              {...editorAttrs('eyebrow')}
              rows={2}
              className="min-h-[52px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-[14px] leading-5 outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
              value={block.eyebrow}
              onChange={(event) => onUpdate('eyebrow', event.target.value)}
            />
          </label>
        )}
        {!isHero && !isSobreNos && !isCenario && !isGargalos && !isAtuacao && !isProcesso && !isCta && !isClientesList && !isDepoimentosList && !isAceleradorServicos && !isEstatisticas && !isBlogCta && !isDepoimentosCta && (
        <label className={isHero ? 'block lg:col-span-2' : 'block'}>
          <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">{labels.eyebrow}</span>
          <textarea
            {...editorAttrs('eyebrow')}
            rows={2}
            className="min-h-[52px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-[14px] leading-5 outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
            value={isCenario ? cenarioEyebrow : isGargalos ? gargalosEyebrow : isAtuacao ? atuacaoEyebrow : isProcesso ? processoEyebrow : block.eyebrow}
            onChange={(event) => onUpdate('eyebrow', event.target.value)}
          />
        </label>
        )}
        {!isCenario && !isGargalos && !isProcesso && !isMvv && !isEstatisticas && !isClientesList && !isDepoimentosList && (
        <label className="block lg:col-span-2">
          <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">{labels.description}</span>
          <textarea
            {...editorAttrs('description')}
            className="min-h-[96px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
            value={isAtuacao ? atuacaoDescription : isFullProcesso ? block.description : isProcesso ? processoStepOneText : block.description}
            onChange={(event) => onUpdate(isFullProcesso ? 'description' : isProcesso ? 'stepOneText' : 'description', event.target.value)}
          />
        </label>
        )}
        {isSobreNos && (
          <>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Título do diferencial 1</span>
              <textarea
                rows={2}
                className="min-h-[52px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-[14px] leading-5 outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.cardOneTitle ?? 'Focados em resultados'}
                onChange={(event) => onUpdate('cardOneTitle', event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Texto do diferencial 1</span>
              <textarea
                className="min-h-[76px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.cardOneText ?? 'Estratégias com objetivo claro e mensurável.'}
                onChange={(event) => onUpdate('cardOneText', event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Título do diferencial 2</span>
              <textarea
                rows={2}
                className="min-h-[52px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-[14px] leading-5 outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.cardTwoTitle ?? 'Time especializado'}
                onChange={(event) => onUpdate('cardTwoTitle', event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Texto do diferencial 2</span>
              <textarea
                className="min-h-[76px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.cardTwoText ?? 'Profissionais experientes em cada área.'}
                onChange={(event) => onUpdate('cardTwoText', event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Título do diferencial 3</span>
              <textarea
                rows={2}
                className="min-h-[52px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-[14px] leading-5 outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.cardThreeTitle ?? 'Abordagem data-driven'}
                onChange={(event) => onUpdate('cardThreeTitle', event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Texto do diferencial 3</span>
              <textarea
                className="min-h-[76px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.cardThreeText ?? 'Decisões baseadas em dados e performance.'}
                onChange={(event) => onUpdate('cardThreeText', event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Título do diferencial 4</span>
              <textarea
                rows={2}
                className="min-h-[52px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-[14px] leading-5 outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.cardFourTitle ?? 'Parceria de verdade'}
                onChange={(event) => onUpdate('cardFourTitle', event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Texto do diferencial 4</span>
              <textarea
                className="min-h-[76px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.cardFourText ?? 'Nosso sucesso é ver o seu negócio crescer.'}
                onChange={(event) => onUpdate('cardFourText', event.target.value)}
              />
            </label>
            <label className="block lg:col-span-2">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Texto do card inferior</span>
              <textarea
                rows={2}
                className="min-h-[52px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-[14px] leading-5 outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.statOne ?? 'Compromisso com excelência e resultados desde o início.'}
                onChange={(event) => onUpdate('statOne', event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Número do card inferior</span>
              <textarea
                rows={2}
                className="min-h-[52px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-[14px] leading-5 outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.statTwo ?? '+20'}
                onChange={(event) => onUpdate('statTwo', event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Complemento do número</span>
              <textarea
                rows={2}
                className="min-h-[52px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-[14px] leading-5 outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.statThree ?? 'empresas atendidas'}
                onChange={(event) => onUpdate('statThree', event.target.value)}
              />
            </label>
          </>
        )}
        {isCenario && (
          <>
            <label className="block lg:col-span-2">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Problema 1</span>
              <textarea
                className="min-h-[76px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={cenarioProblemOne}
                onChange={(event) => onUpdate('problemOne', event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Problema 2</span>
              <textarea
                className="min-h-[76px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.problemTwo ?? 'Desperdício de investimento e oportunidades perdidas.'}
                onChange={(event) => onUpdate('problemTwo', event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Problema 3</span>
              <textarea
                className="min-h-[76px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.problemThree ?? 'Crescimento travado e metas não alcançadas.'}
                onChange={(event) => onUpdate('problemThree', event.target.value)}
              />
            </label>
          </>
        )}
        {isMvv && (
          <>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Título do card de missão</span>
              <textarea
                rows={2}
                className="min-h-[52px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-[14px] leading-5 outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.cardOneTitle ?? block.headline ?? 'Missão'}
                onChange={(event) => onUpdate('cardOneTitle', event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Texto do card de missão</span>
              <textarea
                className="min-h-[76px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.cardOneText ?? block.description ?? 'Compreender negócios para evidenciar ideias com criatividade, tecnologia e visão estratégica.'}
                onChange={(event) => onUpdate('cardOneText', event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Título do card de visão</span>
              <textarea
                rows={2}
                className="min-h-[52px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-[14px] leading-5 outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.cardTwoTitle ?? 'Visão'}
                onChange={(event) => onUpdate('cardTwoTitle', event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Texto do card de visão</span>
              <textarea
                className="min-h-[76px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.cardTwoText ?? 'Consolidar-se como uma agência criativa e inovadora com conhecimento das marcas.'}
                onChange={(event) => onUpdate('cardTwoText', event.target.value)}
              />
            </label>
            <label className="block lg:col-span-2">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Título do card de valores</span>
              <textarea
                rows={2}
                className="min-h-[52px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-[14px] leading-5 outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.cardThreeTitle ?? 'Valores'}
                onChange={(event) => onUpdate('cardThreeTitle', event.target.value)}
              />
            </label>
            <label className="block lg:col-span-2">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Lista de valores</span>
              <textarea
                className="min-h-[140px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.preview}
                onChange={(event) => onUpdate('preview', event.target.value)}
              />
            </label>
          </>
        )}
        {isGargalos && (
          <>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Título do card 1</span>
              <input
                className="h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[14px] outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.cardOneTitle ?? 'POSICIONAMENTO'}
                onChange={(event) => onUpdate('cardOneTitle', event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Texto do card 1</span>
              <textarea
                className="min-h-[76px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.cardOneText ?? block.description}
                onChange={(event) => onUpdate('cardOneText', event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Título do card 2</span>
              <input
                className="h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[14px] outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.cardTwoTitle ?? 'GERAÇÃO DE DEMANDA'}
                onChange={(event) => onUpdate('cardTwoTitle', event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Texto do card 2</span>
              <textarea
                className="min-h-[76px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.cardTwoText ?? 'Baixo volume ou baixa qualidade de oportunidades chegando até sua empresa.'}
                onChange={(event) => onUpdate('cardTwoText', event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Título do card 3</span>
              <input
                className="h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[14px] outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.cardThreeTitle ?? 'PROCESSO COMERCIAL'}
                onChange={(event) => onUpdate('cardThreeTitle', event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Texto do card 3</span>
              <textarea
                className="min-h-[76px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.cardThreeText ?? 'Existem interesses, mas faltam método, acompanhamento e abordagem para converter em vendas.'}
                onChange={(event) => onUpdate('cardThreeText', event.target.value)}
              />
            </label>
          </>
        )}
        {isAtuacao && (
          <>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Item 1 da lista</span>
              <textarea
                className="min-h-[76px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.featureOne ?? 'Marketing estratégico para atrair o cliente certo'}
                onChange={(event) => onUpdate('featureOne', event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Item 2 da lista</span>
              <textarea
                className="min-h-[76px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.featureTwo ?? 'Geração de demanda qualificada para o seu time comercial'}
                onChange={(event) => onUpdate('featureTwo', event.target.value)}
              />
            </label>
            <label className="block lg:col-span-2">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Item 3 da lista</span>
              <textarea
                className="min-h-[76px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.featureThree ?? 'Ajuste no processo comercial para aumentar a conversão'}
                onChange={(event) => onUpdate('featureThree', event.target.value)}
              />
            </label>
          </>
        )}
        {isProcesso && (
          <>
            <label className="block lg:col-span-2">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Título principal</span>
              <textarea
                {...editorAttrs('headline')}
                className="min-h-[68px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.headline}
                onChange={(event) => onUpdate('headline', event.target.value)}
              />
            </label>
            <label className="block lg:col-span-2">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Texto de apoio</span>
              <textarea
                {...editorAttrs('description')}
                className="min-h-[92px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.description}
                onChange={(event) => onUpdate('description', event.target.value)}
              />
            </label>
            <label className="block lg:col-span-2">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Título da etapa 1</span>
              <textarea
                rows={2}
                className="min-h-[52px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-[14px] leading-5 outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.stepOneTitle ?? (isFullProcesso ? 'Diagnóstico' : 'ANÁLISE DO CENÁRIO')}
                onChange={(event) => onUpdate('stepOneTitle', event.target.value)}
              />
            </label>
            <label className="block lg:col-span-2">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Texto da etapa 1</span>
              <textarea
                className="min-h-[76px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.stepOneText ?? (isFullProcesso ? 'Entendemos seu negócio, seus desafios e analisamos o cenário atual para identificar oportunidades de crescimento.' : 'Entendemos seu momento, seus desafios e avaliamos seus canais e resultados atuais.')}
                onChange={(event) => onUpdate('stepOneText', event.target.value)}
              />
            </label>
            <label className="block lg:col-span-2">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Título da etapa 2</span>
              <textarea
                rows={2}
                className="min-h-[52px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-[14px] leading-5 outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.stepTwoTitle ?? (isFullProcesso ? 'Planejamento' : 'PLANEJAMENTO E EXECUÇÃO')}
                onChange={(event) => onUpdate('stepTwoTitle', event.target.value)}
              />
            </label>
            <label className="block lg:col-span-2">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Texto da etapa 2</span>
              <textarea
                className="min-h-[76px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.stepTwoText ?? (isFullProcesso ? 'Desenvolvemos uma estratégia personalizada com ações focadas nos objetivos e metas do seu negócio.' : 'Criamos um plano personalizado e colocamos em prática com foco em demanda e conversão.')}
                onChange={(event) => onUpdate('stepTwoText', event.target.value)}
              />
            </label>
            <label className="block lg:col-span-2">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Título da etapa 3</span>
              <textarea
                rows={2}
                className="min-h-[52px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-[14px] leading-5 outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.stepThreeTitle ?? (isFullProcesso ? 'Execução' : 'ACOMPANHAMENTO E EVOLUÇÃO')}
                onChange={(event) => onUpdate('stepThreeTitle', event.target.value)}
              />
            </label>
            <label className="block lg:col-span-2">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Texto da etapa 3</span>
              <textarea
                className="min-h-[76px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.stepThreeText ?? (isFullProcesso ? 'Colocamos o plano em prática com excelência, utilizando as melhores ferramentas e técnicas do mercado.' : 'Monitoramos indicadores, ajustamos rotas e evoluímos continuamente os resultados.')}
                onChange={(event) => onUpdate('stepThreeText', event.target.value)}
              />
            </label>
            {isFullProcesso && (
              <>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Título da etapa 4</span>
                  <textarea
                    rows={2}
                    className="min-h-[52px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-[14px] leading-5 outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                    value={block.stepFourTitle ?? 'Monitoramento'}
                    onChange={(event) => onUpdate('stepFourTitle', event.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Texto da etapa 4</span>
                  <textarea
                    className="min-h-[76px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                    value={block.stepFourText ?? 'Acompanhamos de perto os indicadores e analisamos os dados para garantir o melhor desempenho.'}
                    onChange={(event) => onUpdate('stepFourText', event.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Título da etapa 5</span>
                  <textarea
                    rows={2}
                    className="min-h-[52px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-[14px] leading-5 outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                    value={block.stepFiveTitle ?? 'Otimização'}
                    onChange={(event) => onUpdate('stepFiveTitle', event.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Texto da etapa 5</span>
                  <textarea
                    className="min-h-[76px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                    value={block.stepFiveText ?? 'Realizamos ajustes contínuos para melhorar os resultados e aumentar a eficiência das ações.'}
                    onChange={(event) => onUpdate('stepFiveText', event.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Título da etapa 6</span>
                  <textarea
                    rows={2}
                    className="min-h-[52px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-[14px] leading-5 outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                    value={block.stepSixTitle ?? 'Resultados'}
                    onChange={(event) => onUpdate('stepSixTitle', event.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Texto da etapa 6</span>
                  <textarea
                    className="min-h-[76px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                    value={block.stepSixText ?? 'Entregamos crescimento sustentável, com mais resultados, autoridade e vendas para o seu negócio.'}
                    onChange={(event) => onUpdate('stepSixText', event.target.value)}
                  />
                </label>
              </>
            )}
          </>
        )}
        {isCta && (
          <>
            <label className={isHomeCta ? 'block lg:col-span-2' : 'block'}>
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Texto do botão</span>
              <input
                className="h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[14px] outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.buttonPrimary ?? 'RECEBER ANÁLISE'}
                onChange={(event) => onUpdate('buttonPrimary', event.target.value)}
              />
            </label>
            <label className={isHomeCta ? 'block lg:col-span-2' : 'block'}>
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Link do botão</span>
              <input
                className="h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[14px] outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.buttonHref ?? '#contato'}
                onChange={(event) => onUpdate('buttonHref', event.target.value)}
              />
            </label>
            {!isHomeCta && !isBlogPage && !isDepoimentosPage && (
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Texto de prova social</span>
                <input
                  className="h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[14px] outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                  value={block.statOne ?? '+60 empresas já confiam na Evidence'}
                  onChange={(event) => onUpdate('statOne', event.target.value)}
                />
              </label>
            )}
          </>
        )}
        {isHomeHero && (
          <>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Texto do botão principal</span>
              <textarea
                rows={2}
                className="min-h-[52px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-[14px] leading-5 outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.buttonPrimary ?? 'RECEBER ANÁLISE'}
                onChange={(event) => onUpdate('buttonPrimary', event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Texto do botão secundário</span>
              <textarea
                rows={2}
                className="min-h-[52px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-[14px] leading-5 outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.buttonSecondary ?? 'VER COMO FUNCIONA'}
                onChange={(event) => onUpdate('buttonSecondary', event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Indicador 1</span>
              <textarea
                rows={2}
                className="min-h-[52px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-[14px] leading-5 outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.statOne ?? 'Foco em geração de demanda qualificada'}
                onChange={(event) => onUpdate('statOne', event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Indicador 2</span>
              <textarea
                rows={2}
                className="min-h-[52px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-[14px] leading-5 outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.statTwo ?? 'Estratégias alinhadas com seu processo comercial'}
                onChange={(event) => onUpdate('statTwo', event.target.value)}
              />
            </label>
            <label className="block lg:col-span-2">
              <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Indicador 3</span>
              <textarea
                rows={2}
                className="min-h-[52px] w-full resize-y rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-[14px] leading-5 outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                value={block.statThree ?? 'Mais oportunidades e conversões para sua empresa'}
                onChange={(event) => onUpdate('statThree', event.target.value)}
              />
            </label>
          </>
        )}
        {isClientesHero && (
          <>
            {([
              ['statOne', 'statOneLabel', 'Indicador 1', '+20', 'empresas atendidas'],
              ['statTwo', 'statTwoLabel', 'Indicador 2', 'diversos', 'segmentos atendidos'],
              ['statThree', 'statThreeLabel', 'Indicador 3', 'relacionamentos', 'de longo prazo'],
              ['statFour', 'statFourLabel', 'Indicador 4', 'desde 2020', 'gerando resultados'],
            ] as [keyof SiteBlock, keyof SiteBlock, string, string, string][]).map(([valueKey, labelKey, title, defaultValue, defaultLabel]) => (
              <Fragment key={String(valueKey)}>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">{title}</span>
                  <input
                    className="h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[14px] outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                    value={String(block[valueKey] ?? defaultValue)}
                    onChange={(event) => onUpdate(valueKey, event.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Legenda do {title.toLowerCase()}</span>
                  <input
                    className="h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[14px] outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                    value={String(block[labelKey] ?? defaultLabel)}
                    onChange={(event) => onUpdate(labelKey, event.target.value)}
                  />
                </label>
              </Fragment>
            ))}
          </>
        )}
        {isDepoimentosHero && (
          <>
            {([
              ['statOne', 'statOneLabel', 'Indicador 1', '+20', 'empresas atendidas'],
              ['statTwo', 'statTwoLabel', 'Indicador 2', 'milhões', 'em vendas geradas'],
              ['statThree', 'statThreeLabel', 'Indicador 3', 'diversos', 'segmentos atendidos'],
              ['statFour', 'statFourLabel', 'Indicador 4', 'desde 2020', 'gerando resultados'],
            ] as [keyof SiteBlock, keyof SiteBlock, string, string, string][]).map(([valueKey, labelKey, title, defaultValue, defaultLabel]) => (
              <Fragment key={String(valueKey)}>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">{title}</span>
                  <input
                    className="h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[14px] outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                    value={String(block[valueKey] ?? defaultValue)}
                    onChange={(event) => onUpdate(valueKey, event.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Legenda do {title.toLowerCase()}</span>
                  <input
                    className="h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[14px] outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                    value={String(block[labelKey] ?? defaultLabel)}
                    onChange={(event) => onUpdate(labelKey, event.target.value)}
                  />
                </label>
              </Fragment>
            ))}
          </>
        )}
        {isClientesList && (
          <>
            {clientCards.map((client, index) => (
              <Fragment key={`cliente-${index}`}>
                <div
                  className={`lg:col-span-2 mt-2 flex items-center justify-between gap-3 border-t pt-4 transition-all duration-150 ${
                    draggingClientIndex === index
                      ? 'scale-[0.99] border-[#eb001a] opacity-60'
                      : clientDropIndex === index
                        ? 'border-[#eb001a] bg-[#fff6f7] shadow-[inset_4px_0_0_#eb001a]'
                        : 'border-[#e7e9ee]'
                  }`}
                  draggable={clientCards.length > 1}
                  onDragStart={(event) => handleClientDragStart(event, index)}
                  onDragEnd={resetClientDragState}
                  onDragEnter={() => setClientDropIndex(index)}
                  onDragOver={(event) => {
                    event.preventDefault()
                    event.dataTransfer.dropEffect = 'move'
                    setClientDropIndex(index)
                  }}
                  onDrop={(event) => handleClientDrop(event, index)}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {clientCards.length > 1 && (
                      <span className="grid h-10 w-10 flex-none cursor-grab place-items-center rounded-lg border border-[#ffd5da] bg-white text-[#eb001a] shadow-sm active:cursor-grabbing">
                        <GripVertical className="h-5 w-5" />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold uppercase tracking-widest text-[#eb001a]">Cliente {index + 1}</p>
                    </div>
                  </div>
                  {clientCards.length > 1 && (
                    <button
                      type="button"
                      className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#ffd5da] bg-white px-3 text-[12px] font-bold text-[#eb001a] transition-colors hover:bg-[#fff1f3]"
                      onClick={() => updateClientCards(clientCards.filter((_, clientIndex) => clientIndex !== index))}
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir cliente
                    </button>
                  )}
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Segmento</span>
                  <div className="relative">
                    <button
                      type="button"
                      className="flex h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-[#dfe3ea] bg-white px-3 text-left text-[14px] outline-none transition-colors hover:border-[#f87171] focus:border-[#f87171] focus:ring-2 focus:ring-[#f87171]/10"
                      onClick={() => setOpenClientSegmentPicker(openClientSegmentPicker === `cliente-segmento-${index}` ? null : `cliente-segmento-${index}`)}
                    >
                      <span className="min-w-0 truncate text-[#111318]">{client.segment || 'Selecione um segmento'}</span>
                      <ChevronDown className={`h-4 w-4 shrink-0 text-[#5f6672] transition-transform ${openClientSegmentPicker === `cliente-segmento-${index}` ? 'rotate-180' : ''}`} />
                    </button>
                    {openClientSegmentPicker === `cliente-segmento-${index}` && (
                      <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-xl border border-[#e7e9ee] bg-white py-1 shadow-xl">
                        {[...(client.segment && !clientSegmentOptions.includes(client.segment) ? [client.segment] : []), ...clientSegmentOptions].map((segment) => {
                          const isSelected = segment === client.segment
                          return (
                            <button
                              key={segment}
                              type="button"
                              className={`flex h-10 w-full cursor-pointer items-center px-3 text-left text-[14px] transition-colors ${
                                isSelected
                                  ? 'bg-[#fee2e2] font-semibold text-[#b91c1c]'
                                  : 'bg-white text-[#111318] hover:bg-[#fff7f7] hover:text-[#b91c1c]'
                              }`}
                              onClick={() => {
                                updateClientCard(index, 'segment', segment, true)
                                setOpenClientSegmentPicker(null)
                              }}
                            >
                              {segment}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Cliente desde</span>
                  <input
                    className="h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[14px] outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                    value={client.since}
                    onChange={(event) => updateClientCard(index, 'since', event.target.value)}
                    onBlur={() => commitClientCards()}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Descrição</span>
                  <textarea
                    className="min-h-[76px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                    value={client.description}
                    onChange={(event) => updateClientCard(index, 'description', event.target.value)}
                    onBlur={() => commitClientCards()}
                  />
                </label>
                <div className="block lg:col-span-2">
                  <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Imagem / logo</span>
                  <p className="mb-2 text-[12px] leading-relaxed text-[#5f6672]">Recomendado: 336 x 180 px, PNG ou SVG com fundo transparente, até 300 KB.</p>
                  <div className="rounded-lg border border-[#dfe3ea] bg-white p-3">
                    <div className="mb-3 flex h-24 items-center justify-center overflow-hidden rounded-md border border-dashed border-[#cfd5df] bg-[#f7f8fa]">
                      {client.imageUrl ? (
                        <img src={client.imageUrl} alt={client.name} className="h-full w-full object-contain p-2" />
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="mx-auto h-6 w-6 text-[#eb001a]" />
                          <p className="mt-1 text-[12px] font-semibold text-[#5f6672]">Nenhuma imagem</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#eb001a] px-3 text-[12px] font-bold text-white transition-colors hover:bg-[#c90015]">
                        <Upload className="h-4 w-4" />
                        Enviar imagem
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => handleClientImageUpload(index, event)}
                        />
                      </label>
                      {client.imageUrl && (
                        <button
                          type="button"
                          className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#e0e3e8] bg-white px-3 text-[12px] font-bold text-[#111318] transition-colors hover:bg-[#eef0f3]"
                          onClick={() => updateClientCard(index, 'imageUrl', '')}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remover
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Fragment>
            ))}
            <div className="lg:col-span-2">
              <button
                type="button"
                className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-[#111318] px-4 text-[13px] font-bold text-white transition-colors hover:bg-black"
                onClick={() => updateClientCards([...clientCards, { name: 'Novo cliente', description: 'Descrição do novo cliente.', since: String(new Date().getFullYear()), segment: 'Serviços' }])}
              >
                Adicionar novo cliente
              </button>
            </div>
          </>
        )}
        {isDepoimentosList && (
          <>
            {testimonialCards.map((testimonial, index) => (
              <Fragment key={`testimonial-card-${index}`}>
                <div
                  className={`lg:col-span-2 mt-2 flex items-center justify-between gap-3 border-t pt-4 transition-all duration-150 ${
                    draggingTestimonialIndex === index
                      ? 'scale-[0.99] border-[#eb001a] opacity-60'
                      : testimonialDropIndex === index
                        ? 'border-[#eb001a] bg-[#fff6f7] shadow-[inset_4px_0_0_#eb001a]'
                        : 'border-[#e7e9ee]'
                  }`}
                  draggable={testimonialCards.length > 1}
                  onDragStart={(event) => handleTestimonialDragStart(event, index)}
                  onDragEnd={resetTestimonialDragState}
                  onDragEnter={() => setTestimonialDropIndex(index)}
                  onDragOver={(event) => {
                    event.preventDefault()
                    event.dataTransfer.dropEffect = 'move'
                    setTestimonialDropIndex(index)
                  }}
                  onDrop={(event) => handleTestimonialDrop(event, index)}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {testimonialCards.length > 1 && (
                      <span className="grid h-10 w-10 flex-none cursor-grab place-items-center rounded-lg border border-[#ffd5da] bg-white text-[#eb001a] shadow-sm active:cursor-grabbing">
                        <GripVertical className="h-5 w-5" />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold uppercase tracking-widest text-[#eb001a]">Depoimento {index + 1}</p>
                      {testimonialCards.length > 1 && (
                        <p className="mt-1 truncate text-[12px] font-semibold text-[#5f6672]">
                          Arraste pelo ícone para reordenar: {testimonial.name || 'Sem nome'}
                        </p>
                      )}
                    </div>
                  </div>
                  {testimonialCards.length > 1 && (
                    <button
                      type="button"
                      className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#ffd5da] bg-white px-3 text-[12px] font-bold text-[#eb001a] transition-colors hover:bg-[#fff1f3]"
                      onClick={() => updateTestimonialCards(testimonialCards.filter((_, testimonialIndex) => testimonialIndex !== index))}
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir depoimento
                    </button>
                  )}
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Nome</span>
                  <input
                    className="h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[14px] outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                    value={testimonial.name}
                    onChange={(event) => updateTestimonialCard(index, 'name', event.target.value)}
                    onBlur={() => commitTestimonialCards()}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Empresa</span>
                  <input
                    className="h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[14px] outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                    value={testimonial.company}
                    onChange={(event) => updateTestimonialCard(index, 'company', event.target.value)}
                    onBlur={() => commitTestimonialCards()}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Cliente desde</span>
                  <input
                    className="h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[14px] outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                    value={testimonial.since}
                    onChange={(event) => updateTestimonialCard(index, 'since', event.target.value)}
                    onBlur={() => commitTestimonialCards()}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Video</span>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[14px] outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                    value={testimonial.video}
                    onChange={(event) => updateTestimonialCard(index, 'video', event.target.value)}
                    onBlur={() => commitTestimonialCards()}
                  />
                </label>
                <label className="block lg:col-span-2">
                  <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Depoimento</span>
                  <textarea
                    className="min-h-[96px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                    value={testimonial.quote}
                    onChange={(event) => updateTestimonialCard(index, 'quote', event.target.value)}
                    onBlur={() => commitTestimonialCards()}
                  />
                </label>
              </Fragment>
            ))}
            <div className="lg:col-span-2">
              <button
                type="button"
                className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-[#111318] px-4 text-[13px] font-bold text-white transition-colors hover:bg-black"
                onClick={() => updateTestimonialCards([...testimonialCards, { quote: 'Novo depoimento do cliente.', name: 'Novo cliente', company: 'Empresa', since: String(new Date().getFullYear()), video: '' }])}
              >
                Adicionar novo depoimento
              </button>
            </div>
          </>
        )}
        {isGridServicos && (
          <>
            {serviceCards.map((service, index) => {
              const serviceId = `servico-${index + 1}`
              const selectedIcon = serviceIconOptions.find((option) => option.key === (service.iconKey || serviceIconOptions[index % serviceIconOptions.length].key)) || serviceIconOptions[0]
              const SelectedIcon = selectedIcon.icon
              return (
                <Fragment key={serviceId}>
                  <div
                    className={`lg:col-span-2 mt-2 flex items-center justify-between gap-3 border-t pt-4 transition-all duration-150 ${
                      draggingServiceIndex === index
                        ? 'scale-[0.99] border-[#eb001a] opacity-60'
                        : serviceDropIndex === index
                          ? 'border-[#eb001a] bg-[#fff6f7] shadow-[inset_4px_0_0_#eb001a]'
                          : 'border-[#e7e9ee]'
                    }`}
                    draggable={serviceCards.length > 1}
                    onDragStart={(event) => handleServiceDragStart(event, index)}
                    onDragEnd={resetServiceDragState}
                    onDragEnter={() => setServiceDropIndex(index)}
                    onDragOver={(event) => {
                      event.preventDefault()
                      event.dataTransfer.dropEffect = 'move'
                      setServiceDropIndex(index)
                    }}
                    onDrop={(event) => handleServiceDrop(event, index)}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {serviceCards.length > 1 && (
                        <span className="grid h-10 w-10 flex-none cursor-grab place-items-center rounded-lg border border-[#ffd5da] bg-white text-[#eb001a] shadow-sm active:cursor-grabbing">
                          <GripVertical className="h-5 w-5" />
                        </span>
                      )}
                      <p className="text-[12px] font-bold uppercase tracking-widest text-[#eb001a]">Serviço {index + 1}</p>
                    </div>
                    {serviceCards.length > 1 && (
                      <button
                        type="button"
                        className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#ffd5da] bg-white px-3 text-[12px] font-bold text-[#eb001a] transition-colors hover:bg-[#fff1f3]"
                        onClick={() => updateServiceCards(serviceCards.filter((_, serviceIndex) => serviceIndex !== index))}
                      >
                        <Trash2 className="h-4 w-4" />
                        Excluir bloco
                      </button>
                    )}
                  </div>
                  <label className="block">
                    <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Ícone</span>
                    <div className="relative">
                      <button
                        type="button"
                        {...editorAttrs('icon', serviceId)}
                        className="flex h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-[#dfe3ea] bg-white px-3 text-left text-[14px] outline-none transition-colors hover:border-[#eb001a] focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                        onClick={() => setOpenIconPicker(openIconPicker === serviceId ? null : serviceId)}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="grid h-8 w-10 shrink-0 place-items-center rounded-md bg-[#fff1f3] text-[#eb001a]">
                            <SelectedIcon className="h-5 w-5" strokeWidth={1.8} />
                          </span>
                          <span className="truncate font-semibold text-[#111318]">{selectedIcon.label}</span>
                        </span>
                        <ChevronDown className={`h-4 w-4 shrink-0 text-[#5f6672] transition-transform ${openIconPicker === serviceId ? 'rotate-180' : ''}`} />
                      </button>
                      {openIconPicker === serviceId && (
                        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 rounded-xl border border-[#e7e9ee] bg-white p-3 shadow-xl">
                          <div className="grid max-h-[260px] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4 lg:grid-cols-5">
                            {serviceIconOptions.map((option) => {
                              const Icon = option.icon
                              const isSelected = option.key === selectedIcon.key
                              return (
                                <button
                                  key={option.key}
                                  type="button"
                                  className={`flex min-h-[74px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border px-2 py-2 text-center text-[11px] font-semibold transition-colors ${
                                    isSelected
                                      ? 'border-[#eb001a] bg-[#fff1f3] text-[#eb001a]'
                                      : 'border-[#edf0f4] bg-white text-[#3c424d] hover:border-[#ffd5da] hover:bg-[#fff7f8] hover:text-[#eb001a]'
                                  }`}
                                  onClick={() => {
                                    updateServiceCard(index, 'iconKey', option.key, true)
                                    setOpenIconPicker(null)
                                  }}
                                >
                                  <Icon className="h-6 w-6" strokeWidth={1.7} />
                                  <span className="line-clamp-2 leading-tight">{option.label}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Título</span>
                    <input
                      {...editorAttrs('title', serviceId)}
                      className="h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[14px] outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                      value={service.title}
                      onChange={(event) => updateServiceCard(index, 'title', event.target.value)}
                      onBlur={(event) => updateServiceCard(index, 'title', event.target.value, true)}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Descrição</span>
                    <textarea
                      {...editorAttrs('description', serviceId)}
                      className="min-h-[76px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                      value={service.desc}
                      onChange={(event) => updateServiceCard(index, 'desc', event.target.value)}
                      onBlur={(event) => updateServiceCard(index, 'desc', event.target.value, true)}
                    />
                  </label>
                  <label className="block lg:col-span-2">
                    <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Itens (um por linha)</span>
                    <textarea
                      {...editorAttrs('items', serviceId)}
                      className="min-h-[60px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                      value={service.items.join('\n')}
                      onChange={(event) => updateServiceCard(index, 'items', event.target.value)}
                      onBlur={(event) => updateServiceCard(index, 'items', event.target.value, true)}
                    />
                  </label>
                </Fragment>
              )
            })}
            <div className="lg:col-span-2">
              <button
                type="button"
                className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-[#111318] px-4 text-[13px] font-bold text-white transition-colors hover:bg-black"
                onClick={() => updateServiceCards([...serviceCards, { iconKey: 'broadcast', title: 'Novo serviço', desc: 'Descrição do novo serviço.', items: ['Novo item'] }])}
              >
                Criar novo bloco
              </button>
            </div>
          </>
        )}
        {isAceleradorServicos && (
          <>
            {([
              ['cardOne', 'Item 1 — Diagnóstico Estratégico', 'Analisamos seu cenário atual, identificando pontos e oportunidades de crescimento.'],
              ['cardTwo', 'Item 2 — Plano de Crescimento', 'Criamos um plano personalizado com metas claras, estratégias e ações priorizadas.'],
              ['cardThree', 'Item 3 — Execução Inteligente', 'Colocamos o plano em prática com métodos ágeis, focados em resultados e acompanhamento contínuo.'],
              ['cardFour', 'Item 4 — Escala e Resultados', 'Otimizamos continuamente para acelerar o que funciona e gerar resultados cada vez maiores.'],
            ] as [string, string, string][]).map(([key, label, defaultText]) => (
              <Fragment key={key}>
                <div className="lg:col-span-2 mt-2 border-t border-[#e7e9ee] pt-4">
                  <p className="text-[12px] font-bold uppercase tracking-widest text-[#eb001a] mb-3">{label}</p>
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Título</span>
                  <input
                    className="h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[14px] outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                    value={(block as Record<string, string>)[`${key}Title`] ?? ''}
                    onChange={(event) => onUpdate(`${key}Title`, event.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Descrição</span>
                  <textarea
                    className="min-h-[76px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                    placeholder={defaultText}
                    value={(block as Record<string, string>)[`${key}Text`] ?? ''}
                    onChange={(event) => onUpdate(`${key}Text`, event.target.value)}
                  />
                </label>
              </Fragment>
            ))}
          </>
        )}
        {isEstatisticas && (
          <>
            {([
              ['statOne', 'statOneLabel', 'Estatística 1', '+20', 'empresas aceleradas'],
              ['statTwo', 'statTwoLabel', 'Estatística 2', 'milhões', 'em vendas geradas'],
              ['statThree', 'statThreeLabel', 'Estatística 3', 'diversos', 'segmentos atendidos'],
              ['statFour', 'statFourLabel', 'Estatística 4', 'resultados', 'comprovados'],
            ] as [string, string, string, string, string][]).map(([valKey, labelKey, sectionLabel, defaultVal, defaultLabel]) => (
              <Fragment key={valKey}>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">{sectionLabel} — Valor</span>
                  <input
                    className="h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[14px] outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                    placeholder={defaultVal}
                    value={(block as Record<string, string>)[valKey] ?? ''}
                    onChange={(event) => onUpdate(valKey, event.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">{sectionLabel} — Label</span>
                  <input
                    className="h-11 w-full rounded-lg border border-[#dfe3ea] bg-white px-3 text-[14px] outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                    placeholder={defaultLabel}
                    value={(block as Record<string, string>)[labelKey] ?? ''}
                    onChange={(event) => onUpdate(labelKey, event.target.value)}
                  />
                </label>
              </Fragment>
            ))}
          </>
        )}
        {!isHero && !isCenario && !isGargalos && !isAtuacao && !isProcesso && !isSobreNos && !isMvv && !isCta && !isGridServicos && !isClientesList && !isAceleradorServicos && !isEstatisticas && !isDepoimentosList && (
        <label className="block lg:col-span-2">
          <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">{labels.preview}</span>
          <textarea
            className="min-h-[92px] w-full resize-none rounded-lg border border-[#dfe3ea] bg-white px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
            value={block.preview}
            onChange={(event) => onUpdate('preview', event.target.value)}
          />
        </label>
        )}
        {hasImageField && (
        <div className="lg:col-span-2 rounded-xl border border-[#e7e9ee] bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[13px] font-bold text-[#111318]">
                <ImageIcon className="h-4 w-4 text-[#eb001a]" />
                {labels.image}
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-[#5f6672]">{getImageRecommendation(block)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#eb001a] px-4 text-[12px] font-bold text-white transition-colors hover:bg-[#c90015]">
                <Upload className="h-4 w-4" />
                Enviar imagem
                <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
              </label>
              {block.imageUrl && (
                <button
                  type="button"
                  className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#e0e3e8] bg-white px-4 text-[12px] font-bold text-[#111318] transition-colors hover:bg-[#eef0f3]"
                  onClick={() => onUpdate('imageUrl', '')}
                >
                  <Trash2 className="h-4 w-4" />
                  Remover
                </button>
              )}
            </div>
          </div>
          <div className="mt-4 overflow-hidden rounded-lg border border-[#dfe3ea] bg-[#f7f8fa]">
            {block.imageUrl ? (
              <img src={block.imageUrl} alt={`Imagem ${block.title}`} className="h-56 w-full object-cover" />
            ) : (
              <div className="grid h-36 place-items-center text-center">
                <div>
                  <ImageIcon className="mx-auto h-7 w-7 text-[#eb001a]" />
                  <p className="mt-2 text-[12px] font-semibold text-[#5f6672]">Nenhuma imagem selecionada</p>
                </div>
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          className="h-11 cursor-pointer rounded-lg border border-[#e0e3e8] bg-white px-5 text-[13px] font-bold text-[#111318] transition-colors hover:bg-[#f7f8fa]"
          onClick={onClose}
        >
          Fechar edição
        </button>
        <button
          type="button"
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#eb001a] px-5 text-[13px] font-bold text-white transition-colors hover:bg-[#c90015]"
          onClick={onSave}
        >
          <Save className="h-4 w-4" />
          Salvar alterações
        </button>
      </div>
    </div>
  )
}

export default function SiteContentPage({
  pageId,
  editBlockId,
  onBackToBlocks,
}: {
  pageId: string
  editBlockId?: string
  onBackToBlocks?: () => void
}) {
  const navigate = useNavigate()
  const [content, setContent] = useState<Record<string, SitePage>>(() => loadContent())
  const normalizedContent = useMemo(() => normalizeContent(content), [content])
  const page = normalizedContent[pageId] ?? sitePages['content-home']
  const [openBlock, setOpenBlock] = useState('')

  useEffect(() => {
    setOpenBlock('')
  }, [pageId])

  useEffect(() => {
    let mounted = true
    loadContentFromApi().then((data) => { if (mounted) setContent(data) })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!editBlockId) return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [editBlockId])

  const sectionCount = page.blocks.length
  const routeLabel = page.route === '/' ? 'Página inicial' : page.route

  const updateBlock = (blockId: string, field: keyof SiteBlock, value: string) => {
    setContent((current) => {
      const currentPage = current[page.id]
      const nextPage = {
        ...currentPage,
        blocks: currentPage.blocks.map((block) => (block.id === blockId ? { ...block, [field]: value } : block)),
      }
      return { ...current, [page.id]: nextPage }
    })
  }

  const handleImageUpload = (blockId: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      updateBlock(blockId, 'imageUrl', String(reader.result ?? ''))
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const saveContent = async () => {
    const normalizedContent = normalizeContent(content)
    setContent(normalizedContent)
    const currentPage = normalizedContent[pageId]
    try {
      await siteContentService.update(pageId, currentPage, currentPage?.route)
      toast.success('Conteúdo salvo com sucesso.')
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response?.status
      if (status === 401) {
        toast.error('Sessão expirada. Faça login novamente para salvar.')
        return
      }
      toast.error('Não foi possível salvar o conteúdo.')
      throw error
    }
  }

  const currentPreview = useMemo(
    () => page.blocks.find((block) => block.id === openBlock) ?? page.blocks[0],
    [openBlock, page.blocks],
  )
  const editBlock = editBlockId ? page.blocks.find((block) => block.id === editBlockId) : null
  const goBackToBlocks = () => {
    if (onBackToBlocks) {
      onBackToBlocks()
      return
    }
    navigate(`/admin?page=${encodeURIComponent(pageId)}`)
  }

  if (editBlockId) {
    if (!editBlock) {
      return (
        <div className="space-y-6">
          <button
            type="button"
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#e0e3e8] bg-white px-4 text-[13px] font-bold text-[#111318] transition-colors hover:bg-[#f7f8fa]"
            onClick={goBackToBlocks}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <div className="rounded-2xl border border-[#e7e9ee] bg-white p-6 shadow-sm">
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#eb001a]">Bloco não encontrado</p>
            <h1 className="mt-2 text-[24px] font-bold text-[#111318]">Não foi possível abrir esse bloco.</h1>
            <p className="mt-2 text-[14px] text-[#5f6672]">Volte para a lista e escolha um bloco válido.</p>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-[#e7e9ee] bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <button
              type="button"
              className="mb-4 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#e0e3e8] bg-white px-4 text-[13px] font-bold text-[#111318] transition-colors hover:bg-[#f7f8fa]"
              onClick={goBackToBlocks}
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para blocos
            </button>
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#eb001a]">Editando bloco</p>
            <h1 className="mt-2 text-[28px] font-bold text-[#111318]">{editBlock.title}</h1>
            <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[#5f6672]">
              {page.label} · {editBlock.eyebrow || getImageRecommendation(editBlock)}
            </p>
          </div>
          <a
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#e0e3e8] px-4 text-[13px] font-semibold text-[#111318] no-underline transition-colors hover:bg-[#f7f8fa]"
            href={page.route}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink className="h-4 w-4" />
            Ver página
          </a>
        </div>

        <article className="overflow-hidden rounded-2xl border border-[#e7e9ee] bg-white shadow-sm">
          <div className="border-b border-[#eef0f3] px-5 py-4">
            <h2 className="text-[16px] font-bold text-[#111318]">Preview do bloco</h2>
          </div>
          <div
            className={`relative isolate z-0 p-4 sm:p-5 whitespace-pre-line ${pageId === 'content-clientes' && editBlock.id === 'hero' ? 'overflow-visible pb-20 sm:pb-24' : 'overflow-hidden'}`}
            style={pageId === 'content-clientes' && editBlock.id === 'hero' ? { paddingBottom: 0 } : undefined}
          >
            <SectionPreview block={editBlock} compact pageId={pageId} />
          </div>
        </article>

        <article className="overflow-hidden rounded-2xl border border-[#e7e9ee] bg-white shadow-sm">
          <div className="border-b border-[#eef0f3] px-5 py-4">
            <h2 className="text-[16px] font-bold text-[#111318]">Campos de edição</h2>
          </div>
          <BlockEditor
            block={editBlock}
            pageId={pageId}
            onUpdate={(field, value) => updateBlock(editBlock.id, field, value)}
            onUpload={(event) => handleImageUpload(editBlock.id, event)}
            onSave={saveContent}
            onClose={goBackToBlocks}
          />
        </article>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-[#e7e9ee] bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#eb001a]">Conteúdo do site</p>
          <h1 className="mt-2 text-[28px] font-bold text-[#111318]">{page.label}</h1>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[#5f6672]">{page.description}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-[12px] font-semibold">
            <span className="rounded-full bg-[#eb001a]/10 px-3 py-1 text-[#eb001a]">{sectionCount} blocos</span>
            <span className="rounded-full bg-[#f1f2f4] px-3 py-1 text-[#3c424d]">{routeLabel}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#e0e3e8] px-4 text-[13px] font-semibold text-[#111318] no-underline transition-colors hover:bg-[#f7f8fa]"
            href={page.route}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink className="h-4 w-4" />
            Ver página
          </a>
        </div>
      </div>

      <div className="space-y-5">
        {page.blocks.map((block, index) => {
          return (
            <article key={block.id} className="overflow-hidden rounded-2xl border border-[#e7e9ee] bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-[#eef0f3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 flex-none place-items-center rounded-lg bg-[#eb001a]/10 text-[13px] font-bold text-[#eb001a]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate text-[16px] font-bold text-[#111318]">{block.title}</h2>
                    <p className="mt-1 truncate text-[12px] text-[#5f6672]">{block.eyebrow} · {getImageRecommendation(block)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#eb001a] px-4 text-[13px] font-bold text-white transition-colors hover:bg-[#c90015]"
                  onClick={() => navigate(`/admin?page=${encodeURIComponent(pageId)}&block=${encodeURIComponent(block.id)}`)}
                >
                  <Edit3 className="h-4 w-4" />
                  Editar
                </button>
              </div>

              <div
                className={`relative isolate z-0 p-4 sm:p-5 whitespace-pre-line ${pageId === 'content-clientes' && block.id === 'hero' ? 'overflow-visible pb-20 sm:pb-24' : 'overflow-hidden'}`}
                style={pageId === 'content-clientes' && block.id === 'hero' ? { paddingBottom: 0 } : undefined}
              >
                <SectionPreview block={block} compact pageId={pageId} />
              </div>
            </article>
          )
        })}
      </div>

      <div className="hidden">
        <div className="space-y-3">
          {page.blocks.map((block, index) => {
            const isOpen = openBlock === block.id
            return (
              <article key={block.id} className="overflow-hidden rounded-2xl border border-[#e7e9ee] bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpenBlock(isOpen ? '' : block.id)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[#f7f8fa]"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-[#eb001a]/10 text-[13px] font-bold text-[#eb001a]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[16px] font-bold text-[#111318]">{block.title}</span>
                      <span className="mt-1 block truncate text-[12px] text-[#5f6672]">{block.headline}</span>
                    </span>
                  </span>
                  <ChevronDown className={`h-5 w-5 flex-none text-[#5f6672] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="border-t border-[#eef0f3] p-5">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <label className="block">
                        <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Etiqueta</span>
                        <input
                          className="h-11 w-full rounded-lg border border-[#dfe3ea] px-3 text-[14px] outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                          value={block.eyebrow}
                          onChange={(event) => updateBlock(block.id, 'eyebrow', event.target.value)}
                        />
                      </label>
                      <label className="block lg:col-span-2">
                        <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Título principal</span>
                        <textarea
                          className="min-h-[68px] w-full resize-y rounded-lg border border-[#dfe3ea] px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                          value={block.headline}
                          onChange={(event) => updateBlock(block.id, 'headline', event.target.value)}
                        />
                      </label>
                      <label className="block lg:col-span-2">
                        <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Descrição</span>
                        <textarea
                          className="min-h-[92px] w-full resize-none rounded-lg border border-[#dfe3ea] px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                          value={block.description}
                          onChange={(event) => updateBlock(block.id, 'description', event.target.value)}
                        />
                      </label>
                      <label className="block lg:col-span-2">
                        <span className="mb-1.5 block text-[13px] font-bold text-[#111318]">Resumo do preview</span>
                        <textarea
                          className="min-h-[92px] w-full resize-none rounded-lg border border-[#dfe3ea] px-3 py-2.5 text-[14px] leading-relaxed outline-none focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10"
                          value={block.preview}
                          onChange={(event) => updateBlock(block.id, 'preview', event.target.value)}
                        />
                      </label>
                      <div className="lg:col-span-2 rounded-xl border border-[#e7e9ee] bg-[#f7f8fa] p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex items-center gap-2 text-[13px] font-bold text-[#111318]">
                              <ImageIcon className="h-4 w-4 text-[#eb001a]" />
                              Imagem da seção
                            </div>
                            <p className="mt-1 text-[12px] leading-relaxed text-[#5f6672]">
                              {getImageRecommendation(block)}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#eb001a] px-4 text-[12px] font-bold text-white transition-colors hover:bg-[#c90015]">
                              <Upload className="h-4 w-4" />
                              Enviar imagem
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(event) => handleImageUpload(block.id, event)}
                              />
                            </label>
                            {block.imageUrl && (
                              <button
                                type="button"
                                className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#e0e3e8] bg-white px-4 text-[12px] font-bold text-[#111318] transition-colors hover:bg-[#eef0f3]"
                                onClick={() => updateBlock(block.id, 'imageUrl', '')}
                              >
                                <Trash2 className="h-4 w-4" />
                                Remover
                              </button>
                            )}
                          </div>
                        </div>

                        {block.imageUrl ? (
                          <div className="mt-4 overflow-hidden rounded-lg border border-[#dfe3ea] bg-white">
                            <img src={block.imageUrl} alt={`Imagem ${block.title}`} className="h-48 w-full object-cover" />
                          </div>
                        ) : (
                          <div className="mt-4 grid h-32 place-items-center rounded-lg border border-dashed border-[#cfd5df] bg-white text-center">
                            <div>
                              <ImageIcon className="mx-auto h-7 w-7 text-[#eb001a]" />
                              <p className="mt-2 text-[12px] font-semibold text-[#5f6672]">Nenhuma imagem selecionada</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          <div className="mb-3 flex items-center gap-2 text-[13px] font-bold text-[#111318]">
            <Eye className="h-4 w-4 text-[#eb001a]" />
            Preview do bloco
          </div>
          {currentPreview ? (
            <BlockPreview block={currentPreview} />
          ) : (
            <div className="rounded-xl border border-dashed border-[#dfe3ea] bg-white p-6 text-center text-[14px] text-[#5f6672]">
              <FileText className="mx-auto mb-3 h-8 w-8 text-[#eb001a]" />
              Abra um bloco para ver o preview.
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
