import { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import { getPublicSitePage } from '../services/publicSiteContent.service'

const pageDefaults = {
  about: {
    eyebrow: 'SOBRE NÓS',
    headline: 'Estratégia, criatividade e tecnologia para gerar resultados reais para o seu negócio.',
    description: 'Somos uma agência de marketing focada em performance e crescimento sustentável. Ajudamos empresas a atrair clientes, fortalecer sua marca e aumentar suas vendas com estratégias personalizadas e orientadas a dados.',
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
    imageUrl: '',
  },
  process: {
    eyebrow: 'COMO TRABALHAMOS',
    headline: 'Um processo estratégico para transformar objetivos em resultados.',
    description: 'Acreditamos em um método claro, colaborativo e orientado a dados para entregar soluções personalizadas que geram impacto real no seu negócio.',
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
  values: {
    eyebrow: 'MISSÃO, VISÃO E VALORES',
    cardOneTitle: 'Missão',
    cardOneText: 'Compreender negócios para evidenciar ideias com criatividade, tecnologia e visão estratégica.',
    cardTwoTitle: 'Visão',
    cardTwoText: 'Consolidar-se como uma agência criativa e inovadora com conhecimento das marcas.',
    cardThreeTitle: 'Valores',
    preview: '• Amor a Deus e ao próximo;\n• Fazer ao próximo o que gostaria que fizessem por você;\n• Compromisso e amor com ideias inovadoras;\n• Equilíbrio e transparência no trabalho em equipe;\n• Responsabilidade na parceria com os clientes;\n• Oportunidade e prosperidade por meio do conhecimento e merecimento;',
  },
  cta: {
    headline: 'Pronto para transformar seus objetivos em resultados reais?',
    description: 'Fale com nossos especialistas e descubra como podemos criar estratégias personalizadas para acelerar o crescimento da sua empresa.',
    buttonPrimary: 'RECEBER ANÁLISE',
  },
}

function blocksById(blocks = []) {
  return Object.fromEntries(blocks.map((block) => [block.id, block]))
}

function IconTarget() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '35px', height: '35px' }}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
}

function IconUsers() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '35px', height: '35px' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
}

function IconBarChart() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 682.667 682.667" fill="none" style={{ width: '35px', height: '35px' }}>
      <g clipPath="url(#about-icon-bar-clip-public)" transform="matrix(1.33333 0 0 -1.33333 0 682.667)">
        <defs>
          <clipPath id="about-icon-bar-clip-public" clipPathUnits="userSpaceOnUse">
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
  )
}

function IconHandshake() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor" style={{ width: '40px', height: '40px' }}>
      <path d="m60.78 31.12-9.266-16.873a1.004 1.004 0 0 0-1.359-.395l-4.164 2.286a1.002 1.002 0 0 0-.395 1.358l.387.705a5.46 5.46 0 0 1-4.604-.193c-3.073-1.257-7.984-1.328-15.014-.219a3.357 3.357 0 0 0-2.178 1.339l-.864 1.193c-3.251-.867-3.882-.743-5.537-1.7l.618-1.125a1.002 1.002 0 0 0-.395-1.358l-4.164-2.286a1.004 1.004 0 0 0-1.359.395L3.221 31.12a1.002 1.002 0 0 0 .395 1.359l4.164 2.286a1.001 1.001 0 0 0 1.359-.396l.089-.163q.865 1.07 1.779 2.076a2.982 2.982 0 0 0 3.088 4.507 2.98 2.98 0 0 0 4.413 3.318 2.981 2.981 0 0 0 4.72 2.262 2.98 2.98 0 0 0 4.97 2.293c3.909 1.676 8.892 2.888 10.95-.839a3.972 3.972 0 0 0 4.23-3.244 3.838 3.838 0 0 0 3.335-4.403 3.673 3.673 0 0 0 2.8-3.847 39.168 39.168 0 0 0 4.697-3.146l.651 1.186a1.001 1.001 0 0 0 1.359.396l4.164-2.287a1.002 1.002 0 0 0 .395-1.358zM7.865 32.53l-2.41-1.324 8.303-15.12 2.41 1.324-8.284 15.086zm4.91 4.686 1.673-2.042a1 1 0 0 1 1.548 1.267l-1.674 2.042c-.783.957-2.359-.272-1.547-1.267zm3.442 3.69 3.803-4.642a1 1 0 0 1 1.546 1.267l-3.802 4.642a1 1 0 0 1-1.547-1.268zm4.5 2.395 2.536-3.094a1 1 0 0 1 1.547 1.268l-2.535 3.093a1 1 0 0 1-1.547-1.267zm4.722 2.488 1.051-1.283a1 1 0 0 1 1.548 1.267l-1.052 1.284a1 1 0 0 1-1.547-1.268zm18.707-7.991-7.538-4.415a1 1 0 0 0-1.011 1.726l7.538 4.414a5.75 5.75 0 0 0 1.528.625 1.857 1.857 0 0 1-1.595 2.455l-7.356-3.939a1 1 0 0 0-.943 1.764l6.679 3.576a2.054 2.054 0 0 1-2.47 1.81l-5.624-2.502a1 1 0 0 0-.813 1.828l4.623 2.056c-1.496 1.965-5.302.79-7.597-.133l.018-.022a2.986 2.986 0 0 0-2.892-4.83 2.991 2.991 0 0 0-3.073-4.333 2.998 2.998 0 0 0-5.147-2.882l-.298.363a2.99 2.99 0 0 0-5.274-1.453l-.638.78q-1.029-1.154-1.99-2.384l6.55-11.929c1.839 1.054 2.862 1.087 5.242 1.686l-3.255 4.499a2.002 2.002 0 0 0 1.448 3.167 10.6 10.6 0 0 0 9.304-3.928 6.512 6.512 0 0 0 2.912.017c3.044 1.565 13.75 7.324 14.997 10.514.393 1.005-1.003 2.837-3.325 1.47zm4.585-3.329c-2.153-3.218-14.565-10.666-16.34-10.666l-.002-.016a4.64 4.64 0 0 1-2.905-.101 1.017 1.017 0 0 0-1.218.435 8.407 8.407 0 0 1-7.835 3.608l5.375-7.428a1.35 1.35 0 0 1 .87-.537c6.564-1.035 11.257-1.004 14.026.129a7.31 7.31 0 0 0 6.244.064l6.287 11.449a37.23 37.23 0 0 1-4.502 3.063zm7.402-1.939L47.83 17.41l2.41-1.324 8.303 15.12z" />
    </svg>
  )
}

function IconStep({ type }) {
  const icons = {
    search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
    map: <><path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z" /><path d="M9 3v15" /><path d="M15 6v15" /></>,
    rocket: <><path d="M4.5 16.5c-1.5 1.3-2 3.8-2 3.8s2.5-.5 3.8-2" /><path d="M9 15 4 10l7-7c3 0 6 1 8 3s3 5 3 8l-7 7-5-5" /><circle cx="15" cy="9" r="2" /></>,
    activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.4 1v.17a2 2 0 1 1-4 0V21a1.65 1.65 0 0 0-1.4-1.63 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1-.4h-.17a2 2 0 1 1 0-4H3a1.65 1.65 0 0 0 1.63-1.4 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-.6 1.65 1.65 0 0 0 .4-1v-.17a2 2 0 1 1 4 0V3a1.65 1.65 0 0 0 1.4 1.63 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.1.4.3.7.6 1 .3.3.6.4 1 .4h.17a2 2 0 1 1 0 4H21a1.65 1.65 0 0 0-1.6.6Z" /></>,
    trophy: <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></>,
  }

  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '25px', height: '25px' }}>{icons[type]}</svg>
}

function IconMedal() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="text-red-600" fill="currentColor" style={{ width: '38px', height: '38px' }}>
      <path d="m36.561 31.048.017-.049a4.733 4.733 0 0 1 .569-1.304 4.538 4.538 0 0 1 1.104-.844 4.78 4.78 0 0 0 1.973-1.877 4.886 4.886 0 0 0 .205-2.703 4.82 4.82 0 0 1-.038-1.455 4.597 4.597 0 0 1 .626-1.233A4.921 4.921 0 0 0 42 19a4.928 4.928 0 0 0-.982-2.582 4.593 4.593 0 0 1-.627-1.234 4.814 4.814 0 0 1 .038-1.454 4.895 4.895 0 0 0-.204-2.703 4.786 4.786 0 0 0-1.972-1.876 4.542 4.542 0 0 1-1.106-.846A4.745 4.745 0 0 1 36.578 7a4.853 4.853 0 0 0-1.345-2.37 4.666 4.666 0 0 0-2.567-.82 4.464 4.464 0 0 1-1.363-.276 4.567 4.567 0 0 1-1.04-.904A4.756 4.756 0 0 0 28.01 1.07a4.633 4.633 0 0 0-2.635.401A4.561 4.561 0 0 1 24 1.833a4.549 4.549 0 0 1-1.374-.361 4.617 4.617 0 0 0-2.636-.4 4.75 4.75 0 0 0-2.253 1.558 4.519 4.519 0 0 1-1.039.903 4.464 4.464 0 0 1-1.363.278 4.666 4.666 0 0 0-2.568.82A4.862 4.862 0 0 0 11.422 7a4.733 4.733 0 0 1-.569 1.303 4.538 4.538 0 0 1-1.104.845 4.78 4.78 0 0 0-1.973 1.877 4.886 4.886 0 0 0-.205 2.703 4.82 4.82 0 0 1 .038 1.454 4.597 4.597 0 0 1-.626 1.234A4.921 4.921 0 0 0 6 19a4.928 4.928 0 0 0 .982 2.582 4.593 4.593 0 0 1 .627 1.234 4.814 4.814 0 0 1-.038 1.454 4.895 4.895 0 0 0 .204 2.703 4.786 4.786 0 0 0 1.972 1.876 4.542 4.542 0 0 1 1.106.847 4.745 4.745 0 0 1 .569 1.303l.018.054-.011.013L6.27 40a2 2 0 0 0 2.034 2.977l3.481-.53 1.283 3.282a1.985 1.985 0 0 0 1.712 1.265q.078.006.155.006a1.984 1.984 0 0 0 1.728-1l5.343-9.255c.212-.069.419-.144.619-.217A4.561 4.561 0 0 1 24 36.167a4.549 4.549 0 0 1 1.374.361c.2.074.41.146.622.215l.004.013L31.337 46a1.984 1.984 0 0 0 1.727 1q.078 0 .156-.006a1.986 1.986 0 0 0 1.713-1.265l1.282-3.282 3.48.53A2 2 0 0 0 41.73 40ZM14.931 45l-1.573-4.026a1.004 1.004 0 0 0-1.082-.624L8.003 41l4.541-7.866a2.692 2.692 0 0 0 .223.234 4.666 4.666 0 0 0 2.567.82 4.464 4.464 0 0 1 1.363.277 4.567 4.567 0 0 1 1.04.904 5.369 5.369 0 0 0 1.923 1.438ZM26.06 34.65a6.092 6.092 0 0 0-2.06-.483 6.069 6.069 0 0 0-2.06.482 3.282 3.282 0 0 1-1.498.332 3.406 3.406 0 0 1-1.266-.999 5.948 5.948 0 0 0-1.594-1.31 6.008 6.008 0 0 0-2.03-.472 3.243 3.243 0 0 1-1.52-.38 3.496 3.496 0 0 1-.714-1.456 6.147 6.147 0 0 0-.89-1.9 5.977 5.977 0 0 0-1.613-1.307 3.346 3.346 0 0 1-1.231-1.037 3.485 3.485 0 0 1-.025-1.62 6.414 6.414 0 0 0 .004-2.117 6.06 6.06 0 0 0-.884-1.86A3.458 3.458 0 0 1 8 19a3.454 3.454 0 0 1 .679-1.522 6.037 6.037 0 0 0 .883-1.86A6.414 6.414 0 0 0 9.56 13.5a3.47 3.47 0 0 1 .026-1.62 3.34 3.34 0 0 1 1.231-1.04 5.974 5.974 0 0 0 1.615-1.306 6.148 6.148 0 0 0 .887-1.898 3.507 3.507 0 0 1 .715-1.456 3.243 3.243 0 0 1 1.52-.38 6.008 6.008 0 0 0 2.03-.474 5.911 5.911 0 0 0 1.595-1.31 3.405 3.405 0 0 1 1.265-.998 3.304 3.304 0 0 1 1.497.332 6.092 6.092 0 0 0 2.06.483 6.069 6.069 0 0 0 2.06-.482 3.31 3.31 0 0 1 1.498-.332 3.406 3.406 0 0 1 1.266.999 5.948 5.948 0 0 0 1.594 1.31 6.008 6.008 0 0 0 2.03.472 3.243 3.243 0 0 1 1.52.38 3.496 3.496 0 0 1 .714 1.456 6.147 6.147 0 0 0 .89 1.9 5.977 5.977 0 0 0 1.613 1.307 3.346 3.346 0 0 1 1.231 1.037 3.485 3.485 0 0 1 .025 1.62 6.414 6.414 0 0 0-.004 2.117 6.06 6.06 0 0 0 .884 1.86A3.458 3.458 0 0 1 40 19a3.454 3.454 0 0 1-.679 1.522 6.037 6.037 0 0 0-.883 1.86 6.414 6.414 0 0 0 .003 2.118 3.47 3.47 0 0 1-.026 1.62 3.34 3.34 0 0 1-1.231 1.04 5.974 5.974 0 0 0-1.615 1.306 6.148 6.148 0 0 0-.887 1.898 3.507 3.507 0 0 1-.715 1.456 3.243 3.243 0 0 1-1.52.381 6.008 6.008 0 0 0-2.03.473 5.911 5.911 0 0 0-1.595 1.31 3.405 3.405 0 0 1-1.265.998 3.317 3.317 0 0 1-1.497-.333Zm9.665 5.7a1.006 1.006 0 0 0-1.082.623L33.069 45l-4.73-8.193a5.365 5.365 0 0 0 1.924-1.437 4.519 4.519 0 0 1 1.039-.903 4.464 4.464 0 0 1 1.363-.278 4.666 4.666 0 0 0 2.568-.82 2.697 2.697 0 0 0 .223-.235L39.997 41ZM36 19a12 12 0 1 0-12 12 12.013 12.013 0 0 0 12-12ZM24 29a10 10 0 1 1 10-10 10.012 10.012 0 0 1-10 10Zm4.555-13.832a1 1 0 0 1 .277 1.387l-4 6a1 1 0 0 1-.733.44A1.003 1.003 0 0 1 24 23a1 1 0 0 1-.707-.293l-3-3a1 1 0 0 1 1.414-1.414l2.138 2.138 3.323-4.986a1 1 0 0 1 1.387-.277Z" />
    </svg>
  )
}

function LogoMark() {
  return (
    <svg width="587" height="587" viewBox="0 0 587 587" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-20 lg:h-[133px] w-auto">
      <path d="M406.163 553.363V180.971H33.7717V318.658H268.476V553.363H406.163Z" stroke="#CB2C30" strokeWidth="9" />
      <path d="M582.194 524.021V4.94043H63.1139V142.629H444.505V524.021H582.194Z" stroke="#CB2C30" strokeWidth="9" />
      <path d="M230.133 582.704V357H4.42932V582.704H230.133Z" stroke="#CB2C30" strokeWidth="9" />
    </svg>
  )
}

function ComoTrabalhamosCtaSection({ cta }) {
  return (
    <section className="bg-zinc-950 border-t border-zinc-800 py-8" style={{ border: 'none', background: 'white', padding: '0 16px', paddingBottom: '64px' }}>
      <div className="max-w-384 mx-auto px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-zinc-950)', maxWidth: '1460px', padding: 'clamp(28px, 4vw, 55px)', borderRadius: '20px' }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-6 items-center lg:items-stretch" style={{ alignItems: 'center' }}>
          <div className="shrink-0"><LogoMark /></div>
          <div className="hidden lg:block self-stretch w-px min-h-[48px]" style={{ backgroundColor: 'rgb(220, 38, 38)' }} />
          <div className="flex-1 lg:max-w-xl text-center lg:text-left w-full" style={{ maxWidth: '650px' }}>
            <h2 className="font-poppins whitespace-pre-line font-bold text-white mb-3 leading-tight text-2xl sm:text-3xl lg:text-[29px]">{cta.headline}</h2>
            <p className="whitespace-pre-line text-zinc-400 text-sm leading-relaxed" style={{ fontSize: '15px' }}>{cta.description}</p>
          </div>
          {/* <div className="hidden lg:block self-stretch w-px min-h-[48px]" style={{ backgroundColor: 'rgba(63, 63, 70, 0.37)' }} /> */}
          <div className="flex flex-col items-center lg:items-stretch gap-4 shrink-0 w-full lg:w-auto">
            <a href="#contato" className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide px-8 py-4 transition-colors duration-200 flex items-center justify-between gap-2" style={{ borderRadius: '4px', fontSize: '15px' }}>
              {cta.buttonPrimary}
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '22px', height: '22px', flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
            {/*
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="flex -space-x-2 shrink-0">{[1, 2, 3, 4].map((i) => <img key={i} src={`/peoples/men${i}.jpg`} alt={`Cliente ${i}`} className="w-8 h-8 rounded-full border-2 border-zinc-900 object-cover" />)}</div>
              <p className="text-zinc-400 text-center lg:text-left" style={{ maxWidth: '131px', fontSize: '13px', lineHeight: '1.4' }}>+60 empresas j? confiam na Evidence</p>
            </div>
            */}
          </div>
        </div>
      </div>
    </section>
  )
}

function DashedArrow() {
  return (
    <div className="hidden lg:flex items-center justify-center shrink-0 px-1">
      <svg width="48" height="12" viewBox="0 0 48 12" fill="none">
        <path d="M0 6h38M38 6l-5-5M38 6l-5 5" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 3" />
      </svg>
    </div>
  )
}

function buildFeatures(about) {
  return [
    { icon: <IconTarget />, title: about.cardOneTitle, desc: about.cardOneText },
    { icon: <IconUsers />, title: about.cardTwoTitle, desc: about.cardTwoText },
    { icon: <IconBarChart />, title: about.cardThreeTitle, desc: about.cardThreeText },
    { icon: <IconHandshake />, title: about.cardFourTitle, desc: about.cardFourText },
  ]
}

function buildSteps(process) {
  return [
    { num: '01', title: process.stepOneTitle, desc: process.stepOneText, icon: 'search' },
    { num: '02', title: process.stepTwoTitle, desc: process.stepTwoText, icon: 'map' },
    { num: '03', title: process.stepThreeTitle, desc: process.stepThreeText, icon: 'rocket' },
    { num: '04', title: process.stepFourTitle, desc: process.stepFourText, icon: 'activity' },
    { num: '05', title: process.stepFiveTitle, desc: process.stepFiveText, icon: 'settings' },
    { num: '06', title: process.stepSixTitle, desc: process.stepSixText, icon: 'trophy' },
  ]
}

export default function ComoTrabalhamosPage() {
  const [pageContent, setPageContent] = useState()

  useEffect(() => {
    let active = true
    getPublicSitePage('content-como-trabalhamos')
      .then((content) => {
        if (active) setPageContent(content)
      })
      .catch(() => {
        if (active) setPageContent(null)
      })
    return () => { active = false }
  }, [])

  const blocks = blocksById(pageContent?.blocks)
  const about = { ...pageDefaults.about, ...(blocks['sobre-nos'] || {}) }
  const process = { ...pageDefaults.process, ...(blocks.processo || {}) }
  const values = { ...pageDefaults.values, ...(blocks['missao-visao-valores'] || {}) }
  const cta = { ...pageDefaults.cta, ...(blocks.cta || {}) }
  const features = buildFeatures(about)
  const steps = buildSteps(process)
  const valueItems = String(values.preview || '').split(/\n+/).map((item) => item.trim()).filter(Boolean)

  return (
    <>
      <main style={{ marginTop: '90px' }}>
        <section className="bg-white py-16 max-[390px]:pb-[30px] lg:py-24">
          <div className="max-w-384 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row justify-between gap-12">
            <div className="flex flex-col gap-12 flex-1">
              <div style={{ maxWidth: '800px' }}>
                <p className="whitespace-pre-line text-red-600 text-xs font-bold tracking-widest uppercase mb-4 text-center lg:text-left" style={{ fontSize: '13px' }}>{about.eyebrow}</p>
                <h1 className="font-poppins md:whitespace-pre-line text-[20px] sm:text-4xl lg:text-[42px] font-bold text-zinc-900 leading-tight mb-6 text-center lg:text-left" style={{ lineHeight: '1.15' }}>{about.headline}</h1>
                <p className="md:whitespace-pre-line text-zinc-500 text-sm leading-relaxed text-center lg:text-left" style={{ maxWidth: '685px', fontSize: '16px' }}>{about.description}</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-10 lg:pt-0" style={{ marginTop: 0, maxWidth: '730px', gap: '40px' }}>
                {features.map((feature) => (
                  <div key={feature.title} className="flex flex-col items-center lg:items-start gap-3 text-center lg:text-left">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-red-600 shrink-0" style={{ width: 'fit-content' }}>{feature.icon}</div>
                    <div>
                      <p className="font-poppins whitespace-pre-line text-sm font-bold text-zinc-900 mb-1">{feature.title}</p>
                      <p className="whitespace-pre-line text-zinc-500 text-xs leading-relaxed" style={{ fontSize: '13px' }}>{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-fit w-full max-w-[497px] pb-10 mx-auto lg:w-auto lg:mx-0">
              <div className="absolute -top-4 -right-4 w-24 h-24 z-0 pointer-events-none">
                <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"><path d="M96 0 A96 96 0 0 1 0 96" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6 5" fill="none" opacity="0.4" /></svg>
              </div>
              <div className="overflow-hidden relative z-10" style={{ borderRadius: '12px' }}>
                <img src={about.imageUrl || '/equipe.png'} alt="Equipe Agência Evidence" className="h-auto w-full object-cover" />
              </div>
              <div className="z-20 mt-4 flex w-full items-start gap-3 rounded-[10px] bg-white p-4 shadow-[0_8px_32px_rgba(0,0,0,0.13)] min-[391px]:absolute min-[391px]:bottom-0 min-[391px]:left-0 min-[391px]:right-0 min-[391px]:mx-auto min-[391px]:mt-0 min-[391px]:max-w-[348px] lg:left-6 lg:right-6">
                <div className="shrink-0 mt-0.5"><IconMedal /></div>
                <div className="flex-1 min-w-0">
                  <p className="whitespace-pre-line text-zinc-800 text-sm font-semibold leading-snug mb-1" style={{ fontSize: '14px' }}>{about.statOne}</p>
                  <p className="font-poppins whitespace-pre-line text-xl font-bold text-red-600 leading-none" style={{ fontSize: '21px' }}>{about.statTwo} <span className="whitespace-pre-line text-zinc-500 text-xs font-normal" style={{ fontSize: '13px' }}>{about.statThree}</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-zinc-50 py-16 lg:py-20 border-t border-zinc-200">
          <div className="max-w-384 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col justify-between gap-6 lg:mb-14 lg:flex-row lg:gap-16">
              <div>
                <p className="mb-4 whitespace-pre-line text-center text-[13px] font-bold uppercase tracking-widest text-red-600 lg:text-left">{process.eyebrow}</p>
                <h2 className="font-poppins whitespace-pre-line text-center text-2xl font-bold leading-tight text-zinc-900 sm:text-3xl lg:text-left lg:text-[36px]">{process.headline}</h2>
              </div>
              <div className="flex max-w-[512px] items-end">
                <p className="whitespace-pre-line text-center text-[17px] leading-relaxed text-zinc-500 lg:text-left">{process.description}</p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-0">
              {steps.map((step, index) => (
                <div key={step.num} className="flex lg:contents">
                  <div className="flex-1 flex flex-col items-center text-center px-3 py-2">
                    <div className="w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center text-red-600 mb-4 shrink-0" style={{ width: '60px', height: '60px' }}><IconStep type={step.icon} /></div>
                    <p className="font-poppins text-sm font-bold text-red-600 mb-1" style={{ fontSize: '20px' }}>{step.num}</p>
                    <p className="font-poppins whitespace-pre-line text-sm font-bold text-zinc-900 mb-2" style={{ fontSize: '16px' }}>{step.title}</p>
                    <p className="whitespace-pre-line text-zinc-500 text-xs leading-relaxed" style={{ fontSize: '13px', width: '100%' }}>{step.desc}</p>
                  </div>
                  {index < steps.length - 1 && <DashedArrow />}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 border-t border-zinc-200">
          <div className="max-w-384 mx-auto px-4 sm:px-6 lg:px-8">
            <p className="whitespace-pre-line text-red-600 text-[17px] font-bold md:text-[13px] tracking-widest uppercase mb-10 text-center lg:text-left" >{values.eyebrow}</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
              <div className="flex flex-col items-center lg:items-start gap-3 text-center lg:text-left" style={{ border: '1px solid #00000014', padding: '19px 25px', borderRadius: '10px' }}>
                <div className="text-red-600"><IconTarget /></div>
                <p className="font-poppins whitespace-pre-line text-sm font-bold text-zinc-900" style={{ fontSize: '15px' }}>{values.cardOneTitle}</p>
                <p className="md:whitespace-pre-line text-zinc-500 text-xs leading-relaxed" style={{ fontSize: '14px' }}>{values.cardOneText}</p>
              </div>
              <div className="flex flex-col items-center lg:items-start gap-3 text-center lg:text-left" style={{ border: '1px solid #00000014', padding: '19px 25px', borderRadius: '10px' }}>
                <div className="text-red-600"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '35px', height: '35px' }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg></div>
                <p className="font-poppins md:whitespace-pre-line text-sm font-bold text-zinc-900" style={{ fontSize: '15px' }}>{values.cardTwoTitle}</p>
                <p className="whitespace-pre-line text-zinc-500 text-xs leading-relaxed" style={{ fontSize: '14px' }}>{values.cardTwoText}</p>
              </div>
              <div className="flex flex-col items-center lg:items-start gap-3 text-center lg:text-left" style={{ border: '1px solid #00000014', padding: '19px 25px', borderRadius: '10px' }}>
                <div className="text-red-600"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '35px', height: '35px' }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg></div>
                <p className="font-poppins md:whitespace-pre-line text-sm font-bold text-zinc-900" style={{ fontSize: '15px' }}>{values.cardThreeTitle}</p>
                <ul className="text-zinc-500 text-xs leading-relaxed flex flex-col gap-1" style={{ fontSize: '14px' }}>
                  {valueItems.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <ComoTrabalhamosCtaSection cta={cta} />
      </main>
      <Footer />
    </>
  )
}
