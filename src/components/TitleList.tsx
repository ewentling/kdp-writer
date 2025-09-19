// SEO analysis function (matches the one in titles.ts)
const analyzeTitleSEO = (title: string) => {
  const analysis = {
    length: title.length,
    hasPowerWords: /(Complete|Ultimate|Essential|Comprehensive|Expert|Professional|Advanced|Master|Secrets|Proven)/i.test(title),
    hasNumbers: /\d+/.test(title),
    hasHowTo: /how to/i.test(title),
    hasBenefits: /(Success|Results|Achieve|Master|Learn|Discover|Transform|Improve|Boost|Increase)/i.test(title),
    hasAudience: /(for Beginners|for Dummies|Made Simple|Step-by-Step|Easy|Quick Start|Complete Guide|Everything You Need)/i.test(title),
    hasUrgency: /(Now|Today|Fast|Quick|Instant|Immediate|Rush|Limited|Exclusive|Special)/i.test(title),
    hasEmotional: /(Amazing|Incredible|Unbelievable|Mind-Blowing|Life-Changing|Revolutionary|Breakthrough|Game-Changing)/i.test(title)
  }
  
  // Calculate SEO score (0-100) - same logic as titles.ts
  let score = 0
  if (analysis.length >= 30 && analysis.length <= 60) score += 20
  if (analysis.hasPowerWords) score += 15
  if (analysis.hasNumbers) score += 10
  if (analysis.hasHowTo) score += 15
  if (analysis.hasBenefits) score += 10
  if (analysis.hasAudience) score += 10
  if (analysis.hasUrgency) score += 10
  if (analysis.hasEmotional) score += 10
  
  return { ...analysis, score: Math.min(score, 100) }
}

export function TitleList({ options, selected, onSelect }: { options: string[]; selected: string | null; onSelect: (t: string) => void; }) {
  return (
    <div className="space-y-3">
      {options.map((title, i) => {
        const seo = analyzeTitleSEO(title)
        const scoreColor = seo.score >= 80 ? 'text-green-400' : seo.score >= 65 ? 'text-yellow-400' : 'text-orange-400'
        
        return (
          <div key={i} onClick={() => onSelect(title)} className={`px-4 py-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${selected === title ? 'bg-sky-600 border-sky-400' : 'bg-slate-900/60 border-slate-700 hover:border-slate-600'}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h4 className="font-medium text-sm leading-relaxed">{title}</h4>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                  <span className={`font-semibold ${scoreColor}`}>SEO Score: {seo.score}/100</span>
                  <span>Length: {seo.length} chars</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {seo.hasPowerWords && <span className="px-2 py-0.5 bg-blue-900/50 text-blue-300 text-xs rounded-full">Power Words</span>}
                  {seo.hasNumbers && <span className="px-2 py-0.5 bg-purple-900/50 text-purple-300 text-xs rounded-full">Numbers</span>}
                  {seo.hasHowTo && <span className="px-2 py-0.5 bg-green-900/50 text-green-300 text-xs rounded-full">How-To</span>}
                  {seo.hasBenefits && <span className="px-2 py-0.5 bg-emerald-900/50 text-emerald-300 text-xs rounded-full">Benefits</span>}
                  {seo.hasAudience && <span className="px-2 py-0.5 bg-orange-900/50 text-orange-300 text-xs rounded-full">Audience</span>}
                  {seo.hasUrgency && <span className="px-2 py-0.5 bg-red-900/50 text-red-300 text-xs rounded-full">Urgency</span>}
                  {seo.hasEmotional && <span className="px-2 py-0.5 bg-pink-900/50 text-pink-300 text-xs rounded-full">Emotional</span>}
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full mt-1 ${selected === title ? 'bg-white' : 'bg-slate-600'}`}></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
