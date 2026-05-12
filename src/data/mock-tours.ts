import { Tour, Sight } from '../types';

// Mock Vatican tours for testing without backend
export const MOCK_TOURS: Tour[] = [
  {
    id: 'st-peters-basilica',
    title: 'St. Peter\'s Basilica Tour',
    description: 'Explore the magnificent St. Peter\'s Basilica, one of the largest churches in the world. Discover its rich history, stunning architecture, and priceless artworks.',
    duration: '45 minutes',
    category: 'Religious Sites',
    difficulty: 'easy',
    featured: true,
    downloadable: true,
    thumbnail: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800',
    stops: [
      {
        id: 'st-peters-square',
        name: 'St. Peter\'s Square',
        name_it: 'Piazza San Pietro',
        lat: 41.9022,
        lng: 12.4539,
        radius: 50,
        category: 'piazza',
        has_tips: true,
        pack: 'essential',
        thumbnail: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
        description: 'Welcome to St. Peter\'s Square, designed by the famous architect Gian Lorenzo Bernini in the 17th century.',
        tips: ['Best time to visit is early morning', 'Dress modestly - shoulders and knees covered'],
        audioFiles: {
          en: {
            quick: {
              url: 'https://pub-8c2c698c5e7e4c8b9e3f1a2b3c4d5e6f.r2.dev/en/st-peters-square/quick.mp3',
              duration: 180,
              size: 2048000,
            },
            deep: {
              url: 'https://pub-8c2c698c5e7e4c8b9e3f1a2b3c4d5e6f.r2.dev/en/st-peters-square/deep.mp3',
              duration: 420,
              size: 5120000,
            },
          },
        },
      },
      {
        id: 'basilica-entrance',
        name: 'The Basilica Entrance',
        name_it: 'Ingresso della Basilica',
        lat: 41.9029,
        lng: 12.4534,
        radius: 30,
        category: 'religious',
        has_tips: false,
        pack: 'essential',
        thumbnail: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
        description: 'Stand before the grand entrance to St. Peter\'s Basilica, with its massive bronze doors and stunning facade.',
        audioFiles: {
          en: {
            deep: {
              url: 'https://pub-8c2c698c5e7e4c8b9e3f1a2b3c4d5e6f.r2.dev/en/basilica-entrance/deep.mp3',
              duration: 240,
              size: 3072000,
            },
          },
        },
      },
    ],
  },
  {
    id: 'vatican-museums',
    title: 'Vatican Museums Highlights',
    description: 'Discover the masterpieces of the Vatican Museums including the Sistine Chapel and Raphael Rooms.',
    duration: '2 hours',
    category: 'Museums',
    difficulty: 'moderate',
    featured: true,
    downloadable: true,
    thumbnail: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
    stops: [
      {
        id: 'sistine-chapel',
        name: 'Sistine Chapel',
        name_it: 'Cappella Sistina',
        lat: 41.9029,
        lng: 12.4545,
        radius: 40,
        category: 'museum',
        has_tips: true,
        pack: 'essential',
        thumbnail: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
        description: 'Marvel at Michelangelo\'s masterpiece on the ceiling of the Sistine Chapel.',
        tips: ['No photography allowed', 'Silence is required'],
        kidsMyth: 'Did you know Michelangelo painted the ceiling lying on his back? Actually, he stood on scaffolding!',
        audioFiles: {
          en: {
            deep: {
              url: 'https://pub-8c2c698c5e7e4c8b9e3f1a2b3c4d5e6f.r2.dev/en/sistine-chapel/deep.mp3',
              duration: 600,
              size: 7168000,
            },
            kids: {
              url: 'https://pub-8c2c698c5e7e4c8b9e3f1a2b3c4d5e6f.r2.dev/en/sistine-chapel/kids.mp3',
              duration: 240,
              size: 3072000,
            },
          },
        },
      },
    ],
  },
  {
    id: 'vatican-gardens',
    title: 'Vatican Gardens Tour',
    description: 'A peaceful walk through the beautiful Vatican Gardens, a hidden gem of Vatican City.',
    duration: '1 hour',
    category: 'Gardens',
    difficulty: 'easy',
    featured: false,
    downloadable: true,
    thumbnail: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800',
    stops: [],
  },
];

export const getMockTours = (): Promise<Tour[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_TOURS), 500);
  });
};

export const getMockSights = (): Promise<Sight[]> => {
  return new Promise((resolve) => {
    const allSights = MOCK_TOURS.flatMap(tour => tour.stops);
    setTimeout(() => resolve(allSights), 500);
  });
};
