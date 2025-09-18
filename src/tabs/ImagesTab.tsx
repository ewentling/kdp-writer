export function ImagesTab({ hasSaved, coverFrontSvg, coverBackSvg, interiors, interiorCount, setInteriorCount, onGenCovers, onClearCovers, onGenInteriors, onClearInteriors }: any) {
  const placeholderDiv = (t:string)=> `<div class=\"text-slate-400 text-sm\">${t}</div>`
  return (
    <div className={`${!hasSaved ? 'opacity-50 pointer-events-none select-none' : ''}`}>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800/60 rounded-2xl p-4 shadow">
          <h3 className="font-semibold mb-2">Covers</h3>
          <div className="flex gap-2 mb-2"><button onClick={onGenCovers} className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm">Generate Covers</button><button onClick={onClearCovers} className="px-3 py-1.5 rounded-lg border border-slate-600 text-sm">Clear</button></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-700 min-h-[260px]" dangerouslySetInnerHTML={{ __html: coverFrontSvg || placeholderDiv('Front cover will appear here.') }} />
            <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-700 min-h-[260px]" dangerouslySetInnerHTML={{ __html: coverBackSvg || placeholderDiv('Back cover will appear here.') }} />
          </div>
        </div>
        <div className="bg-slate-800/60 rounded-2xl p-4 shadow">
          <h3 className="font-semibold mb-2">Interior Graphics</h3>
          <div className="flex items-center gap-2 mb-2"><label className="text-sm">Count</label><input type="number" min={0} max={12} value={interiorCount} onChange={(e)=>setInteriorCount(parseInt(e.target.value||'0',10))} className="w-20 rounded-lg bg-slate-900/60 border border-slate-700 px-2 py-1" /><button onClick={onGenInteriors} className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm">Generate Interiors</button><button onClick={onClearInteriors} className="px-3 py-1.5 rounded-lg border border-slate-600 text-sm">Clear</button></div>
          {interiors.length===0 ? (<p className="text-slate-400 text-sm">No interior graphics yet.</p>) : (<div className="grid sm:grid-cols-2 gap-3">{interiors.map((svg:string,i:number)=>(<div key={i} className="bg-slate-900/60 p-2 rounded-xl border border-slate-700" dangerouslySetInnerHTML={{ __html: svg }} />))}</div>)}
        </div>
      </div>
    </div>
  )
}
