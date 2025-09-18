import { describe, it, expect } from 'vitest'
import { Titles } from '@lib/titles'
import { Text } from '@lib/text'
import { Images } from '@lib/images'

describe('smoke', () => {
  it('suggestTitles produces 5 sanitized unique titles', () => {
    const a = Titles.suggestTitles('Anal Warts')
    expect(a).toHaveLength(5)
    expect(new Set(a).size).toBe(a.length)
    expect(a.every(t => !/anal|warts/i.test(t))).toBe(true)
  })

  it('toneFromTitle leans in correct directions', () => {
    expect(Titles.toneFromTitle('Guide to Baking')).toBeGreaterThan(50)
    expect(Titles.toneFromTitle('Stories from the Trail')).toBeLessThan(50)
    expect(Titles.toneFromTitle('A Thing')).toBe(50)
  })

  it('outline shape by title style', () => {
    const how = Titles.deriveOutlineFromTitle('Pocket Handbook: Gardening Made Simple','Gardening',false)
    expect(how).toContain('Quick Start')
    expect(how).toContain('Checklists')
    const mem = Titles.deriveOutlineFromTitle('Stories and Secrets of Coins','Coin Collecting',false)
    expect(mem).toContain('Little Anecdotes')
    expect(mem).toContain('Reflections')
  })

  it('composeChapterPure responds to tone', () => {
    const how = Text.composeChapterPure({ title:'Quick Start', subject:'Collecting for Fun', targetWords:160, fiction:false, tonePct:100 })
    expect(/First,|Next,|Then/.test(how)).toBe(true)
    const mem = Text.composeChapterPure({ title:'Why It Matters', subject:'Collecting for Fun', targetWords:160, fiction:false, tonePct:0 })
    expect(/remember|story|moments/i.test(mem)).toBe(true)
  })

  it('images utilities build SVG strings', () => {
    const c = Images.coverSVG('front','Title','Author','Pub',{ fontFamily:'serif', fontSizePt:11, lineHeight:1.5, accentHex:'#0ea5e9', textHex:'#111827' })
    expect(/^\s*<svg/.test(c)).toBe(true)
    const i = Images.interiorSVG(0,{ fontFamily:'serif', fontSizePt:11, lineHeight:1.5, accentHex:'#0ea5e9', textHex:'#111827' })
    expect(/Figure 1/.test(i)).toBe(true)
  })
})
