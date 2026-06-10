import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Factory,
  HeartPulse,
  Lock,
  Phone,
  Rocket,
  ShoppingCart,
  UsersRound,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Footer from '../components/Footer'
import { getPublicSitePage } from '../services/publicSiteContent.service'
import { diagnosisService, normalizeQuestion, normalizeSection } from '../services/diagnosis.service'
import { toWhatsAppHref, useContatoInfo } from '../services/contatoInfo.service'

const stages = ['segment', 'diagnostic', 'result']

const contactStep = {
  key: 'contact',
  title: 'Dados para contato',
  icon: 'briefcase',
  fields: [
    { key: 'name', label: 'Qual é o seu nome?', type: 'text', required: true, placeholder: 'Seu nome' },
    { key: 'companyName', label: 'Qual é o nome da empresa?', type: 'text', required: true, placeholder: 'Nome da empresa' },
    { key: 'phone', label: 'Qual é o seu telefone/WhatsApp?', type: 'text', required: true, placeholder: '(00) 00000-0000' },
    { key: 'email', label: 'Qual é o seu e-mail?', type: 'text', required: true, placeholder: 'voce@empresa.com' },
    { key: 'city', label: 'Cidade', type: 'text', required: true, placeholder: 'Sua cidade' },
    { key: 'state', label: 'Estado', type: 'select', required: true, placeholder: 'UF', options: ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'] },
  ],
}

function fieldKey(field) {
  return field.key || field.id
}

function fieldsForStep(step) {
  if (step?.key === 'contact') return step.fields
  return (step?.fields || step?.questions || []).map(normalizeQuestion)
}

function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '')
}

function maskPhone(value) {
  const digits = onlyDigits(value).slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function isValidPhone(value) {
  const digits = onlyDigits(value)
  return digits.length === 10 || digits.length === 11
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || '').trim())
}

function normalizePublicForm(form) {
  const sections = Array.isArray(form.sections) ? form.sections.map(normalizeSection) : []
  return { ...form, sections, icon: form.icon || sections[0]?.metadata?.formIcon || sections[0]?.icon || 'briefcase' }
}

function formIconName(form) {
  return form.icon || form.sections?.[0]?.metadata?.formIcon || form.sections?.[0]?.icon || 'briefcase'
}

function FormIcon({ icon, className }) {
  const props = { className, strokeWidth: 1.8 }
  switch (icon) {
    case 'factory': return <Factory {...props} />
    case 'rocket': return <Rocket {...props} />
    case 'users': return <UsersRound {...props} />
    case 'heart': return <HeartPulse {...props} />
    case 'cart':
    case 'store': return <ShoppingCart {...props} />
    default: return <BriefcaseBusiness {...props} />
  }
}

function copyFromAdmin(block, key, fallback) {
  return block?.[key] || fallback
}

function CustomSelect({ id, value, placeholder, options = [], error, onChange }) {
  const [open, setOpen] = useState(false)
  const selected = value || ''
  const selectedLabel = selected || placeholder || 'Selecione'

  return (
    <div className="relative mt-2">
      <button
        id={id}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-md border bg-white px-4 py-3 text-left text-[14px] outline-none transition ${error ? 'border-[#eb001a]' : 'border-[#dfe3ea] hover:border-[#eb001a] focus:border-[#eb001a] focus:ring-2 focus:ring-[#eb001a]/10'} ${selected ? 'text-[#111318]' : 'text-[#8a93a3]'}`}
      >
        <span>{selectedLabel}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-[#6b7280] transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-40 mt-2 max-h-64 w-full overflow-auto rounded-md border border-[#dfe3ea] bg-white p-1 shadow-xl" role="listbox" aria-labelledby={id}>
          <button
            type="button"
            role="option"
            aria-selected={!selected}
            onClick={() => { onChange(''); setOpen(false) }}
            className={`w-full cursor-pointer rounded px-3 py-2 text-left text-[14px] transition ${!selected ? 'bg-[#fff1f3] font-bold text-[#eb001a]' : 'text-[#6b7280] hover:bg-[#f7f8fa] hover:text-[#111318]'}`}
          >
            {placeholder || 'Selecione'}
          </button>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={selected === option}
              onClick={() => { onChange(option); setOpen(false) }}
              className={`w-full cursor-pointer rounded px-3 py-2 text-left text-[14px] transition ${selected === option ? 'bg-[#fff1f3] font-bold text-[#eb001a]' : 'text-[#111318] hover:bg-[#f7f8fa] hover:text-[#eb001a]'}`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function DarkHeader() {
  return (
    <header className="mx-auto mb-2 flex min-h-[38px] w-full max-w-[1000px] items-center justify-between py-[27px] max-[720px]:mb-3 max-[720px]:py-3">
      <a href="/" aria-label="Agência Evidence" className="inline-flex cursor-pointer items-center">
        <img className="block w-full max-w-[160px] max-[720px]:max-w-[96px]" src="/Logo - Agência Evidence.png" alt="Agência Evidence" />
      </a>
      <a className="inline-flex min-h-8 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[5px] border border-[rgba(239,0,28,0.78)] bg-[rgba(239,0,28,0.05)] px-4 text-[13px] font-normal text-[#ef2335] no-underline" href="/">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.8} /> Voltar <span className="max-[720px]:hidden">para o site</span>
      </a>
    </header>
  )
}

function QuizHeader() {
  return (
    <header className="bg-[#07090c] py-[11px]">
      <div className="mx-auto flex h-[68px] max-w-[1472px] items-center justify-between px-8 max-[720px]:h-[74px] max-[720px]:px-4">
        <a href="/" aria-label="Agência Evidence" className="inline-flex cursor-pointer items-center">
          <img className="block w-full max-w-[176px] max-[720px]:max-w-[128px]" src="/Logo - Agência Evidence.png" alt="Agência Evidence" />
        </a>
        <a className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-white/20 px-5 py-3 text-[13px] font-semibold text-white no-underline" href="/">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </a>
      </div>
    </header>
  )
}

function Stepper({ stage, selectedSegment, light = false }) {
  const activeIndex = stages.indexOf(stage)
  const steps = [
    { id: 'segment', title: 'Segmento', description: selectedSegment || 'Escolha o seu segmento' },
    { id: 'diagnostic', title: 'Diagnóstico', description: 'Responda algumas perguntas' },
    { id: 'result', title: 'Resultado', description: 'Receba sua análise personalizada' },
  ]
  return (
    <div className={`mx-auto flex max-w-[780px] items-center justify-center gap-10 py-12 ${light ? 'text-[#111318]' : 'text-white'}`}>
      {steps.map((step, index) => {
        const active = index === activeIndex
        const done = index < activeIndex
        return (
          <div key={step.id} className="flex items-center gap-3">
            <span className={`grid h-10 w-10 place-items-center rounded-full text-[14px] font-bold ${active ? 'bg-[#eb001a] text-white' : done ? 'border border-[#eb001a] bg-white text-[#eb001a]' : 'bg-[#eef1f5] text-[#111318]'}`}>{done ? <Check className="h-4 w-4" /> : index + 1}</span>
            <div className="max-[720px]:hidden"><p className="text-[14px] font-bold">{step.title}</p><p className={`text-[11px] ${light ? 'text-[#5f6672]' : 'text-white/80'}`}>{step.description}</p></div>
          </div>
        )
      })}
    </div>
  )
}

function SegmentCard({ form, onSelect }) {
  return (
    <button type="button" onClick={() => onSelect(form)} className="group min-h-[210px] w-full shrink-0 basis-[calc((100%-32px)/3)] cursor-pointer rounded-md border border-white/15 bg-white/[0.015] p-5 text-left text-white transition hover:border-[#eb001a] hover:bg-white/[0.04] max-[920px]:basis-[calc((100%-16px)/2)] max-[620px]:basis-full">
      <FormIcon icon={formIconName(form)} className="h-10 w-10 text-[#eb001a]" />
      <h3 className="mt-6 text-[21px] font-bold">{form.title}</h3>
      <p className="mt-3 text-[14px] leading-[1.6] text-white/85">{form.description}</p>
      <ArrowRight className="mt-4 h-4 w-4 transition group-hover:translate-x-1" />
    </button>
  )
}

function SegmentScreen({ adminData, forms, loading, error, onSelect }) {
  const heroBlock = adminData?.blocks?.find((block) => block.id === 'hero' || block.id === 'segmento')
  const title = copyFromAdmin(heroBlock, 'headline', 'Vamos começar a análise do seu negócio?')
  const description = copyFromAdmin(heroBlock, 'description', 'Para oferecer um diagnóstico preciso e estratégias personalizadas, precisamos entender melhor o contexto do seu negócio.')
  const prompt = copyFromAdmin(heroBlock, 'preview', 'Selecione o segmento que melhor representa sua empresa:')

  return (
    <main className="min-h-screen bg-[#050608] text-white">
      <div className="mx-auto max-w-[1000px] px-4 pb-12">
        <DarkHeader />
        <section className="rounded-md border border-white/10 bg-[#07090c] px-12 pb-12 max-[720px]:px-5">
          <Stepper stage="segment" />
          <div className="mx-auto max-w-[820px] text-center">
            <h1 className="font-poppins whitespace-pre-line text-[clamp(32px,4vw,46px)] font-bold leading-tight">{title}</h1>
            <p className="mx-auto mt-7 max-w-[720px] whitespace-pre-line text-[18px] leading-[1.8]">{description}</p>
            <p className="mt-10 text-[17px] font-bold">{prompt}</p>
          </div>
          {loading && <p className="mt-8 rounded-md border border-white/10 bg-white/5 p-5 text-center text-sm">Carregando segmentos da API...</p>}
          {error && <p className="mt-8 rounded-md border border-[#eb001a]/40 bg-[#eb001a]/10 p-5 text-center text-sm text-[#ff8090]">{error}</p>}
          {!loading && !error && forms.length === 0 && <p className="mt-8 rounded-md border border-white/10 bg-white/5 p-5 text-center text-sm">Nenhum formulário ativo foi encontrado na API.</p>}
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            {forms.map((form) => <SegmentCard key={form.slug} form={form} onSelect={onSelect} />)}
          </div>
        </section>
      </div>
    </main>
  )
}

function Field({ field, value, error, onChange, fieldIndex }) {
  const key = fieldKey(field)
  const id = `field-${key}`
  const commonClass = `mt-2 w-full rounded-md border bg-white px-4 py-3 text-[14px] outline-none ${error ? 'border-[#eb001a]' : 'border-[#dfe3ea] focus:border-[#eb001a]'}`
  const options = field.options || []
  const otherOption = options.find((option) => option.trim().toLowerCase() === 'outro')
  const selectedOther = otherOption && value && !options.includes(value)
  return (
    <div className="rounded-md border border-[#e5e8ee] bg-white p-5 shadow-sm">
      <label htmlFor={id} className="block text-[15px] font-bold text-[#111318]">{fieldIndex + 1}. {field.label}{field.required && <span className="ml-2 rounded bg-[#fff1f3] px-2 py-0.5 text-[11px] text-[#eb001a]">Obrigatório</span>}</label>
      {field.description && <p className="mt-1 text-[12px] text-[#6b7280]">{field.description}</p>}
      {field.type === 'textarea' ? (
        <textarea id={id} rows={5} value={value || ''} placeholder={field.placeholder} onChange={(event) => onChange(key, event.target.value)} className={commonClass} />
      ) : field.type === 'select' ? (
        <CustomSelect id={id} value={value || ''} placeholder={field.placeholder || 'Selecione'} options={options} error={error} onChange={(nextValue) => onChange(key, nextValue)} />
      ) : field.type === 'single' || field.type === 'radio' ? (
        <div className="mt-3 grid gap-2">
          {options.map((option) => {
            const isOther = option.trim().toLowerCase() === 'outro'
            const selected = isOther ? selectedOther || value === option : value === option
            return <button key={option} type="button" onClick={() => onChange(key, option)} className={`cursor-pointer rounded-md border px-4 py-3 text-left text-[14px] transition hover:border-[#eb001a] ${selected ? 'border-[#eb001a] bg-[#fff1f3] text-[#eb001a]' : 'border-[#dfe3ea] bg-white text-[#111318]'}`}>{option}</button>
          })}
          {otherOption && (selectedOther || value === otherOption) && (
            <input id={`${id}-other`} type="text" value={selectedOther ? value : ''} placeholder="Digite sua resposta" onChange={(event) => onChange(key, event.target.value)} className={commonClass} autoFocus />
          )}
        </div>
      ) : (
        <input id={id} type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'} inputMode={key === 'phone' ? 'tel' : undefined} value={value || ''} placeholder={field.placeholder} onChange={(event) => onChange(key, event.target.value)} className={commonClass} />
      )}
      {error && <p className="mt-2 text-[12px] font-semibold text-[#eb001a]">{error}</p>}
    </div>
  )
}

function Sidebar({ currentStep, selectedForm, answers, onJump, steps }) {
  const progress = Math.round(((currentStep + 1) / steps.length) * 100)
  const contato = useContatoInfo()
  const specialistHref = toWhatsAppHref(contato?.whatsapp || '')
  const specialistTarget = specialistHref !== '#' ? '_blank' : undefined
  const specialistRel = specialistHref !== '#' ? 'noopener noreferrer' : undefined
  return (
    <aside className="rounded-md bg-[#07090c] p-7 text-white shadow-[0_18px_45px_rgba(0,0,0,0.22)] lg:sticky lg:top-6">
      <p className="text-[14px] font-bold">Progresso da análise</p>
      <p className="mt-2 text-[12px] text-white/75">{progress}% concluído</p>
      <div className="mt-4 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-[#eb001a]" style={{ width: `${progress}%` }} /></div>
      <nav className="mt-8 space-y-3" aria-label="Seções do diagnóstico">
        {steps.map((step, index) => <button key={step.key || index} type="button" onClick={() => index <= currentStep && onJump(index)} className={`flex w-full items-center rounded-md px-4 py-4 text-left text-[13px] font-semibold ${index <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed opacity-55'} ${index === currentStep ? 'bg-[linear-gradient(90deg,rgba(235,0,26,0.28),rgba(235,0,26,0.04))] text-[#eb001a]' : 'text-white/78 hover:bg-white/[0.04]'}`}>{step.title}</button>)}
      </nav>
      <div className="mt-20 rounded-md border border-white/10 bg-white/[0.02] p-5"><p className="text-[14px] font-bold">Precisa de ajuda?</p><p className="mt-4 text-[12px] leading-[1.6] text-white/75">Nosso time está pronto para te ajudar a fazer a melhor análise do seu negócio.</p><a className="mt-5 inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-[#eb001a] text-[12px] font-bold text-[#eb001a] no-underline" href={specialistHref} target={specialistTarget} rel={specialistRel}>Falar com especialista</a><Phone className="mx-auto mt-6 h-9 w-9 text-[#eb001a]" /></div>
      <p className="mt-5 text-[12px] text-white/60">Segmento: {selectedForm.title}</p><p className="mt-1 text-[12px] text-white/60">Respostas: {Object.keys(answers).length}</p>
    </aside>
  )
}

function DiagnosticScreen({ selectedForm, answers, currentStep, errors, submitting, onAnswer, onBack, onJump, onNext }) {
  const steps = useMemo(() => [contactStep, ...selectedForm.sections], [selectedForm])
  const step = steps[currentStep]
  const fields = fieldsForStep(step)
  const progress = Math.round(((currentStep + 1) / steps.length) * 100)
  return (
    <main className="bg-white text-[#111318]">
      <QuizHeader />
      <Stepper stage="diagnostic" selectedSegment={selectedForm.title} light />
      <section className="mx-auto grid max-w-[1180px] grid-cols-[270px_minmax(300px,1fr)_220px] gap-8 px-4 pb-14 max-[900px]:grid-cols-1">
        <div className="max-[900px]:hidden"><Sidebar currentStep={currentStep} selectedForm={selectedForm} answers={answers} onJump={onJump} steps={steps} /></div>
        <section>
          <div className="mb-6 hidden rounded-md bg-[#07090c] p-5 text-white max-[900px]:block"><div className="flex items-center justify-between"><p className="text-[14px] font-bold">Progresso da análise</p><p className="text-[12px] text-white/75">{progress}% concluído</p></div><div className="mt-3 h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-[#eb001a]" style={{ width: `${progress}%` }} /></div></div>
          <div><h1 id="analysis-title" className="font-poppins text-[clamp(24px,3vw,42px)] font-bold leading-tight"><span className="text-[#eb001a]">Diagnóstico</span> do seu negócio</h1><div className="mt-3 flex items-center gap-2 text-[18px] font-semibold"><FormIcon icon={formIconName(selectedForm)} className="h-5 w-5" />{selectedForm.title}</div><p className="mt-6 max-w-[620px] text-[14px] leading-[1.8] text-[#5f6672]">Responda às perguntas abaixo para que possamos entender melhor seu negócio e identificar as melhores oportunidades de crescimento.</p></div>
          <div className="mt-12 flex items-center justify-between"><h2 className="text-[24px] font-bold">{step.title}</h2><span className="text-[13px] font-medium text-[#3c424d]">{currentStep + 1} de {steps.length}</span></div>
          <div className="mt-6 space-y-5">{fields.map((field, index) => <Field key={fieldKey(field)} field={field} value={answers[fieldKey(field)]} error={errors[fieldKey(field)]} onChange={onAnswer} fieldIndex={index} />)}</div>
          <div className="mt-8 flex gap-3 max-[520px]:flex-col"><button type="button" onClick={onBack} className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-md border border-[#e0e3e8] bg-white px-5 text-[14px] font-semibold"><ArrowLeft className="h-4 w-4" />Voltar</button><button type="button" onClick={onNext} disabled={submitting} className="inline-flex h-12 flex-1 cursor-pointer items-center justify-center gap-3 rounded-md bg-[#e60018] px-6 text-[14px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Enviando...' : currentStep === steps.length - 1 ? 'Finalizar' : 'Continuar'}<ArrowRight className="h-4 w-4" /></button></div>
        </section>
        <aside className="space-y-10 max-[900px]:hidden"><InfoCard title="Por que estas perguntas?" items={['Oportunidades específicas do seu setor', 'Desafios do seu mercado', 'Estratégias mais eficazes para seu negócio', 'Benchmarks do seu segmento']} /><div className="rounded-md bg-[#f5f5f5] p-6"><Lock className="h-7 w-7 text-[#111318]" /><h3 className="mt-4 text-[15px] font-bold">Segurança dos dados</h3><p className="mt-2 text-[12px] leading-[1.65] text-[#5f6672]">Suas informações estão 100% seguras e são utilizadas apenas para gerar seu diagnóstico personalizado.</p></div></aside>
      </section>
      <Footer />
    </main>
  )
}

function InfoCard({ title, items }) {
  return <div className="rounded-md bg-[#f5f5f5] p-6"><h3 className="text-[14px] font-bold">{title}</h3><p className="mt-3 text-[12px] leading-[1.65] text-[#5f6672]">Suas respostas nos ajudam a entender a realidade da sua empresa e identificar:</p><ul className="mt-5 space-y-4">{items.map((item) => <li key={item} className="flex gap-3 text-[12px] leading-[1.5]"><Check className="mt-0.5 h-3.5 w-3.5 flex-none" />{item}</li>)}</ul></div>
}

function scrollAnalysisTop() {
  if (typeof window === 'undefined') return
  window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
}

function ResultScreen({ selectedSegment, onRestart }) {
  return <main className="bg-white text-[#111318]"><QuizHeader /><Stepper stage="result" selectedSegment={selectedSegment} light /><section className="mx-auto max-w-[1180px] px-8 pb-20 pt-8"><div className="mx-auto max-w-[820px] text-center"><div className="mx-auto grid h-[72px] w-[72px] place-items-center rounded-full bg-[#eb001a] text-white"><Check className="h-8 w-8" /></div><h1 id="analysis-title" className="font-poppins mt-8 text-[42px] font-bold leading-tight max-[720px]:text-[26px]">Recebemos suas respostas</h1><p className="mx-auto mt-4 max-w-[640px] text-[16px] leading-[1.8] text-[#5f6672]">Nossa equipe analisará seu caso e entraremos em contato em breve com os próximos passos.</p></div><div className="mt-9 flex justify-center"><button className="h-[54px] cursor-pointer rounded-md border border-[#e0e3e8] px-7 text-[14px] font-semibold" type="button" onClick={onRestart}>Refazer análise</button></div></section><Footer /></main>
}

export default function AnalisePage() {
  const [stage, setStage] = useState('segment')
  const [forms, setForms] = useState([])
  const [formsLoading, setFormsLoading] = useState(true)
  const [formsError, setFormsError] = useState('')
  const [selectedForm, setSelectedForm] = useState(null)
  const [answers, setAnswers] = useState({})
  const [errors, setErrors] = useState({})
  const [currentStep, setCurrentStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [adminData, setAdminData] = useState(null)

  useEffect(() => {
    let alive = true
    getPublicSitePage('content-analise').then((data) => alive && setAdminData(data)).catch(() => undefined)
    diagnosisService.listFormsWithDetails(true)
      .then((items) => { if (alive) { setForms(items.map(normalizePublicForm)); setFormsError('') } })
      .catch((error) => { console.warn(error); if (alive) setFormsError('Não foi possível carregar os segmentos da API.') })
      .finally(() => alive && setFormsLoading(false))
    return () => { alive = false }
  }, [])

  async function handleSegmentSelect(form) {
    setFormsError('')
    try {
      const detail = await diagnosisService.getForm(form.slug)
      setSelectedForm(normalizePublicForm({ ...form, ...detail }))
      setAnswers({})
      setErrors({})
      setCurrentStep(0)
      setStage('diagnostic')
      scrollAnalysisTop()
    } catch (error) {
      console.warn(error)
      setFormsError('Não foi possível carregar o formulário deste segmento.')
    }
  }

  function handleAnswer(key, value) {
    const nextValue = key === 'phone' ? maskPhone(value) : value
    setAnswers((current) => ({ ...current, [key]: nextValue }))
    setErrors((current) => ({ ...current, [key]: '' }))
  }

  function validateStep(step) {
    const nextErrors = {}
    fieldsForStep(step).forEach((field) => {
      const key = fieldKey(field)
      const value = String(answers[key] || '').trim()
      if (field.required && !value) {
        nextErrors[key] = 'Campo obrigatório.'
        return
      }
      if (key === 'email' && value && !isValidEmail(value)) {
        nextErrors[key] = 'Informe um e-mail válido.'
      }
      if (key === 'phone' && value && !isValidPhone(value)) {
        nextErrors[key] = 'Informe um telefone válido com DDD.'
      }
    })
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function submitDiagnosis() {
    if (!selectedForm) return
    const diagnosis = {}
    selectedForm.sections.forEach((section) => {
      diagnosis[section.key || section.id || section.title] = {}
      fieldsForStep(section).forEach((field) => { diagnosis[section.key || section.id || section.title][fieldKey(field)] = answers[fieldKey(field)] || '' })
    })
    setSubmitting(true)
    try {
      await diagnosisService.submitLead({
        formType: selectedForm.slug,
        name: answers.name || '',
        companyName: answers.companyName || '',
        phone: answers.phone || '',
        email: answers.email || '',
        city: answers.city || '',
        state: answers.state || '',
        segment: selectedForm.title,
        diagnosis,
      })
      setStage('result')
      scrollAnalysisTop()
    } catch (error) {
      console.warn(error)
      setErrors({ form: 'Não foi possível enviar suas respostas. Tente novamente.' })
    } finally {
      setSubmitting(false)
    }
  }

  function handleNext() {
    if (!selectedForm) return
    const steps = [contactStep, ...selectedForm.sections]
    const step = steps[currentStep]
    if (!validateStep(step)) return
    if (currentStep < steps.length - 1) {
      setCurrentStep((current) => current + 1)
      scrollAnalysisTop()
      return
    }
    submitDiagnosis()
  }

  function handleBack() {
    setErrors({})
    if (currentStep > 0) {
      setCurrentStep((current) => current - 1)
      scrollAnalysisTop()
      return
    }
    setStage('segment')
  }

  function handleJump(stepIndex) {
    setCurrentStep(stepIndex)
    scrollAnalysisTop()
  }

  function handleRestart() {
    setStage('segment')
    setSelectedForm(null)
    setAnswers({})
    setErrors({})
    setCurrentStep(0)
  }

  if (stage === 'segment') return <SegmentScreen adminData={adminData} onSelect={handleSegmentSelect} forms={forms} loading={formsLoading} error={formsError} />
  if (stage === 'result') return <ResultScreen selectedSegment={selectedForm?.title || ''} onRestart={handleRestart} />
  return selectedForm ? <DiagnosticScreen selectedForm={selectedForm} answers={answers} currentStep={currentStep} errors={errors} submitting={submitting} onAnswer={handleAnswer} onBack={handleBack} onJump={handleJump} onNext={handleNext} /> : null
}
