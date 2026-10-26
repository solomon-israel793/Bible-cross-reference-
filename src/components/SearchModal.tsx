import React, { useState, useMemo } from 'react';
import { BUNDLED_SCRIPTURE } from '../data/bibleText';
import { BIBLE_BOOKS, getBookByName } from '../data/canon';
import { X, Search as SearchIcon, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { BibleVerse } from '../types/bible';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPassage: (bookName: string, chapter: number, verse: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectPassage
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  // Sample curated searchable corpus + book direct lookup
  const searchResults = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) return [];

    const clean = query.trim().toLowerCase();
    const results: { book: string; chapter: number; verse: number; text: string; matchType: string }[] = [];

    // 1. Direct Book Match (e.g. user typed "Genesis", "John", "Romans")
    const matchedBook = BIBLE_BOOKS.find(b => b.name.toLowerCase().startsWith(clean));
    if (matchedBook) {
      results.push({
        book: matchedBook.name,
        chapter: 1,
        verse: 1,
        text: `${matchedBook.theme} (${matchedBook.chaptersCount} chapters in the ${matchedBook.testament === 'OT' ? 'Old' : 'New'} Testament)`,
        matchType: 'Book Overview'
      });
    }

    // 2. Direct citation match: e.g. "John 3:16" or "Gen 1:1" or "Romans 8:28"
    const citationRegex = /^([1-3]?\s*[a-zA-Z]+)\s+(\d+)(?::(\d+))?$/i;
    const match = clean.match(citationRegex);
    if (match) {
      const bookStr = match[1].trim();
      const ch = parseInt(match[2], 10);
      const v = match[3] ? parseInt(match[3], 10) : 1;
      const foundBook = BIBLE_BOOKS.find(b => b.name.toLowerCase().startsWith(bookStr.toLowerCase()) || b.id.toLowerCase() === bookStr.toLowerCase());
      if (foundBook) {
        results.push({
          book: foundBook.name,
          chapter: Math.min(foundBook.chaptersCount, Math.max(1, ch)),
          verse: v,
          text: `Jump directly to ${foundBook.name} chapter ${ch}, verse ${v}`,
          matchType: 'Direct Citation'
        });
      }
    }

    // 3. Text search in bundled high-value scripture database
    for (const [key, verses] of Object.entries(BUNDLED_SCRIPTURE)) {
      for (const v of verses) {
        if (v.textKJV.toLowerCase().includes(clean) || (v.textNIV && v.textNIV.toLowerCase().includes(clean))) {
          results.push({
            book: v.book,
            chapter: v.chapter,
            verse: v.verse,
            text: v.textKJV,
            matchType: 'Scripture Verse'
          });
        }
      }
    }

    return results.slice(0, 15);
  }, [query]);

  const quickSearchSuggestions = [
    'In the beginning',
    'The LORD is my shepherd',
    'God so loved the world',
    'Light of the world',
    'All things work together',
    'Wounded for our transgressions',
    'Faith is the substance'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-stone-900 border border-stone-800 text-stone-100 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Search Input */}
        <div className="p-4 border-b border-stone-800 flex items-center gap-3">
          <SearchIcon className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search scripture text, keywords, or citations (e.g. John 3:16, Light, Shepherd)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-stone-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggestion tags if query empty */}
        {!query && (
          <div className="p-4 bg-stone-950/40 border-b border-stone-800/60">
            <div className="text-xs text-stone-400 mb-2 font-medium">Quick Scripture Searches:</div>
            <div className="flex flex-wrap gap-1.5">
              {quickSearchSuggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(s)}
                  className="px-2.5 py-1 text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg border border-stone-700/60 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {query.trim().length > 1 && searchResults.length === 0 ? (
            <div className="p-8 text-center text-stone-400 text-sm">
              No matching verses found for "{query}". Try checking the spelling or search by citation like "John 1".
            </div>
          ) : (
            searchResults.map((res, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelectPassage(res.book, res.chapter, res.verse);
                  onClose();
                }}
                className="w-full p-3.5 rounded-xl bg-stone-850 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/40 text-left transition-all group flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-amber-300 group-hover:text-amber-200">
                      {res.book} {res.chapter}:{res.verse}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 border border-stone-700">
                      {res.matchType}
                    </span>
                  </div>
                  <p className="font-scripture text-xs sm:text-sm text-stone-300 line-clamp-2 leading-relaxed">
                    {res.text}
                  </p>
                </div>

                <div className="pt-1 shrink-0 text-stone-500 group-hover:text-amber-400 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-950/80 border-t border-stone-800 text-center text-xs text-stone-400">
          Tip: You can type citations directly, e.g. <span className="text-amber-400">"Genesis 1"</span>, <span className="text-amber-400">"Psalm 23"</span>, or <span className="text-amber-400">"John 3:16"</span>
        </div>
      </div>
    </div>
  );
};
