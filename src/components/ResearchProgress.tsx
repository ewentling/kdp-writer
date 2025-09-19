import React from 'react'
import type { ResearchProgress } from '@lib/research'

interface ResearchProgressProps {
  progress: ResearchProgress
  isVisible: boolean
}

export function ResearchProgress({ progress, isVisible }: ResearchProgressProps) {
  if (!isVisible) return null

  const progressPercentage = (progress.sourcesCompleted / progress.totalSources) * 100
  const resultsProgress = progress.resultsFound / (progress.totalSources * 100) * 100
  const summariesProgress = progress.summariesCompleted / (progress.totalSources * 100) * 100
  const masterProgress = progress.masterSummariesCompleted / progress.totalSources * 100

  return (
    <div className="bg-slate-800/60 rounded-2xl p-6 shadow-lg border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-sky-400">🔍 Comprehensive Research Pipeline</h3>
        <div className="text-sm text-slate-400">
          {progress.sourcesCompleted}/{progress.totalSources} Sources
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm text-slate-400">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Current Activity */}
      <div className="mb-4 p-3 bg-slate-900/50 rounded-lg">
        <div className="text-sm text-slate-300 mb-1">
          <span className="font-medium">Current Source:</span> {progress.currentSource}
        </div>
        <div className="text-sm text-slate-400">
          {progress.currentStep}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          ETA: {progress.estimatedTimeRemaining}
        </div>
      </div>

      {/* Detailed Progress Bars */}
      <div className="space-y-3">
        {/* Results Found */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-300">Results Found</span>
            <span className="text-xs text-slate-400">{progress.resultsFound.toLocaleString()}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(resultsProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Summaries Created */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-300">Summaries Created</span>
            <span className="text-xs text-slate-400">{progress.summariesCompleted.toLocaleString()}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-orange-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(summariesProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Master Summaries */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-300">Master Summaries</span>
            <span className="text-xs text-slate-400">{progress.masterSummariesCompleted}/{progress.totalSources}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${masterProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Research Sources Preview */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 mb-2">Research Sources:</div>
        <div className="flex flex-wrap gap-1">
          {[
            'Google Scholar', 'JSTOR', 'Wikipedia', 'BBC News', 'NY Times', 
            'The Guardian', 'Reuters', 'AP News', 'Statista', 'Pew Research',
            'World Bank', 'UN Data', 'Archives', 'YouTube', 'TED Talks',
            'C-SPAN', 'Khan Academy', 'Coursera', 'Gutenberg', 'Archive.org'
          ].map((source, index) => (
            <span
              key={source}
              className={`px-2 py-1 rounded text-xs ${
                index < progress.sourcesCompleted
                  ? 'bg-green-900/50 text-green-300'
                  : index === progress.sourcesCompleted
                  ? 'bg-blue-900/50 text-blue-300'
                  : 'bg-slate-900/50 text-slate-500'
              }`}
            >
              {source.split(' ')[0]}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
