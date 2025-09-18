export function ProgressPanel({ heartbeat, progress, status }: { heartbeat: string; progress: number; status: string[]; }) {
  return (
    <div className="bg-slate-800/60 rounded-2xl p-4 shadow flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold">Pipeline</h2>
        <span className="text-xs text-slate-400">{heartbeat || 'Idle'}</span>
      </div>
      <div className="w-full h-3 bg-slate-900/60 rounded-full overflow-hidden mb-3">
        <div className="h-full bg-sky-500 transition-all" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
      </div>
      <div className="flex-1 overflow-auto space-y-2 pr-1">
        {status.map((s, i) => (<div key={i} className="text-sm text-slate-300">• {s}</div>))}
      </div>
    </div>
  )
}
