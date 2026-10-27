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
  SlidersHorizontal, 
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
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookMarked
} from 'lucide-react';

interface BibleReaderProps {
  verses: BibleVerse[];
  currentBook: string;
  currentChapter: number;
  currentVersion: BibleVersion;
  readerMode: ReaderMode;
  onToggleReaderMode: () => void;
  onSelectVerseToStudy: (verse: BibleVerse | null) => void;
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
  const [readerToast, setReaderToast] = useState<string | null>(null);

  const showReaderToast = (msg: string) => {
    setReaderToast(msg);
    setTimeout(() => setReaderToast(null), 3000);
  };

  // Accordion state for expanded cross references in inline study drawer
  // Set of reference IDs that are expanded
  const [expandedRefIds, setExpandedRefIds] = useState<Record<string, boolean>>({});
  const [copiedRefId, setCopiedRefId] = useState<string | null>(null);

  // Reset or initialize accordion when selected verse changes
  useEffect(() => {
    if (selectedVerse) {
      // By default expand the first reference so user immediately sees how it works
      const refs = getCrossReferencesForVerse(selectedVerse.book, selectedVerse.chapter, selectedVerse.verse);
      if (refs.length > 0) {
        setExpandedRefIds({ [refs[0].id]: true });
      } else {
        setExpandedRefIds({});
      }
    }
  }, [selectedVerse?.book, selectedVerse?.chapter, selectedVerse?.verse]);

  const toggleRefAccordion = (id: string) => {
    setExpandedRefIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedRefId(id);
    setTimeout(() => setCopiedRefId(null), 2000);
  };

  // Stop audio when changing chapters
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  }, [currentBook, currentChapter]);

  const toggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      showReaderToast('Audio playback is not supported on this browser.');
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
      case 'yellow': return 'bg-amber-400/25 text-amber-100 border-b-2 border-amber-400';
      case 'emerald': return 'bg-emerald-400/25 text-emerald-100 border-b-2 border-emerald-400';
      case 'cyan': return 'bg-cyan-400/25 text-cyan-100 border-b-2 border-cyan-400';
      case 'rose': return 'bg-rose-400/25 text-rose-100 border-b-2 border-rose-400';
      case 'amber': return 'bg-orange-400/25 text-orange-100 border-b-2 border-orange-400';
      default: return '';
    }
  };

  const toSuperscript = (num: number) => {
    const supers = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
    return num.toString().split('').map(d => supers[parseInt(d, 10)]).join('');
  };

  const selectedVerseRefs = selectedVerse 
    ? getCrossReferencesForVerse(selectedVerse.book, selectedVerse.chapter, selectedVerse.verse)
    : [];

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col min-h-screen text-slate-100 pb-36 select-none px-3 sm:px-4">
      {/* Toast Notification */}
      {readerToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs shadow-2xl animate-bounce">
          {readerToast}
        </div>
      )}

      {/* Top Header - Distinct Architectural Layout */}
      <header className="sticky top-0 z-30 bg-[#0e1015]/95 backdrop-blur-md px-3 sm:px-5 py-3 flex items-center justify-between border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          {/* Book & Chapter Indicator Pill */}
          <button
            onClick={onOpenBookPicker}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-sm font-semibold text-slate-100 border border-zinc-700/60 transition-all shadow-sm group"
          >
            <BookMarked className="w-4 h-4 text-amber-400" />
            <span>{currentBook} {currentChapter}</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
          </button>

          {/* Mode Switcher */}
          <button
            onClick={onToggleReaderMode}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              readerMode === 'study' 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm' 
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-slate-200'
            }`}
            title="Toggle Cross-Reference Study Mode"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Study Mode</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio narration button */}
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-850 transition-colors ${isPlayingAudio ? 'text-amber-400 bg-amber-500/10' : ''}`}
            title={isPlayingAudio ? 'Pause Narration' : 'Listen to Chapter'}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Search button */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-850 transition-colors"
            title="Search scripture"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Reading Display Settings */}
          <button
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-850 transition-colors"
            title="Display Options"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Translation Picker Button */}
          <button
            onClick={onOpenVersionPicker}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 border border-zinc-700/60 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span>{currentVersion}</span>
          </button>

          <PWAInstallButton />
        </div>
      </header>

      {/* Typography & Display Options Flyout */}
      {showOptionsMenu && (
        <div className="mx-2 mt-2 p-4 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl space-y-3 z-30 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Reader Settings</span>
            <button onClick={() => setShowOptionsMenu(false)} className="text-zinc-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-300">
            <span>Font Size</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 font-bold"
              >
                A-
              </button>
              <span className="font-mono text-amber-400 font-semibold">{fontSize}px</span>
              <button 
                onClick={() => setFontSize(prev => Math.min(26, prev + 2))}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 font-bold"
              >
                A+
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-300">
            <span>Font Family</span>
            <div className="flex items-center gap-1 bg-zinc-800 p-0.5 rounded-lg">
              <button
                onClick={() => setFontFamily('serif')}
                className={`px-3 py-1 rounded font-serif text-xs ${fontFamily === 'serif' ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Serif
              </button>
              <button
                onClick={() => setFontFamily('sans')}
                className={`px-3 py-1 rounded font-sans text-xs ${fontFamily === 'sans' ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Sans
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chapter Title Lockup - Scholarly Header */}
      <div className="pt-8 pb-5 text-center border-b border-zinc-850/60 mb-4">
        <span className="text-xs font-semibold tracking-widest uppercase text-amber-400/90 font-mono">
          The Holy Scripture • {currentVersion}
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-100 mt-1">
          {currentBook}
        </h1>
        <div className="text-4xl sm:text-5xl font-black font-serif text-amber-400/90 mt-0.5">
          {currentChapter}
        </div>
      </div>

      {/* Main Scripture Text Body with INLINE Cross-Reference Study under clicked verse */}
      <div 
        className={`px-2 sm:px-4 leading-relaxed text-slate-200 space-y-3 ${
          fontFamily === 'serif' ? 'font-scripture' : 'font-sans'
        }`}
        style={{ fontSize: `${fontSize}px` }}
      >
        {verses.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-zinc-400 text-sm">Loading authentic scripture text...</p>
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          verses.map(verse => {
            const isSelected = selectedVerse?.book === verse.book && 
                               selectedVerse?.chapter === verse.chapter && 
                               selectedVerse?.verse === verse.verse;

            const highlight = highlights.find(
              h => h.book === verse.book && h.chapter === verse.chapter && h.verse === verse.verse
            );

            const crossRefs = getCrossReferencesForVerse(verse.book, verse.chapter, verse.verse);
            const text = getVerseDisplay(verse, currentVersion);

            return (
              <React.Fragment key={verse.verse}>
                {/* The Verse Paragraph */}
                <div
                  id={`verse-${verse.verse}`}
                  onClick={() => onSelectVerseToStudy(isSelected ? null : verse)}
                  className={`relative cursor-pointer transition-all rounded-lg p-2.5 -mx-1.5 ${
                    isSelected 
                      ? 'bg-amber-500/10 border-l-4 border-amber-400 pl-3 shadow-inner' 
                      : 'hover:bg-zinc-850/50'
                  }`}
                >
                  <span className="text-xs font-bold text-amber-400/80 select-none mr-2 align-super font-mono">
                    {toSuperscript(verse.verse)}
                  </span>

                  <span className={`inline ${getHighlightClass(highlight?.color)}`}>
                    {text}
                  </span>

                  {/* Study Mode Indicator badge */}
                  {readerMode === 'study' && crossRefs.length > 0 && (
                    <span className="inline-flex items-center gap-1 ml-2 text-[11px] font-sans font-semibold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/25">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>{crossRefs.length} cross-refs</span>
                    </span>
                  )}
                </div>

                {/* CRITICAL: INLINE CROSS-REFERENCE SECTION IMMEDIATELY UNDER CLICKED VERSE */}
                {isSelected && (
                  <div className="my-3 p-3.5 sm:p-5 rounded-xl bg-[#14161d] border border-amber-500/40 shadow-2xl space-y-4 animate-fadeIn">
                    {/* Header: Verse identification and close */}
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold text-amber-400 bg-amber-500/15 rounded border border-amber-500/30">
                            Studying Verse {selectedVerse.verse}
                          </span>
                          <span className="text-xs text-zinc-400 font-mono">
                            {selectedVerseRefs.length} References Found
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-1">
                          {selectedVerse.book} {selectedVerse.chapter}:{selectedVerse.verse} ({currentVersion})
                        </h3>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectVerseToStudy(null);
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="Close Study Details"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quick Highlight & Tools Bar */}
                    <div className="flex items-center justify-between py-1 text-xs text-zinc-300">
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-400 text-[11px]">Highlight:</span>
                        {(['yellow', 'emerald', 'cyan', 'rose', 'amber'] as HighlightColor[]).map(c => (
                          <button
                            key={c}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSetHighlight(selectedVerse.book, selectedVerse.chapter, selectedVerse.verse, c);
                            }}
                            className={`w-5 h-5 rounded-full transition-transform ${
                              c === 'yellow' ? 'bg-amber-400' :
                              c === 'emerald' ? 'bg-emerald-400' :
                              c === 'cyan' ? 'bg-cyan-400' :
                              c === 'rose' ? 'bg-rose-400' : 'bg-orange-500'
                            } hover:scale-125`}
                            title={`Highlight ${c}`}
                          />
                        ))}
                        {highlight && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSetHighlight(selectedVerse.book, selectedVerse.chapter, selectedVerse.verse, null);
                            }}
                            className="text-zinc-400 hover:text-zinc-200 text-[11px] underline ml-1"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(`${selectedVerse.book} ${selectedVerse.chapter}:${selectedVerse.verse} - "${text}"`, 'active-verse');
                        }}
                        className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-750 transition-colors"
                      >
                        {copiedRefId === 'active-verse' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Verse</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* COLORFUL CROSS-REFERENCE ARC CHART FOR THIS ACTIVE VERSE */}
                    <div className="bg-[#0b0c10] p-3 rounded-lg border border-zinc-800">
                      <div className="text-[11px] font-mono font-semibold text-zinc-400 mb-2 flex items-center justify-between">
                        <span>CANONICAL CONNECTION MAP</span>
                        <span className="text-amber-400">63,779 Hyperlink Network</span>
                      </div>
                      <VerseArcChart
                        verse={selectedVerse}
                        references={selectedVerseRefs}
                        onSelectReference={(b, c, v) => onJumpToPassage(b, c, v)}
                      />
                    </div>

                    {/* COLLAPSIBLE CROSS-REFERENCE CARDS */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                        <span>Click any cross-reference to expand and read full verse:</span>
                        <span className="text-[11px] text-amber-400/90">
                          {selectedVerseRefs.length} connections
                        </span>
                      </div>

                      {selectedVerseRefs.map((cr) => {
                        const isExpanded = !!expandedRefIds[cr.id];
                        const refTargetLabel = `${cr.targetBook} ${cr.targetChapter}:${cr.targetVerseStart}${cr.targetVerseEnd ? `-${cr.targetVerseEnd}` : ''}`;
                        const targetText = currentVersion === 'NIV' ? cr.targetNIV : cr.targetKJV;

                        return (
                          <div 
                            key={cr.id}
                            className={`rounded-lg border transition-all ${
                              isExpanded 
                                ? 'bg-zinc-850 border-amber-500/40 shadow-lg' 
                                : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            {/* Collapsible Accordion Header */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRefAccordion(cr.id);
                              }}
                              className="w-full text-left p-3 flex items-center justify-between gap-3"
                            >
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-sm text-white font-serif">
                                  {refTargetLabel}
                                </span>
                                <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                                  {cr.relationship}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-zinc-400 shrink-0">
                                <span className="text-[11px] hidden sm:inline text-zinc-500 font-sans">
                                  {isExpanded ? 'Collapse' : 'Read verse'}
                                </span>
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-amber-400" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                                )}
                              </div>
                            </button>

                            {/* Expanded Content with Full Verbatim Verse and Notes */}
                            {isExpanded && (
                              <div className="px-3 pb-3.5 pt-1 border-t border-zinc-800/80 space-y-2.5 animate-fadeIn">
                                {/* Verbatim Target Scripture Text */}
                                <div className="p-3 rounded bg-[#0e1015] border border-zinc-800 font-scripture text-sm text-amber-100 leading-relaxed">
                                  <span className="font-sans text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                                    {refTargetLabel} ({currentVersion})
                                  </span>
                                  "{targetText}"
                                </div>

                                {/* Theological Insight / Parallel Note */}
                                {cr.notes && (
                                  <p className="text-xs text-zinc-400 font-sans leading-relaxed italic pl-1 border-l-2 border-amber-500/30">
                                    {cr.notes}
                                  </p>
                                )}

                                {/* Action Controls for this referenced verse */}
                                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-sans text-xs">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(`${refTargetLabel} - "${targetText}"`, cr.id);
                                    }}
                                    className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-750 transition-colors"
                                  >
                                    {copiedRefId === cr.id ? (
                                      <>
                                        <Check className="w-3 h-3 text-emerald-400" />
                                        <span className="text-emerald-400">Copied</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3" />
                                        <span>Copy Reference</span>
                                      </>
                                    )}
                                  </button>

                                  {/* Optional Button to Navigate to that chapter only if user explicitly desires */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onJumpToPassage(cr.targetBook, cr.targetChapter, cr.targetVerseStart);
                                    }}
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-amber-500/20 text-zinc-300 hover:text-amber-300 border border-zinc-700/60 hover:border-amber-500/40 text-[11px] font-medium transition-colors"
                                    title="Open this entire chapter in reader"
                                  >
                                    <span>Read {cr.targetBook} {cr.targetChapter}</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })
        )}
      </div>

      {/* FLOATING BOTTOM AUDIO & CHAPTER NAVIGATION BAR */}
      <div className="fixed bottom-20 inset-x-0 z-30 pointer-events-none flex justify-center px-4">
        <div className="w-full max-w-md pointer-events-auto flex items-center justify-between gap-3 p-1.5 bg-[#14161e]/95 backdrop-blur-md rounded-xl border border-zinc-700/70 shadow-2xl">
          {/* Play/Pause Narration Button */}
          <button
            onClick={toggleAudio}
            className="w-10 h-10 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-colors shrink-0 shadow"
            title={isPlayingAudio ? 'Pause Narration' : 'Listen to Chapter'}
          >
            {isPlayingAudio ? (
              <Pause className="w-4 h-4 text-amber-400 fill-amber-400" />
            ) : (
              <Play className="w-4 h-4 fill-white ml-0.5" />
            )}
          </button>

          {/* Chapter Navigation Pill: < Book Chapter > */}
          <div className="flex-1 flex items-center justify-between px-3 py-1.5 bg-zinc-850 hover:bg-zinc-800 rounded-lg text-xs font-semibold text-zinc-200 transition-colors">
            <button
              onClick={() => onNavigateChapter('prev')}
              className="p-1 text-zinc-400 hover:text-white transition-colors"
              title="Previous Chapter"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenBookPicker}
              className="px-2 font-medium hover:text-amber-400 transition-colors flex items-center gap-1"
              title="Choose Book and Chapter"
            >
              <span>{currentBook} {currentChapter}</span>
              <span className="text-[10px] text-zinc-500 font-mono">({currentVersion})</span>
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
