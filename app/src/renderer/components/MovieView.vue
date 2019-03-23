<template>
  <div class="container">
    <div v-if="user && user.username">
      <h1>{{ movie.title }} ({{movie.year}})</h1>
      <hr>
      <button v-on:click="close">Close</button>
      <ul>
        <li v-for="genre in movie.genres">
          {{ genre }}
        </li>
      </ul>
      <hr>
      <p>Seen: {{movie.seen}}</p>
      <p>Watchlist: {{movie.watchlist}}</p>
      <hr>
      <p>Tagline: {{movie.tagline}}</p>
      <hr>
      <p>{{movie.overview}}</p>
      <hr>
      <p>homepage: {{movie.homepage}}</p>
      <p>runtime: {{movie.runtime}}</p>
      <p>trailer: {{movie.trailer}}</p>
      <p>released {{movie.released}}</p>
      <p>rating {{movie.rating}}</p>

      <img :src="movie.poster" style="height:100px;">
    </div>
    <div v-else>
      Not logged in.
    </div>
  </div>
</template>

<script>
  import { traktApi } from './Modules/Trakt';

  export default {
    name: 'movie-view',
    props: ['user'],
    data() {
      return {
        movie: {},
        poster: '',
      };
    },
    methods: {
      close() {
        if (this.$parent.lastPage && this.$parent.lastPage !== 'search-view') {
          this.$router.push({ name: this.$parent.lastPage });
        } else if (this.$parent.lastPage === 'search-view' && this.$parent.query) {
          this.$router.push({ name: 'search-view', params: { query: this.$parent.query } });
        } else {
          this.$router.push({ name: 'discover-view' });
        }
      },
      loadContent() {
        traktApi.movies.summary({
          id: `${this.$route.params.id}?extended=full`,
        }).then(response => {
          this.movie = response;
          traktApi.images.get({
            imdb: this.$route.params.id,
            type: 'movie',
          }).then(response => {
            this.movie.poster = response.poster;
          });
        });
      },
    },
    created() {
      this.loadContent();
    },
  };
</script>

<style lang="scss" scoped>
  li {
    list-style: none;
  }
</style>
