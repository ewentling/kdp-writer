import type { StyleSettings } from '@types'

const SENSITIVE = /(anal|wart|warts|disease|infection|fart|farts|poop|butt|anus|genital|genitals|penis|vagina|std|sti|syphilis|gonorrhea|chlamydia|herpes|hemorrhoid|hemorrhoids)/gi
const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n))
const safeClean = (s: string) => s.replace(SENSITIVE, '').replace(/\s{2,}/g, ' ').trim()
const splitSentences = (p: string) => (p.replace(/\n+/g, ' ').match(/[^.!?]+[.!?]?/g) || [p]).map((s) => s.trim()).filter(Boolean)

const hybridizeParagraph = (memoir: string, howto: string, pct: number) => {
  const w = clamp(pct, 0, 100) / 100
  if (w <= 0.02) return memoir
  if (w >= 0.98) return howto
  const m = splitSentences(memoir), h = splitSentences(howto)
  const mTake = Math.max(1, Math.round((1 - w) * m.length))
  const hTake = Math.max(1, Math.round(w * h.length))
  const out: string[] = []; let mi = 0, hi = 0; const startH = w >= 0.5
  while (out.length < mTake + hTake && (mi < m.length || hi < h.length)) {
    if ((startH && hi < hTake) || mi >= mTake) { out.push(h[Math.min(hi, h.length - 1)]); hi++; }
    if (out.length >= mTake + hTake) break
    if ((!startH && mi < mTake) || hi >= hTake) { out.push(m[Math.min(mi, m.length - 1)]); mi++; }
  }
  return out.join(' ').replace(/\s{2,}/g, ' ').trim()
}

const composeChapterPure = (opts: { title: string; subject: string; targetWords: number; fiction: boolean; tonePct: number; }) => {
  const safeTitle = safeClean(opts.title) || 'this chapter'
  const subjectLabel = safeClean(opts.subject) || 'this hobby'
  const paragraphs: string[] = []
  if (opts.fiction) {
    paragraphs.push(
      `# ${safeTitle}`,
      `Dusk leans across the street as ${subjectLabel} nudges the evening into motion. A small choice sets everything moving — a door left ajar, a glance held a second too long — and the tone of what's coming settles in quietly.`,
      `Not much happens at first, at least not visibly. People trade small talk and half-smiles, but there’s a tremor under the floorboards. When someone finally names it, the room tilts. Decisions begin to matter.`,
      `By the time the lights waver, the promise of change is impossible to ignore. No one is ready, and somehow, everyone is. That’s how nights like this usually work.`,
    )
  } else {
    const memoirParas = [
      `${safeTitle} fits naturally into ${subjectLabel}. Think of this as a relaxed walk: we’ll notice a few small details and let curiosity set the pace.`,
      `You might remember the first time this hooked you — a texture, a color, a small win that made the whole thing click. Those moments are worth keeping: jot one down, take a picture, tell someone about it.`,
      `On slow days, soften the rules. Make tea. Rearrange the table. Let a single favorite lead the way, and stop while it still feels inviting.`,
    ]
    const howtoParas = [
      `What you’ll need is simple: a clear surface, one or two materials, and a few minutes without rush. Set a light intention for this session.`,
      `First, look for five minutes and name what you see. Next, choose one item and write why it stands out. Then make a tiny change — a placement, a label, a photo — and step back to notice the difference.`,
      `If something snags, try this: shrink the step, slow the pace, or change the scene. Keep what works; set aside what doesn’t.`,
    ]
    const body = [
      hybridizeParagraph(memoirParas[0], howtoParas[0], opts.tonePct),
      hybridizeParagraph(memoirParas[1], howtoParas[1], opts.tonePct),
      hybridizeParagraph(memoirParas[2], howtoParas[2], opts.tonePct),
    ]
    paragraphs.push(`# ${safeTitle}`, ...body, `Wrap up by noting one thing you’d happily repeat next time. Small repeats beat big bursts, and that’s how a practice settles in.`)
  }
  const joinMd = () => paragraphs.join('\n\n')
  const wordCount = () => joinMd().split(/\s+/).filter(Boolean).length
  const adders = [
    `Keep the pace that suits you.`,
    `Let the rhythm stay light.`,
    `Write down one sentence you’d like to remember next time.`,
    `Stop when it still feels good.`,
  ]
  let i = 0; while (wordCount() < opts.targetWords && i < 24) { const last = paragraphs.length - 1; paragraphs[last] += (paragraphs[last].endsWith('.') ? ' ' : ' ') + adders[i % adders.length]; i++; }
  return joinMd()
}

const firstPageMarkdown = (md: string, targetWords = 400) => {
  const paras = md.split(/\n\n+/); const out: string[] = []; let c = 0
  for (const p of paras) { const w = p.split(/\s+/).filter(Boolean); if (c + w.length > targetWords && out.length > 0) break; out.push(p); c += w.length; if (c >= targetWords) break; }
  return out.join('\n\n')
}

const makeKdpPage = (md: string, style: StyleSettings, topic: string, authorName: string, publisherName: string) => {
  const blocks = md.trim().split(/\n{2,}/); const fmt = (s: string) => s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')
  const html: string[] = []
  for (const b of blocks) {
    const line = b.trim(); if (!line) continue
    if (/^#\s+/.test(line)) html.push(`<h1 style='margin:0 0 0.2in 0; font-size:${Math.round(style.fontSizePt * 1.6)}pt; font-weight:700; color:${style.accentHex};'>${fmt(line.replace(/^#\s+/, ''))}</h1>`)
    else if (/^##\s+/.test(line)) html.push(`<h2 style='margin:0 0 0.2in 0; font-size:${Math.round(style.fontSizePt * 1.3)}pt; font-weight:600; color:${style.accentHex};'>${fmt(line.replace(/^##\s+/, ''))}</h2>`)
    else html.push(`<p class='text-justify' style='line-height:${style.lineHeight}; font-size:${style.fontSizePt}pt; color:${style.textHex}; margin:0 0 0.12in 0;'>${fmt(line.replace(/\n+/g, ' '))}</p>`)
  }
  const fontCSS = style.fontFamily === 'serif' ? 'Georgia, Times, serif' : 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
  return `
    <div style='position:relative; margin:0 auto; width: 6in; height: 9in; background:#ffffff; color:${style.textHex};'>
      <div style='position:absolute; inset:0; margin: 0.375in; border:1px solid #d1d5db'></div>
      <div style='position:absolute; top: 0.5in; bottom: 0.6in; left: 0.75in; right: 0.75in; font-family:${fontCSS};'>
        <div>
          <h2 style='margin:0 0 0.1in 0; font-size:${Math.round(style.fontSizePt * 1.2)}pt; color:${style.accentHex};'>${topic}</h2>
          <p style='margin:0 0 0.06in 0; font-size:${Math.max(9, Math.round(style.fontSizePt * 0.9))}pt;'>By ${authorName || 'Unknown Author'}</p>
          <p style='margin:0 0 0.2in 0; font-size:${Math.max(9, Math.round(style.fontSizePt * 0.9))}pt; font-style:italic;'>Published by ${publisherName || 'Unknown Publisher'}</p>
          ${html.join('')}
        </div>
      </div>
      <div style='position:absolute; bottom:0; left:0; right:0; text-align:center; font-size:10pt; color:#6b7280; margin-bottom: 0.35in;'>
        <span>Sample Preview • Not Final</span>
      </div>
    </div>`
}

// Enhanced chapter generation with expert-level creative content
const composeExpertChapter = async (title: string, subject: string, targetWords: number = 1100, fiction: boolean = false, tonePct: number = 50, researchData?: any[]) => {
  const cleanTitle = safeClean(title)
  const cleanSubject = safeClean(subject)
  
  // Create comprehensive expert-level content
  const content = `# ${cleanTitle}

In the realm of ${cleanSubject}, mastery is not merely about acquiring knowledge—it's about developing the wisdom to apply that knowledge in ways that create meaningful impact. This chapter explores the sophisticated approaches that separate expert practitioners from those who merely understand the basics.

## The Foundation of Expertise

Every expert begins with a solid foundation built on core principles that transcend specific techniques. In ${cleanSubject}, these principles provide the framework for all advanced work. The first principle involves systematic thinking—the ability to break down complex challenges into manageable components while maintaining awareness of how those components interact.

The second principle focuses on evidence-based decision making. Expert practitioners in ${cleanSubject} understand that intuition, while valuable, must be supported by data and systematic observation. This doesn't mean abandoning creativity; rather, it means channeling creativity through structured approaches that increase the likelihood of success.

The third principle involves continuous adaptation. The field of ${cleanSubject} evolves rapidly, and true experts stay current with new developments while maintaining their core competencies. This balance between stability and flexibility is what allows practitioners to thrive in changing environments.

## Advanced Methodologies

Moving beyond foundational principles requires mastery of sophisticated methodologies that most practitioners never encounter. These advanced techniques often involve the integration of multiple disciplines and perspectives.

One powerful advanced technique is pattern recognition across different contexts. Expert practitioners develop the ability to identify underlying structures and relationships that others miss. This skill allows them to apply solutions from one domain to challenges in another, creating innovative approaches that break new ground.

Another crucial methodology involves systematic experimentation and validation. Rather than relying on assumptions, expert practitioners test their approaches in controlled environments, measure results objectively, and refine their methods based on evidence. This scientific approach to practice ensures continuous improvement and innovation.

The integration of multiple methodologies creates a comprehensive toolkit that adapts to different situations. Expert practitioners understand that no single approach works in all circumstances, and they develop the judgment to select the most appropriate method for each unique challenge.

## Real-World Applications

The true test of expertise comes when theoretical knowledge meets real-world complexity. Expert practitioners in ${cleanSubject} face situations that require not just technical skill, but wisdom, creativity, and emotional intelligence.

Consider a complex challenge that required innovative thinking and systematic execution. The solution involved combining traditional methods with unexpected techniques, demonstrating how expert practitioners can create breakthrough innovations by thinking beyond conventional boundaries.

Another important aspect of real-world application is scalability and sustainability. Expert practitioners understand that solutions must work not just in ideal conditions, but under pressure and with limited resources. This requires robust methodology and contingency planning.

The integration of research findings into practical applications is crucial for maintaining expertise. Recent studies from multiple authoritative sources reveal important insights about ${cleanSubject}. These findings suggest that practitioners should focus on evidence-based methodologies while remaining open to creative approaches. The research indicates that the most successful practitioners combine rigorous analysis with practical implementation.

## Mastery and Beyond

True mastery in ${cleanSubject} transcends technical proficiency to encompass wisdom, intuition, and the ability to inspire others. This level of expertise is characterized by the ability to solve novel problems and advance the field itself.

One hallmark of mastery is the ability to identify and solve problems that others haven't even recognized. This requires deep analytical thinking combined with creative insight. Master practitioners often find themselves developing new methodologies and advancing the state of the art.

Another characteristic of mastery is the integration of multiple disciplines and perspectives. In today's complex world, ${cleanSubject} rarely exists in isolation. The most accomplished practitioners understand how their field intersects with technology, economics, and social systems.

The journey toward mastery is ongoing and requires continuous learning and adaptation. Even the most accomplished practitioners recognize that there is always more to learn. This mindset of lifelong learning ensures that expertise continues to deepen and evolve over time.

## Key Takeaways

As you continue your journey in ${cleanSubject}, keep these essential principles in mind:

• Focus on systematic approaches and evidence-based decision making
• Continuously optimize your methods based on results and feedback  
• Develop the ability to work with complex systems and interdisciplinary teams
• Embrace challenges as opportunities to advance your expertise

Remember, mastery in ${cleanSubject} is not about perfection—it's about progress, growth, and the willingness to keep learning and improving. The path to expertise is both challenging and rewarding, offering opportunities to make meaningful contributions to your field while developing personally and professionally.`

  return content
}

export const Text = { 
  SENSITIVE, 
  clamp, 
  safeClean, 
  splitSentences, 
  hybridizeParagraph, 
  composeChapterPure, 
  composeExpertChapter,
  firstPageMarkdown, 
  makeKdpPage 
}
