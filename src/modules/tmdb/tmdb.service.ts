import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface Movie {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
    vote_average: number;
    vote_count: number;
    popularity: number;
    adult: boolean;
    original_language: string;
    genre_ids: number[];
    video: boolean;
}

export interface MovieResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export interface MovieDetails extends Movie {
    runtime: number;
    genres: { id: number; name: string }[];
    production_companies: { id: number; name: string; logo_path: string }[];
    production_countries: { iso_3166_1: string; name: string }[];
    spoken_languages: { iso_639_1: string; name: string }[];
    status: string;
    tagline: string;
    budget: number;
    revenue: number;
    homepage: string;
    imdb_id: string;
}

export interface Cast {
    id: number;
    name: string;
    character: string;
    profile_path: string;
    order: number;
}

export interface Crew {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string;
}

export interface Credits {
    cast: Cast[];
    crew: Crew[];
}

export interface Person {
    id: number;
    name: string;
    biography: string;
    birthday: string;
    deathday: string;
    place_of_birth: string;
    profile_path: string;
    popularity: number;
    known_for_department: string;
    adult: boolean;
    imdb_id: string;
}

export interface PersonMovieCredits {
    cast: Movie[];
    crew: Movie[];
}

@Injectable()
export class TmdbService {
    private readonly baseUrl = 'https://api.themoviedb.org/3';
    private readonly apiKey: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.apiKey = this.configService.get<string>('TMDB_API_KEY') || '6b65dd535348a6ba2f306839a9152272';
    }

    private async makeRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const queryParams = {
                api_key: this.apiKey,
                language: 'pt-BR',
                ...params,
            };

            console.log(`🎬 TMDB Request: ${url}`, queryParams);

            const response = await firstValueFrom(
                this.httpService.get(url, { params: queryParams, timeout: 10000 })
            );

            console.log(`✅ TMDB Success: ${endpoint}`, {
                results: response.data.results?.length || 0,
                page: response.data.page || 0
            });

            return response.data;
        } catch (error) {
            console.error('❌ TMDB API Error:', {
                endpoint,
                status: error.response?.status,
                message: error.response?.data || error.message
            });

            if (error.response?.status === 401) {
                throw new HttpException('API Key inválida', HttpStatus.UNAUTHORIZED);
            } else if (error.response?.status === 404) {
                throw new HttpException('Recurso não encontrado', HttpStatus.NOT_FOUND);
            } else if (error.response?.status >= 500) {
                throw new HttpException('Erro interno da API TMDB', HttpStatus.BAD_GATEWAY);
            }

            throw new HttpException('Erro ao buscar dados dos filmes', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Buscar filmes em alta
    async getTrendingMovies(timeWindow: 'day' | 'week' = 'day'): Promise<MovieResponse> {
        return this.makeRequest<MovieResponse>(`/trending/movie/${timeWindow}`);
    }

    // Buscar próximos lançamentos
    async getUpcomingMovies(page: number = 1): Promise<MovieResponse> {
        return this.makeRequest<MovieResponse>('/movie/upcoming', { page });
    }

    // Buscar filmes mais bem avaliados
    async getTopRatedMovies(page: number = 1): Promise<MovieResponse> {
        return this.makeRequest<MovieResponse>('/movie/top_rated', { page });
    }

    // Buscar filmes populares
    async getPopularMovies(page: number = 1): Promise<MovieResponse> {
        return this.makeRequest<MovieResponse>('/movie/popular', { page });
    }

    // Buscar filmes em cartaz
    async getNowPlayingMovies(page: number = 1): Promise<MovieResponse> {
        return this.makeRequest<MovieResponse>('/movie/now_playing', { page });
    }

    // Buscar detalhes de um filme
    async getMovieDetails(movieId: number): Promise<MovieDetails> {
        return this.makeRequest<MovieDetails>(`/movie/${movieId}`);
    }

    // Buscar elenco e equipe de um filme
    async getMovieCredits(movieId: number): Promise<Credits> {
        return this.makeRequest<Credits>(`/movie/${movieId}/credits`);
    }

    // Buscar filmes similares
    async getSimilarMovies(movieId: number, page: number = 1): Promise<MovieResponse> {
        return this.makeRequest<MovieResponse>(`/movie/${movieId}/similar`, { page });
    }

    // Buscar recomendações de filmes
    async getMovieRecommendations(movieId: number, page: number = 1): Promise<MovieResponse> {
        return this.makeRequest<MovieResponse>(`/movie/${movieId}/recommendations`, { page });
    }

    // Pesquisar filmes
    async searchMovies(
        query: string | null,
        genre: number | null,
        page: number = 1,
    ): Promise<MovieResponse> {
        let endpoint = '/search/movie'; // Default to text search
        const params: Record<string, any> = { page };

        if (query) {
            params.query = query.trim();
        } else if (genre) {
            endpoint = '/discover/movie'; // Switch to discover for genre
            params.with_genres = genre;
        } else {
            throw new HttpException(
                'A search query or genre is required',
                HttpStatus.BAD_REQUEST,
            );
        }

        return this.makeRequest<MovieResponse>(endpoint, params);
    }

    // Buscar detalhes de uma pessoa (ator, diretor, etc.)
    async getPersonDetails(personId: number): Promise<Person> {
        return this.makeRequest<Person>(`/person/${personId}`);
    }

    // Buscar filmes de uma pessoa
    async getPersonMovieCredits(personId: number): Promise<PersonMovieCredits> {
        return this.makeRequest<PersonMovieCredits>(`/person/${personId}/movie_credits`);
    }

    // Descobrir filmes por gênero
    async discoverMovies(options: {
        genre?: number;
        year?: number;
        page?: number;
        sortBy?: string;
        voteAverageGte?: number;
        voteCountGte?: number;
        includeAdult?: boolean;
    } = {}): Promise<MovieResponse> {
        const params: Record<string, any> = {
            page: options.page || 1,
            sort_by: options.sortBy || 'popularity.desc',
            include_adult: options.includeAdult || false,
        };

        if (options.genre) params.with_genres = options.genre;
        if (options.year) params.year = options.year;
        if (options.voteAverageGte) params['vote_average.gte'] = options.voteAverageGte;
        if (options.voteCountGte) params['vote_count.gte'] = options.voteCountGte;

        return this.makeRequest<MovieResponse>('/discover/movie', params);
    }

    // Buscar gêneros disponíveis
    async getGenres(): Promise<{ genres: { id: number; name: string }[] }> {
        return this.makeRequest<{ genres: { id: number; name: string }[] }>('/genre/movie/list');
    }

    // Utilitários para URLs de imagens
    getImageUrl(path: string, size: 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string | null {
        if (!path) return null;
        return `https://image.tmdb.org/t/p/${size}${path}`;
    }

    // Buscar configurações da API (para URLs de imagens)
    async getConfiguration(): Promise<any> {
        return this.makeRequest<any>('/configuration');
    }
}