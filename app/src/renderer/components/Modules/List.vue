<template>
  <div class="container">
    <template v-if="user && user.username">
      <template v-if="!isLoading">
        <card-wrapper :type="type" :movies="movies"></card-wrapper>
      </template>
      <template v-else>
        <loading></loading>
      </template>
    </template>
    <template v-else>
      <not-logged-in v-if="!isLoading"></not-logged-in>
    </template>
  </div>
</template>

<script>
  import CardWrapper from './CardWrapper';
  import NotLoggedIn from './NotLoggedIn';
  import Loading from './Loading';

  export default {
    components: {
      CardWrapper,
      NotLoggedIn,
      Loading,
    },
    props: ['user', 'movies', 'type', 'isLoading'],
    methods: {
      openMovie(id) {
        this.$router.push({ name: 'movie-view', params: { id } });
      },
    },
    mounted() {
      // if (this.user.username) is needed when user is not logged in
      // in the future, just hide these routes
      this.$parent.$parent.lastPage = `${this.type}-view`;
      this.$parent.$parent.getMovies({ type: this.type, query: this.$parent.$parent.query });
    },
  };
</script>
