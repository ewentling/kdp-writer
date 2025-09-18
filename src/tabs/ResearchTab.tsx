import React from 'react'
import { TitleList } from '@components/TitleList'

export function ResearchTab(props: any) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2 bg-slate-800/60 rounded-2xl p-4 shadow space-y-3">
        <div className="flex items-center gap-3">
          <button className={`px-3 py-1.5 rounded-xl text-sm border ${props.mode==='single'?'bg-sky-600 border-sky-400':'border-slate-600'}`} onClick={()=>props.setMode('single')}>Single Subject</button>
          <button className={`px-3 py-1.5 rounded-xl text-sm border ${props.mode==='batch'?'bg-sky-600 border-sky-400':'border-slate-600'}`} onClick={()=>props.setMode('batch')}>Batch List</button>
          <div className="ml-auto flex items-center gap-2"><label className="text-sm">Speed</label><input type="checkbox" className="accent-sky-500" checked={props.speedMode} onChange={(e)=>props.setSpeedMode(e.target.checked)} /></div>
        </div>
        <div>
          <label className="text-sm mb-1 block">Subject <span className="text-rose-400">*</span></label>
          {props.mode==='single' ? (
            <input value={props.topic} onChange={(e)=>props.setTopic(e.target.value)} placeholder="e.g., Collecting for Fun" className={`w-full rounded-xl bg-slate-900/60 border px-3 py-2 ${props.hasSubject?'border-slate-700':'border-rose-500'}`} />
          ) : (
            <textarea value={props.batchText} onChange={(e)=>props.setBatchText(e.target.value)} placeholder="Enter one topic per line" rows={5} className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2" />
          )}
          {!props.hasSubject && props.mode==='single' && (<p className="text-xs text-rose-400 mt-1">Subject is required to generate titles.</p>)}
        </div>
        <input value={props.authorName} onChange={(e)=>props.setAuthorName(e.target.value)} placeholder="Author Name (optional)" className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2" />
        <input value={props.publisherName} onChange={(e)=>props.setPublisherName(e.target.value)} placeholder="Publisher Name (optional)" className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2" />
        <div className="flex items-center gap-2"><label className="text-sm">Fiction</label><input type="checkbox" className="accent-sky-500" checked={props.isFiction} onChange={(e)=>props.setIsFiction(e.target.checked)} /></div>
        <div className="flex items-center gap-3"><label className="text-sm whitespace-nowrap">Tone</label><input type="range" min={0} max={100} step={1} value={props.tonePct} onChange={(e)=>props.setTonePct(parseInt(e.target.value,10))} className="flex-1" /><span className="text-xs text-slate-300 w-40 text-right">Memoir 0% ↔ How‑To {props.tonePct}%</span></div>
        <div className="flex items-center gap-2">
          <button onClick={props.onGenerateTitles} disabled={!props.hasSubject || props.isRunning} className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-sm font-medium">{props.hasTitles? 'Regenerate Titles':'Generate Titles'}</button>
          {props.hasTitles && (<span className="text-xs text-slate-400">Select a title below to enable Save.</span>)}
        </div>
        {props.hasTitles && (
          <div className="mt-2">
            <h3 className="font-semibold mb-2">Suggested Titles <span className="text-xs text-slate-400">(single-select required)</span></h3>
            <TitleList options={props.titleOptions} selected={props.selectedTitle} onSelect={props.onSelectTitle} />
          </div>
        )}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2"><label className="text-sm">Words per chapter</label><input type="number" value={props.wordTarget} onChange={(e)=>props.setWordTarget(parseInt(e.target.value||'1100',10))} min={300} max={2000} className="w-28 rounded-lg bg-slate-900/60 border border-slate-700 px-2 py-1 text-right" /></div>
          <div className="flex items-center gap-2">{props.hasTitles && (<button onClick={props.onSave} disabled={!props.canSave || props.isRunning} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 font-medium shadow">{props.isRunning?'Saving...':'Save'}</button>)}<button onClick={props.onReset} disabled={props.isRunning} className="px-3 py-2 rounded-xl border border-slate-600 hover:bg-slate-800 disabled:opacity-50 text-sm">Reset</button></div>
        </div>
      </div>
      {props.children}
    </div>
  )
}
