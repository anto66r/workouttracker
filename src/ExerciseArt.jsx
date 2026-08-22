/*
 * Illustration per exercise type.
 *
 * Preferred source: drop an image file into public/exercise-art/<type>.<ext>
 * (e.g. public/exercise-art/running.png) and it will be picked up
 * automatically — no code change needed. Supported extensions are tried in
 * order (see IMAGE_EXTS below).
 *
 * Any exercise type without a matching file falls back to a small
 * hand-drawn placeholder sketch defined below.
 */

import { useState, useEffect } from 'react'

const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'webp', 'svg']

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

// Thinner secondary strokes: ground lines, equipment, muscle hints
const hint = { ...stroke, strokeWidth: 1.6, opacity: 0.55 }

const ART = {
  running: (
    <>
      <circle cx="41" cy="13" r="5" {...stroke} />
      <path d="M38 19 L29 34" {...stroke} />
      <path d="M37 22 L47 19 L51 26" {...stroke} />
      <path d="M37 24 L28 29 L23 23" {...stroke} />
      <path d="M29 34 L39 41 L37 53" {...stroke} />
      <path d="M29 34 L20 44 L25 52" {...stroke} />
      <path d="M8 57 L26 57 M34 57 L56 57" {...hint} />
    </>
  ),

  bike: (
    <>
      <circle cx="15" cy="45" r="10" {...hint} />
      <circle cx="49" cy="45" r="10" {...hint} />
      <path d="M15 45 L27 30 L41 30 L49 45 M27 30 L33 45 M24 27 L31 28 M41 30 L46 26" {...hint} />
      <circle cx="39" cy="13" r="4.5" {...stroke} />
      <path d="M37 18 L31 27" {...stroke} />
      <path d="M36 20 L45 26" {...stroke} />
      <path d="M31 27 L33 38 M31 27 L27 37" {...stroke} />
    </>
  ),

  rowing: (
    <>
      <path d="M6 55 L58 55 M28 47 L28 55 M21 47 L35 47" {...hint} />
      <circle cx="10" cy="34" r="6" {...hint} />
      <path d="M15 34 L24 34 M8 42 L14 54" {...hint} />
      <circle cx="44" cy="25" r="4.5" {...stroke} />
      <path d="M41 29 L30 44" {...stroke} />
      <path d="M39 31 L25 34" {...stroke} />
      <path d="M24 29 L24 39" {...stroke} />
      <path d="M30 45 L17 47 L13 53" {...stroke} />
    </>
  ),

  elliptical: (
    <>
      <circle cx="12" cy="42" r="9" {...hint} />
      <path d="M14 44 L48 50" {...hint} />
      <path d="M16 44 L26 15 M20 46 L41 22" {...hint} />
      <circle cx="34" cy="17" r="4.5" {...stroke} />
      <path d="M34 22 L34 36" {...stroke} />
      <path d="M34 25 L27 18 M34 27 L40 25" {...stroke} />
      <path d="M34 36 L28 47 M34 36 L40 45" {...stroke} />
      <path d="M24 48 L32 48 M36 46 L44 46" {...hint} />
    </>
  ),

  plank: (
    <>
      <path d="M6 55 L58 55" {...hint} />
      <circle cx="50" cy="30" r="4.5" {...stroke} />
      <path d="M46 33 L12 48" {...stroke} />
      <path d="M12 48 L9 54" {...stroke} />
      <path d="M46 33 L41 49 L52 51" {...stroke} />
      <path d="M27 41 L23 47" {...hint} />
    </>
  ),

  crunches: (
    <>
      <path d="M6 55 L58 55" {...hint} />
      <path d="M22 53 L34 39 L45 53" {...stroke} />
      <path d="M22 53 L13 44" {...stroke} />
      <circle cx="9" cy="38" r="4.5" {...stroke} />
      <path d="M13 44 L12 37" {...stroke} />
      <path d="M18 30 Q26 24 34 27" {...hint} />
    </>
  ),

  abs: (
    <>
      <path d="M20 11 C17 27 17 39 22 47 Q32 55 42 47 C47 39 47 27 44 11" {...stroke} />
      <path d="M32 15 L32 45" {...hint} />
      <path d="M23 22 L41 22 M23 30 L41 30 M24 38 L40 38" {...hint} />
    </>
  ),

  back: (
    <>
      <circle cx="15" cy="25" r="4.5" {...stroke} />
      <path d="M19 28 L40 33" {...stroke} />
      <path d="M40 33 L37 51 M40 33 L47 50" {...stroke} />
      <path d="M25 30 L25 42" {...stroke} />
      <path d="M17 43 L34 43" {...stroke} />
      <path d="M17 39 L17 47 M34 39 L34 47" {...hint} />
      <path d="M22 30 Q28 36 24 41 M33 32 Q37 37 33 42" {...hint} />
    </>
  ),

  lats: (
    <>
      <path d="M6 12 L58 12" {...stroke} />
      <path d="M22 14 L26 26 M42 14 L38 26" {...stroke} />
      <circle cx="32" cy="27" r="5" {...stroke} />
      <path d="M32 32 L32 44" {...stroke} />
      <path d="M32 44 L25 55 M32 44 L38 52" {...stroke} />
      <path d="M27 31 Q21 37 29 43 M37 31 Q43 37 35 43" {...hint} />
    </>
  ),

  chest: (
    <>
      <path d="M9 45 L55 45 M18 45 L14 55 M46 45 L50 55" {...hint} />
      <circle cx="15" cy="38" r="4.5" {...stroke} />
      <path d="M20 41 L44 41" {...stroke} />
      <path d="M28 39 L26 25 M38 39 L40 25" {...stroke} />
      <path d="M21 23 L47 23" {...stroke} />
      <path d="M21 19 L21 27 M47 19 L47 27" {...hint} />
      <path d="M25 36 Q30 32 34 37" {...hint} />
    </>
  ),

  shoulders: (
    <>
      <circle cx="32" cy="35" r="5" {...stroke} />
      <path d="M32 40 L32 54" {...stroke} />
      <path d="M28 36 L22 26 L20 17" {...stroke} />
      <path d="M36 36 L42 26 L44 17" {...stroke} />
      <path d="M14 17 L26 17 M38 17 L50 17" {...stroke} />
      <path d="M14 13 L14 21 M26 13 L26 21 M38 13 L38 21 M50 13 L50 21" {...hint} />
      <path d="M25 31 Q22 34 24 38 M39 31 Q42 34 40 38" {...hint} />
    </>
  ),

  biceps: (
    <>
      <circle cx="13" cy="47" r="5" {...stroke} />
      <path d="M15 43 L27 24" {...stroke} />
      <path d="M27 24 L42 38" {...stroke} />
      <circle cx="46" cy="42" r="4.5" {...stroke} />
      <path d="M17 37 Q25 21 33 30" {...stroke} />
    </>
  ),

  triceps: (
    <>
      <circle cx="23" cy="16" r="5" {...stroke} />
      <path d="M23 21 L23 46" {...stroke} />
      <path d="M24 25 L34 12" {...stroke} />
      <path d="M34 12 L27 25" {...stroke} />
      <path d="M22 22 L32 28" {...stroke} />
      <path d="M28 18 Q34 20 33 26" {...hint} />
      <path d="M23 46 L17 56 M23 46 L30 55" {...hint} />
    </>
  ),

  forearms: (
    <>
      <path d="M9 23 L38 26" {...stroke} />
      <path d="M9 37 L38 34" {...stroke} />
      <circle cx="44" cy="30" r="6" {...stroke} />
      <path d="M44 12 L44 48" {...hint} />
      <path d="M40 12 L48 12 M40 48 L48 48" {...hint} />
      <path d="M15 27 Q22 30 15 33" {...hint} />
    </>
  ),

  glutes: (
    <>
      <circle cx="25" cy="14" r="5" {...stroke} />
      <path d="M23 19 L34 33" {...stroke} />
      <path d="M24 22 L13 27" {...stroke} />
      <path d="M34 33 L21 42 L24 54" {...stroke} />
      <path d="M17 55 L31 55" {...hint} />
      <path d="M35 30 Q43 36 34 41" {...stroke} />
    </>
  ),

  hamstrings: (
    <>
      <circle cx="13" cy="43" r="5" {...stroke} />
      <path d="M16 43 L43 44" {...stroke} />
      <path d="M43 44 L48 24" {...stroke} />
      <path d="M48 24 L55 22" {...stroke} />
      <path d="M18 48 Q30 55 41 48" {...stroke} />
      <path d="M6 50 L26 50" {...hint} />
    </>
  ),

  quads: (
    <>
      <path d="M8 39 L30 39 M8 39 L8 19" {...hint} />
      <circle cx="15" cy="13" r="4.5" {...stroke} />
      <path d="M15 18 L16 35" {...stroke} />
      <path d="M16 35 L36 35" {...stroke} />
      <path d="M36 35 L51 27 L56 24" {...stroke} />
      <circle cx="47" cy="30" r="3.5" {...hint} />
      <path d="M20 32 Q28 25 34 32" {...stroke} />
    </>
  ),

  calves: (
    <>
      <path d="M6 53 L58 53 M31 44 L56 44 L56 53" {...hint} />
      <path d="M27 7 L27 33" {...stroke} />
      <path d="M27 34 L34 44" {...stroke} />
      <path d="M27 34 L20 41" {...stroke} />
      <path d="M22 17 Q14 26 24 34" {...stroke} />
      <path d="M13 40 L13 26 M10 29 L13 26 L16 29" {...hint} />
    </>
  ),
}

const FALLBACK = (
  <>
    <path d="M12 32 L52 32" {...stroke} />
    <path d="M14 22 L14 42 M22 18 L22 46 M42 18 L42 46 M50 22 L50 42" {...stroke} />
  </>
)

function ExerciseSketch({ type, className }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      {ART[type] ?? FALLBACK}
    </svg>
  )
}

export default function ExerciseArt({ type, className }) {
  const [extIndex, setExtIndex] = useState(0)

  // Re-try from the first extension whenever the exercise type changes,
  // since a given instance of this component gets reused across renders.
  useEffect(() => setExtIndex(0), [type])

  if (extIndex >= IMAGE_EXTS.length) {
    return <ExerciseSketch type={type} className={className} />
  }

  return (
    <img
      key={type}
      src={`/exercise-art/${type}.${IMAGE_EXTS[extIndex]}`}
      alt=""
      className={className}
      role="presentation"
      aria-hidden="true"
      onError={() => setExtIndex(i => i + 1)}
    />
  )
}
