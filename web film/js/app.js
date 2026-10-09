/**
 * Cineverse - Alpine.js Application State & Logic
 */
document.addEventListener('alpine:init', () => {
  Alpine.data('movieApp', () => ({
    // Navigation & View States
    activeTab: 'home', // 'home' | 'trending' | 'popular' | 'topRated' | 'genres' | 'watchlist'
    mobileMenuOpen: false,

    // Loading States
    isLoadingHero: true,
    isLoadingRails: true,
    isLoadingGenre: false,
    isSearching: false,

    // Hero Section State
    heroMovies: [],
    currentHeroIndex: 0,
    heroAutoPlayTimer: null,

    // Movie Rails / Categories
    rails: {
      trending: [],
      popular: [],
      topRated: [],
      nowPlaying: [],
      action: [],
      scifi: [],
      animation: [],
      horror: []
    },

    // Genre Exploration State
    genresList: [
      { id: 28, name: 'Aksi', icon: '💥' },
      { id: 12, name: 'Petualangan', icon: '🗺️' },
      { id: 16, name: 'Animasi', icon: '🎨' },
      { id: 35, name: 'Komedi', icon: '😂' },
      { id: 878, name: 'Fiksi Ilmiah', icon: '🚀' },
      { id: 27, name: 'Horor', icon: '👻' },
      { id: 10749, name: 'Romansa', icon: '💖' },
      { id: 18, name: 'Drama', icon: '🎭' },
      { id: 9648, name: 'Misteri', icon: '🔍' },
      { id: 14, name: 'Fantasi', icon: '🧙' },
      { id: 53, name: 'Thriller', icon: '⚡' }
    ],
    selectedGenre: { id: 28, name: 'Aksi', icon: '💥' },
    genreMovies: [],

    // Release Year Exploration State (Lengkap dari 2026 hingga 1970)
    availableYears: Array.from({ length: 2026 - 1970 + 1 }, (_, i) => 2026 - i),
    selectedYear: 2026,
    yearMovies: [],
    isLoadingYear: false,
    yearSortBy: 'popularity.desc',
    yearDropdownOpen: false,

    // Search State
    searchQuery: '',
    searchResults: [],
    searchTimer: null,
    isSearchActive: false,

    // Watchlist State (Local Storage)
    watchlist: [],

    // Movie Detail & Trailer Modal
    isModalOpen: false,
    selectedMovie: null,
    detailedMovie: null,
    trailerKey: null,
    isPlayingTrailer: false,
    isLoadingDetails: false,

    // Toast Notification
    toast: {
      show: false,
      message: '',
      type: 'success'
    },
    toastTimer: null,

    // Initializer
    async init() {
      this.loadWatchlist();
      await this.initHeroAndTrending();
      this.loadAllRails();
      this.startHeroAutoplay();
    },

    // --- Hero Section Methods ---
    async initHeroAndTrending() {
      try {
        this.isLoadingHero = true;
        const trending = await MovieAPI.getTrending('week');
        if (trending && trending.length > 0) {
          // Take top 6 movies with valid backdrops for Hero
          this.heroMovies = trending
            .filter(m => m.backdrop_path && m.overview)
            .slice(0, 6);
          this.rails.trending = trending;
        }
      } catch (err) {
        console.error('Failed to load hero trending:', err);
      } finally {
        this.isLoadingHero = false;
      }
    },

    get activeHero() {
      if (!this.heroMovies.length) return null;
      return this.heroMovies[this.currentHeroIndex] || this.heroMovies[0];
    },

    setHeroIndex(idx) {
      this.currentHeroIndex = idx;
      this.restartHeroAutoplay();
    },

    nextHero() {
      if (this.heroMovies.length === 0) return;
      this.currentHeroIndex = (this.currentHeroIndex + 1) % this.heroMovies.length;
    },

    prevHero() {
      if (this.heroMovies.length === 0) return;
      this.currentHeroIndex = (this.currentHeroIndex - 1 + this.heroMovies.length) % this.heroMovies.length;
    },

    startHeroAutoplay() {
      this.stopHeroAutoplay();
      this.heroAutoPlayTimer = setInterval(() => {
        if (!this.isModalOpen && this.activeTab === 'home' && !this.isSearchActive) {
          this.nextHero();
        }
      }, 7000);
    },

    stopHeroAutoplay() {
      if (this.heroAutoPlayTimer) {
        clearInterval(this.heroAutoPlayTimer);
        this.heroAutoPlayTimer = null;
      }
    },

    restartHeroAutoplay() {
      this.startHeroAutoplay();
    },

    // --- Rail Content Loading ---
    async loadAllRails() {
      this.isLoadingRails = true;
      try {
        const [popular, topRated, nowPlaying, action, scifi, animation, horror] = await Promise.allSettled([
          MovieAPI.getPopular(1),
          MovieAPI.getTopRated(1),
          MovieAPI.getNowPlaying(1),
          MovieAPI.getByGenre(28, 1),  // Action
          MovieAPI.getByGenre(878, 1), // Sci-Fi
          MovieAPI.getByGenre(16, 1),  // Animation
          MovieAPI.getByGenre(27, 1)   // Horror
        ]);

        if (popular.status === 'fulfilled') this.rails.popular = popular.value;
        if (topRated.status === 'fulfilled') this.rails.topRated = topRated.value;
        if (nowPlaying.status === 'fulfilled') this.rails.nowPlaying = nowPlaying.value;
        if (action.status === 'fulfilled') this.rails.action = action.value;
        if (scifi.status === 'fulfilled') this.rails.scifi = scifi.value;
        if (animation.status === 'fulfilled') this.rails.animation = animation.value;
        if (horror.status === 'fulfilled') this.rails.horror = horror.value;
      } catch (err) {
        console.error('Error loading movie rails:', err);
      } finally {
        this.isLoadingRails = false;
      }
    },

    // --- Genre Tab Exploration ---
    async selectGenre(genre) {
      this.selectedGenre = genre;
      this.isLoadingGenre = true;
      try {
        this.genreMovies = await MovieAPI.getByGenre(genre.id, 1);
      } catch (err) {
        console.error('Failed to load genre movies:', err);
      } finally {
        this.isLoadingGenre = false;
      }
    },

    switchToGenres() {
      this.activeTab = 'genres';
      this.isSearchActive = false;
      if (!this.genreMovies.length) {
        this.selectGenre(this.selectedGenre);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // --- Release Year Methods ---
    async selectYear(year) {
      this.selectedYear = Number(year);
      this.yearDropdownOpen = false;
      this.activeTab = 'years';
      this.isSearchActive = false;
      this.isLoadingYear = true;
      try {
        this.yearMovies = await MovieAPI.getByYear(this.selectedYear, this.yearSortBy, 1);
      } catch (err) {
        console.error('Failed to load movies by year:', err);
      } finally {
        this.isLoadingYear = false;
      }
    },

    async setYearSort(sortBy) {
      if (this.yearSortBy === sortBy) return;
      this.yearSortBy = sortBy;
      await this.selectYear(this.selectedYear);
    },

    switchToYears(year = null) {
      this.activeTab = 'years';
      this.isSearchActive = false;
      this.yearDropdownOpen = false;
      if (year) {
        this.selectYear(year);
      } else if (!this.yearMovies.length) {
        this.selectYear(this.selectedYear);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // --- Search Logic with Debounce ---
    onSearchInput() {
      if (this.searchTimer) clearTimeout(this.searchTimer);
      
      const query = this.searchQuery.trim();
      if (!query) {
        this.searchResults = [];
        this.isSearchActive = false;
        return;
      }

      this.isSearchActive = true;
      this.isSearching = true;

      this.searchTimer = setTimeout(async () => {
        try {
          const results = await MovieAPI.searchMovies(query);
          this.searchResults = results.filter(m => m.poster_path || m.backdrop_path);
        } catch (err) {
          console.error('Search failed:', err);
        } finally {
          this.isSearching = false;
        }
      }, 350);
    },

    clearSearch() {
      this.searchQuery = '';
      this.searchResults = [];
      this.isSearchActive = false;
    },

    // --- Watchlist Methods (Local Storage) ---
    loadWatchlist() {
      try {
        const stored = localStorage.getItem('cineverse_watchlist');
        this.watchlist = stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.warn('Could not read watchlist from localStorage', e);
        this.watchlist = [];
      }
    },

    saveWatchlist() {
      try {
        localStorage.setItem('cineverse_watchlist', JSON.stringify(this.watchlist));
      } catch (e) {
        console.warn('Could not save watchlist to localStorage', e);
      }
    },

    isInWatchlist(movieId) {
      if (!movieId) return false;
      return this.watchlist.some(m => m.id === movieId);
    },

    toggleWatchlist(movie, event) {
      if (event) event.stopPropagation();
      if (!movie || !movie.id) return;

      const idx = this.watchlist.findIndex(m => m.id === movie.id);
      if (idx > -1) {
        this.watchlist.splice(idx, 1);
        this.showNotification(`Dihapus dari Daftar Saya: "${movie.title || movie.name}"`, 'info');
      } else {
        // Save simplified movie object
        this.watchlist.unshift({
          id: movie.id,
          title: movie.title || movie.name,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date || movie.first_air_date,
          overview: movie.overview,
          genre_ids: movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : [])
        });
        this.showNotification(`Ditambahkan ke Daftar Saya: "${movie.title || movie.name}"`, 'success');
      }
      this.saveWatchlist();
    },

    // --- Movie Detail & Trailer Modal ---
    async openModal(movie, autoplayTrailer = false) {
      if (!movie) return;
      this.selectedMovie = movie;
      this.detailedMovie = null;
      this.trailerKey = null;
      this.isPlayingTrailer = autoplayTrailer;
      this.isModalOpen = true;
      this.isLoadingDetails = true;
      document.body.style.overflow = 'hidden';

      try {
        const details = await MovieAPI.getMovieDetails(movie.id);
        this.detailedMovie = details;
        this.trailerKey = MovieAPI.getTrailerKey(details);
        if (autoplayTrailer && this.trailerKey) {
          this.isPlayingTrailer = true;
        }
      } catch (err) {
        console.error('Failed to load movie details:', err);
      } finally {
        this.isLoadingDetails = false;
      }
    },

    closeModal() {
      this.isModalOpen = false;
      this.selectedMovie = null;
      this.detailedMovie = null;
      this.trailerKey = null;
      this.isPlayingTrailer = false;
      document.body.style.overflow = '';
    },

    playTrailerNow() {
      if (this.trailerKey) {
        this.isPlayingTrailer = true;
      } else {
        this.showNotification('Trailer video belum tersedia untuk film ini', 'info');
      }
    },

    stopTrailer() {
      this.isPlayingTrailer = false;
    },

    // --- Carousel Horizontal Scroll Navigation ---
    scrollRail(railId, distance) {
      const el = document.getElementById(railId);
      if (el) {
        el.scrollBy({
          left: distance,
          behavior: 'smooth'
        });
      }
    },

    // --- Toast Notifications ---
    showNotification(message, type = 'success') {
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toast.message = message;
      this.toast.type = type;
      this.toast.show = true;

      this.toastTimer = setTimeout(() => {
        this.toast.show = false;
      }, 3200);
    },

    // --- Formatting & Helper Functions ---
    formatRating(vote) {
      if (!vote && vote !== 0) return 'N/A';
      return Number(vote).toFixed(1);
    },

    formatYear(dateStr) {
      if (!dateStr) return 'TBA';
      return dateStr.substring(0, 4);
    },

    formatRuntime(mins) {
      if (!mins) return 'N/A';
      const hours = Math.floor(mins / 60);
      const m = mins % 60;
      return hours > 0 ? `${hours}j ${m}m` : `${m}m`;
    },

    getGenreNames(genreIds) {
      if (!genreIds || !genreIds.length) return '';
      return genreIds
        .slice(0, 2)
        .map(id => GENRE_MAP[id] || '')
        .filter(Boolean)
        .join(' • ');
    },

    getImageUrl(path, size = 'w500', isBackdrop = false) {
      return getImageUrl(path, size, isBackdrop);
    },

    shareMovie(movie) {
      const shareUrl = window.location.href;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(`${movie.title} - Tonton di Cineverse: ${shareUrl}`);
        this.showNotification('Tautan film berhasil disalin ke clipboard!', 'success');
      } else {
        this.showNotification('Tautan siap dibagikan!', 'info');
      }
    }
  }));
});
