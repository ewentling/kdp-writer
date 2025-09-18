import React, { Suspense, useEffect, useMemo, useState } from 'react'
import './index.css'
import type { TabKey, StyleSettings } from '@types'
import { Text } from '@lib/text'
import { Titles } from '@lib/titles'
import { Images } from '@lib/images'
import { ProgressPanel } from '@components/ProgressPanel'
import { runSmoke } from '@dev/smokeTests'

const ResearchTab = React.lazy(() => import('@tabs/ResearchTab').then(m => ({ default: m.ResearchTab })))
const WritingTab  = React.lazy(() => import('@tabs/WritingTab').then(m => ({ default: m.WritingTab })))
const ImagesTab   = React.lazy(() => import('@tabs/ImagesTab').then(m => ({ default: m.ImagesTab })))
const TweakingTab = React.lazy(() => import('@tabs/TweakingTab').then(m => ({ default: m.TweakingTab })))
const ExportTab   = React.lazy(() => import('@tabs/ExportTab').then(m => ({ default: m.ExportTab })))

const TAB_LABELS: Record<TabKey, string> = {
  research: 'Researcher',
  writing: 'Writing',
  images: 'Images',
  tweaking: 'Tweaking',
  export: 'Export',
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('research')
  const [hasSaved, setHasSaved] = useState(false)

  const [mode, setMode] = useState<'single'|'batch'>('single')
  const [topic, setTopic] = useState('')
  const [batchText, setBatchText] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [publisherName, setPublisherName] = useState('')
  const [isFiction, setIsFiction] = useState(false)
  const [tonePct, setTonePct] = useState(50)
  const [speedMode, setSpeedMode] = useState(false)
  const [wordTarget, setWordTarget] = useState(1100)

  const [titleOptions, setTitleOptions] = useState<string[]>([])
  const [selectedTitle, setSelectedTitle] = useState<string|null>(null)
  const [outline, setOutline] = useState<string[]>([])
  const [sample, setSample] = useState('')
  const [status, setStatus] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [heartbeat, setHeartbeat] = useState('')
  const [kdpHtml, setKdpHtml] = useState('')

  const [coverFrontSvg, setCoverFrontSvg] = useState('')
  const [coverBackSvg, setCoverBackSvg] = useState('')
  const [interiors, setInteriors] = useState<string[]>([])
  const [interiorCount, setInteriorCount] = useState(3)

  const [style, setStyle] = useState<StyleSettings>({ fontFamily:'serif', fontSizePt:11, lineHeight:1.5, accentHex:'#0ea5e9', textHex:'#111827' })

  const hasSubject = useMemo(()=> topic.trim().length>0, [topic])
  const hasTitles = titleOptions.length>0

  useEffect(()=>{ if(!isRunning) return; const id=setInterval(()=> setHeartbeat(`Heartbeat: ${new Date().toLocaleTimeString()}`), 5000); return ()=>clearInterval(id); }, [isRunning])
  useEffect(()=>{ if(!hasSaved || !sample) return; const first = Text.firstPageMarkdown(sample, 400); setKdpHtml(Text.makeKdpPage(first, style, topic, authorName, publisherName)); }, [style, authorName, publisherName, topic, hasSaved, sample])
  useEffect(()=>{ runSmoke() }, [])

  const addStatus = (s:string)=> setStatus(v=>[...v,s])
  const tick = ()=> new Promise(r=> setTimeout(r, speedMode?200:600))
  const resetOutputs = ()=>{ setOutline([]); setSample(''); setStatus([]); setProgress(0); setKdpHtml(''); setHeartbeat(''); }
  const resetAll = ()=>{ resetOutputs(); setTopic(''); setBatchText(''); setTitleOptions([]); setSelectedTitle(null); setAuthorName(''); setPublisherName(''); setIsFiction(false); setTonePct(50); setSpeedMode(False); setWordTarget(1100); setCoverFrontSvg(''); setCoverBackSvg(''); setInteriors([]); setInteriorCount(3); setHasSaved(False); setActiveTab('research'); }

  const onGenerateTitles = ()=>{ const s = Titles.suggestTitles(topic); setTitleOptions(s); setSelectedTitle(null); }
  const onSelectTitle = (t:string)=>{ setSelectedTitle(prev=> prev===t ? null : t); setTonePct(Titles.toneFromTitle(t)); }

  const canSaveCore = useMemo(()=> mode==='single' ? hasSubject : batchText.trim().length>0, [mode, hasSubject, batchText])
  const writeChapter = (title:string, subj:string, target=300)=> Text.composeChapterPure({ title, subject:subj, targetWords:target, fiction:isFiction, tonePct })

  async function runPipeline(subject:string){
    resetOutputs(); setIsRunning(true); addStatus(`Starting: "${subject}"`)
    setProgress(20); addStatus('Creating outline...')
    const candidate = selectedTitle || titleOptions[0] || subject || 'Untitled'
    const derived = Titles.deriveOutlineFromTitle(candidate, subject, isFiction); setOutline(derived); await tick()

    setProgress(60); addStatus('Drafting sample chapter...')
    const words = speedMode?350:wordTarget; const chosen = selectedTitle || titleOptions[0] || derived[0] || candidate
    const ch0 = writeChapter(chosen, subject, words); setSample(ch0); await tick()

    setProgress(90); addStatus('Rendering page preview (first page)...')
    const first = Text.firstPageMarkdown(ch0, 400); setKdpHtml(Text.makeKdpPage(first, style, topic, authorName, publisherName)); await tick()

    setProgress(100); addStatus('Done.'); setIsRunning(false)
  }

  const handleSave = async ()=>{
    if(!canSaveCore || isRunning || !selectedTitle) return; setHasSaved(true); setActiveTab('writing')
    if(mode==='single'){ await runPipeline(topic.trim()); }
    else { const lines = batchText.split('\n').map(l=>l.trim()).filter(Boolean); if(!lines.length) return; setTopic(lines[0]); await runPipeline(lines[0]); setBatchText(lines.slice(1).join('\n')); }
  }

  const onGenCovers = ()=>{ const t = selectedTitle || titleOptions[0] || topic || 'Untitled'; setCoverFrontSvg(Images.coverSVG('front', t, authorName, publisherName, style)); setCoverBackSvg(Images.coverSVG('back', t, authorName, publisherName, style)); }
  const onClearCovers = ()=>{ setCoverFrontSvg(''); setCoverBackSvg(''); }
  const onGenInteriors = ()=>{ setInteriors(Array.from({length:Math.max(0, interiorCount)}, (_,i)=> Images.interiorSVG(i, style))); }
  const onClearInteriors = ()=> setInteriors([])

  async function onExport(){
    const title = selectedTitle || titleOptions[0] || topic || 'Untitled'
    const coverFrontPng = coverFrontSvg ? await Images.svgToPngArrayBuffer(coverFrontSvg, 1800, 2700) : null
    const coverBackPng  = coverBackSvg  ? await Images.svgToPngArrayBuffer(coverBackSvg, 1800, 2700)  : null
    const interiorsPng: ArrayBuffer[] = []
    for(const svg of interiors){ const buf = await Images.svgToPngArrayBuffer(svg, 1200, 800); interiorsPng.push(buf) }

    // Build docx here by delegating to the Export tab's button for UX; kept simple.
    // (ExportTab doesn't need props beyond onExport to keep separation.)
    // Using onExport directly for now.
    const { Document, Packer, Paragraph, HeadingLevel, TextRun, ImageRun } = await import('docx')

    const docParas: any[] = []
    docParas.push(new Paragraph({ text: title, heading: HeadingLevel.TITLE }))
    if (authorName) docParas.push(new Paragraph({ text: `Author: ${authorName}` }))
    if (publisherName) docParas.push(new Paragraph({ text: `Publisher: ${publisherName}` }))
    docParas.push(new Paragraph({ text: '' }))

    if(outline?.length){ docParas.push(new Paragraph({ text: 'Outline', heading: HeadingLevel.HEADING_1 })); outline.forEach(o=>docParas.push(new Paragraph({ text: `• ${o}` }))) }
    if(sample){ docParas.push(new Paragraph({ text: 'Sample Chapter', heading: HeadingLevel.HEADING_1 })); sample.split(/\n{2,}/).forEach(blk=>docParas.push(new Paragraph({ children:[new TextRun(blk)] }))) }

    const imgParas: any[] = []
    if(coverFrontPng || coverBackPng || interiorsPng.length){
      imgParas.push(new Paragraph({ text: 'Images', heading: HeadingLevel.HEADING_1 }))
      if(coverFrontPng) { imgParas.push(new Paragraph({ children:[ new ImageRun({ data: coverFrontPng, transformation:{ width:450, height:675 } }) ] })); imgParas.push(new Paragraph({ text: 'Front Cover' })) }
      if(coverBackPng)  { imgParas.push(new Paragraph({ children:[ new ImageRun({ data: coverBackPng, transformation:{ width:450, height:675 } }) ] })); imgParas.push(new Paragraph({ text: 'Back Cover' })) }
      interiorsPng.forEach((buf, i)=>{ imgParas.push(new Paragraph({ children:[ new ImageRun({ data: buf, transformation:{ width:500, height:333 } }) ] })); imgParas.push(new Paragraph({ text: `Figure ${i+1}` })) })
    }

    const doc = new Document({ sections: [{ properties: {}, children: [...docParas, ...imgParas] }] })
    const blob = await Packer.toBlob(doc)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `${title.replace(/[^a-z0-9\-\s]/gi,'_') || 'book'}.docx`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Book Researcher & Writer — Live Preview</h1>
        <p className="text-slate-300 mb-6">Subject is required. Generate titles, select one, then <span className="font-semibold">Save</span> to enable other tabs.</p>

        <div className="flex gap-2 mb-4 flex-wrap">
          {(['research','writing','images','tweaking','export'] as TabKey[]).map((tab)=>{ const disabled = tab!=='research' && !hasSaved; return (
            <button key={tab} disabled={disabled} className={`px-3 py-1.5 rounded-xl border ${activeTab===tab?'bg-sky-600 border-sky-400':'border-slate-600'} ${disabled?'opacity-50 cursor-not-allowed':''}`} onClick={()=>!disabled && setActiveTab(tab)} title={disabled? 'Save on Researcher to enable':''}>
              {TAB_LABELS[tab]}
            </button>
          ); })}
        </div>

        <Suspense fallback={<div className="text-slate-400">Loading…</div>}>
          {activeTab==='research' && (
            <ResearchTab
              mode={mode} setMode={setMode}
              topic={topic} setTopic={setTopic} hasSubject={hasSubject}
              batchText={batchText} setBatchText={setBatchText}
              authorName={authorName} setAuthorName={setAuthorName}
              publisherName={publisherName} setPublisherName={setPublisherName}
              isFiction={isFiction} setIsFiction={setIsFiction}
              tonePct={tonePct} setTonePct={setTonePct}
              speedMode={speedMode} setSpeedMode={setSpeedMode}
              wordTarget={wordTarget} setWordTarget={setWordTarget}
              titleOptions={titleOptions} hasTitles={hasTitles} selectedTitle={selectedTitle}
              onGenerateTitles={onGenerateTitles}
              onSelectTitle={onSelectTitle}
              canSave={ (mode==='single'? hasSubject : batchText.trim().length>0) && !!selectedTitle }
              isRunning={isRunning}
              onSave={handleSave}
              onReset={()=>{ setHasSaved(false); setActiveTab('research'); setSelectedTitle(null); setTitleOptions([]); setOutline([]); setSample(''); setKdpHtml('') }}
            >
              <ProgressPanel heartbeat={heartbeat} progress={progress} status={status} />
            </ResearchTab>
          )}

          {activeTab==='writing' && (
            <WritingTab hasSaved={hasSaved} isRunning={isRunning} outline={outline} sample={sample} kdpHtml={kdpHtml} />
          )}

          {activeTab==='images' && (
            <ImagesTab
              hasSaved={hasSaved}
              coverFrontSvg={coverFrontSvg}
              coverBackSvg={coverBackSvg}
              interiors={interiors}
              interiorCount={interiorCount}
              setInteriorCount={setInteriorCount}
              onGenCovers={onGenCovers}
              onClearCovers={onClearCovers}
              onGenInteriors={onGenInteriors}
              onClearInteriors={onClearInteriors}
            />
          )}

          {activeTab==='tweaking' && (
            <TweakingTab hasSaved={hasSaved} style={style} setStyle={setStyle} />
          )}

          {activeTab==='export' && (
            <ExportTab hasSaved={hasSaved} onExport={onExport} />
          )}
        </Suspense>
      </div>
    </div>
  )
}
