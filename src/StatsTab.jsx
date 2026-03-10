import { useState } from 'react'
import { dailyCalories } from './calories'

const W = 540, H = 160
const PAD = { top: 12, right: 8, bottom: 30, left: 40 }
const plotW = W - PAD.left - PAD.right
const plotH = H - PAD.top - PAD.bottom

const COL_ACTUAL = '#3b82f6'
const COL_ESTIMATED = '#3f3f46'

export default function StatsTab({ workouts }) {
  const [hovered, setHovered] = useState(null)

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - 13 + i)
    return d.toISOString().slice(0, 10)
  })

  const calorieMap = dailyCalories(workouts)
  const values = days.map(d => calorieMap[d]?.kcal ?? 0)
  const maxVal = Math.max(...values, 200)
  const niceMax = Math.ceil(maxVal / 100) * 100
  const yTicks = [0, Math.round(niceMax / 2), niceMax]

  const barSlot = plotW / days.length
  const barW = barSlot * 0.6

  const totalKcal = values.reduce((a, b) => a + b, 0)
  const activeDays = values.filter(v => v > 0).length

  return (
    <div>
      <h2>Stats</h2>

      <div className="stats-summary">
        <div className="stat-box">
          <div className="stat-value">{workouts.length}</div>
          <div className="stat-label">Total Workouts</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{totalKcal.toLocaleString()}</div>
          <div className="stat-label">kcal (14 days)</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{activeDays}</div>
          <div className="stat-label">Active Days</div>
        </div>
      </div>

      <div className="card chart-card">
        <div className="chart-title">Daily Calorie Burn — last 14 days</div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
          {/* Grid lines + Y labels */}
          {yTicks.map(v => {
            const y = PAD.top + plotH - (v / niceMax) * plotH
            return (
              <g key={v}>
                <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#27272a" strokeWidth="1" />
                <text x={PAD.left - 5} y={y + 4} textAnchor="end" fill="#52525b" fontSize="10">{v}</text>
              </g>
            )
          })}

          {/* Stacked bars */}
          {days.map((day, i) => {
            const data = calorieMap[day]
            const total = data?.kcal ?? 0
            const actual = data?.actualKcal ?? 0
            const estimated = data?.estimatedKcal ?? 0
            const x = PAD.left + i * barSlot + (barSlot - barW) / 2
            const isHovered = hovered === i

            const totalH = total ? Math.max((total / niceMax) * plotH, 2) : 0
            const actualH = actual ? Math.max((actual / niceMax) * plotH, 2) : 0
            const estimatedH = estimated ? Math.max((estimated / niceMax) * plotH, 2) : 0

            const d = new Date(day + 'T12:00:00')
            const label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            const showLabel = i % 2 === 0 || i === days.length - 1

            // Tooltip content
            const tipLines = []
            if (actual) tipLines.push(`${actual} logged`)
            if (estimated) tipLines.push(`${estimated} est.`)

            return (
              <g key={day} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                {/* Estimated segment (bottom or full) */}
                {estimated > 0 && (
                  <rect
                    x={x}
                    y={PAD.top + plotH - estimatedH}
                    width={barW}
                    height={estimatedH}
                    fill={COL_ESTIMATED}
                    opacity={isHovered ? 1 : 0.9}
                    rx="2"
                  />
                )}
                {/* Actual segment (stacked on top) */}
                {actual > 0 && (
                  <rect
                    x={x}
                    y={PAD.top + plotH - totalH}
                    width={barW}
                    height={actualH}
                    fill={COL_ACTUAL}
                    opacity={isHovered ? 1 : 0.9}
                    rx="2"
                  />
                )}

                {showLabel && (
                  <text x={x + barW / 2} y={PAD.top + plotH + 18} textAnchor="middle" fill="#52525b" fontSize="9.5">
                    {label}
                  </text>
                )}

                {/* Hover tooltip */}
                {isHovered && total > 0 && (() => {
                  const tx = x + barW / 2
                  const ty = PAD.top + plotH - totalH - 6
                  const lineH = 13
                  const boxH = tipLines.length * lineH + 8
                  const boxW = 72
                  const bx = Math.min(Math.max(tx - boxW / 2, PAD.left), W - PAD.right - boxW)
                  return (
                    <g>
                      <rect x={bx} y={ty - boxH} width={boxW} height={boxH} fill="#27272a" rx="3" />
                      {tipLines.map((line, li) => (
                        <text
                          key={li}
                          x={bx + boxW / 2}
                          y={ty - boxH + 14 + li * lineH}
                          textAnchor="middle"
                          fill={li === 0 && actual ? COL_ACTUAL : '#a1a1aa'}
                          fontSize="10"
                          fontWeight="600"
                        >{line}</text>
                      ))}
                    </g>
                  )
                })()}
              </g>
            )
          })}
        </svg>

        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-dot" style={{ background: COL_ACTUAL }} /> Logged calories
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ background: COL_ESTIMATED }} /> Calculated
          </span>
        </div>
      </div>
    </div>
  )
}
