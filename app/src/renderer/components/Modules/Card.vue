<template>
  <div class="card">
    <div v-on:click="openMovie(movie.id)" class="card-thumbnail" :style="{ backgroundImage: 'url(' + (movie.poster ? movie.poster : '/imgs/default-poster.png') + ')' }">
      <div v-if="movie.watched || movie.watchlist" class="card-status">
        <p v-if="movie.watchlist">Watchlist</p>
        <p v-if="movie.watched">Seen</p>
      </div>
      <div class="card-overlay"></div>
    </div>
    <div class="card-info">
      <div class="card-title">{{ movie.title }}</div>
      <div class="card-year">{{ movie.year }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['movie'],
    methods: {
      openMovie(id) {
        this.$router.push({ name: 'movie-view', params: { id } });
      },
    },
  };
</script>

<style lang="scss" scoped rel="stylesheet/scss">
  .card {
    margin: 25px 0 -10px;
    text-align: center;
    animation: appear $transition-speed ease-in-out;
  }

  .card-thumbnail {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    margin: 0 auto 10px;
    width: 160px;
    height: 250px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: $gray-lighter;
    border-radius: $border-radius;
    box-shadow: 0 4px 20px rgba($black, .25);

    &:active .card-overlay {
      background-color: rgba($gray-dark, .8);
      box-shadow: inset 0 0 0 2px $primary;
    }
  }

  .card-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba($gray-dark, 0);
    border-radius: $border-radius;
  }

  .card-title {
    color: $white;
    @include text-truncate;
    max-width: 145px;
    margin: 0 auto;
  }

  .card-year {
    margin-top: 5px;
    font-size: 14px;
    color: rgba($white, .3);
  }

  .card-status {
    position: relative;
    z-index: 2;
    padding: 4px;
    font-size: 13px;
    font-weight: 500;
    color: rgba($white, .8);
    background-color: rgba($primary, .8);
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    animation: status $transition-speed ease-in-out;
  }

  @keyframes status {
    0% { opacity: .5; }
    100% { opacity: 1; }
  }

  @keyframes appear {
    0% { opacity: .5; }
    100% { opacity: 1; }
  }

  @media only screen and (min-width: $small) { .card { width: calc(100%/4) } }
  @media only screen and (min-width: $medium) { .card { width: calc(100%/5) } }
  @media only screen and (min-width: $large) { .card { width: calc(100%/6) } }
  @media only screen and (min-width: $xl) { .card { width: calc(100%/7) } }
</style>
