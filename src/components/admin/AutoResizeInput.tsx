import { useEffect, useRef } from 'react'

type AutoResizeInputProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'rows'>

export function AutoResizeInput({ value, className, onChange, ...props }: AutoResizeInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    props.onKeyDown?.(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e)
  }

  return (
    <textarea
      ref={ref}
      value={value}
      rows={1}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className={`resize-none overflow-hidden ${className ?? ''}`}
      {...props}
    />
  )
}