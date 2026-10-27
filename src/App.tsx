/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  BibleVerse, 
  BibleVersion, 
  HighlightColor, 
  ReaderMode, 
  UserHighlight, 
  UserNote 
} from './types/bible';
import { BIBLE_BOOKS, getBookByName } from './data/canon';
import { fetchChapterVerses } from './data/bibleText';
import { BibleReader } from './components/BibleReader';
import { CrossReferenceChart } from './components/CrossReferenceChart';
import { BookSelectorModal } from './components/BookSelectorModal';
import { VersionPickerModal } from './components/VersionPickerModal';
import { SearchModal } from './components/SearchModal';
import { NotesAndHighlightsView } from './components/NotesAndHighlightsView';
import { UserProfileView } from './components/UserProfileView';
import { AuthModal } from './components/AuthModal';
import { AccountGate } from './components/AccountGate';
import { OfflineIndicator } from './components/OfflineIndicator';
import { 
  BookOpen, 
  Sparkles, 
  Bookmark, 
  Search, 
  User, 
  Compass, 
  Layers
} from 'lucide-react';

const STORAGE_KEY_AUTH_TOKEN = 'scripturearc_token_v3';
const STORAGE_KEY_CURRENT_USER = 'scripturearc_user_v3';
const STORAGE_KEY_LAST_READ = 'scripturearc_last_read_v3';

export default function App() {
  // 1. Authenticated User State (Mandatory Gate)
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null; // Requires user to log in or register before using
  });

  const [authToken, setAuthToken] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_AUTH_TOKEN) || '';
  });

  // 2. Remember Last-Read Position (Does NOT default to Ezekiel 3 every time!)
  const [currentBook, setCurrentBook] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LAST_READ);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.book) return parsed.book;
      }
    } catch {}
    return 'Genesis';
  });

  const [currentChapter, setCurrentChapter] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LAST_READ);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.chapter && typeof parsed.chapter === 'number') return parsed.chapter;
      }
    } catch {}
    return 1;
  });

  const [currentVersion, setCurrentVersion] = useState<BibleVersion>('KJV');
  const [readerMode, setReaderMode] = useState<ReaderMode>('read');
  const [activeTab, setActiveTab] = useState<'bible' | 'arcs' | 'saved' | 'search' | 'profile'>('bible');
  const [selectedVerse, setSelectedVerse] = useState<BibleVerse | null>(null);

  // Verses state
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [isLoadingVerses, setIsLoadingVerses] = useState<boolean>(true);

  // User Highlights and Notes
  const [highlights, setHighlights] = useState<UserHighlight[]>([]);
  const [notes, setNotes] = useState<UserNote[]>([]);

  // Modals Visibility
  const [isBookPickerOpen, setIsBookPickerOpen] = useState(false);
  const [isVersionPickerOpen, setIsVersionPickerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Persist Last Read Position so app remembers where the user left off
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LAST_READ, JSON.stringify({
        book: currentBook,
        chapter: currentChapter,
        verse: selectedVerse ? selectedVerse.verse : 1
      }));
    } catch {}
  }, [currentBook, currentChapter, selectedVerse]);

  // Sync saved items with backend API
  useEffect(() => {
    if (!currentUser || !authToken) return;
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/user/saved', {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.highlights) setHighlights(data.highlights);
          if (data.notes) setNotes(data.notes);
        }
      } catch (e) {
        console.warn('Could not sync user saved data with backend API', e);
      }
    };
    fetchUserData();
  }, [currentUser, authToken]);

  // Save changes to backend API
  const syncSavedWithBackend = useCallback(async (newHighlights: UserHighlight[], newNotes: UserNote[]) => {
    if (!authToken) return;
    try {
      await fetch('/api/user/saved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ highlights: newHighlights, notes: newNotes })
      });
    } catch (e) {
      console.warn('Backend sync failed', e);
    }
  }, [authToken]);

  // Load verses whenever currentBook, currentChapter, or currentVersion changes
  useEffect(() => {
    let isCancelled = false;
    setIsLoadingVerses(true);

    fetchChapterVerses(currentBook, currentChapter, currentVersion).then(data => {
      if (!isCancelled) {
        setVerses(data);
        setIsLoadingVerses(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [currentBook, currentChapter, currentVersion]);

  // Handle Passage Selection
  const handleSelectPassage = useCallback((bookName: string, chapter: number, verseNum?: number) => {
    setCurrentBook(bookName);
    setCurrentChapter(chapter);
    setActiveTab('bible');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (verseNum) {
      setTimeout(() => {
        const targetElement = document.getElementById(`verse-${verseNum}`);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        fetchChapterVerses(bookName, chapter, currentVersion).then(res => {
          const match = res.find(v => v.verse === verseNum);
          if (match) setSelectedVerse(match);
        });
      }, 200);
    } else {
      setSelectedVerse(null);
    }
  }, [currentVersion]);

  // Chapter Navigation (Previous / Next)
  const handleNavigateChapter = useCallback((direction: 'prev' | 'next') => {
    const book = getBookByName(currentBook) || BIBLE_BOOKS[0];
    if (direction === 'prev') {
      if (currentChapter > 1) {
        handleSelectPassage(currentBook, currentChapter - 1);
      } else {
        const prevIndex = book.order - 2;
        if (prevIndex >= 0) {
          const prevBook = BIBLE_BOOKS[prevIndex];
          handleSelectPassage(prevBook.name, prevBook.chaptersCount);
        }
      }
    } else {
      if (currentChapter < book.chaptersCount) {
        handleSelectPassage(currentBook, currentChapter + 1);
      } else {
        const nextIndex = book.order;
        if (nextIndex < BIBLE_BOOKS.length) {
          const nextBook = BIBLE_BOOKS[nextIndex];
          handleSelectPassage(nextBook.name, 1);
        }
      }
    }
  }, [currentBook, currentChapter, handleSelectPassage]);

  // Highlights handlers
  const handleSetHighlight = useCallback((book: string, chapter: number, verse: number, color: HighlightColor | null) => {
    setHighlights(prev => {
      const filtered = prev.filter(h => !(h.book === book && h.chapter === chapter && h.verse === verse));
      const updated = color ? [...filtered, {
        id: `${book}-${chapter}-${verse}`,
        book,
        chapter,
        verse,
        color,
        timestamp: Date.now()
      }] : filtered;
      syncSavedWithBackend(updated, notes);
      return updated;
    });
  }, [notes, syncSavedWithBackend]);

  const handleDeleteHighlight = useCallback((book: string, chapter: number, verse: number) => {
    setHighlights(prev => {
      const updated = prev.filter(h => !(h.book === book && h.chapter === chapter && h.verse === verse));
      syncSavedWithBackend(updated, notes);
      return updated;
    });
  }, [notes, syncSavedWithBackend]);

  // Notes handlers
  const handleSaveNote = useCallback((book: string, chapter: number, verse: number, text: string) => {
    setNotes(prev => {
      const filtered = prev.filter(n => !(n.book === book && n.chapter === chapter && n.verse === verse));
      const updated = [...filtered, {
        id: `note-${book}-${chapter}-${verse}-${Date.now()}`,
        book,
        chapter,
        verse,
        text,
        timestamp: Date.now()
      }];
      syncSavedWithBackend(highlights, updated);
      return updated;
    });
  }, [highlights, syncSavedWithBackend]);

  const handleDeleteNote = useCallback((id: string) => {
    setNotes(prev => {
      const updated = prev.filter(n => n.id !== id);
      syncSavedWithBackend(highlights, updated);
      return updated;
    });
  }, [highlights, syncSavedWithBackend]);

  // Auth Success Handler
  const handleAuthSuccess = (user: any, token: string) => {
    setCurrentUser(user);
    setAuthToken(token);
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEY_AUTH_TOKEN, token);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken('');
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    localStorage.removeItem(STORAGE_KEY_AUTH_TOKEN);
  };

  // If user is not authenticated, show mandatory Account Gate screen
  if (!currentUser) {
    return <AccountGate onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="w-full min-h-screen bg-[#0b0c10] text-slate-100 flex flex-col overflow-x-hidden selection:bg-amber-500/30 font-sans">
      {/* Offline Status Toast */}
      <OfflineIndicator />

      {/* MAIN VIEWPORT */}
      <main className="flex-1 w-full flex flex-col pb-20">
        {/* VIEW 1: SCRIPTURE READER WITH INLINE COLLAPSIBLE CROSS-REFERENCES */}
        {activeTab === 'bible' && (
          <div className="w-full flex-1 flex flex-col">
            {isLoadingVerses ? (
              <div className="p-16 text-center max-w-sm mx-auto my-auto space-y-3">
                <div className="w-9 h-9 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-zinc-400 font-mono">Loading {currentBook} {currentChapter}...</p>
              </div>
            ) : (
              <BibleReader
                verses={verses}
                currentBook={currentBook}
                currentChapter={currentChapter}
                currentVersion={currentVersion}
                readerMode={readerMode}
                onToggleReaderMode={() => setReaderMode(readerMode === 'read' ? 'study' : 'read')}
                onSelectVerseToStudy={v => setSelectedVerse(v)}
                selectedVerse={selectedVerse}
                onNavigateChapter={handleNavigateChapter}
                highlights={highlights}
                onSetHighlight={handleSetHighlight}
                notes={notes}
                onOpenBookPicker={() => setIsBookPickerOpen(true)}
                onOpenVersionPicker={() => setIsVersionPickerOpen(true)}
                onOpenSearch={() => setIsSearchOpen(true)}
                onJumpToPassage={handleSelectPassage}
              />
            )}
          </div>
        )}

        {/* VIEW 2: 63,779 CANONICAL CROSS-REFERENCES ARCS MAP */}
        {activeTab === 'arcs' && (
          <div className="max-w-4xl mx-auto w-full px-3 sm:px-6 pt-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-400">
                  Global Scripture Network
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mt-0.5">
                  The 63,779 Cross-References Chart
                </h2>
                <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                  Christoph Römhild & Chris Harrison's canonical arc visualization. Each bar along the bottom represents one of the 1,189 chapters of the Bible. The rainbow arcs connect cross-references across scripture.
                </p>
              </div>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 border border-zinc-700/60 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors shrink-0"
              >
                <Search className="w-3.5 h-3.5 text-zinc-400" />
                <span>Search</span>
              </button>
            </div>

            {/* Interactive Rainbow Arcs Canvas */}
            <CrossReferenceChart
              onSelectPassage={handleSelectPassage}
              activeBookName={currentBook}
              activeChapter={currentChapter}
            />
          </div>
        )}

        {/* VIEW 3: STUDY JOURNAL (Highlights & Personal Notes) */}
        {activeTab === 'saved' && (
          <div className="max-w-2xl mx-auto w-full px-4 pt-6 space-y-4">
            <div className="pb-3 border-b border-zinc-800">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-400">
                Personal Repository
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mt-0.5">
                Study Journal & Highlights
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Review your saved scripture verses, annotations, and colored highlights.
              </p>
            </div>

            <NotesAndHighlightsView
              highlights={highlights}
              notes={notes}
              onSelectPassage={handleSelectPassage}
              onDeleteHighlight={handleDeleteHighlight}
              onDeleteNote={handleDeleteNote}
            />
          </div>
        )}

        {/* VIEW 4: CONCORDANCE & SCRIPTURE SEARCH */}
        {activeTab === 'search' && (
          <div className="max-w-2xl mx-auto w-full px-4 pt-6 space-y-4">
            <div className="pb-3 border-b border-zinc-800">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-400">
                Biblical Concordance
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white mt-0.5">
                Scripture Search
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Search across all 66 books by word, keyword, prophet, or topic.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#14161f] border border-zinc-800 space-y-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-[#0c0d12] border border-zinc-700/60 text-zinc-400 hover:text-white hover:border-amber-500/40 text-sm transition-all"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-amber-400" />
                  <span>Type a book, verse, or keyword (e.g. Ezekiel 3, Roll, Light)...</span>
                </div>
                <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded text-zinc-300 font-mono">Open</span>
              </button>

              <div className="pt-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                  Prominent Study Passages:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { label: 'Ezekiel 3 (The Roll)', book: 'Ezekiel', ch: 3 },
                    { label: 'Genesis 1 (Creation)', book: 'Genesis', ch: 1 },
                    { label: 'John 1 (The Logos)', book: 'John', ch: 1 },
                    { label: 'Romans 8 (Life in Spirit)', book: 'Romans', ch: 8 },
                    { label: 'Isaiah 53 (Suffering Servant)', book: 'Isaiah', ch: 53 },
                    { label: 'Revelation 21 (New Jerusalem)', book: 'Revelation', ch: 21 },
                  ].map(p => (
                    <button
                      key={p.label}
                      onClick={() => handleSelectPassage(p.book, p.ch, 1)}
                      className="p-2 rounded-lg bg-zinc-850 hover:bg-zinc-800 border border-zinc-700/50 text-left text-zinc-200 hover:text-amber-300 transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: USER ACCOUNT & ADMIN MANAGEMENT */}
        {activeTab === 'profile' && (
          <div className="w-full pt-4">
            <UserProfileView
              user={currentUser}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onLogout={handleLogout}
              onOpenSavedTab={() => setActiveTab('saved')}
            />
          </div>
        )}
      </main>

      {/* DISTINCT SCHOLARLY BOTTOM NAVIGATION BAR */}
      <nav 
        className="fixed bottom-0 inset-x-0 z-40 bg-[#0e1017]/95 backdrop-blur-md border-t border-zinc-800/80 flex items-center justify-around py-2 px-1 text-zinc-400"
        aria-label="App Navigation"
      >
        <button
          onClick={() => setActiveTab('bible')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
            activeTab === 'bible' ? 'text-amber-400 font-bold' : 'hover:text-zinc-200'
          }`}
        >
          <BookOpen className="w-4 h-4 stroke-[2]" />
          <span>Scripture</span>
        </button>

        <button
          onClick={() => setActiveTab('arcs')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
            activeTab === 'arcs' ? 'text-amber-400 font-bold' : 'hover:text-zinc-200'
          }`}
        >
          <Sparkles className="w-4 h-4 stroke-[2]" />
          <span>63,779 Arcs</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
            activeTab === 'saved' ? 'text-amber-400 font-bold' : 'hover:text-zinc-200'
          }`}
        >
          <Bookmark className="w-4 h-4 stroke-[2]" />
          <span>Journal</span>
        </button>

        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
            activeTab === 'search' ? 'text-amber-400 font-bold' : 'hover:text-zinc-200'
          }`}
        >
          <Search className="w-4 h-4 stroke-[2]" />
          <span>Search</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-colors ${
            activeTab === 'profile' ? 'text-amber-400 font-bold' : 'hover:text-zinc-200'
          }`}
        >
          <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px] font-bold">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span>Account</span>
        </button>
      </nav>

      {/* MODALS */}
      <BookSelectorModal
        isOpen={isBookPickerOpen}
        onClose={() => setIsBookPickerOpen(false)}
        onSelect={handleSelectPassage}
        currentBook={currentBook}
        currentChapter={currentChapter}
      />

      <VersionPickerModal
        isOpen={isVersionPickerOpen}
        onClose={() => setIsVersionPickerOpen(false)}
        currentVersion={currentVersion}
        onSelectVersion={v => setCurrentVersion(v)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectPassage={handleSelectPassage}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
