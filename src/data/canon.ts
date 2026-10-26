import { BibleBook } from '../types/bible';

// Standard 66 books of Protestant Canon with exact chapter counts
export const BIBLE_BOOKS: BibleBook[] = [
  // --- OLD TESTAMENT (39 Books, 929 Chapters) ---
  // Pentateuch / Law (5)
  {
    id: 'GEN',
    name: 'Genesis',
    testament: 'OT',
    category: 'Law',
    order: 1,
    chaptersCount: 50,
    totalVerses: 1533,
    approxChapterVerses: [31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20, 18, 24, 21, 16, 27, 33, 38, 18, 34, 24, 20, 67, 34, 35, 46, 22, 35, 43, 55, 32, 20, 31, 29, 43, 36, 30, 23, 23, 57, 38, 34, 34, 28, 34, 31, 22, 33, 26],
    startGlobalChapter: 0,
    theme: 'Origins, Creation, Fall, and the Abrahamic Covenant',
    author: 'Moses'
  },
  {
    id: 'EXO',
    name: 'Exodus',
    testament: 'OT',
    category: 'Law',
    order: 2,
    chaptersCount: 40,
    totalVerses: 1213,
    approxChapterVerses: [22, 25, 22, 31, 23, 30, 25, 32, 35, 29, 10, 51, 22, 31, 27, 36, 16, 27, 25, 26, 36, 31, 33, 18, 40, 37, 21, 43, 46, 38, 18, 35, 23, 35, 35, 38, 29, 31, 43, 38],
    startGlobalChapter: 50,
    theme: 'Deliverance from bondage, Law at Sinai, Tabernacle',
    author: 'Moses'
  },
  {
    id: 'LEV',
    name: 'Leviticus',
    testament: 'OT',
    category: 'Law',
    order: 3,
    chaptersCount: 27,
    totalVerses: 859,
    approxChapterVerses: [17, 16, 17, 35, 19, 30, 38, 36, 24, 20, 47, 8, 59, 57, 33, 34, 16, 30, 37, 27, 24, 33, 44, 23, 55, 46, 34],
    startGlobalChapter: 90,
    theme: 'Holiness, sacrificial atonement, priesthood, and feasts',
    author: 'Moses'
  },
  {
    id: 'NUM',
    name: 'Numbers',
    testament: 'OT',
    category: 'Law',
    order: 4,
    chaptersCount: 36,
    totalVerses: 1288,
    approxChapterVerses: [54, 34, 51, 49, 31, 27, 89, 26, 23, 36, 35, 16, 33, 45, 41, 50, 13, 32, 22, 29, 35, 41, 30, 25, 18, 65, 23, 31, 40, 16, 54, 42, 56, 29, 34, 13],
    startGlobalChapter: 117,
    theme: 'Wilderness wanderings and divine faithfulness',
    author: 'Moses'
  },
  {
    id: 'DEU',
    name: 'Deuteronomy',
    testament: 'OT',
    category: 'Law',
    order: 5,
    chaptersCount: 34,
    totalVerses: 959,
    approxChapterVerses: [46, 37, 29, 49, 33, 25, 26, 20, 29, 22, 32, 32, 18, 29, 23, 22, 20, 22, 21, 20, 23, 30, 25, 22, 19, 19, 26, 68, 29, 20, 30, 52, 29, 12],
    startGlobalChapter: 153,
    theme: 'Renewal of the Covenant and Call to Obedience',
    author: 'Moses'
  },
  // Historical Books (12)
  {
    id: 'JOS',
    name: 'Joshua',
    testament: 'OT',
    category: 'History',
    order: 6,
    chaptersCount: 24,
    totalVerses: 658,
    approxChapterVerses: [18, 24, 17, 24, 15, 27, 26, 35, 27, 43, 23, 24, 33, 15, 63, 10, 18, 28, 51, 9, 45, 34, 16, 33],
    startGlobalChapter: 187,
    theme: 'Conquest and allotment of the Promised Land',
    author: 'Joshua'
  },
  {
    id: 'JDG',
    name: 'Judges',
    testament: 'OT',
    category: 'History',
    order: 7,
    chaptersCount: 21,
    totalVerses: 618,
    approxChapterVerses: [36, 23, 31, 24, 31, 40, 25, 35, 57, 18, 40, 15, 25, 20, 20, 31, 13, 31, 30, 48, 25],
    startGlobalChapter: 211,
    theme: 'Cycles of rebellion, repentance, and deliverance',
    author: 'Samuel'
  },
  {
    id: 'RUT',
    name: 'Ruth',
    testament: 'OT',
    category: 'History',
    order: 8,
    chaptersCount: 4,
    totalVerses: 85,
    approxChapterVerses: [22, 23, 18, 22],
    startGlobalChapter: 232,
    theme: 'Kinsman-Redeemer and lineage of David',
    author: 'Samuel'
  },
  {
    id: '1SA',
    name: '1 Samuel',
    testament: 'OT',
    category: 'History',
    order: 9,
    chaptersCount: 31,
    totalVerses: 810,
    approxChapterVerses: [28, 36, 21, 22, 12, 21, 17, 22, 27, 27, 15, 25, 23, 52, 35, 23, 58, 30, 24, 42, 15, 23, 29, 22, 44, 25, 12, 25, 11, 31, 13],
    startGlobalChapter: 236,
    theme: 'Transition from judges to kings: Saul and David',
    author: 'Samuel / Gad / Nathan'
  },
  {
    id: '2SA',
    name: '2 Samuel',
    testament: 'OT',
    category: 'History',
    order: 10,
    chaptersCount: 24,
    totalVerses: 695,
    approxChapterVerses: [27, 32, 39, 12, 25, 23, 29, 18, 13, 19, 27, 31, 39, 33, 37, 23, 29, 33, 43, 26, 22, 51, 39, 25],
    startGlobalChapter: 267,
    theme: 'David’s reign and the eternal Davidic Covenant',
    author: 'Nathan / Gad'
  },
  {
    id: '1KI',
    name: '1 Kings',
    testament: 'OT',
    category: 'History',
    order: 11,
    chaptersCount: 22,
    totalVerses: 816,
    approxChapterVerses: [53, 46, 28, 34, 18, 38, 51, 66, 28, 29, 43, 33, 34, 31, 34, 34, 24, 46, 21, 43, 29, 53],
    startGlobalChapter: 291,
    theme: 'Solomon’s temple and the divided kingdom',
    author: 'Jeremiah'
  },
  {
    id: '2KI',
    name: '2 Kings',
    testament: 'OT',
    category: 'History',
    order: 12,
    chaptersCount: 25,
    totalVerses: 719,
    approxChapterVerses: [18, 25, 27, 44, 27, 33, 20, 29, 37, 36, 21, 21, 25, 29, 38, 20, 41, 37, 37, 21, 26, 20, 37, 20, 30],
    startGlobalChapter: 313,
    theme: 'Decline of Israel and Judah, exile in Babylon',
    author: 'Jeremiah'
  },
  {
    id: '1CH',
    name: '1 Chronicles',
    testament: 'OT',
    category: 'History',
    order: 13,
    chaptersCount: 29,
    totalVerses: 942,
    approxChapterVerses: [54, 55, 24, 43, 26, 81, 40, 40, 44, 14, 47, 40, 14, 17, 29, 43, 27, 17, 19, 8, 30, 19, 32, 31, 31, 32, 34, 21, 30],
    startGlobalChapter: 338,
    theme: 'Genealogies, worship, and David’s preparation for the temple',
    author: 'Ezra'
  },
  {
    id: '2CH',
    name: '2 Chronicles',
    testament: 'OT',
    category: 'History',
    order: 14,
    chaptersCount: 36,
    totalVerses: 822,
    approxChapterVerses: [17, 18, 17, 22, 14, 42, 22, 18, 31, 19, 23, 16, 22, 15, 19, 14, 19, 34, 11, 37, 20, 12, 21, 27, 28, 23, 9, 27, 36, 27, 21, 33, 25, 33, 27, 23],
    startGlobalChapter: 367,
    theme: 'Kings of Judah, revival, and the house of the LORD',
    author: 'Ezra'
  },
  {
    id: 'EZR',
    name: 'Ezra',
    testament: 'OT',
    category: 'History',
    order: 15,
    chaptersCount: 10,
    totalVerses: 280,
    approxChapterVerses: [11, 70, 13, 24, 17, 22, 28, 36, 15, 44],
    startGlobalChapter: 403,
    theme: 'Return from exile and rebuilding the temple',
    author: 'Ezra'
  },
  {
    id: 'NEH',
    name: 'Nehemiah',
    testament: 'OT',
    category: 'History',
    order: 16,
    chaptersCount: 13,
    totalVerses: 406,
    approxChapterVerses: [11, 20, 32, 23, 19, 19, 73, 18, 38, 39, 36, 47, 31],
    startGlobalChapter: 413,
    theme: 'Rebuilding the walls of Jerusalem and spiritual reform',
    author: 'Nehemiah'
  },
  {
    id: 'EST',
    name: 'Esther',
    testament: 'OT',
    category: 'History',
    order: 17,
    chaptersCount: 10,
    totalVerses: 167,
    approxChapterVerses: [22, 23, 15, 17, 14, 14, 10, 17, 32, 3],
    startGlobalChapter: 426,
    theme: 'God’s providence and deliverance of His people',
    author: 'Mordecai / Unknown'
  },
  // Poetry & Wisdom (5)
  {
    id: 'JOB',
    name: 'Job',
    testament: 'OT',
    category: 'Poetry & Wisdom',
    order: 18,
    chaptersCount: 42,
    totalVerses: 1070,
    approxChapterVerses: [22, 13, 26, 21, 27, 30, 21, 22, 35, 22, 20, 25, 28, 22, 35, 22, 16, 21, 29, 29, 34, 30, 17, 25, 6, 14, 23, 28, 25, 31, 40, 22, 33, 37, 16, 33, 24, 41, 30, 24, 34, 17],
    startGlobalChapter: 436,
    theme: 'Suffering, sovereignty, and trust in God’s majesty',
    author: 'Job / Moses'
  },
  {
    id: 'PSA',
    name: 'Psalms',
    testament: 'OT',
    category: 'Poetry & Wisdom',
    order: 19,
    chaptersCount: 150,
    totalVerses: 2461,
    // Chapter verse counts for the 150 psalms (sample highlights: 119 has 176, 117 has 2)
    approxChapterVerses: [6, 12, 8, 8, 12, 10, 17, 9, 20, 18, 7, 8, 6, 7, 5, 11, 15, 50, 14, 9, 13, 31, 6, 10, 22, 12, 14, 9, 11, 12, 24, 11, 22, 22, 28, 12, 40, 22, 13, 17, 13, 11, 5, 26, 17, 11, 9, 14, 20, 23, 19, 9, 6, 7, 23, 13, 11, 11, 17, 12, 8, 12, 11, 10, 13, 20, 7, 35, 36, 5, 24, 20, 28, 23, 10, 12, 20, 72, 13, 19, 16, 8, 18, 12, 13, 17, 7, 18, 52, 17, 16, 15, 5, 23, 11, 13, 12, 9, 9, 5, 8, 28, 22, 35, 45, 48, 43, 13, 31, 7, 10, 10, 9, 8, 18, 19, 2, 29, 176, 7, 8, 9, 4, 8, 5, 6, 5, 6, 8, 8, 3, 18, 3, 3, 21, 26, 9, 8, 24, 13, 10, 7, 12, 15, 21, 10, 20, 14, 9, 6],
    startGlobalChapter: 478,
    theme: 'Prayer, praise, Messianic prophecy, and the beauty of holiness',
    author: 'David, Asaph, Sons of Korah, Moses, Solomon'
  },
  {
    id: 'PRO',
    name: 'Proverbs',
    testament: 'OT',
    category: 'Poetry & Wisdom',
    order: 20,
    chaptersCount: 31,
    totalVerses: 915,
    approxChapterVerses: [33, 22, 35, 27, 23, 35, 27, 36, 18, 32, 31, 28, 25, 35, 33, 33, 28, 24, 29, 30, 31, 29, 35, 34, 28, 28, 27, 28, 27, 33, 31],
    startGlobalChapter: 628,
    theme: 'The fear of the LORD is the beginning of wisdom',
    author: 'Solomon, Agur, Lemuel'
  },
  {
    id: 'ECC',
    name: 'Ecclesiastes',
    testament: 'OT',
    category: 'Poetry & Wisdom',
    order: 21,
    chaptersCount: 12,
    totalVerses: 222,
    approxChapterVerses: [18, 26, 22, 16, 20, 12, 29, 17, 18, 20, 10, 14],
    startGlobalChapter: 659,
    theme: 'Vanity under the sun and fearing God',
    author: 'Solomon'
  },
  {
    id: 'SNG',
    name: 'Song of Solomon',
    testament: 'OT',
    category: 'Poetry & Wisdom',
    order: 22,
    chaptersCount: 8,
    totalVerses: 117,
    approxChapterVerses: [17, 17, 11, 16, 16, 13, 13, 14],
    startGlobalChapter: 671,
    theme: 'Marital love and the divine Bridegroom’s devotion',
    author: 'Solomon'
  },
  // Major Prophets (5)
  {
    id: 'ISA',
    name: 'Isaiah',
    testament: 'OT',
    category: 'Major Prophets',
    order: 23,
    chaptersCount: 66,
    totalVerses: 1292,
    approxChapterVerses: [31, 22, 26, 6, 30, 13, 25, 22, 21, 34, 16, 6, 22, 32, 9, 14, 14, 7, 25, 6, 17, 25, 18, 23, 12, 21, 13, 29, 24, 33, 9, 20, 24, 17, 10, 22, 38, 22, 8, 31, 29, 25, 28, 28, 25, 13, 15, 22, 26, 11, 23, 15, 12, 17, 13, 12, 21, 14, 21, 22, 11, 12, 19, 12, 25, 24],
    startGlobalChapter: 679,
    theme: 'The Holy One of Israel, the Suffering Servant, and the New Creation',
    author: 'Isaiah'
  },
  {
    id: 'JER',
    name: 'Jeremiah',
    testament: 'OT',
    category: 'Major Prophets',
    order: 24,
    chaptersCount: 52,
    totalVerses: 1364,
    approxChapterVerses: [19, 37, 25, 31, 31, 30, 34, 22, 26, 25, 23, 17, 27, 22, 21, 21, 27, 23, 15, 18, 14, 30, 40, 10, 38, 24, 22, 17, 32, 24, 40, 44, 26, 22, 19, 32, 21, 28, 18, 16, 18, 22, 13, 30, 5, 28, 7, 47, 39, 46, 64, 34],
    startGlobalChapter: 745,
    theme: 'Impending judgment, weeping prophet, and the New Covenant',
    author: 'Jeremiah'
  },
  {
    id: 'LAM',
    name: 'Lamentations',
    testament: 'OT',
    category: 'Major Prophets',
    order: 25,
    chaptersCount: 5,
    totalVerses: 154,
    approxChapterVerses: [22, 22, 66, 22, 22],
    startGlobalChapter: 797,
    theme: 'Grief over fallen Jerusalem and God’s enduring mercies',
    author: 'Jeremiah'
  },
  {
    id: 'EZK',
    name: 'Ezekiel',
    testament: 'OT',
    category: 'Major Prophets',
    order: 26,
    chaptersCount: 48,
    totalVerses: 1273,
    approxChapterVerses: [28, 10, 27, 17, 17, 14, 27, 18, 11, 22, 25, 28, 23, 23, 8, 63, 24, 32, 14, 49, 32, 31, 49, 27, 17, 21, 36, 26, 21, 26, 18, 32, 33, 31, 15, 38, 28, 23, 29, 49, 26, 20, 27, 31, 25, 24, 23, 35],
    startGlobalChapter: 802,
    theme: 'The glory of God, the valley of dry bones, and the new temple',
    author: 'Ezekiel'
  },
  {
    id: 'DAN',
    name: 'Daniel',
    testament: 'OT',
    category: 'Major Prophets',
    order: 27,
    chaptersCount: 12,
    totalVerses: 357,
    approxChapterVerses: [21, 49, 30, 37, 31, 28, 28, 27, 27, 21, 45, 13],
    startGlobalChapter: 850,
    theme: 'God’s everlasting Kingdom and apocalyptic visions of world empires',
    author: 'Daniel'
  },
  // Minor Prophets (12)
  {
    id: 'HOS',
    name: 'Hosea',
    testament: 'OT',
    category: 'Minor Prophets',
    order: 28,
    chaptersCount: 14,
    totalVerses: 197,
    approxChapterVerses: [11, 23, 5, 19, 15, 11, 16, 14, 17, 15, 12, 14, 16, 9],
    startGlobalChapter: 862,
    theme: 'Unfailing covenant love for unfaithful people',
    author: 'Hosea'
  },
  {
    id: 'JOL',
    name: 'Joel',
    testament: 'OT',
    category: 'Minor Prophets',
    order: 29,
    chaptersCount: 3,
    totalVerses: 73,
    approxChapterVerses: [20, 32, 21],
    startGlobalChapter: 876,
    theme: 'The Day of the LORD and outpouring of the Holy Spirit',
    author: 'Joel'
  },
  {
    id: 'AMO',
    name: 'Amos',
    testament: 'OT',
    category: 'Minor Prophets',
    order: 30,
    chaptersCount: 9,
    totalVerses: 146,
    approxChapterVerses: [15, 16, 15, 13, 27, 14, 17, 14, 15],
    startGlobalChapter: 879,
    theme: 'Let justice roll down like waters',
    author: 'Amos'
  },
  {
    id: 'OBA',
    name: 'Obadiah',
    testament: 'OT',
    category: 'Minor Prophets',
    order: 31,
    chaptersCount: 1,
    totalVerses: 21,
    approxChapterVerses: [21],
    startGlobalChapter: 888,
    theme: 'Judgment on Edom and restoration of Zion',
    author: 'Obadiah'
  },
  {
    id: 'JON',
    name: 'Jonah',
    testament: 'OT',
    category: 'Minor Prophets',
    order: 32,
    chaptersCount: 4,
    totalVerses: 48,
    approxChapterVerses: [17, 10, 10, 11],
    startGlobalChapter: 889,
    theme: 'God’s boundless mercy to the nations',
    author: 'Jonah'
  },
  {
    id: 'MIC',
    name: 'Micah',
    testament: 'OT',
    category: 'Minor Prophets',
    order: 33,
    chaptersCount: 7,
    totalVerses: 105,
    approxChapterVerses: [16, 13, 12, 13, 15, 16, 20],
    startGlobalChapter: 893,
    theme: 'To act justly, love mercy, and walk humbly with your God',
    author: 'Micah'
  },
  {
    id: 'NAM',
    name: 'Nahum',
    testament: 'OT',
    category: 'Minor Prophets',
    order: 34,
    chaptersCount: 3,
    totalVerses: 47,
    approxChapterVerses: [15, 13, 19],
    startGlobalChapter: 900,
    theme: 'Judgment on Nineveh and refuge in the LORD',
    author: 'Nahum'
  },
  {
    id: 'HAB',
    name: 'Habakkuk',
    testament: 'OT',
    category: 'Minor Prophets',
    order: 35,
    chaptersCount: 3,
    totalVerses: 56,
    approxChapterVerses: [17, 20, 19],
    startGlobalChapter: 903,
    theme: 'The just shall live by faith',
    author: 'Habakkuk'
  },
  {
    id: 'ZEP',
    name: 'Zephaniah',
    testament: 'OT',
    category: 'Minor Prophets',
    order: 36,
    chaptersCount: 3,
    totalVerses: 53,
    approxChapterVerses: [18, 15, 20],
    startGlobalChapter: 906,
    theme: 'The great Day of the LORD and joyful restoration',
    author: 'Zephaniah'
  },
  {
    id: 'HAG',
    name: 'Haggai',
    testament: 'OT',
    category: 'Minor Prophets',
    order: 37,
    chaptersCount: 2,
    totalVerses: 38,
    approxChapterVerses: [15, 23],
    startGlobalChapter: 909,
    theme: 'Consider your ways and build the house of God',
    author: 'Haggai'
  },
  {
    id: 'ZEC',
    name: 'Zechariah',
    testament: 'OT',
    category: 'Minor Prophets',
    order: 38,
    chaptersCount: 14,
    totalVerses: 211,
    approxChapterVerses: [21, 13, 10, 14, 11, 15, 14, 23, 17, 12, 17, 14, 9, 21],
    startGlobalChapter: 911,
    theme: 'Visions of the coming Messiah King and the Branch',
    author: 'Zechariah'
  },
  {
    id: 'MAL',
    name: 'Malachi',
    testament: 'OT',
    category: 'Minor Prophets',
    order: 39,
    chaptersCount: 4,
    totalVerses: 55,
    approxChapterVerses: [14, 17, 18, 6],
    startGlobalChapter: 925,
    theme: 'The Sun of Righteousness rising with healing in His wings',
    author: 'Malachi'
  },

  // --- NEW TESTAMENT (27 Books, 260 Chapters) ---
  // Gospels (4)
  {
    id: 'MAT',
    name: 'Matthew',
    testament: 'NT',
    category: 'Gospels',
    order: 40,
    chaptersCount: 28,
    totalVerses: 1071,
    approxChapterVerses: [25, 23, 17, 25, 48, 34, 29, 34, 38, 42, 30, 50, 58, 36, 39, 28, 27, 35, 30, 34, 46, 46, 39, 51, 46, 75, 66, 20],
    startGlobalChapter: 929,
    theme: 'Jesus Christ the Promised Messiah and King of the Jews',
    author: 'Matthew (Levi)'
  },
  {
    id: 'MRK',
    name: 'Mark',
    testament: 'NT',
    category: 'Gospels',
    order: 41,
    chaptersCount: 16,
    totalVerses: 678,
    approxChapterVerses: [45, 28, 35, 41, 43, 56, 37, 38, 50, 52, 33, 44, 37, 72, 47, 20],
    startGlobalChapter: 957,
    theme: 'Jesus the Servant who gave His life as a ransom for many',
    author: 'John Mark'
  },
  {
    id: 'LUK',
    name: 'Luke',
    testament: 'NT',
    category: 'Gospels',
    order: 42,
    chaptersCount: 24,
    totalVerses: 1151,
    approxChapterVerses: [80, 52, 38, 44, 39, 49, 50, 56, 62, 42, 54, 59, 35, 35, 32, 31, 37, 43, 48, 47, 38, 71, 56, 53],
    startGlobalChapter: 973,
    theme: 'Jesus the Son of Man who came to seek and save the lost',
    author: 'Luke'
  },
  {
    id: 'JHN',
    name: 'John',
    testament: 'NT',
    category: 'Gospels',
    order: 43,
    chaptersCount: 21,
    totalVerses: 879,
    approxChapterVerses: [51, 25, 36, 54, 47, 71, 53, 59, 41, 42, 57, 50, 38, 31, 27, 33, 26, 40, 42, 31, 25],
    startGlobalChapter: 997,
    theme: 'Jesus the Word made flesh, the Son of God, and eternal life',
    author: 'John the Apostle'
  },
  // Church History (1)
  {
    id: 'ACT',
    name: 'Acts',
    testament: 'NT',
    category: 'Church History',
    order: 44,
    chaptersCount: 28,
    totalVerses: 1007,
    approxChapterVerses: [26, 47, 26, 37, 42, 15, 60, 40, 43, 48, 30, 25, 52, 28, 41, 40, 34, 28, 41, 38, 40, 30, 35, 27, 27, 32, 44, 31],
    startGlobalChapter: 1018,
    theme: 'The Holy Spirit and the explosion of the early Church',
    author: 'Luke'
  },
  // Pauline Epistles (13)
  {
    id: 'ROM',
    name: 'Romans',
    testament: 'NT',
    category: 'Pauline Epistles',
    order: 45,
    chaptersCount: 16,
    totalVerses: 433,
    approxChapterVerses: [32, 29, 31, 25, 21, 23, 25, 39, 33, 21, 36, 21, 14, 23, 33, 27],
    startGlobalChapter: 1046,
    theme: 'Justification by faith, the righteousness of God, and life in the Spirit',
    author: 'Paul'
  },
  {
    id: '1CO',
    name: '1 Corinthians',
    testament: 'NT',
    category: 'Pauline Epistles',
    order: 46,
    chaptersCount: 16,
    totalVerses: 437,
    approxChapterVerses: [31, 16, 23, 21, 13, 20, 40, 13, 27, 33, 34, 31, 13, 40, 58, 24],
    startGlobalChapter: 1062,
    theme: 'Unity in Christ, spiritual gifts, love, and the resurrection',
    author: 'Paul'
  },
  {
    id: '2CO',
    name: '2 Corinthians',
    testament: 'NT',
    category: 'Pauline Epistles',
    order: 47,
    chaptersCount: 13,
    totalVerses: 257,
    approxChapterVerses: [24, 17, 18, 18, 21, 18, 16, 24, 15, 18, 33, 21, 14],
    startGlobalChapter: 1078,
    theme: 'Ministry of reconciliation and strength in weakness',
    author: 'Paul'
  },
  {
    id: 'GAL',
    name: 'Galatians',
    testament: 'NT',
    category: 'Pauline Epistles',
    order: 48,
    chaptersCount: 6,
    totalVerses: 149,
    approxChapterVerses: [24, 21, 29, 31, 26, 18],
    startGlobalChapter: 1091,
    theme: 'Christian freedom through grace, not the works of the law',
    author: 'Paul'
  },
  {
    id: 'EPH',
    name: 'Ephesians',
    testament: 'NT',
    category: 'Pauline Epistles',
    order: 49,
    chaptersCount: 6,
    totalVerses: 155,
    approxChapterVerses: [23, 22, 21, 32, 33, 24],
    startGlobalChapter: 1097,
    theme: 'The mystery of Christ, the Church His body, and the armor of God',
    author: 'Paul'
  },
  {
    id: 'PHP',
    name: 'Philippians',
    testament: 'NT',
    category: 'Pauline Epistles',
    order: 50,
    chaptersCount: 4,
    totalVerses: 104,
    approxChapterVerses: [30, 30, 21, 23],
    startGlobalChapter: 1103,
    theme: 'Joy in Christ and pressing on toward the upward call',
    author: 'Paul'
  },
  {
    id: 'COL',
    name: 'Colossians',
    testament: 'NT',
    category: 'Pauline Epistles',
    order: 51,
    chaptersCount: 4,
    totalVerses: 95,
    approxChapterVerses: [29, 23, 25, 18],
    startGlobalChapter: 1107,
    theme: 'The supreme preeminence and all-sufficiency of Christ',
    author: 'Paul'
  },
  {
    id: '1TH',
    name: '1 Thessalonians',
    testament: 'NT',
    category: 'Pauline Epistles',
    order: 52,
    chaptersCount: 5,
    totalVerses: 89,
    approxChapterVerses: [10, 20, 13, 18, 28],
    startGlobalChapter: 1111,
    theme: 'Hope in the Lord’s return and holy living',
    author: 'Paul'
  },
  {
    id: '2TH',
    name: '2 Thessalonians',
    testament: 'NT',
    category: 'Pauline Epistles',
    order: 53,
    chaptersCount: 3,
    totalVerses: 47,
    approxChapterVerses: [12, 17, 18],
    startGlobalChapter: 1116,
    theme: 'Steadfastness before the coming of Christ',
    author: 'Paul'
  },
  {
    id: '1TI',
    name: '1 Timothy',
    testament: 'NT',
    category: 'Pauline Epistles',
    order: 54,
    chaptersCount: 6,
    totalVerses: 113,
    approxChapterVerses: [20, 15, 16, 16, 25, 21],
    startGlobalChapter: 1119,
    theme: 'Pastoral leadership, sound doctrine, and church order',
    author: 'Paul'
  },
  {
    id: '2TI',
    name: '2 Timothy',
    testament: 'NT',
    category: 'Pauline Epistles',
    order: 55,
    chaptersCount: 4,
    totalVerses: 83,
    approxChapterVerses: [18, 26, 17, 22],
    startGlobalChapter: 1125,
    theme: 'Faithful endurance, inspired Scripture, and finishing the race',
    author: 'Paul'
  },
  {
    id: 'TIT',
    name: 'Titus',
    testament: 'NT',
    category: 'Pauline Epistles',
    order: 56,
    chaptersCount: 3,
    totalVerses: 46,
    approxChapterVerses: [16, 15, 15],
    startGlobalChapter: 1129,
    theme: 'Godly character and sound teaching in the church',
    author: 'Paul'
  },
  {
    id: 'PHM',
    name: 'Philemon',
    testament: 'NT',
    category: 'Pauline Epistles',
    order: 57,
    chaptersCount: 1,
    totalVerses: 25,
    approxChapterVerses: [25],
    startGlobalChapter: 1132,
    theme: 'Brotherly forgiveness in Christ for Onesimus',
    author: 'Paul'
  },
  // General Epistles (8)
  {
    id: 'HEB',
    name: 'Hebrews',
    testament: 'NT',
    category: 'General Epistles',
    order: 58,
    chaptersCount: 13,
    totalVerses: 303,
    approxChapterVerses: [14, 18, 19, 16, 14, 20, 28, 13, 28, 39, 40, 29, 25],
    startGlobalChapter: 1133,
    theme: 'Jesus our High Priest, superior to angels, Moses, and the old covenant',
    author: 'Paul / Apollos / Unknown'
  },
  {
    id: 'JAS',
    name: 'James',
    testament: 'NT',
    category: 'General Epistles',
    order: 59,
    chaptersCount: 5,
    totalVerses: 108,
    approxChapterVerses: [27, 26, 18, 17, 20],
    startGlobalChapter: 1146,
    theme: 'Living faith demonstrated through works of love',
    author: 'James the brother of Jesus'
  },
  {
    id: '1PE',
    name: '1 Peter',
    testament: 'NT',
    category: 'General Epistles',
    order: 60,
    chaptersCount: 5,
    totalVerses: 105,
    approxChapterVerses: [25, 25, 22, 19, 14],
    startGlobalChapter: 1151,
    theme: 'Living hope amidst suffering and the pilgrim life',
    author: 'Peter'
  },
  {
    id: '2PE',
    name: '2 Peter',
    testament: 'NT',
    category: 'General Epistles',
    order: 61,
    chaptersCount: 3,
    totalVerses: 61,
    approxChapterVerses: [21, 22, 18],
    startGlobalChapter: 1156,
    theme: 'Growing in grace and warning against false teachers',
    author: 'Peter'
  },
  {
    id: '1JN',
    name: '1 John',
    testament: 'NT',
    category: 'General Epistles',
    order: 62,
    chaptersCount: 5,
    totalVerses: 105,
    approxChapterVerses: [10, 29, 24, 21, 21],
    startGlobalChapter: 1159,
    theme: 'God is light, God is love, and assurance of eternal life',
    author: 'John the Apostle'
  },
  {
    id: '2JN',
    name: '2 John',
    testament: 'NT',
    category: 'General Epistles',
    order: 63,
    chaptersCount: 1,
    totalVerses: 13,
    approxChapterVerses: [13],
    startGlobalChapter: 1164,
    theme: 'Walking in truth and Christian love',
    author: 'John the Apostle'
  },
  {
    id: '3JN',
    name: '3 John',
    testament: 'NT',
    category: 'General Epistles',
    order: 64,
    chaptersCount: 1,
    totalVerses: 14,
    approxChapterVerses: [14],
    startGlobalChapter: 1165,
    theme: 'Hospitality to fellow workers for the truth',
    author: 'John the Apostle'
  },
  {
    id: 'JUD',
    name: 'Jude',
    testament: 'NT',
    category: 'General Epistles',
    order: 65,
    chaptersCount: 1,
    totalVerses: 25,
    approxChapterVerses: [25],
    startGlobalChapter: 1166,
    theme: 'Contending earnestly for the faith once delivered to the saints',
    author: 'Jude'
  },
  // Apocalyptic (1)
  {
    id: 'REV',
    name: 'Revelation',
    testament: 'NT',
    category: 'Apocalyptic',
    order: 66,
    chaptersCount: 22,
    totalVerses: 404,
    approxChapterVerses: [20, 29, 22, 11, 14, 17, 17, 13, 21, 11, 19, 17, 18, 20, 8, 21, 18, 24, 21, 15, 27, 21],
    startGlobalChapter: 1167,
    theme: 'The triumphant return of the Lamb, victory over evil, and the New Jerusalem',
    author: 'John the Apostle'
  }
];

export const TOTAL_CHAPTERS = 1189; // 929 OT + 260 NT
export const TOTAL_CROSS_REFERENCES_COUNT = 63779; // Christoph Römhild & Chris Harrison canonical count

export function getBookById(id: string): BibleBook | undefined {
  return BIBLE_BOOKS.find(b => b.id.toUpperCase() === id.toUpperCase());
}

export function getBookByName(name: string): BibleBook | undefined {
  const clean = name.trim().toLowerCase();
  return BIBLE_BOOKS.find(b => b.name.toLowerCase() === clean);
}

export function getGlobalChapterIndex(bookName: string, chapter: number): number {
  const book = getBookByName(bookName);
  if (!book) return 0;
  return book.startGlobalChapter + Math.max(0, chapter - 1);
}

export function getBookAndChapterFromGlobal(globalIndex: number): { book: BibleBook; chapter: number } {
  const clamped = Math.max(0, Math.min(TOTAL_CHAPTERS - 1, globalIndex));
  for (let i = BIBLE_BOOKS.length - 1; i >= 0; i--) {
    if (clamped >= BIBLE_BOOKS[i].startGlobalChapter) {
      return {
        book: BIBLE_BOOKS[i],
        chapter: clamped - BIBLE_BOOKS[i].startGlobalChapter + 1
      };
    }
  }
  return { book: BIBLE_BOOKS[0], chapter: 1 };
}
