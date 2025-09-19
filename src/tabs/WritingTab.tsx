import React, { useState } from 'react'

export function WritingTab({ 
  hasSaved, 
  isRunning, 
  outline, 
  sample, 
  chapters,
  selectedChapter,
  isEditingChapter,
  onSelectChapter,
  onEditChapter,
  onSaveChapter,
  onCancelEdit
}: any) {
  const [editContent, setEditContent] = useState(sample || '')

  React.useEffect(() => {
    setEditContent(sample || '')
  }, [sample])

  const handleSave = () => {
    onSaveChapter(editContent)
  }

  const handleCancel = () => {
    setEditContent(sample || '')
    onCancelEdit()
  }

  return (
    <div className={`${!hasSaved ? 'opacity-50 pointer-events-none select-none' : ''}`}>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Outline Panel */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800/60 rounded-2xl p-4 shadow">
            <h3 className="font-semibold mb-3">Chapter Outline</h3>
            {!hasSaved ? (
              <p className="text-slate-400 text-sm">Save on the Researcher tab to enable Writing.</p>
            ) : isRunning ? (
              <p className="text-slate-400 text-sm">Generating outline…</p>
            ) : !outline.length ? (
              <p className="text-slate-400 text-sm">No outline yet. Save on the Researcher tab.</p>
            ) : (
              <div className="space-y-2">
                {outline.map((chapter: string, i: number) => (
                  <div
                    key={i}
                    onClick={() => onSelectChapter(chapter)}
                    className={`p-3 rounded-lg cursor-pointer transition-all border ${
                      selectedChapter === chapter
                        ? 'bg-sky-600/20 border-sky-400 text-sky-300'
                        : 'bg-slate-900/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{i + 1}. {chapter}</span>
                      {selectedChapter === chapter && (
                        <span className="text-xs text-sky-400">●</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chapter Content Panel */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800/60 rounded-2xl p-4 shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">
                {selectedChapter ? selectedChapter : 'Chapter Content'}
              </h3>
              {selectedChapter && !isEditingChapter && (
                <button
                  onClick={onEditChapter}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
                >
                  Edit Chapter
                </button>
              )}
            </div>

            {!hasSaved ? (
              <p className="text-slate-400 text-sm">Save on the Researcher tab to enable Writing.</p>
            ) : isRunning ? (
              <p className="text-slate-400 text-sm">Generating expert content…</p>
            ) : sample ? (
              <div className="space-y-4">
                {isEditingChapter ? (
                  <div className="space-y-3">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full h-96 p-3 bg-slate-900/50 border border-slate-700 rounded-lg text-sm leading-relaxed resize-none"
                      placeholder="Edit chapter content..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 max-h-[60vh] overflow-auto">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                      {sample}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">No content yet. Save on the Researcher tab.</p>
            )}
          </div>
        </div>
      </div>

      {/* Chapter Statistics */}
      {hasSaved && sample && (
        <div className="mt-6 bg-slate-800/60 rounded-2xl p-4 shadow">
          <h3 className="font-semibold mb-3">Chapter Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <div className="text-slate-400">Word Count</div>
              <div className="text-xl font-semibold text-sky-400">
                {sample.split(' ').length.toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <div className="text-slate-400">Character Count</div>
              <div className="text-xl font-semibold text-green-400">
                {sample.length.toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <div className="text-slate-400">Paragraphs</div>
              <div className="text-xl font-semibold text-purple-400">
                {sample.split('\n\n').length}
              </div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg">
              <div className="text-slate-400">Chapters Generated</div>
              <div className="text-xl font-semibold text-orange-400">
                {Object.keys(chapters || {}).length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
