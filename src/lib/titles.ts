import { Text } from './text'

const toneFromTitle = (title: string) => {
  const t = title || ''
  if (/(Guide|Handbook|Companion|Made Simple|for Beginners|How to|Basics|Starter|Pocket)/i.test(t)) return 78
  if (/(Stories|Secrets|Journey|Adventures|Little Moments|Tales|Reflections|Memoir|Chronicles)/i.test(t)) return 22
  return 50
}

const deriveOutlineFromTitle = (title: string, subject: string, fiction: boolean) => {
  if (fiction) return [
    'Opening Scene','Character Introductions','Rising Action','Conflict & Obstacles','Climax','Falling Action','Resolution'
  ]
  const s = Text.safeClean(subject) || 'the topic'; const t = title || ''
  if (/(Guide|Handbook|Companion|Made Simple|for Beginners|How to|Basics|Starter|Pocket)/i.test(t)) return [
    `Introduction to ${s}`,'Quick Start','Tools & Materials','Core Techniques','Practice Exercises','Common Mistakes & Fixes','Checklists','Care & Maintenance','Next Steps'
  ]
  if (/(Stories|Secrets|Journey|Adventures|Little Moments|Tales|Reflections|Memoir|Chronicles)/i.test(t)) return [
    `Why ${s} Matters`,'First Encounters','Learning the Hard Way','Little Anecdotes','Community Voices','Rituals & Habits','Reflections','Keeping the Spark Alive'
  ]
  return [
    'Introduction','History & Background','Tools & Materials','Getting Started','Tips & Techniques','Enjoyment & Community','Challenges & How to Overcome Them','Memorable Experiences','Conclusion & Next Steps'
  ]
}

const suggestTitles = (subject: string) => {
  const base = subject.trim(); let clean = Text.safeClean(base); if (!clean) clean = 'Your Topic'
  const starters = ['Guide to','Adventures in','The World of','Discovering','Everyday Joys of','Pocket Handbook:','Little Moments of','Beginner’s Companion to']
  const enders = ['for Beginners','Made Simple','That Bring Joy','A Friendly Start','Without the Jargon','Tips, Tales, and How-Tos','A Gentle Introduction']
  const seen = new Set<string>(); const out: string[] = []; let guard = 0
  while (out.length < 5 && guard < 50) {
    guard++
    const s = starters[Math.floor(Math.random() * starters.length)]
    const e = enders[Math.floor(Math.random() * enders.length)]
    const p = Math.random()
    const cand = p < 0.33 ? `${clean}` : p < 0.66 ? `${s} ${clean}` : `${clean} — ${e}`
    const title = cand.replace(/\s+—\s+$/, '').trim()
    if (title && !seen.has(title)) { seen.add(title); out.push(title) }
  }
  return out
}

export const Titles = { toneFromTitle, deriveOutlineFromTitle, suggestTitles }
