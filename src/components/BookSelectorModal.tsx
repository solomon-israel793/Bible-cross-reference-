import React, { useState } from 'react';
import { BIBLE_BOOKS } from '../data/canon';
import { BibleBook } from '../types/bible';
import { X, Search, ChevronRight, BookMarked } from 'lucide-react';

interface BookSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (bookName: string, chapter: number, verse?: number) => void;
  currentBook: string;
  currentChapter: number;
}

export const BookSelectorModal: React.FC<BookSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentBook,
  currentChapter
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'book' | 'chapter' | 'verse'>('book');
  const [selectedBook, setSelectedBook] = useState<BibleBook>(
    BIBLE_BOOKS.find(b => b.name === currentBook) || BIBLE_BOOKS[0]
  );
  const [selectedChapter, setSelectedChapter] = useState<number>(currentChapter);
  const [testamentFilter, setTestamentFilter] = useState<'ALL' | 'OT' | 'NT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = BIBLE_BOOKS.filter(book => {
    const matchesTestament = testamentFilter === 'ALL' || book.testament === testamentFilter;
    const matchesSearch = book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          book.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTestament && matchesSearch;
  });

  const handleBookClick = (book: BibleBook) => {
    setSelectedBook(book);
    setStep('chapter');
  };

  const handleChapterClick = (chapterNum: number) => {
    setSelectedChapter(chapterNum);
    setStep('verse');
  };

  const handleVerseClick = (verseNum: number) => {
    onSelect(selectedBook.name, selectedChapter, verseNum);
    onClose();
  };

  const handleDirectReadChapter = (chapterNum: number) => {
    onSelect(selectedBook.name, chapterNum, 1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-stone-900 border border-stone-800 text-stone-100 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-stone-800 rounded-lg text-xs font-medium">
              <button
                onClick={() => setStep('book')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  step === 'book' ? 'bg-stone-700 text-white font-bold' : 'text-stone-400 hover:text-white'
                }`}
              >
                1. Book
              </button>
              <button
                onClick={() => setStep('chapter')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  step === 'chapter' ? 'bg-stone-700 text-white font-bold' : 'text-stone-400 hover:text-white'
                }`}
              >
                2. Chapter ({selectedBook.name})
              </button>
              <button
                onClick={() => setStep('verse')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  step === 'verse' ? 'bg-stone-700 text-white font-bold' : 'text-stone-400 hover:text-white'
                }`}
              >
                3. Verse ({selectedChapter})
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: BOOK SELECTION */}
        {step === 'book' && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Search and Testament Tabs */}
            <div className="p-4 border-b border-stone-800 space-y-3 bg-stone-900/50">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search 66 books (e.g. Genesis, Psalms, John)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-stone-400 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setTestamentFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    testamentFilter === 'ALL' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  All (66 Books)
                </button>
                <button
                  onClick={() => setTestamentFilter('OT')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    testamentFilter === 'OT' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Old Testament (39)
                </button>
                <button
                  onClick={() => setTestamentFilter('NT')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    testamentFilter === 'NT' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  New Testament (27)
                </button>
              </div>
            </div>

            {/* Books List Grid */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {filteredBooks.map(book => {
                const isCurrent = book.name === currentBook;
                return (
                  <button
                    key={book.id}
                    onClick={() => handleBookClick(book)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all group ${
                      isCurrent
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                        : 'bg-stone-850 border-stone-800 hover:bg-stone-800 hover:border-stone-700 text-stone-200'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm group-hover:text-amber-400 transition-colors">
                        {book.name}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {book.category} · {book.chaptersCount} chs
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: CHAPTER SELECTION */}
        {step === 'chapter' && (
          <div className="flex flex-col flex-1 overflow-hidden p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{selectedBook.name}</span>
                  <span className="text-xs font-normal text-stone-400">({selectedBook.chaptersCount} Chapters)</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">{selectedBook.theme}</p>
              </div>
              <button
                onClick={() => setStep('book')}
                className="text-xs text-amber-400 hover:underline"
              >
                ← Back to Books
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                {Array.from({ length: selectedBook.chaptersCount }, (_, i) => i + 1).map(chNum => {
                  const isCurrent = selectedBook.name === currentBook && chNum === currentChapter;
                  return (
                    <button
                      key={chNum}
                      onClick={() => handleChapterClick(chNum)}
                      onDoubleClick={() => handleDirectReadChapter(chNum)}
                      className={`h-11 rounded-xl text-sm font-semibold border flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-md'
                          : 'bg-stone-800 border-stone-700 text-stone-200 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-300'
                      }`}
                    >
                      {chNum}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span>Click a chapter to choose verse, or start from verse 1</span>
              <button
                onClick={() => handleDirectReadChapter(1)}
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg font-medium transition-colors"
              >
                Read Chapter 1 →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: VERSE SELECTION */}
        {step === 'verse' && (
          <div className="flex flex-col flex-1 overflow-hidden p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {selectedBook.name} Chapter {selectedChapter}
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">Select a verse to jump directly to study or reading</p>
              </div>
              <button
                onClick={() => setStep('chapter')}
                className="text-xs text-amber-400 hover:underline"
              >
                ← Back to Chapters
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              {/* Calculate approximate verse count */}
              {(() => {
                const totalV = selectedBook.approxChapterVerses[selectedChapter - 1] || 25;
                return (
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
                    {Array.from({ length: totalV }, (_, i) => i + 1).map(vNum => (
                      <button
                        key={vNum}
                        onClick={() => handleVerseClick(vNum)}
                        className="h-10 rounded-xl text-xs font-semibold bg-stone-800 border border-stone-700 text-stone-200 hover:bg-amber-500 hover:text-stone-950 hover:border-amber-400 transition-colors"
                      >
                        {vNum}
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
              <button
                onClick={() => handleDirectReadChapter(selectedChapter)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl border border-stone-700 font-medium"
              >
                Read Whole Chapter
              </button>
              <button
                onClick={() => handleVerseClick(1)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-md transition-colors"
              >
                Go to Verse 1 →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
