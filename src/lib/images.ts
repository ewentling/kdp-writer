import type { StyleSettings } from '@types'

  const coverSVG = (kind: 'front' | 'back', title: string, author: string, publisher: string, style: StyleSettings) => {
    const w = 1800, h = 2700; const bg = style.accentHex; const text = '#ffffff'; const subtitle = kind === 'front' ? '' : (publisher ? `\n${publisher}` : '\n')
    return `
<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>
  <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='${bg}'/><stop offset='100%' stop-color='#0b5f77'/></linearGradient></defs>
  <rect x='0' y='0' width='${w}' height='${h}' fill='url(#g)' />
  <text x='90' y='${kind === 'front' ? 420 : 540}' fill='${text}' font-family='${style.fontFamily === 'serif' ? 'Georgia, Times, serif' : 'Inter, system-ui, sans-serif'}' font-size='${kind === 'front' ? 110 : 72}' font-weight='700'>${title}</text>
  <text x='90' y='${kind === 'front' ? h - 300 : 840}' fill='${text}' font-family='${style.fontFamily === 'serif' ? 'Georgia, Times, serif' : 'Inter, system-ui, sans-serif'}' font-size='${kind === 'front' ? 64 : 54}' font-weight='500'>${author || ''}${subtitle}</text>
</svg>`
  }

  const interiorSVG = (idx: number, style: StyleSettings) => {
    const w = 1200, h = 800
    return `
<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>
  <rect x='0' y='0' width='${w}' height='${h}' fill='${style.textHex}11' stroke='${style.accentHex}'/>
  <text x='40' y='120' fill='${style.textHex}' font-family='${style.fontFamily === 'serif' ? 'Georgia, Times, serif' : 'Inter, system-ui, sans-serif'}' font-size='42' font-weight='600'>Figure ${idx + 1}</text>
  <text x='40' y='200' fill='${style.textHex}' font-size='28'>Placeholder illustration area</text>
</svg>`
  }

  const svgToPngArrayBuffer = async (svgMarkup: string, width: number, height: number): Promise<ArrayBuffer> => {
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' }); const url = URL.createObjectURL(blob)
    try {
      const img: HTMLImageElement = await new Promise((resolve, reject) => { const im = new Image(); im.onload = () => resolve(im); im.onerror = (e) => reject(e); im.src = url; })
      const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height; const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Canvas 2D not supported')
      ctx.drawImage(img, 0, 0, width, height)
      const pngBlob: Blob = await new Promise((res, rej) => canvas.toBlob((b) => b ? res(b) : rej(new Error('toBlob failed')), 'image/png'))
      return await pngBlob.arrayBuffer()
    } finally { URL.revokeObjectURL(url) }
  }

  export const Images = { coverSVG, interiorSVG, svgToPngArrayBuffer }
