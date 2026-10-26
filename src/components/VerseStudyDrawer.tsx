import React, { useState, useEffect } from 'react';
import { BibleVerse, BibleVersion, CrossReference, HighlightColor, UserHighlight, UserNote } from '../types/bible';
import { getCrossReferencesForVerse } from '../data/crossReferences';
import { X, BookOpen, Sparkles, ExternalLink, Bookmark, Highlighter, MessageSquare, ChevronRight, Share2, Copy, Check, ArrowRight } from 'lucide-react';

interface VerseStudyDrawerProps {
  verse: BibleVerse | null;
  currentVersion: BibleVersion;
  onClose: () => void;
  onJumpToPassage: (bookName: string, chapter: number, verse?: number) => void;
  highlights: UserHighlight[];
  onSetHighlight: (book: string, chapter: number, verse: number, color: HighlightColor | null) => void;
  notes: UserNote[];
  onSaveNote: (book: string, chapter: number, verse: number, text: string) => void;
  onDeleteNote: (id: string) => void;
}

export const VerseStudyDrawer: React.FC<VerseStudyDrawerProps> = ({
  verse,
  currentVersion,
  onClose,
  onJumpToPassage,
  highlights,
  onSetHighlight,
  notes,
  onSaveNote,
  onDeleteNote
}) => {
  if (!verse) return null;

  const [compareMode, setCompareMode] = useState<'single' | 'compare'>('single');
  const [activeTab, setActiveTab] = useState<'references' | 'notes' | 'exegesis'>('references');
  const [noteInput, setNoteInput] = useState('');
  const [copied, setCopied] = useState(false);

  // Retrieve cross references for this verse
  const crossReferences = getCrossReferencesForVerse(verse.book, verse.chapter, verse.verse);

  // Current highlight for this verse
  const currentHighlight = highlights.find(
    h => h.book === verse.book && h.chapter === verse.chapter && h.verse === verse.verse
  );

  // Current notes for this verse
  const verseNotes = notes.filter(
    n => n.book === verse.book && n.chapter === verse.chapter && n.verse === verse.verse
  );

  // Sync note input if editing
  useEffect(() => {
    if (verseNotes.length > 0) {
      setNoteInput(verseNotes[0].text);
    } else {
      setNoteInput('');
    }
  }, [verse.book, verse.chapter, verse.verse, verseNotes.length]);

  const handleCopyVerse = () => {
    const textToCopy = `"${verse.textKJV}" — ${verse.book} ${verse.chapter}:${verse.verse} (KJV)`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveCurrentNote = () => {
    if (!noteInput.trim()) return;
    onSaveNote(verse.book, verse.chapter, verse.verse, noteInput);
  };

  const highlightColors: { id: HighlightColor; bg: string; border: string; label: string }[] = [
    { id: 'yellow', bg: 'bg-yellow-400', border: 'border-yellow-500', label: 'Gold' },
    { id: 'emerald', bg: 'bg-emerald-400', border: 'border-emerald-500', label: 'Emerald' },
    { id: 'cyan', bg: 'bg-cyan-400', border: 'border-cyan-500', label: 'Sky' },
    { id: 'rose', bg: 'bg-rose-400', border: 'border-rose-500', label: 'Rose' },
    { id: 'amber', bg: 'bg-amber-400', border: 'border-amber-500', label: 'Amber' }
  ];

  return (
    <aside 
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] lg:w-[540px] bg-stone-900 border-l border-stone-800 shadow-2xl flex flex-col text-stone-100 animate-slideLeft"
      aria-label="Verse Study & Cross-Reference Drawer"
    >
      {/* Drawer Header */}
      <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-950/70 backdrop-blur-md flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Study & Cross-References
            </span>
          </div>
          <h2 className="text-xl font-bold font-serif text-white mt-0.5">
            {verse.book} {verse.chapter}:{verse.verse}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyVerse}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            title="Copy Verse Citation"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Drawer Body Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
        {/* Primary Selected Verse Presentation */}
        <div className="p-4 rounded-xl bg-stone-850 border border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wide">
              Scripture Passage
            </span>
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setCompareMode('single')}
                className={`px-2 py-0.5 rounded ${compareMode === 'single' ? 'bg-stone-700 text-white font-medium' : 'text-stone-400'}`}
              >
                {currentVersion}
              </button>
              <button
                onClick={() => setCompareMode('compare')}
                className={`px-2 py-0.5 rounded ${compareMode === 'compare' ? 'bg-stone-700 text-white font-medium' : 'text-stone-400'}`}
              >
                KJV vs NIV
              </button>
            </div>
          </div>

          {compareMode === 'single' ? (
            <p className="font-scripture text-base sm:text-lg leading-relaxed text-stone-100">
              {currentVersion === 'KJV' ? verse.textKJV : (verse.textNIV || verse.textKJV)}
            </p>
          ) : (
            <div className="space-y-3 pt-1">
              <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                <span className="text-[11px] font-bold text-amber-400 block mb-1">KING JAMES VERSION (KJV)</span>
                <p className="font-scripture text-sm text-stone-200 leading-relaxed">{verse.textKJV}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                <span className="text-[11px] font-bold text-cyan-400 block mb-1">NEW INTERNATIONAL VERSION (NIV)</span>
                <p className="font-scripture text-sm text-stone-200 leading-relaxed">{verse.textNIV || verse.textKJV}</p>
              </div>
            </div>
          )}

          {/* Quick Highlight Bar */}
          <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
            <span className="text-xs text-stone-400">Highlight:</span>
            <div className="flex items-center gap-2">
              {highlightColors.map(c => (
                <button
                  key={c.id}
                  onClick={() => onSetHighlight(
                    verse.book, 
                    verse.chapter, 
                    verse.verse, 
                    currentHighlight?.color === c.id ? null : c.id
                  )}
                  className={`w-6 h-6 rounded-full ${c.bg} transition-transform ${
                    currentHighlight?.color === c.id ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                  title={`Highlight in ${c.label}`}
                />
              ))}
              {currentHighlight && (
                <button
                  onClick={() => onSetHighlight(verse.book, verse.chapter, verse.verse, null)}
                  className="text-[10px] text-stone-400 hover:text-stone-200 underline ml-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Drawer Tabs: Cross-References vs Notes & Comments vs Exegesis */}
        <div className="flex items-center gap-1 p-1 bg-stone-950/60 rounded-xl border border-stone-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('references')}
            className={`flex-1 py-2 text-center rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'references'
                ? 'bg-stone-800 text-amber-400 shadow-sm font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cross-References ({crossReferences.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-2 text-center rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'notes'
                ? 'bg-stone-800 text-amber-400 shadow-sm font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>My Notes & Reflections</span>
          </button>
          <button
            onClick={() => setActiveTab('exegesis')}
            className={`flex-1 py-2 text-center rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'exegesis'
                ? 'bg-stone-800 text-amber-400 shadow-sm font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>TSK Commentary</span>
          </button>
        </div>

        {/* TAB 1: CROSS-REFERENCES LIST */}
        {activeTab === 'references' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Connected Scriptures in the Canon:</span>
              <span className="text-amber-400 font-medium">{crossReferences.length} Hyperlinks</span>
            </div>

            {crossReferences.length === 0 ? (
              <div className="p-8 text-center bg-stone-850 rounded-xl border border-stone-800">
                <p className="text-sm text-stone-400">No direct cross-references found for this specific verse.</p>
              </div>
            ) : (
              crossReferences.map((ref, idx) => (
                <div
                  key={ref.id || idx}
                  className="p-4 rounded-xl bg-stone-850 border border-stone-800 hover:border-amber-500/40 transition-all space-y-2.5 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-300 text-sm">
                        {ref.targetBook} {ref.targetChapter}:{ref.targetVerseStart}
                        {ref.targetVerseEnd ? `-${ref.targetVerseEnd}` : ''}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                        {ref.relationship}
                      </span>
                    </div>

                    <button
                      onClick={() => onJumpToPassage(ref.targetBook, ref.targetChapter, ref.targetVerseStart)}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors opacity-80 group-hover:opacity-100"
                      title="Jump to this scripture"
                    >
                      <span>Read Passage</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Target Scripture Text */}
                  <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800/80">
                    <p className="font-scripture text-xs sm:text-sm text-stone-200 leading-relaxed">
                      "{currentVersion === 'KJV' ? ref.targetKJV : (ref.targetNIV || ref.targetKJV)}"
                    </p>
                  </div>

                  {/* Connection Explanatory Rationale */}
                  {ref.notes && (
                    <p className="text-xs text-stone-400 italic">
                      <strong className="text-stone-300 not-italic">Connection:</strong> {ref.notes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: PERSONAL NOTES & REFLECTIONS */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                Write Personal Note or Meditation
              </label>
              <textarea
                value={noteInput}
                onChange={e => setNoteInput(e.target.value)}
                placeholder={`Write insights, sermon notes, or reflections on ${verse.book} ${verse.chapter}:${verse.verse}...`}
                rows={5}
                className="w-full bg-stone-900 border border-stone-700 rounded-xl p-3 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSaveCurrentNote}
                  disabled={!noteInput.trim()}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold rounded-xl text-xs shadow-md transition-colors"
                >
                  Save Note
                </button>
              </div>
            </div>

            {/* Saved Notes for this verse */}
            <div className="space-y-2.5 pt-3 border-t border-stone-800">
              <span className="text-xs font-semibold text-stone-400">Saved Notes for this Verse:</span>
              {verseNotes.length === 0 ? (
                <p className="text-xs text-stone-500 italic">No notes saved yet for this verse.</p>
              ) : (
                verseNotes.map(n => (
                  <div key={n.id} className="p-3 bg-stone-900 rounded-xl border border-stone-800 space-y-1">
                    <p className="text-xs text-stone-200 whitespace-pre-wrap">{n.text}</p>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-stone-500">
                      <span>{new Date(n.timestamp).toLocaleDateString()}</span>
                      <button
                        onClick={() => onDeleteNote(n.id)}
                        className="text-rose-400 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: TSK EXEGESIS & HISTORICAL COMMENTARY */}
        {activeTab === 'exegesis' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-stone-850 border border-stone-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Treasury of Scripture Knowledge (TSK) Synthesis
              </span>
              <p className="text-xs text-stone-300 leading-relaxed">
                The canonical cross-referencing principle operates on the theological maxim:
                <em className="text-stone-200"> "Scriptura sacra sui ipsius interpres"</em> (Sacred Scripture is its own interpreter).
                Verses in {verse.book} find their ultimate resolution across the overarching biblical tapestry of God’s redemptive covenant.
              </p>
              <div className="pt-2 text-xs text-stone-400">
                <strong>Key Theological Anchor:</strong> Compare with apostolic interpretations in the New Testament to discern how the Apostles understood this prophecy and narrative.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drawer Footer with Quick Jump Action */}
      <div className="p-3.5 bg-stone-950/80 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
        <span>Click any cross-reference card to open in reader</span>
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors font-medium"
        >
          Done
        </button>
      </div>
    </aside>
  );
};
