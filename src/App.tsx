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
import { VerseStudyDrawer } from './components/VerseStudyDrawer';
import { BookSelectorModal } from './components/BookSelectorModal';
import { VersionPickerModal } from './components/VersionPickerModal';
import { SearchModal } from './components/SearchModal';
import { NotesAndHighlightsView } from './components/NotesAndHighlightsView';
import { UserProfileView } from './components/UserProfileView';
import { AuthModal } from './components/AuthModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { 
  Home, 
  BookOpen, 
  CheckSquare, 
  Search, 
  User, 
  Sparkles, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

const STORAGE_KEY_AUTH_TOKEN = 'scripturearc_token_v2';
const STORAGE_KEY_CURRENT_USER = 'scripturearc_user_v2';

export default function App() {
  // Navigation & Scripture State (Default to Ezekiel 3 matching user's screenshot!)
  const [currentBook, setCurrentBook] = useState<string>('Ezekiel');
  const [currentChapter, setCurrentChapter] = useState<number>(3);
  const [currentVersion, setCurrentVersion] = useState<BibleVersion>('KJV');
  const [readerMode, setReaderMode] = useState<ReaderMode>('read');
  const [activeTab, setActiveTab] = useState<'home' | 'bible' | 'plans' | 'discover' | 'you'>('bible');
  const [selectedVerse, setSelectedVerse] = useState<BibleVerse | null>(null);

  // Authenticated User State (defaults to admin Israel Solomon as configured)
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (saved) return JSON.parse(saved);
    } catch {}
    // Initial default admin profile matching user's exact screenshot and request
    return {
      id: 'admin-1',
      name: 'Israel Solomon',
      email: 'solomonisrael793@gmail.com',
      contact: '+234 806 468 7282',
      role: 'admin',
      streak: 6,
      encouragements: 0,
      badgesCount: 10
    };
  });

  const [authToken, setAuthToken] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_AUTH_TOKEN) || 'token-admin-1';
  });

  // Scripture Verses for current chapter
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

  // Sync saved items with backend API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/user/saved', {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
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
  }, [authToken]);

  // Save changes to backend API
  const syncSavedWithBackend = useCallback(async (newHighlights: UserHighlight[], newNotes: UserNote[]) => {
    try {
      await fetch('/api/user/saved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
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
      }, 150);
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

  return (
    <div className="w-full min-h-screen bg-[#121212] text-zinc-100 flex flex-col overflow-x-hidden selection:bg-amber-500/30 font-sans">
      {/* Offline Status Toast */}
      <OfflineIndicator />

      {/* MAIN VIEWPORT */}
      <main className="flex-1 w-full flex flex-col pb-20">
        {/* TAB 1: HOME (Verse of Day & Quick Study) */}
        {activeTab === 'home' && (
          <div className="max-w-md sm:max-w-xl mx-auto w-full px-4 pt-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between py-2">
              <div>
                <span className="text-xs text-zinc-400">Good Day,</span>
                <h2 className="text-xl font-bold text-white font-sans">
                  {currentUser ? currentUser.name : 'Seeker of Truth'}
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('you')}
                className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-800 flex items-center justify-center font-bold text-sm text-white"
              >
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </button>
            </div>

            {/* Verse of the Day Card */}
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 shadow-md">
              <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase tracking-wider">
                <span>Verse of the Day</span>
                <span className="text-zinc-400 font-mono">Ezekiel 3:3</span>
              </div>
              <p className="font-scripture text-base sm:text-lg text-zinc-100 leading-relaxed italic">
                "And he said unto me, Son of man, cause thy belly to eat, and fill thy bowels with this roll that I give thee. Then did I eat it; and it was in my mouth as honey for sweetness."
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
                <button
                  onClick={() => handleSelectPassage('Ezekiel', 3, 3)}
                  className="px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold transition-colors"
                >
                  Read & Study Cross-References →
                </button>
              </div>
            </div>

            {/* 63,779 Hyperlinks Shortcut Banner */}
            <div 
              onClick={() => setActiveTab('discover')}
              className="p-4 rounded-2xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 cursor-pointer transition-colors space-y-1.5"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span>63,779 Visual Cross-References Map</span>
              </div>
              <p className="text-xs text-zinc-300">
                Explore the canonical arc diagram connecting all 66 books from Genesis to Revelation.
              </p>
            </div>

            {/* Quick Streaks & Highlights Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white tabular-nums">{currentUser?.streak || 6} Days</div>
                  <div className="text-[11px] text-zinc-400">Study Streak</div>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('you')}
                className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-3 cursor-pointer hover:bg-zinc-850 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white tabular-nums">{highlights.length + notes.length} Items</div>
                  <div className="text-[11px] text-zinc-400">Saved Journal</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BIBLE READER (Exact YouVersion layout matching Screenshot 1) */}
        {activeTab === 'bible' && (
          <div className="w-full flex-1 flex flex-col">
            {isLoadingVerses ? (
              <div className="p-12 text-center max-w-sm mx-auto my-auto space-y-3">
                <div className="w-10 h-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mx-auto" />
                <p className="text-xs text-zinc-400">Loading {currentBook} {currentChapter}...</p>
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

        {/* TAB 3: PLANS (Curated Biblical Reading Plans) */}
        {activeTab === 'plans' && (
          <div className="max-w-md sm:max-w-xl mx-auto w-full px-4 pt-6 space-y-4">
            <h2 className="text-xl font-bold text-white font-sans">Biblical Study Plans</h2>
            <p className="text-xs text-zinc-400">Systematic reading plans highlighting deep cross-references</p>

            <div className="space-y-3">
              {[
                {
                  title: 'Messianic Prophecies & Their Apostolic Fulfillment',
                  duration: '30 Days',
                  desc: 'Track Isaiah 53, Psalm 22, and Micah 5 directly to their New Testament fulfillments.',
                  actionBook: 'Isaiah',
                  actionCh: 53
                },
                {
                  title: 'Through the Law & Prophets with Ezekiel',
                  duration: '21 Days',
                  desc: 'Explore prophetic commissions from Ezekiel to Revelation.',
                  actionBook: 'Ezekiel',
                  actionCh: 3
                },
                {
                  title: 'The Great Biblical Arc: Genesis to Revelation',
                  duration: '14 Days',
                  desc: 'The Tree of Life, the Paradise of God, and the Lamb on the Throne.',
                  actionBook: 'Genesis',
                  actionCh: 1
                }
              ].map((plan, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 hover:border-zinc-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">{plan.duration}</span>
                    <button
                      onClick={() => handleSelectPassage(plan.actionBook, plan.actionCh, 1)}
                      className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>Start Reading</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h3 className="font-bold text-white text-sm">{plan.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{plan.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DISCOVER (Full 63,779 Cross-References Chart & Search) */}
        {activeTab === 'discover' && (
          <div className="max-w-4xl mx-auto w-full px-4 pt-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white font-sans">
                  The 63,779 Cross-References Chart
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Visual map of biblical connections across all 1,189 chapters
                </p>
              </div>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="px-3 py-1.5 rounded-full bg-zinc-800 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 hover:bg-zinc-700"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search Scripture</span>
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

        {/* TAB 5: YOU (Profile Screen matching Screenshot 2) */}
        {activeTab === 'you' && (
          <div className="w-full pt-4">
            <UserProfileView
              user={currentUser}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onLogout={handleLogout}
              onOpenSavedTab={() => {
                // Open notes/saved view
                setActiveTab('you');
              }}
            />

            {/* Saved Highlights and Notes section beneath */}
            <div className="max-w-md mx-auto px-2 mt-6 pt-6 border-t border-zinc-800">
              <NotesAndHighlightsView
                highlights={highlights}
                notes={notes}
                onSelectPassage={handleSelectPassage}
                onDeleteHighlight={handleDeleteHighlight}
                onDeleteNote={handleDeleteNote}
              />
            </div>
          </div>
        )}
      </main>

      {/* FIXED BOTTOM NAVIGATION BAR matching Screenshot 1 & 2 */}
      <nav 
        className="fixed bottom-0 inset-x-0 z-40 bg-[#121212]/95 backdrop-blur-md border-t border-zinc-800/60 flex items-center justify-around py-2 px-1 text-zinc-400"
        aria-label="App Navigation"
      >
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'home' ? 'text-white font-bold' : 'hover:text-zinc-200'
          }`}
        >
          <Home className="w-5 h-5 stroke-[2]" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('bible')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'bible' ? 'text-white font-bold' : 'hover:text-zinc-200'
          }`}
        >
          <BookOpen className="w-5 h-5 stroke-[2]" />
          <span>Bible</span>
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'plans' ? 'text-white font-bold' : 'hover:text-zinc-200'
          }`}
        >
          <CheckSquare className="w-5 h-5 stroke-[2]" />
          <span>Plans</span>
        </button>

        <button
          onClick={() => setActiveTab('discover')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'discover' ? 'text-white font-bold' : 'hover:text-zinc-200'
          }`}
        >
          <Search className="w-5 h-5 stroke-[2]" />
          <span>Discover</span>
        </button>

        <button
          onClick={() => setActiveTab('you')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'you' ? 'text-white font-bold' : 'hover:text-zinc-200'
          }`}
        >
          <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'Y'}
          </div>
          <span>You</span>
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
