import { Titles } from '@lib/titles'
import { Text } from '@lib/text'
import { Images } from '@lib/images'

export function runSmoke() {
  const a = Titles.suggestTitles('Anal Warts')
  console.assert(a.length===5, 'Title generator should produce 5 suggestions')
  console.assert(a.every(t=>!/anal|warts/i.test(t)), 'Titles should be sanitized')
  console.assert(new Set(a).size === a.length, 'Suggestions should be unique')

  const howOutline = Titles.deriveOutlineFromTitle('Pocket Handbook: Gardening Made Simple','Gardening',false)
  console.assert(howOutline.includes('Quick Start') && howOutline.includes('Checklists'),'How‑To title → how‑to outline')
  const memOutline = Titles.deriveOutlineFromTitle('Stories and Secrets of Coins','Coin Collecting',false)
  console.assert(memOutline.includes('Little Anecdotes') && memOutline.includes('Reflections'),'Memoir title → memoir outline')

  console.assert(Titles.toneFromTitle('Guide to Baking')>50,'Guide tilts how‑to')
  console.assert(Titles.toneFromTitle('Stories from the Trail')<50,'Stories tilts memoir')
  console.assert(Titles.toneFromTitle('A Thing')===50,'Default tone is neutral (50)')

  const mid = Text.composeChapterPure({ title:'Blended', subject:'Collecting for Fun', targetWords:180, fiction:false, tonePct:50 })
  console.assert(/First,|Next,|Then/.test(mid) && /remember|story|moments/i.test(mid), 'Mid tone mixes')
  const chHow = Text.composeChapterPure({ title:'Quick Start', subject:'Collecting for Fun', targetWords:160, fiction:false, tonePct:100 })
  console.assert(/First,|Next,|Then/.test(chHow), 'How‑to tone step language')
  const chMem = Text.composeChapterPure({ title:'Why It Matters', subject:'Collecting for Fun', targetWords:160, fiction:false, tonePct:0 })
  console.assert(/remember|story|moments/i.test(chMem), 'Memoir tone reflective')

  const html = Text.makeKdpPage('# Title\n\nParagraph one.\n\nParagraph two.', { fontFamily:'serif', fontSizePt:11, lineHeight:1.5, accentHex:'#0ea5e9', textHex:'#111827' }, 'Topic','Author','Publisher')
  console.assert(html.includes('<p class=') , 'KDP HTML built')

  const csvg = Images.coverSVG('front','Title','Author','Pub',{ fontFamily:'serif', fontSizePt:11, lineHeight:1.5, accentHex:'#0ea5e9', textHex:'#111827' })
  console.assert(/^\s*<svg/.test(csvg), 'coverSVG returns SVG')
  const isvg = Images.interiorSVG(0,{ fontFamily:'serif', fontSizePt:11, lineHeight:1.5, accentHex:'#0ea5e9', textHex:'#111827' })
  console.assert(/Figure 1/.test(isvg), 'interiorSVG labels Figure 1')

  console.assert(!Text.safeClean('anal warts and more').toLowerCase().includes('anal'), 'safeClean strips sensitive terms')
}
