import React from 'react';
import { Book, Compass, Highlighter, Search as SearchIcon, ChevronDown } from 'lucide-react';
import { BibleVersion } from '../types/bible';

interface TopNavbarProps {
  currentBook: string;
  currentChapter: number;
  currentVersion: BibleVersion;
  activeTab: 'read' | 'chart' | 'notes';
  onTabChange: (tab: 'read' | 'chart' | 'notes') => void;
  onOpenBookPicker: () => void;
  onOpenVersionPicker: () => void;
  onOpenSearch: () => void;
  isStudyMode: boolean;
  onToggleStudyMode: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentBook,
  currentChapter,
  currentVersion,
  activeTab,
  onTabChange,
  onOpenBookPicker,
  onOpenVersionPicker,
  onOpenSearch,
  isStudyMode,
  onToggleStudyMode
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => onTabChange('read')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif font-bold text-lg">
                ✝
              </span>
              <span className="font-serif text-xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors whitespace-nowrap">
                ScriptureArc
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
          <button
            onClick={() => onTabChange('read')}
            className={`transition-colors whitespace-nowrap pb-0.5 hover:text-white ${
              activeTab === 'read' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
            }`}
          >
            Read Scripture
          </button>
          <button
            onClick={() => onTabChange('chart')}
            className={`transition-colors whitespace-nowrap pb-0.5 hover:text-white flex items-center gap-1.5 ${
              activeTab === 'chart' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
            }`}
          >
            <span>63,779 Arcs Map</span>
          </button>
          <button
            onClick={() => onTabChange('notes')}
            className={`transition-colors whitespace-nowrap pb-0.5 hover:text-white ${
              activeTab === 'notes' ? 'text-amber-400 border-b-2 border-amber-400 font-semibold' : ''
            }`}
          >
            Notes & Highlights
          </button>
          <button
            onClick={onOpenSearch}
            className="transition-colors whitespace-nowrap pb-0.5 hover:text-white flex items-center gap-1.5"
          >
            <SearchIcon className="w-3.5 h-3.5 text-stone-400" />
            <span>Search</span>
          </button>
        </nav>

        {/* Zone 3: Quick Passage & Version Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Book Selector */}
          <button
            onClick={onOpenBookPicker}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-stone-100 bg-stone-800 hover:bg-stone-700 active:bg-stone-600 rounded-lg border border-stone-700 transition-colors whitespace-nowrap"
            title="Choose Book and Chapter"
          >
            <span>{currentBook} {currentChapter}</span>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
          </button>

          {/* Quick Version Selector */}
          <button
            onClick={onOpenVersionPicker}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg border border-amber-500/30 transition-colors whitespace-nowrap"
            title="Switch Bible Translation"
          >
            <span>{currentVersion}</span>
            <ChevronDown className="w-3 h-3 text-amber-400" />
          </button>

          {/* Study Mode Quick Toggle */}
          <button
            onClick={onToggleStudyMode}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap hidden sm:flex items-center gap-1.5 ${
              isStudyMode
                ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                : 'bg-stone-800 text-stone-300 hover:text-white border border-stone-700'
            }`}
            title="Toggle Cross-Reference Study Mode"
          >
            <span>{isStudyMode ? 'Study Mode ON' : 'Study Mode'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
