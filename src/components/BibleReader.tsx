import React, { useState, useEffect, useRef } from 'react';
import { BibleVerse, BibleVersion, HighlightColor, ReaderMode, UserHighlight, UserNote } from '../types/bible';
import { getVerseDisplay } from '../data/bibleText';
import { getCrossReferencesForVerse } from '../data/crossReferences';
import { VerseArcChart } from './VerseArcChart';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  Volume2, 
  VolumeX, 
  Search, 
  MoreHorizontal, 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Globe, 
  Bookmark, 
  Highlighter, 
  Share2, 
  Copy, 
  Check, 
  Type, 
  X,
  FileText
} from 'lucide-react';

interface BibleReaderProps {
  verses: BibleVerse[];
  currentBook: string;
  currentChapter: number;
  currentVersion: BibleVersion;
  readerMode: ReaderMode;
  onToggleReaderMode: () => void;
  onSelectVerseToStudy: (verse: BibleVerse) => void;
  selectedVerse: BibleVerse | null;
  onNavigateChapter: (direction: 'prev' | 'next') => void;
  highlights: UserHighlight[];
  onSetHighlight: (book: string, chapter: number, verse: number, color: HighlightColor | null) => void;
  notes: UserNote[];
  onOpenBookPicker: () => void;
  onOpenVersionPicker: () => void;
  onOpenSearch: () => void;
  onJumpToPassage: (bookName: string, chapter: number, verse: number) => void;
}

export const BibleReader: React.FC<BibleReaderProps> = ({
  verses,
  currentBook,
  currentChapter,
  currentVersion,
  readerMode,
  onToggleReaderMode,
  onSelectVerseToStudy,
  selectedVerse,
  onNavigateChapter,
  highlights,
  onSetHighlight,
  notes,
  onOpenBookPicker,
  onOpenVersionPicker,
  onOpenSearch,
  onJumpToPassage
}) => {
  // Typography State
  const [fontSize, setFontSize] = useState<number>(18);
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  // Audio Playback
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Stop audio when changing chapters
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  }, [currentBook, currentChapter]);

  const toggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Audio playback is not supported on this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const fullChapterText = verses.map(v => `Verse ${v.verse}. ${getVerseDisplay(v, currentVersion)}`).join(' ');
    const utterance = new SpeechSynthesisUtterance(fullChapterText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    speechUtteranceRef.current = utterance;
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const getHighlightClass = (color?: HighlightColor) => {
    switch (color) {
      case 'yellow': return 'bg-amber-400/25 text-amber-200 border-b-2 border-amber-400';
      case 'emerald': return 'bg-emerald-400/25 text-emerald-200 border-b-2 border-emerald-400';
      case 'cyan': return 'bg-cyan-400/25 text-cyan-200 border-b-2 border-cyan-400';
      case 'rose': return 'bg-rose-400/25 text-rose-200 border-b-2 border-rose-400';
      case 'amber': return 'bg-orange-400/25 text-orange-200 border-b-2 border-orange-400';
      default: return '';
    }
  };

  // Convert numbers to superscript format (like in YouVersion: ¹, ², ³)
  const toSuperscript = (num: number) => {
    const supers = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
    return num.toString().split('').map(d => supers[parseInt(d, 10)]).join('');
  };

  const selectedVerseRefs = selectedVerse 
    ? getCrossReferencesForVerse(selectedVerse.book, selectedVerse.chapter, selectedVerse.verse)
    : [];

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col min-h-screen text-zinc-100 pb-28 select-none">
      {/* Top Header matching Screenshot 1 */}
      <header className="sticky top-0 z-30 bg-[#121212]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-zinc-800/40">
        <div className="flex items-center gap-4">
          {/* Audio narration button */}
          <button
            onClick={toggleAudio}
            className={`p-1 text-zinc-300 hover:text-white transition-colors ${isPlayingAudio ? 'text-amber-400' : ''}`}
            title={isPlayingAudio ? 'Stop audio' : 'Listen to chapter'}
          >
            {isPlayingAudio ? <VolumeX className="w-5 h-5 text-amber-400" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Search button */}
          <button
            onClick={onOpenSearch}
            className="p-1 text-zinc-300 hover:text-white transition-colors"
            title="Search scripture"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Options / Typography */}
          <button
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            className="p-1 text-zinc-300 hover:text-white transition-colors"
            title="Reading options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* In-App PWA Install Prompt */}
          <PWAInstallButton />

          {/* Translation Picker Button (e.g. 🌐 KJV) */}
          <button
            onClick={onOpenVersionPicker}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/90 hover:bg-zinc-750 text-xs font-semibold text-zinc-200 border border-zinc-700/60 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span>{currentVersion}</span>
          </button>
        </div>
      </header>

      {/* Typography Options Flyout */}
      {showOptionsMenu && (
        <div className="mx-4 mt-2 p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl space-y-3 z-30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300">Reading Options</span>
            <button onClick={() => setShowOptionsMenu(false)} className="text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-300">
            <span>Font Size</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                className="px-2.5 py-1 rounded bg-zinc-800 font-bold"
              >
                A-
              </button>
              <span className="font-mono">{fontSize}px</span>
              <button 
                onClick={() => setFontSize(prev => Math.min(24, prev + 2))}
                className="px-2.5 py-1 rounded bg-zinc-800 font-bold"
              >
                A+
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-300">
            <span>Typeface</span>
            <div className="flex items-center gap-1 bg-zinc-800 p-0.5 rounded-lg">
              <button
                onClick={() => setFontFamily('serif')}
                className={`px-3 py-1 rounded font-serif text-xs ${fontFamily === 'serif' ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-400'}`}
              >
                Serif
              </button>
              <button
                onClick={() => setFontFamily('sans')}
                className={`px-3 py-1 rounded font-sans text-xs ${fontFamily === 'sans' ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-400'}`}
              >
                Sans
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-300 pt-1 border-t border-zinc-800">
            <span>Study Mode (Cross-References)</span>
            <button
              onClick={onToggleReaderMode}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                readerMode === 'study' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              {readerMode === 'study' ? 'Active' : 'Off'}
            </button>
          </div>
        </div>
      )}

      {/* Chapter Title Lockup matching Screenshot 1 */}
      <div className="pt-8 pb-6 text-center">
        <button
          onClick={onOpenBookPicker}
          className="text-base text-zinc-400 font-medium hover:text-white transition-colors"
        >
          {currentBook}
        </button>
        <div className="text-5xl font-bold font-serif text-white mt-1 tracking-tight">
          {currentChapter}
        </div>
      </div>

      {/* Main Scripture Text Body */}
      <div 
        className={`px-5 leading-loose text-zinc-200 space-y-4 ${
          fontFamily === 'serif' ? 'font-scripture' : 'font-sans'
        }`}
        style={{ fontSize: `${fontSize}px` }}
      >
        {verses.map(verse => {
          const isSelected = selectedVerse?.book === verse.book && 
                             selectedVerse?.chapter === verse.chapter && 
                             selectedVerse?.verse === verse.verse;

          const highlight = highlights.find(
            h => h.book === verse.book && h.chapter === verse.chapter && h.verse === verse.verse
          );

          const crossRefs = getCrossReferencesForVerse(verse.book, verse.chapter, verse.verse);
          const text = getVerseDisplay(verse, currentVersion);

          return (
            <div
              key={verse.verse}
              id={`verse-${verse.verse}`}
              onClick={() => onSelectVerseToStudy(verse)}
              className={`relative cursor-pointer transition-colors rounded-lg p-1 -m-1 ${
                isSelected ? 'bg-zinc-800/80 ring-1 ring-amber-400/50' : 'hover:bg-zinc-850/40'
              }`}
            >
              <span className="text-xs font-bold text-zinc-400 select-none mr-1.5 align-super">
                {toSuperscript(verse.verse)}
              </span>

              <span className={`inline ${getHighlightClass(highlight?.color)}`}>
                {text}
              </span>

              {/* Study Mode Indicator badge */}
              {readerMode === 'study' && crossRefs.length > 0 && (
                <span className="inline-flex items-center gap-1 ml-2 text-[11px] font-sans font-semibold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>{crossRefs.length} refs</span>
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* DEDICATED INLINE VERSE CROSS-REFERENCE & COLORFUL CHART SECTION */}
      {selectedVerse && (
        <div className="mt-8 mx-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400 block">
                Studying Verse {selectedVerse.verse}
              </span>
              <h3 className="text-base font-bold text-white">
                {selectedVerse.book} {selectedVerse.chapter}:{selectedVerse.verse} ({currentVersion})
              </h3>
            </div>
            <button
              onClick={() => onSelectVerseToStudy(null as any)}
              className="p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* COLORFUL CROSS-REFERENCE ARC CHART FOR THIS ACTIVE VERSE */}
          <VerseArcChart
            verse={selectedVerse}
            references={selectedVerseRefs}
            onSelectReference={(b, c, v) => onJumpToPassage(b, c, v)}
          />

          {/* Quick Highlight Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
            <span className="text-zinc-400">Highlight:</span>
            <div className="flex items-center gap-2">
              {(['yellow', 'emerald', 'cyan', 'rose', 'amber'] as HighlightColor[]).map(c => (
                <button
                  key={c}
                  onClick={() => onSetHighlight(selectedVerse.book, selectedVerse.chapter, selectedVerse.verse, c)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    c === 'yellow' ? 'bg-yellow-400' :
                    c === 'emerald' ? 'bg-emerald-400' :
                    c === 'cyan' ? 'bg-cyan-400' :
                    c === 'rose' ? 'bg-rose-400' : 'bg-amber-500'
                  } hover:scale-110`}
                />
              ))}
              <button
                onClick={() => onSetHighlight(selectedVerse.book, selectedVerse.chapter, selectedVerse.verse, null)}
                className="text-zinc-500 hover:text-zinc-300 text-[11px] underline ml-1"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING BOTTOM AUDIO & CHAPTER CONTROLS matching Screenshot 1 */}
      <div className="fixed bottom-16 inset-x-0 z-30 pointer-events-none flex justify-center px-4">
        <div className="w-full max-w-sm pointer-events-auto flex items-center justify-between gap-3 p-1.5 bg-[#1e1e20]/90 backdrop-blur-md rounded-full border border-zinc-700/60 shadow-2xl">
          {/* Play/Pause Button */}
          <button
            onClick={toggleAudio}
            className="w-11 h-11 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-colors shrink-0 shadow"
            title={isPlayingAudio ? 'Pause Narration' : 'Listen to Chapter'}
          >
            {isPlayingAudio ? <Pause className="w-4 h-4 text-amber-400 fill-amber-400" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          </button>

          {/* Chapter Navigation Pill: < Book Chapter > */}
          <div className="flex-1 flex items-center justify-between px-3 py-2 bg-zinc-850 hover:bg-zinc-800 rounded-full text-xs font-semibold text-zinc-200 transition-colors">
            <button
              onClick={() => onNavigateChapter('prev')}
              className="p-1 text-zinc-400 hover:text-white transition-colors"
              title="Previous Chapter"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenBookPicker}
              className="px-2 font-medium hover:text-amber-400 transition-colors"
              title="Choose Book and Chapter"
            >
              {currentBook} {currentChapter}
            </button>

            <button
              onClick={() => onNavigateChapter('next')}
              className="p-1 text-zinc-400 hover:text-white transition-colors"
              title="Next Chapter"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
