export type Testament = 'OT' | 'NT';

export type BookCategory = 
  | 'Law'
  | 'History'
  | 'Poetry & Wisdom'
  | 'Major Prophets'
  | 'Minor Prophets'
  | 'Gospels'
  | 'Church History'
  | 'Pauline Epistles'
  | 'General Epistles'
  | 'Apocalyptic';

export interface BibleBook {
  id: string; // e.g. 'GEN'
  name: string; // e.g. 'Genesis'
  testament: Testament;
  category: BookCategory;
  order: number; // 1 to 66
  chaptersCount: number;
  totalVerses: number;
  approxChapterVerses: number[]; // Verses per chapter
  startGlobalChapter: number; // 0-based global index in 1,189 chapters
  theme: string;
  author: string;
}

export type BibleVersion = 'KJV' | 'NIV' | 'BSB' | 'ASV';

export interface BibleVerse {
  book: string; // 'Genesis'
  bookId: string; // 'GEN'
  chapter: number;
  verse: number;
  textKJV: string;
  textNIV?: string;
  textBSB?: string;
}

export interface CrossReference {
  id: string;
  sourceBook: string;
  sourceChapter: number;
  sourceVerse: number;
  targetBook: string;
  targetChapter: number;
  targetVerseStart: number;
  targetVerseEnd?: number;
  relationship: 'Prophecy & Fulfillment' | 'Creation & Eternity' | 'Messianic' | 'Covenant & Law' | 'Apostolic Quotation' | 'Thematic Parallel' | 'Wisdom & Praise';
  targetKJV: string;
  targetNIV?: string;
  notes?: string;
  weight?: number; // connection strength (1 to 5)
}

export type HighlightColor = 'yellow' | 'emerald' | 'cyan' | 'rose' | 'amber';

export interface UserHighlight {
  id: string; // `${bookId}-${chapter}-${verse}`
  book: string;
  chapter: number;
  verse: number;
  color: HighlightColor;
  timestamp: number;
}

export interface UserNote {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  timestamp: number;
  tags?: string[];
}

export type ReaderTheme = 'light' | 'sepia' | 'dark';
export type ReaderMode = 'read' | 'study';
