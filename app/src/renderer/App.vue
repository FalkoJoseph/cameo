<template>
  <div class="app" id="#app">
    <template v-if="isCached">
      <navbar></navbar>
      <router-view :user="this.user"></router-view>
    </template>
    <template v-else>
      <template v-if="this.user && this.user.username">
        <installer v-if="this.user && this.user.username"></installer>
      </template>
      <template v-else>
        <settings-window></settings-window>
      </template>
    </template>
  </div>
</template>

<script>
  import { traktApi } from 'renderer/components/Modules/Trakt';
  import Navbar from 'renderer/components/Modules/Navbar';
  import Installer from 'renderer/components/Modules/Installer';
  import SettingsWindow from 'renderer/components/SettingsView';
  const LSDB = require('lsdb');
  const axios = require('axios');
  const Movies = new LSDB.Table('movies');
  const Settings = new LSDB.Table('settings');

  export default {
    components: {
      Navbar,
      Installer,
      SettingsWindow,
    },
    data() {
      return {
        account: {},
        user: {},
        lastPage: '',
        query: '',
        id: '',
        sortBy: '',
        groupBy: '',
        orderAsc: false,
        isCached: false,
        isLoading: false,
        seenCached: false,
        watchlistCached: false,
        movies: [],
        moviesDiscover: [],
        moviesSearch: [],
        seenCache: [],
        watchlistCache: [],
        infoCounter: 0,
        watchlistCounter: 0,
        seenCounter: 0,
        totalMovies: 0,
        totalSeen: 0,
        totalWatchlist: 0,
      };
    },
    methods: {
      fastIteration(type) {
        if (type === 'search' || type === 'discover') {
          this.infoCounter++;
        }
      },
      cachedIteration(type) {
        switch (type) {
          case 'seen':
            this.seenCounter++;
            break;
          case 'watchlist':
            this.watchlistCounter++;
            break;
          default:
            break;
        }
      },
      storeMovie(type, movies) {
        if (type === 'seen' || type === 'watchlist') {
          if (this.seenCounter === this.totalSeen && type === 'seen') {
            this.seenCached = true;
            this.seenCache = movies;
            console.log('✨ Seen collection is now synced locally! ✨');
          }

          if (this.watchlistCounter === this.totalWatchlist && type === 'watchlist') {
            this.watchlistCached = true;
            this.watchlistCache = movies;
            console.log('✨ Watchlist collection is now synced locally! ✨');
          }

          if (this.seenCached && this.watchlistCached) {
            console.log('✨ Movies are now synced locally! ✨');
            this.isCached = true;
            Movies.insert(this.seenCache.concat(this.watchlistCache));
          }
        }
      },
      overwriteInfo(type, result, movie, movies) {
        delete result.revenue;
        delete result.score;
        console.log(movie);
        result.id = result.movie.ids.imdb;
        result.title = movie.title;
        result.released = movie.release_date; // TODO: moment
        result.last_watched_at = result.last_watched_at;
        result.listed_at = result.listed_at;
        result.poster = `http://image.tmdb.org/t/p/w500/${movie.poster_path}`;
        this.storeMovie(type, movies);
      },
      getMovieInfo(type, result, movies) {
        this.fastIteration(type);

        if (result.movie.ids.imdb) {
          setTimeout(() => {
            axios.get(`https://api.themoviedb.org/3/find/${result.movie.ids.imdb}?api_key=63d12cf7411ab522a70b572ece374792&external_source=imdb_id`)
            .then((movieResult) => {
              movieResult = movieResult.data.movie_results[0];
              this.cachedIteration(type);
              this.overwriteInfo(type, result, movieResult, movies);
            });
          }, 1000);
        }
      },
      getStatus(movies) {
        for (const movie of Object.values(movies)) {
          this.getSeen(movie);
          this.getWatchlist(movie);
        }
      },
      getSeen(movie) {
        traktApi.users.watched({ username: this.user.username, type: 'movies' })
        .then(response => {
          for (const seen of response) {
            if (seen.movie.ids.imdb === movie.id) {
              movie.watched = true;
            }
          }
        });
      },
      getWatchlist(movie) {
        traktApi.users.watchlist({ username: this.user.username, type: 'movies' })
        .then(response => {
          for (const watchlist of response) {
            if (watchlist.movie.ids.imdb === movie.id) {
              movie.watchlist = true;
            }
          }
        });
      },
      afterProcessing(movies) {
        if (this.infoCounter === this.totalMovies) {
          this.getStatus(movies);
        }
      },
      beforeProcessing(args, movies) {
        this.totalMovies = movies.length;
        this.isLoading = false;

        for (const data of movies) {
          this.getMovieInfo(args.type, data, movies);

          if (args.type === 'discover' || args.type === 'search') {
            this.afterProcessing(movies);
          }
        }
      },
      addAttribute(results, key, value) {
        for (const data of results) {
          data[key] = value;
        }
      },
      addDefaultAttributes(results) {
        for (const data of results) {
          data.title = data.movie.title;
          data.year = data.movie.year;
          data.watched = false;
          data.watchlist = false;
          data.poster = '';
        }
      },
      existsInCache() {
        return (Movies.all().length > 0) ? 1 : 0;
      },
      retrieveCache() {
        this.isCached = true;
        this.isLoading = false;
        this.movies = Movies.all()[0];
        console.log('🍑 Movies are loaded from cache! 🍑');
      },
      bootstrap(args) {
        switch (args.type) {
          case 'discover':
            traktApi.movies.boxoffice().then((results) => {
              this.addDefaultAttributes(results);
              this.beforeProcessing(args, results);
              this.moviesDiscover = results;
            });
            break;
          case 'search':
            traktApi.search.text({
              query: args.query,
              type: 'movie',
            }).then(results => {
              this.addDefaultAttributes(results);
              this.beforeProcessing(args, results);
              this.moviesSearch = results;
            });
            break;
          case 'watchlist':
            if (this.existsInCache()) {
              this.retrieveCache();
            } else {
              traktApi.users.watchlist({ username: this.user.username, type: 'movies' })
              .then((results) => {
                this.totalWatchlist = results.length;
                this.addDefaultAttributes(results);
                this.addAttribute(results, 'watchlist', true);
                this.beforeProcessing(args, results);
                this.movies = results;
              });
            }
            break;
          case 'seen':
            if (this.existsInCache()) {
              this.retrieveCache();
            } else {
              traktApi.users.watched({ username: this.user.username, type: 'movies' })
              .then((results) => {
                this.totalSeen = results.length;
                this.addDefaultAttributes(results);
                this.addAttribute(results, 'watched', true);
                this.beforeProcessing(args, results);
                this.movies = results;
              });
            }
            break;
          default:
            break;
        }
      },
      resetView() {
        this.id = '';
        this.isLoading = false;
        this.infoCounter = 0;
        this.seenCounter = 0;
        this.watchlistCounter = 0;
        this.totalSeen = 0;
        this.totalWatchlist = 0;
        this.totalMovies = 0;
        this.movies = [];
        this.moviesDiscover = [];
        this.moviesSearch = [];
      },
      getMovies(args) {
        this.resetView();
        this.isLoading = true;
        this.startSession(args);
      },
      startSession(args) {
        if (window.localStorage.getItem('token') || !this.user) {
          traktApi.import_token(JSON.parse(window.localStorage.getItem('token'))).then(() => {
            traktApi.users.settings().then((response) => {
              this.account = response.account;
              this.user = response.user;
              return args ? this.bootstrap(args) : false;
            });
          });
        }
      },
      loadSettings() {
        const settings = {
          id: 0,
          sortBy: 'year',
          groupBy: 'none',
          orderAsc: false,
        };

        if (Settings.all().length > 0) {
          this.sortBy = Settings.all()[0].sortBy;
          this.groupBy = Settings.all()[0].groupBy;
          this.orderAsc = Settings.all()[0].orderAsc;
        } else {
          Settings.insert(settings);
          this.sortBy = settings.sortBy;
          this.groupBy = settings.groupBy;
          this.orderAsc = settings.orderAsc;
          location.reload();
        }
      },
    },
    mounted() {
      this.loadSettings();
      this.startSession(); // we should be able to only load startSession once...
    },
  };
</script>

<style lang="scss">
  * {
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
    user-select: none;
  }

  html,
  body { height: 100%; }

  body {
    display: flex;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: $font-size;
    overflow: hidden;
    cursor: default;
  }
</style>
