import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { useState, useEffect, useRef } from 'react'

interface ChartDataPoint {
  name: string
  value: number
}

interface ChartCardProps {
  title: string
  data: ChartDataPoint[]
}

export default function ChartCard({ title, data }: ChartCardProps) {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const chartGold = '#eb001a'

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return

      const width = Math.floor(entry.contentRect.width)
      const height = Math.floor(entry.contentRect.height)
      if (width > 0 && height > 0) {
        setChartSize((current) => (
          current.width === width && current.height === height ? current : { width, height }
        ))
      }
    })

    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const axisColor = isDark ? 'rgba(242, 237, 227, 0.38)' : '#9CA3AF'
  const gridColor = isDark ? 'rgba(196, 155, 60, 0.12)' : '#E5E7EB'

  return (
    <div className="bg-white dark:bg-[#111111] border border-[#eb001a]/12 dark:border-[#eb001a]/10 shadow-sm dark:shadow-none rounded-xl p-4 sm:p-6">
      <h3 className="text-[#111111]/60 dark:text-[#f1f2f4]/65 text-base font-medium mb-4 sm:mb-6">{title}</h3>

      <div ref={containerRef} className="w-full h-56 sm:h-72 lg:h-96 min-w-0">
        {chartSize.width > 0 && chartSize.height > 0 && (
          <BarChart width={chartSize.width} height={chartSize.height} data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: axisColor, fontSize: 12 }}
              axisLine={{ stroke: gridColor }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: axisColor, fontSize: 12 }}
              axisLine={{ stroke: gridColor }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#111111' : '#FFFFFF',
                border: `1px solid ${isDark ? 'rgba(196, 155, 60, 0.20)' : 'rgba(196, 155, 60, 0.25)'}`,
                borderRadius: '8px',
                padding: '8px 12px'
              }}
              labelStyle={{ color: isDark ? '#f1f2f4' : '#111111', fontWeight: 500 }}
              cursor={{ fill: isDark ? 'rgba(196, 155, 60, 0.08)' : 'rgba(196, 155, 60, 0.10)' }}
            />
            <Bar
              dataKey="value"
              fill={chartGold}
              radius={[4, 4, 0, 0]}
              name="Acessos por dia"
            />
          </BarChart>
        )}
      </div>
    </div>
  )
}
