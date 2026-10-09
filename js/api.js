/**
 * Cineverse - TMDB API Service
 */
const MovieAPI = {
  /**
   * Helper method to perform requests with standard error handling
   */
  async request(endpoint, params = {}) {
    try {
      const url = new URL(`${TMDB_CONFIG.BASE_URL}${endpoint}`);
      url.searchParams.set('api_key', TMDB_CONFIG.API_KEY);
      url.searchParams.set('include_adult', 'false');

      // Set language if not already provided
      if (!params.language) {
        url.searchParams.set('language', 'id-ID');
      }

      // Append custom query parameters
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          url.searchParams.set(key, val);
        }
      });

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`TMDB HTTP Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`[MovieAPI Error] endpoint: ${endpoint}`, error);
      throw error;
    }
  },

  /**
   * Get trending movies
   */
  async getTrending(timeWindow = 'week') {
    const data = await this.request(`/trending/movie/${timeWindow}`);
    return data.results || [];
  },

  /**
   * Get popular movies
   */
  async getPopular(page = 1) {
    const data = await this.request('/movie/popular', { page });
    return data.results || [];
  },

  /**
   * Get top rated movies
   */
  async getTopRated(page = 1) {
    const data = await this.request('/movie/top_rated', { page });
    return data.results || [];
  },

  /**
   * Get currently playing movies
   */
  async getNowPlaying(page = 1) {
    const data = await this.request('/movie/now_playing', { page });
    return data.results || [];
  },

  /**
   * Discover movies by genre ID
   */
  async getByGenre(genreId, page = 1) {
    const data = await this.request('/discover/movie', {
      with_genres: genreId,
      sort_by: 'popularity.desc',
      page
    });
    return data.results || [];
  },

  /**
   * Discover movies by release year
   */
  async getByYear(year, sortBy = 'popularity.desc', page = 1) {
    const params = {
      primary_release_year: year,
      sort_by: sortBy,
      page
    };
    if (sortBy === 'vote_average.desc') {
      params['vote_count.gte'] = 50;
    }
    const data = await this.request('/discover/movie', params);
    return data.results || [];
  },

  /**
   * Full movie detail with trailer videos, cast credits, and similar films
   */
  async getMovieDetails(movieId) {
    // Request English video trailer as fallback if Indonesian has none
    const data = await this.request(`/movie/${movieId}`, {
      append_to_response: 'videos,credits,similar',
      language: 'id-ID'
    });

    // If no videos returned in id-ID, try to fetch english videos
    if (!data.videos || !data.videos.results || data.videos.results.length === 0) {
      try {
        const enVideos = await this.request(`/movie/${movieId}/videos`, { language: 'en-US' });
        if (enVideos && enVideos.results) {
          data.videos = enVideos;
        }
      } catch (e) {
        console.warn('Could not fetch EN trailer fallback', e);
      }
    }

    return data;
  },

  /**
   * Search movies by keyword
   */
  async searchMovies(query, page = 1) {
    if (!query || !query.trim()) return [];
    const data = await this.request('/search/movie', {
      query: query.trim(),
      page
    });
    return data.results || [];
  },

  /**
   * Extract YouTube Trailer Key
   */
  getTrailerKey(movieDetails) {
    if (!movieDetails || !movieDetails.videos || !movieDetails.videos.results) {
      return null;
    }
    const videos = movieDetails.videos.results;
    
    // Look for Official Trailer on YouTube
    const officialTrailer = videos.find(
      v => v.site === 'YouTube' && v.type === 'Trailer' && v.official
    );
    if (officialTrailer) return officialTrailer.key;

    // Fallback: any Trailer on YouTube
    const anyTrailer = videos.find(
      v => v.site === 'YouTube' && v.type === 'Trailer'
    );
    if (anyTrailer) return anyTrailer.key;

    // Fallback: Teaser on YouTube
    const teaser = videos.find(
      v => v.site === 'YouTube' && (v.type === 'Teaser' || v.type === 'Clip')
    );
    return teaser ? teaser.key : null;
  }
};
