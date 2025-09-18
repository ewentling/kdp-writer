import { Document, Packer, Paragraph, HeadingLevel, TextRun, ImageRun } from 'docx'

export function ExportTab({ hasSaved, onExport }: any) {
  return (
    <div className={`${!hasSaved ? 'opacity-50 pointer-events-none select-none' : ''}`}>
      <div className="bg-slate-800/60 rounded-2xl p-4 shadow space-y-3"><h3 className="font-semibold">Export</h3><p className="text-sm text-slate-300">Export the current title page, outline, and sample chapter to a <code>.docx</code> file suitable for KDP import. Generated covers and interior graphics are embedded as images.</p><div className="flex items-center gap-2"><button onClick={onExport} className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-sm font-medium">Export DOCX</button><span className="text-xs text-slate-400">Tip: generate Covers/Interiors in the Images tab first.</span></div></div>
    </div>
  )
}
