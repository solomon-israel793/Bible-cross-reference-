import { BibleVerse, BibleVersion } from '../types/bible';
import { getBookByName } from './canon';

// Pre-bundled, pristine scripture text for core biblical chapters in KJV and NIV
export const BUNDLED_SCRIPTURE: Record<string, BibleVerse[]> = {
  // Genesis 1
  'Genesis-1': [
    {
      book: 'Genesis', bookId: 'GEN', chapter: 1, verse: 1,
      textKJV: 'In the beginning God created the heaven and the earth.',
      textNIV: 'In the beginning God created the heavens and the earth.',
      textBSB: 'In the beginning God created the heavens and the earth.'
    },
    {
      book: 'Genesis', bookId: 'GEN', chapter: 1, verse: 2,
      textKJV: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.',
      textNIV: 'Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.',
      textBSB: 'Now the earth was formless and void, and darkness was over the surface of the deep. And the Spirit of God was hovering over the surface of the waters.'
    },
    {
      book: 'Genesis', bookId: 'GEN', chapter: 1, verse: 3,
      textKJV: 'And God said, Let there be light: and there was light.',
      textNIV: 'And God said, "Let there be light," and there was light.',
      textBSB: 'And God said, "Let there be light," and there was light.'
    },
    {
      book: 'Genesis', bookId: 'GEN', chapter: 1, verse: 4,
      textKJV: 'And God saw the light, that it was good: and God divided the light from the darkness.',
      textNIV: 'God saw that the light was good, and he separated the light from the darkness.',
      textBSB: 'And God saw that the light was good, and He separated the light from the darkness.'
    },
    {
      book: 'Genesis', bookId: 'GEN', chapter: 1, verse: 5,
      textKJV: 'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.',
      textNIV: 'God called the light "day," and the darkness he called "night." And there was evening, and there was morning—the first day.',
      textBSB: 'God called the light "day," and the darkness He called "night." And there was evening, and there was morning—the first day.'
    },
    {
      book: 'Genesis', bookId: 'GEN', chapter: 1, verse: 26,
      textKJV: 'And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth.',
      textNIV: 'Then God said, "Let us make mankind in our image, in our likeness, so that they may rule over the fish in the sea and the birds in the sky, over the livestock and all the wild animals, and over all the creatures that move along the ground."',
      textBSB: 'Then God said, "Let Us make man in Our image, after Our likeness, to rule over the fish of the sea and the birds of the air, over the livestock, and over all the earth, and over all the creatures that crawl upon the earth."'
    },
    {
      book: 'Genesis', bookId: 'GEN', chapter: 1, verse: 27,
      textKJV: 'So God created man in his own image, in the image of God created he him; male and female created he them.',
      textNIV: 'So God created mankind in his own image, in the image of God he created them; male and female he created them.',
      textBSB: 'So God created man in His own image; in the image of God He created him; male and female He created them.'
    },
    {
      book: 'Genesis', bookId: 'GEN', chapter: 1, verse: 31,
      textKJV: 'And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day.',
      textNIV: 'God saw all that he had made, and it was very good. And there was evening, and there was morning—the sixth day.',
      textBSB: 'And God looked upon all that He had made, and indeed, it was very good. And there was evening, and there was morning—the sixth day.'
    }
  ],

  // Ezekiel 3 (Matches user screenshot)
  'Ezekiel-3': [
    {
      book: 'Ezekiel', bookId: 'EZK', chapter: 3, verse: 1,
      textKJV: 'Moreover he said unto me, Son of man, eat that thou findest; eat this roll, and go speak unto the house of Israel.',
      textNIV: 'And he said to me, "Son of man, eat what is before you, eat this scroll; then go and speak to the people of Israel."',
      textBSB: 'Son of man, He said to me, "Eat what you find here. Eat this scroll, then go and speak to the house of Israel."'
    },
    {
      book: 'Ezekiel', bookId: 'EZK', chapter: 3, verse: 2,
      textKJV: 'So I opened my mouth, and he caused me to eat that roll.',
      textNIV: 'So I opened my mouth, and he gave me the scroll to eat.',
      textBSB: 'So I opened my mouth, and He fed me the scroll.'
    },
    {
      book: 'Ezekiel', bookId: 'EZK', chapter: 3, verse: 3,
      textKJV: 'And he said unto me, Son of man, cause thy belly to eat, and fill thy bowels with this roll that I give thee. Then did I eat it; and it was in my mouth as honey for sweetness.',
      textNIV: 'Then he said to me, "Son of man, eat this scroll I am giving you and fill your stomach with it." So I ate it, and it tasted as sweet as honey in my mouth.',
      textBSB: '"Son of man," He said to me, "feed your stomach and fill your belly with this scroll I am giving you." So I ate it, and it was as sweet as honey in my mouth.'
    },
    {
      book: 'Ezekiel', bookId: 'EZK', chapter: 3, verse: 4,
      textKJV: 'And he said unto me, Son of man, go, get thee unto the house of Israel, and speak with my words unto them.',
      textNIV: 'He then said to me: "Son of man, go now to the people of Israel and speak my words to them.',
      textBSB: 'Then He said to me, "Son of man, go now to the house of Israel and speak My words to them.'
    },
    {
      book: 'Ezekiel', bookId: 'EZK', chapter: 3, verse: 5,
      textKJV: 'For thou art not sent to a people of a strange speech and of an hard language, but to the house of Israel;',
      textNIV: 'You are not being sent to a people of obscure speech and strange language, but to the people of Israel—',
      textBSB: 'For you are not being sent to a people of unfamiliar speech or difficult language, but to the house of Israel—'
    },
    {
      book: 'Ezekiel', bookId: 'EZK', chapter: 3, verse: 6,
      textKJV: 'Not to many people of a strange speech and of an hard language, whose words thou canst not understand. Surely, had I sent thee to them, they would have hearkened unto thee.',
      textNIV: 'not to many peoples of obscure speech and strange language, whose words you cannot understand. Surely if I had sent you to them, they would have listened to you.',
      textBSB: 'not to many peoples of unfamiliar speech and difficult language, whose words you cannot understand. Surely if I had sent you to them, they would have listened to you.'
    },
    {
      book: 'Ezekiel', bookId: 'EZK', chapter: 3, verse: 7,
      textKJV: 'But the house of Israel will not hearken unto thee; for they will not hearken unto me: for all the house of Israel are impudent and hardhearted.',
      textNIV: 'But the people of Israel are not willing to listen to you because they are not willing to listen to me, for all the Israelites are hardened and obstinate.',
      textBSB: 'But the house of Israel will be unwilling to listen to you, because they are unwilling to listen to Me; for the entire house of Israel is obstinate and stubborn.'
    },
    {
      book: 'Ezekiel', bookId: 'EZK', chapter: 3, verse: 8,
      textKJV: 'Behold, I have made thy face strong against their faces, and thy forehead strong against their foreheads.',
      textNIV: 'But I will make you as unyielding and hardened as they are.',
      textBSB: 'Behold, I have made your face as hard as their faces, and your forehead as hard as their foreheads.'
    },
    {
      book: 'Ezekiel', bookId: 'EZK', chapter: 3, verse: 9,
      textKJV: 'As an adamant harder than flint have I made thy forehead: fear them not, neither be dismayed at their looks, though they be a rebellious house.',
      textNIV: 'I will make your forehead like the hardest stone, harder than flint. Do not be afraid of them or terrified by them, though they are a rebellious people."',
      textBSB: 'I have made your forehead like diamond, harder than flint. Do not be afraid of them or dismayed by their looks, for they are a rebellious house."'
    },
    {
      book: 'Ezekiel', bookId: 'EZK', chapter: 3, verse: 10,
      textKJV: 'Moreover he said unto me, Son of man, all my words that I shall speak unto thee receive in thine heart, and hear with thine ears.',
      textNIV: 'And he said to me, "Son of man, listen carefully and take to heart all the words I speak to you.',
      textBSB: 'And He said to me, "Son of man, receive into your heart and hear with your ears all the words that I speak to you.'
    },
    {
      book: 'Ezekiel', bookId: 'EZK', chapter: 3, verse: 11,
      textKJV: 'And go, get thee to them of the captivity, unto the children of thy people, and speak unto them, and tell them, Thus saith the Lord GOD; whether they will hear, or whether they will forbear.',
      textNIV: 'Go now to your people in exile and speak to them. Say to them, \'This is what the Sovereign LORD says,\' whether they listen or fail to listen."',
      textBSB: 'Go to your people, the exiles, and speak to them. Tell them, \'This is what the Lord GOD says,\' whether they listen or refuse to listen."'
    }
  ],

  // Psalm 23
  'Psalms-23': [
    {
      book: 'Psalms', bookId: 'PSA', chapter: 23, verse: 1,
      textKJV: 'The LORD is my shepherd; I shall not want.',
      textNIV: 'The LORD is my shepherd, I lack nothing.',
      textBSB: 'The LORD is my shepherd; I shall not want.'
    },
    {
      book: 'Psalms', bookId: 'PSA', chapter: 23, verse: 2,
      textKJV: 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.',
      textNIV: 'He makes me lie down in green pastures, he leads me beside quiet waters,',
      textBSB: 'He makes me lie down in green pastures; He leads me beside quiet waters.'
    },
    {
      book: 'Psalms', bookId: 'PSA', chapter: 23, verse: 3,
      textKJV: 'He restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake.',
      textNIV: 'he refreshes my soul. He guides me along the right paths for his name’s sake.',
      textBSB: 'He restores my soul; He guides me in the paths of righteousness for the sake of His name.'
    },
    {
      book: 'Psalms', bookId: 'PSA', chapter: 23, verse: 4,
      textKJV: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.',
      textNIV: 'Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.',
      textBSB: 'Even though I walk through the valley of the shadow of death, I will fear no evil, for You are with me; Your rod and Your staff, they comfort me.'
    },
    {
      book: 'Psalms', bookId: 'PSA', chapter: 23, verse: 5,
      textKJV: 'Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.',
      textNIV: 'You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows.',
      textBSB: 'You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows.'
    },
    {
      book: 'Psalms', bookId: 'PSA', chapter: 23, verse: 6,
      textKJV: 'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.',
      textNIV: 'Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the LORD forever.',
      textBSB: 'Surely goodness and mercy will follow me all the days of my life, and I will dwell in the house of the LORD forever.'
    }
  ],

  // Psalm 1
  'Psalms-1': [
    {
      book: 'Psalms', bookId: 'PSA', chapter: 1, verse: 1,
      textKJV: 'Blessed is the man that walketh not in the counsel of the ungodly, nor standeth in the way of sinners, nor sitteth in the seat of the scornful.',
      textNIV: 'Blessed is the one who does not walk in step with the wicked or stand in the way that sinners take or sit in the company of mockers,',
      textBSB: 'Blessed is the man who does not walk in the counsel of the wicked, or set foot on the path of sinners, or sit in the seat of mockers.'
    },
    {
      book: 'Psalms', bookId: 'PSA', chapter: 1, verse: 2,
      textKJV: 'But his delight is in the law of the LORD; and in his law doth he meditate day and night.',
      textNIV: 'but whose delight is in the law of the LORD, and who meditates on his law day and night.',
      textBSB: 'But his delight is in the Law of the LORD, and on His law he meditates day and night.'
    },
    {
      book: 'Psalms', bookId: 'PSA', chapter: 1, verse: 3,
      textKJV: 'And he shall be like a tree planted by the rivers of water, that bringeth forth his fruit in his season; his leaf also shall not wither; and whatsoever he doeth shall prosper.',
      textNIV: 'That person is like a tree planted by streams of water, which yields its fruit in season and whose leaf does not wither—whatever they do prospers.',
      textBSB: 'He is like a tree planted by streams of water, yielding its fruit in season, whose leaf does not wither, and who prospers in all he does.'
    },
    {
      book: 'Psalms', bookId: 'PSA', chapter: 1, verse: 4,
      textKJV: 'The ungodly are not so: but are like the chaff which the wind driveth away.',
      textNIV: 'Not so the wicked! They are like chaff that the wind blows away.',
      textBSB: 'Not so the wicked! For they are like chaff driven off by the wind.'
    },
    {
      book: 'Psalms', bookId: 'PSA', chapter: 1, verse: 5,
      textKJV: 'Therefore the ungodly shall not stand in the judgment, nor sinners in the congregation of the righteous.',
      textNIV: 'Therefore the wicked will not stand in the judgment, nor sinners in the assembly of the righteous.',
      textBSB: 'Therefore the wicked will not stand in the judgment, nor sinners in the assembly of the righteous.'
    },
    {
      book: 'Psalms', bookId: 'PSA', chapter: 1, verse: 6,
      textKJV: 'For the LORD knoweth the way of the righteous: but the way of the ungodly shall perish.',
      textNIV: 'For the LORD watches over the way of the righteous, but the way of the wicked leads to destruction.',
      textBSB: 'For the LORD guards the path of the righteous, but the way of the wicked will perish.'
    }
  ],

  // Isaiah 53
  'Isaiah-53': [
    {
      book: 'Isaiah', bookId: 'ISA', chapter: 53, verse: 1,
      textKJV: 'Who hath believed our report? and to whom is the arm of the LORD revealed?',
      textNIV: 'Who has believed our message and to whom has the arm of the LORD been revealed?',
      textBSB: 'Who has believed our message? And to whom has the arm of the LORD been revealed?'
    },
    {
      book: 'Isaiah', bookId: 'ISA', chapter: 53, verse: 3,
      textKJV: 'He is despised and rejected of men; a man of sorrows, and acquainted with grief: and we hid as it were our faces from him; he was despised, and we esteemed him not.',
      textNIV: 'He was despised and rejected by mankind, a man of suffering, and familiar with pain. Like one from whom people hide their faces he was despised, and we held him in low esteem.',
      textBSB: 'He was despised and rejected by men, a man of sorrows, acquainted with grief, in contrast to one from whom men hide their faces. He was despised, and we esteemed Him not.'
    },
    {
      book: 'Isaiah', bookId: 'ISA', chapter: 53, verse: 5,
      textKJV: 'But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed.',
      textNIV: 'But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.',
      textBSB: 'But He was pierced for our transgressions, He was crushed for our iniquities; the punishment that brought our peace was on Him, and by His stripes we are healed.'
    },
    {
      book: 'Isaiah', bookId: 'ISA', chapter: 53, verse: 6,
      textKJV: 'All we like sheep have gone astray; we have turned every one to his own way; and the LORD hath laid on him the iniquity of us all.',
      textNIV: 'We all, like sheep, have gone astray, each of us has turned to our own way; and the LORD has laid on him the iniquity of us all.',
      textBSB: 'We all like sheep have gone astray, each one has turned to his own way; and the LORD has laid upon Him the iniquity of us all.'
    }
  ],

  // Matthew 5 (Sermon on the Mount Beatitudes)
  'Matthew-5': [
    {
      book: 'Matthew', bookId: 'MAT', chapter: 5, verse: 1,
      textKJV: 'And seeing the multitudes, he went up into a mountain: and when he was set, his disciples came unto him:',
      textNIV: 'Now when Jesus saw the crowds, he went up on a mountainside and sat down. His disciples came to him,',
      textBSB: 'When Jesus saw the crowds, He went up on the mountain and sat down. His disciples came to Him,'
    },
    {
      book: 'Matthew', bookId: 'MAT', chapter: 5, verse: 2,
      textKJV: 'And he opened his mouth, and taught them, saying,',
      textNIV: 'and he began to teach them. He said:',
      textBSB: 'and He began to teach them, saying:'
    },
    {
      book: 'Matthew', bookId: 'MAT', chapter: 5, verse: 3,
      textKJV: 'Blessed are the poor in spirit: for theirs is the kingdom of heaven.',
      textNIV: 'Blessed are the poor in spirit, for theirs is the kingdom of heaven.',
      textBSB: 'Blessed are the poor in spirit, for theirs is the kingdom of heaven.'
    },
    {
      book: 'Matthew', bookId: 'MAT', chapter: 5, verse: 4,
      textKJV: 'Blessed are they that mourn: for they shall be comforted.',
      textNIV: 'Blessed are those who mourn, for they will be comforted.',
      textBSB: 'Blessed are those who mourn, for they will be comforted.'
    },
    {
      book: 'Matthew', bookId: 'MAT', chapter: 5, verse: 5,
      textKJV: 'Blessed are the meek: for they shall inherit the earth.',
      textNIV: 'Blessed are the meek, for they will inherit the earth.',
      textBSB: 'Blessed are the meek, for they will inherit the earth.'
    },
    {
      book: 'Matthew', bookId: 'MAT', chapter: 5, verse: 6,
      textKJV: 'Blessed are they which do hunger and thirst after righteousness: for they shall be filled.',
      textNIV: 'Blessed are those who hunger and thirst for righteousness, for they will be filled.',
      textBSB: 'Blessed are those who hunger and thirst for righteousness, for they will be filled.'
    },
    {
      book: 'Matthew', bookId: 'MAT', chapter: 5, verse: 7,
      textKJV: 'Blessed are the merciful: for they shall obtain mercy.',
      textNIV: 'Blessed are the merciful, for they will be shown mercy.',
      textBSB: 'Blessed are the merciful, for they will be shown mercy.'
    },
    {
      book: 'Matthew', bookId: 'MAT', chapter: 5, verse: 8,
      textKJV: 'Blessed are the pure in heart: for they shall see God.',
      textNIV: 'Blessed are the pure in heart, for they will see God.',
      textBSB: 'Blessed are the pure in heart, for they will see God.'
    },
    {
      book: 'Matthew', bookId: 'MAT', chapter: 5, verse: 9,
      textKJV: 'Blessed are the peacemakers: for they shall be called the children of God.',
      textNIV: 'Blessed are the peacemakers, for they will be called children of God.',
      textBSB: 'Blessed are the peacemakers, for they will be called sons of God.'
    },
    {
      book: 'Matthew', bookId: 'MAT', chapter: 5, verse: 14,
      textKJV: 'Ye are the light of the world. A city that is set on an hill cannot be hid.',
      textNIV: 'You are the light of the world. A town built on a hill cannot be hidden.',
      textBSB: 'You are the light of the world. A city on a hill cannot be hidden.'
    },
    {
      book: 'Matthew', bookId: 'MAT', chapter: 5, verse: 16,
      textKJV: 'Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven.',
      textNIV: 'In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven.',
      textBSB: 'In the same way, let your light shine before men, that they may see your good deeds and glorify your Father in heaven.'
    }
  ],

  // John 1
  'John-1': [
    {
      book: 'John', bookId: 'JHN', chapter: 1, verse: 1,
      textKJV: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
      textNIV: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
      textBSB: 'In the beginning was the Word, and the Word was with God, and the Word was God.'
    },
    {
      book: 'John', bookId: 'JHN', chapter: 1, verse: 2,
      textKJV: 'The same was in the beginning with God.',
      textNIV: 'He was with God in the beginning.',
      textBSB: 'He was with God in the beginning.'
    },
    {
      book: 'John', bookId: 'JHN', chapter: 1, verse: 3,
      textKJV: 'All things were made by him; and without him was not any thing made that was made.',
      textNIV: 'Through him all things were made; without him nothing was made that has been made.',
      textBSB: 'Through Him all things were made, and without Him nothing was made that has been made.'
    },
    {
      book: 'John', bookId: 'JHN', chapter: 1, verse: 4,
      textKJV: 'In him was life; and the life was the light of men.',
      textNIV: 'In him was life, and that life was the light of all mankind.',
      textBSB: 'In Him was life, and that life was the light of men.'
    },
    {
      book: 'John', bookId: 'JHN', chapter: 1, verse: 5,
      textKJV: 'And the light shineth in darkness; and the darkness comprehended it not.',
      textNIV: 'The light shines in the darkness, and the darkness has not overcome it.',
      textBSB: 'The Light shines in the darkness, and the darkness has not overcome it.'
    },
    {
      book: 'John', bookId: 'JHN', chapter: 1, verse: 14,
      textKJV: 'And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.',
      textNIV: 'The Word became flesh and made his dwelling among us. We have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth.',
      textBSB: 'The Word became flesh and made His dwelling among us. We have seen His glory, the glory of the one and only Son from the Father, full of grace and truth.'
    },
    {
      book: 'John', bookId: 'JHN', chapter: 1, verse: 16,
      textKJV: 'And of his fulness have all we received, and grace for grace.',
      textNIV: 'Out of his fullness we have all received grace in place of grace already given.',
      textBSB: 'From His fullness we have all received grace upon grace.'
    },
    {
      book: 'John', bookId: 'JHN', chapter: 1, verse: 17,
      textKJV: 'For the law was given by Moses, but grace and truth came by Jesus Christ.',
      textNIV: 'For the law was given through Moses; grace and truth came through Jesus Christ.',
      textBSB: 'For the law was given through Moses; grace and truth came through Jesus Christ.'
    },
    {
      book: 'John', bookId: 'JHN', chapter: 1, verse: 29,
      textKJV: 'The next day John seeth Jesus coming unto him, and saith, Behold the Lamb of God, which taketh away the sin of the world.',
      textNIV: 'The next day John saw Jesus coming toward him and said, "Look, the Lamb of God, who takes away the sin of the world!"',
      textBSB: 'The next day John saw Jesus coming toward him and said, "Look, the Lamb of God, who takes away the sin of the world!"'
    }
  ],

  // John 3
  'John-3': [
    {
      book: 'John', bookId: 'JHN', chapter: 3, verse: 1,
      textKJV: 'There was a man of the Pharisees, named Nicodemus, a ruler of the Jews:',
      textNIV: 'Now there was a Pharisee, a man named Nicodemus who was a member of the Jewish ruling council.',
      textBSB: 'Now there was a man of the Pharisees named Nicodemus, a leader of the Jews.'
    },
    {
      book: 'John', bookId: 'JHN', chapter: 3, verse: 3,
      textKJV: 'Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.',
      textNIV: 'Jesus replied, "Very truly I tell you, no one can see the kingdom of God unless they are born again."',
      textBSB: 'Jesus replied, "Truly, truly, I tell you, no one can see the kingdom of God unless he is born again."'
    },
    {
      book: 'John', bookId: 'JHN', chapter: 3, verse: 14,
      textKJV: 'And as Moses lifted up the serpent in the wilderness, even so must the Son of man be lifted up:',
      textNIV: 'Just as Moses lifted up the snake in the wilderness, so the Son of Man must be lifted up,',
      textBSB: 'Just as Moses lifted up the snake in the wilderness, so the Son of Man must be lifted up,'
    },
    {
      book: 'John', bookId: 'JHN', chapter: 3, verse: 15,
      textKJV: 'That whosoever believeth in him should not perish, but have eternal life.',
      textNIV: 'that everyone who believes may have eternal life in him.',
      textBSB: 'that everyone who believes in Him may have eternal life.'
    },
    {
      book: 'John', bookId: 'JHN', chapter: 3, verse: 16,
      textKJV: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
      textNIV: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
      textBSB: 'For God so loved the world that He gave His one and only Son, that everyone who believes in Him shall not perish but have eternal life.'
    },
    {
      book: 'John', bookId: 'JHN', chapter: 3, verse: 17,
      textKJV: 'For God sent not his Son into the world to condemn the world; but that the world through him might be saved.',
      textNIV: 'For God did not send his Son into the world to condemn the world, but to save the world through him.',
      textBSB: 'For God did not send His Son into the world to condemn the world, but that the world through Him might be saved.'
    }
  ],

  // Romans 8
  'Romans-8': [
    {
      book: 'Romans', bookId: 'ROM', chapter: 8, verse: 1,
      textKJV: 'There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit.',
      textNIV: 'Therefore, there is now no condemnation for those who are in Christ Jesus,',
      textBSB: 'Therefore, there is now no condemnation for those who are in Christ Jesus.'
    },
    {
      book: 'Romans', bookId: 'ROM', chapter: 8, verse: 26,
      textKJV: 'Likewise the Spirit also helpeth our infirmities: for we know not what we should pray for as we ought: but the Spirit itself maketh intercession for us with groanings which cannot be uttered.',
      textNIV: 'In the same way, the Spirit helps us in our weakness. We do not know what we ought to pray for, but the Spirit himself intercedes for us through wordless groans.',
      textBSB: 'In the same way, the Spirit helps us in our weakness. For we do not know how we ought to pray, but the Spirit Himself intercedes for us with groans too deep for words.'
    },
    {
      book: 'Romans', bookId: 'ROM', chapter: 8, verse: 28,
      textKJV: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.',
      textNIV: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
      textBSB: 'And we know that God works all things together for the good of those who love Him, who are called according to His purpose.'
    },
    {
      book: 'Romans', bookId: 'ROM', chapter: 8, verse: 31,
      textKJV: 'What shall we then say to these things? If God be for us, who can be against us?',
      textNIV: 'What, then, shall we say in response to these things? If God is for us, who can be against us?',
      textBSB: 'What then shall we say in response to these things? If God is for us, who can be against us?'
    },
    {
      book: 'Romans', bookId: 'ROM', chapter: 8, verse: 38,
      textKJV: 'For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come,',
      textNIV: 'For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers,',
      textBSB: 'For I am convinced that neither death nor life, neither angels nor principalities, neither the present nor the future, nor any powers,'
    },
    {
      book: 'Romans', bookId: 'ROM', chapter: 8, verse: 39,
      textKJV: 'Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.',
      textNIV: 'neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.',
      textBSB: 'neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.'
    }
  ],

  // Revelation 21
  'Revelation-21': [
    {
      book: 'Revelation', bookId: 'REV', chapter: 21, verse: 1,
      textKJV: 'And I saw a new heaven and a new earth: for the first heaven and the first earth were passed away; and there was no more sea.',
      textNIV: 'Then I saw "a new heaven and a new earth," for the first heaven and the first earth had passed away, and there was no longer any sea.',
      textBSB: 'Then I saw a new heaven and a new earth, for the first heaven and the first earth had passed away, and there was no longer any sea.'
    },
    {
      book: 'Revelation', bookId: 'REV', chapter: 21, verse: 2,
      textKJV: 'And I John saw the holy city, new Jerusalem, coming down from God out of heaven, prepared as a bride adorned for her husband.',
      textNIV: 'I saw the Holy City, the new Jerusalem, coming down out of heaven from God, prepared as a bride beautifully dressed for her husband.',
      textBSB: 'I saw the holy city, the new Jerusalem, coming down out of heaven from God, prepared as a bride adorned for her husband.'
    },
    {
      book: 'Revelation', bookId: 'REV', chapter: 21, verse: 3,
      textKJV: 'And I heard a great voice out of heaven saying, Behold, the tabernacle of God is with men, and he will dwell with them, and they shall be his people, and God himself shall be with them, and be their God.',
      textNIV: 'And I heard a loud voice from the throne saying, "Look! God’s dwelling place is now among the people, and he will dwell with them. They will be his people, and God himself will be with them and be their God."',
      textBSB: 'And I heard a loud voice from the throne saying: "Behold, the dwelling place of God is with man, and He will dwell with them. They will be His people, and God Himself will be with them as their God."'
    },
    {
      book: 'Revelation', bookId: 'REV', chapter: 21, verse: 4,
      textKJV: 'And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.',
      textNIV: '"He will wipe every tear from their eyes. There will be no more death" or mourning or crying or pain, for the old order of things has passed away.',
      textBSB: 'He will wipe away every tear from their eyes, and there will be no more death or mourning or crying or pain, for the former things have passed away.'
    },
    {
      book: 'Revelation', bookId: 'REV', chapter: 21, verse: 5,
      textKJV: 'And he that sat upon the throne said, Behold, I make all things new. And he said unto me, Write: for these words are true and faithful.',
      textNIV: 'He who was seated on the throne said, "I am making everything new!" Then he said, "Write this down, for these words are trustworthy and true."',
      textBSB: 'And the One seated on the throne said, "Behold, I make all things new." Then He said, "Write this down, for these words are faithful and true."'
    },
    {
      book: 'Revelation', bookId: 'REV', chapter: 21, verse: 6,
      textKJV: 'And he said unto me, It is done. I am Alpha and Omega, the beginning and the end. I will give unto him that is athirst of the fountain of the water of life freely.',
      textNIV: 'He said to me: "It is done. I am the Alpha and the Omega, the Beginning and the End. To the thirsty I will give water without cost from the spring of the water of life."',
      textBSB: 'And He told me, "It is done! I am the Alpha and the Omega, the Beginning and the End. To the thirsty I will give freely from the spring of the water of life."'
    }
  ]
};

// In-memory runtime cache for fetched or loaded chapters
const RUNTIME_CACHE = new Map<string, BibleVerse[]>();

/**
 * Loads scripture verses for any book and chapter.
 * First checks bundled database, then local runtime cache,
 * then fetches from free public Bible API (bible-api.com) with resilient graceful fallback.
 */
export async function fetchChapterVerses(bookName: string, chapter: number, translation: BibleVersion = 'KJV'): Promise<BibleVerse[]> {
  const key = `${bookName}-${chapter}`;
  const localCacheKey = `scripture_cache_${translation}_${bookName}_${chapter}`;

  // 1. Check runtime memory cache
  if (RUNTIME_CACHE.has(key)) {
    return RUNTIME_CACHE.get(key)!;
  }

  // 2. Check local storage persistent offline cache
  try {
    const cachedLocal = localStorage.getItem(localCacheKey);
    if (cachedLocal) {
      const parsed = JSON.parse(cachedLocal) as BibleVerse[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        RUNTIME_CACHE.set(key, parsed);
        return parsed;
      }
    }
  } catch {}

  // 3. Check bundled offline scripture
  if (BUNDLED_SCRIPTURE[key] && BUNDLED_SCRIPTURE[key].length > 0) {
    RUNTIME_CACHE.set(key, BUNDLED_SCRIPTURE[key]);
    return BUNDLED_SCRIPTURE[key];
  }

  const bookMeta = getBookByName(bookName);
  const bookId = bookMeta ? bookMeta.id : 'GEN';

  // 4. Multi-tier Real Scripture Fetching
  // Tier A: Backend API Proxy with server caching
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`/api/bible/${encodeURIComponent(bookName)}/${chapter}?version=${translation}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.verses) && json.verses.length > 0) {
        RUNTIME_CACHE.set(key, json.verses);
        try {
          localStorage.setItem(localCacheKey, JSON.stringify(json.verses));
        } catch {}
        return json.verses;
      }
    }
  } catch (e) {
    // Continue to next tier
  }

  // Tier B: Direct public Bible-API endpoint (verbatim KJV)
  try {
    const query = encodeURIComponent(`${bookName} ${chapter}`);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`https://bible-api.com/${query}?translation=kjv`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      if (data && data.verses && Array.isArray(data.verses) && data.verses.length > 0) {
        const parsedVerses: BibleVerse[] = data.verses.map((v: any) => ({
          book: bookName,
          bookId: bookId,
          chapter: chapter,
          verse: v.verse,
          textKJV: (v.text || '').trim().replace(/\n+/g, ' '),
          textNIV: (v.text || '').trim().replace(/\n+/g, ' '),
          textBSB: (v.text || '').trim().replace(/\n+/g, ' ')
        }));
        RUNTIME_CACHE.set(key, parsedVerses);
        try {
          localStorage.setItem(localCacheKey, JSON.stringify(parsedVerses));
        } catch {}
        return parsedVerses;
      }
    }
  } catch (err) {
    // Continue to next tier
  }

  // Tier C: Bolls Life Scripture API
  try {
    const bookOrder = bookMeta?.order || 1;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const bollsResp = await fetch(`https://bolls.life/get-chapter/KJV/${bookOrder}/${chapter}/`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (bollsResp.ok) {
      const bollsData = await bollsResp.json();
      if (Array.isArray(bollsData) && bollsData.length > 0) {
        const parsedVerses: BibleVerse[] = bollsData.map((v: any) => {
          // Clean HTML/Strong's tags
          const cleanText = (v.text || '')
            .replace(/<[^>]*>?/gm, '')
            .replace(/\s+/g, ' ')
            .trim();
          return {
            book: bookName,
            bookId: bookId,
            chapter: chapter,
            verse: v.verse,
            textKJV: cleanText,
            textNIV: cleanText,
            textBSB: cleanText
          };
        });
        RUNTIME_CACHE.set(key, parsedVerses);
        try {
          localStorage.setItem(localCacheKey, JSON.stringify(parsedVerses));
        } catch {}
        return parsedVerses;
      }
    }
  } catch (err) {
    console.error('All online scripture sources failed for', bookName, chapter);
  }

  return [];
}

export function getVerseDisplay(verse: BibleVerse, version: BibleVersion): string {
  if (version === 'KJV') return verse.textKJV;
  if (version === 'NIV') return verse.textNIV || verse.textKJV;
  if (version === 'BSB') return verse.textBSB || verse.textKJV;
  return verse.textKJV;
}
