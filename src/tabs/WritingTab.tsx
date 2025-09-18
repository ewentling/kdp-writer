export function WritingTab({ hasSaved, isRunning, outline, sample, kdpHtml }: any) {
  return (
    <div className={`${!hasSaved ? 'opacity-50 pointer-events-none select-none' : ''}`}>
      <div className="mt-2 grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/60 rounded-2xl p-4 shadow"><h3 className="font-semibold mb-3">Outline</h3>{!hasSaved ? (<p className="text-slate-400 text-sm">Save on the Researcher tab to enable Writing.</p>) : isRunning ? (<p className="text-slate-400 text-sm">Generating outline…</p>) : !outline.length ? (<p className="text-slate-400 text-sm">No outline yet. Save on the Researcher tab.</p>) : (<ol className="list-decimal list-inside space-y-1">{outline.map((o: string, i: number)=>(<li key={i} className="text-sm">{o}</li>))}</ol>)}</div>
        <div className="bg-slate-800/60 rounded-2xl p-4 shadow"><h3 className="font-semibold mb-2">Sample Chapter</h3>{!hasSaved ? (<p className="text-slate-400 text-sm">Save on the Researcher tab to enable Writing.</p>) : isRunning ? (<p className="text-slate-400 text-sm">Drafting sample…</p>) : sample ? (<pre className="whitespace-pre-wrap text-sm leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-700 max-h-[50vh] overflow-auto">{sample}</pre>) : (<p className="text-slate-400 text-sm">No sample yet. Save on the Researcher tab.</p>)}</div>
      </div>
      <div className="mt-6 bg-slate-800/60 rounded-2xl p-4 shadow"><h3 className="font-semibold mb-3">KDP 6×9 Page Preview</h3>{!hasSaved ? (<p className="text-slate-400 text-sm">Save on the Researcher tab to enable Writing.</p>) : isRunning ? (<p className="text-slate-400 text-sm">Rendering preview…</p>) : kdpHtml ? (<div className="overflow-auto"><div dangerouslySetInnerHTML={{ __html: kdpHtml }} /></div>) : (<p className="text-slate-400 text-sm">Preview will appear here after you Save from the Researcher tab.</p>)}</div>
    </div>
  )
}
