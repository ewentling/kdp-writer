export function TweakingTab({ hasSaved, style, setStyle, kdpHtml, sample, topic, authorName, publisherName }: any) {
  // Generate KDP preview when style changes
  React.useEffect(() => {
    if (sample && hasSaved) {
      // This would trigger a re-render of the KDP preview
    }
  }, [style, sample, hasSaved])

  return (
    <div className={`${!hasSaved ? 'opacity-50 pointer-events-none select-none' : ''}`}>
      <div className="grid md:grid-cols-2 gap-4">
        {/* Style Controls */}
        <div className="bg-slate-800/60 rounded-2xl p-4 shadow space-y-3">
          <h3 className="font-semibold">Visual Style</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2"><label className="text-sm w-32">Font Family</label><select value={style.fontFamily} onChange={(e)=>setStyle({ ...style, fontFamily: e.target.value })} className="flex-1 rounded-lg bg-slate-900/60 border border-slate-700 px-2 py-1"><option value="serif">Serif</option><option value="sans-serif">Sans‑Serif</option></select></div>
            <div className="flex items-center gap-2"><label className="text-sm w-32">Font Size (pt)</label><input type="number" min={9} max={14} value={style.fontSizePt} onChange={(e)=>setStyle({ ...style, fontSizePt: parseInt(e.target.value||'11',10) })} className="w-28 rounded-lg bg-slate-900/60 border border-slate-700 px-2 py-1" /></div>
            <div className="flex items-center gap-2"><label className="text-sm w-32">Line Height</label><input type="number" step={0.05} min={1.2} max={2} value={style.lineHeight} onChange={(e)=>setStyle({ ...style, lineHeight: parseFloat(e.target.value||'1.5') })} className="w-28 rounded-lg bg-slate-900/60 border border-slate-700 px-2 py-1" /></div>
            <div className="flex items-center gap-2"><label className="text-sm w-32">Accent Color</label><input type="color" value={style.accentHex} onChange={(e)=>setStyle({ ...style, accentHex: e.target.value })} className="h-9 w-14 rounded border border-slate-700" /></div>
            <div className="flex items-center gap-2"><label className="text-sm w-32">Text Color</label><input type="color" value={style.textHex} onChange={(e)=>setStyle({ ...style, textHex: e.target.value })} className="h-9 w-14 rounded border border-slate-700" /></div>
          </div>
          <p className="text-xs text-slate-400">Changes update the KDP preview automatically.</p>
        </div>

        {/* KDP Preview */}
        <div className="bg-slate-800/60 rounded-2xl p-4 shadow">
          <h3 className="font-semibold mb-3">KDP Preview (6×9)</h3>
          {hasSaved && sample ? (
            <div className="border border-slate-600 rounded-lg overflow-hidden">
              <iframe
                srcDoc={kdpHtml}
                className="w-full h-96 border-0"
                title="KDP Preview"
                sandbox="allow-same-origin"
              />
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-slate-500 border border-slate-600 rounded-lg">
              <p>Complete research and writing to see KDP preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
