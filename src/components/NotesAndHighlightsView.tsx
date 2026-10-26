import React, { useState } from 'react';
import { UserHighlight, UserNote, HighlightColor } from '../types/bible';
import { Bookmark, Highlighter, FileText, Trash2, ArrowRight, Search, BookOpen } from 'lucide-react';

interface NotesAndHighlightsViewProps {
  highlights: UserHighlight[];
  notes: UserNote[];
  onSelectPassage: (bookName: string, chapter: number, verse: number) => void;
  onDeleteHighlight: (book: string, chapter: number, verse: number) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesAndHighlightsView: React.FC<NotesAndHighlightsViewProps> = ({
  highlights,
  notes,
  onSelectPassage,
  onDeleteHighlight,
  onDeleteNote
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'highlights' | 'notes'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const colorBadge = (color: HighlightColor) => {
    switch (color) {
      case 'yellow': return 'bg-yellow-400 text-stone-900';
      case 'emerald': return 'bg-emerald-400 text-stone-900';
      case 'cyan': return 'bg-cyan-400 text-stone-900';
      case 'rose': return 'bg-rose-400 text-stone-900';
      case 'amber': return 'bg-amber-400 text-stone-900';
      default: return 'bg-stone-400 text-stone-900';
    }
  };

  const filteredHighlights = highlights.filter(h => 
    `${h.book} ${h.chapter}:${h.verse}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNotes = notes.filter(n => 
    n.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${n.book} ${n.chapter}:${n.verse}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-stone-900 text-white rounded-2xl border border-stone-800 shadow-md">
        <h2 className="text-2xl font-bold font-serif">My Scripture Journal</h2>
        <p className="text-xs text-stone-400 mt-1">
          All your saved personal highlights, study reflections, and sermon notes in one place
        </p>

        {/* Search & Tabs */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-stone-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'all' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
              }`}
            >
              All Entries ({highlights.length + notes.length})
            </button>
            <button
              onClick={() => setActiveTab('highlights')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'highlights' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
              }`}
            >
              Highlights ({highlights.length})
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === 'notes' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
              }`}
            >
              Notes ({notes.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search notes or citations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {/* Notes Section */}
        {(activeTab === 'all' || activeTab === 'notes') && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 px-1">
              Personal Study Notes ({filteredNotes.length})
            </h3>
            {filteredNotes.length === 0 ? (
              activeTab === 'notes' ? (
                <div className="p-8 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
                  <FileText className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-sm text-stone-500">No notes written yet. Click on any verse in Study Mode to write personal notes.</p>
                </div>
              ) : null
            ) : (
              filteredNotes.map(n => (
                <div
                  key={n.id}
                  className="p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-amber-400/50 transition-all shadow-sm space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => onSelectPassage(n.book, n.chapter, n.verse)}
                      className="font-bold font-serif text-sm text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1.5"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{n.book} {n.chapter}:{n.verse}</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-stone-400">
                        {new Date(n.timestamp).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => onDeleteNote(n.id)}
                        className="p-1 text-stone-400 hover:text-rose-500 transition-colors"
                        title="Delete Note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-200 whitespace-pre-wrap leading-relaxed">
                    {n.text}
                  </p>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => onSelectPassage(n.book, n.chapter, n.verse)}
                      className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 hover:underline"
                    >
                      <span>Study Verse in Context</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Highlights Section */}
        {(activeTab === 'all' || activeTab === 'highlights') && (
          <div className="space-y-3 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 px-1">
              Highlighted Verses ({filteredHighlights.length})
            </h3>
            {filteredHighlights.length === 0 ? (
              activeTab === 'highlights' ? (
                <div className="p-8 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
                  <Highlighter className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <p className="text-sm text-stone-500">No verses highlighted yet. Select any verse in the reader to highlight with color.</p>
                </div>
              ) : null
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredHighlights.map((h, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-amber-400/50 transition-all shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-3.5 h-3.5 rounded-full ${colorBadge(h.color)}`} />
                      <div>
                        <button
                          onClick={() => onSelectPassage(h.book, h.chapter, h.verse)}
                          className="font-bold text-sm text-stone-800 dark:text-stone-100 hover:text-amber-500 transition-colors text-left"
                        >
                          {h.book} {h.chapter}:{h.verse}
                        </button>
                        <div className="text-[11px] text-stone-400">
                          Color: {h.color}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectPassage(h.book, h.chapter, h.verse)}
                        className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-amber-500 transition-colors"
                        title="Read"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteHighlight(h.book, h.chapter, h.verse)}
                        className="p-1.5 text-stone-400 hover:text-rose-500 transition-colors"
                        title="Remove highlight"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
