/**
 * Cineverse - TMDB API Configuration
 */
const TMDB_CONFIG = {
  API_KEY: 'b445f844e085c657e0d92b909a380ba4',
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  POSTER_SIZES: {
    SMALL: 'w185',
    MEDIUM: 'w342',
    LARGE: 'w500',
    ORIGINAL: 'original'
  },
  BACKDROP_SIZES: {
    SMALL: 'w300',
    MEDIUM: 'w780',
    LARGE: 'w1280',
    ORIGINAL: 'original'
  },
  DEFAULT_LANG: 'id-ID',
  FALLBACK_LANG: 'en-US'
};

// Helper function to build image URLs safely
function getImageUrl(path, size = 'w500', isBackdrop = false) {
  if (!path) {
    return isBackdrop 
      ? 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1280&q=80'
      : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80';
  }
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${path}`;
}

// Genre map cache
const GENRE_MAP = {
  28: 'Aksi',
  12: 'Petualangan',
  16: 'Animasi',
  35: 'Komedi',
  80: 'Kejahatan',
  99: 'Dokumenter',
  18: 'Drama',
  10751: 'Keluarga',
  14: 'Fantasi',
  36: 'Sejarah',
  27: 'Horor',
  10402: 'Musik',
  9648: 'Misteri',
  10749: 'Romansa',
  878: 'Fiksi Ilmiah',
  10770: 'Film TV',
  53: 'Thriller',
  10752: 'Perang',
  37: 'Western'
};
