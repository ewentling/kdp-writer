export function TitleList({ options, selected, onSelect }: { options: string[]; selected: string | null; onSelect: (t: string) => void; }) {
  return (
    <div className="space-y-2">
      {options.map((t, i) => (
        <div key={i} onClick={() => onSelect(t)} className={`px-3 py-2 rounded-xl border cursor-pointer ${selected === t ? 'bg-sky-600 border-sky-400' : 'bg-slate-900/60 border-slate-700'}`}>{t}</div>
      ))}
    </div>
  )
}
