import { useState } from 'react'
import { dailyCalories } from './calories'

const W = 540, H = 160
const PAD = { top: 12, right: 8, bottom: 30, left: 40 }
const plotW = W - PAD.left - PAD.right
const plotH = H - PAD.top - PAD.bottom

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

  const barSlot = plotW / days.length
  const barW = barSlot * 0.6

  const niceMax = Math.ceil(maxVal / 100) * 100
  const yTicks = [0, Math.round(niceMax / 2), niceMax]

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
                <line
                  x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
                  stroke="#2d2a27" strokeWidth="1"
                />
                <text x={PAD.left - 5} y={y + 4} textAnchor="end" fill="#6b6560" fontSize="10">
                  {v}
                </text>
              </g>
            )
          })}

          {/* Bars */}
          {days.map((day, i) => {
            const val = values[i]
            const x = PAD.left + i * barSlot + (barSlot - barW) / 2
            const barH = val ? Math.max((val / niceMax) * plotH, 2) : 0
            const y = PAD.top + plotH - barH
            const dayData = calorieMap[day]
            const isEstimated = dayData?.hasEstimated && !dayData?.hasActual
            const isHovered = hovered === i

            const d = new Date(day + 'T12:00:00')
            const label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            const showLabel = i % 2 === 0 || i === days.length - 1

            return (
              <g
                key={day}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {val > 0 && (
                  <rect
                    x={x} y={y} width={barW} height={barH}
                    fill={isEstimated ? '#fb923c' : '#f97316'}
                    opacity={isHovered ? 1 : 0.85}
                    rx="2"
                  />
                )}
                {showLabel && (
                  <text
                    x={x + barW / 2}
                    y={PAD.top + plotH + 18}
                    textAnchor="middle"
                    fill="#6b6560"
                    fontSize="9.5"
                  >
                    {label}
                  </text>
                )}
                {isHovered && val > 0 && (
                  <text
                    x={x + barW / 2}
                    y={y - 5}
                    textAnchor="middle"
                    fill="#e2e8f0"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {val}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-dot" style={{ background: '#f97316' }} /> Logged
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ background: '#fb923c', opacity: 0.85 }} /> Estimated
          </span>
        </div>
      </div>
    </div>
  )
}
