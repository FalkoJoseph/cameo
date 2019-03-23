<template>
  <list
    type="watchlist"
    :user="user"
    :isLoading="this.$parent.isLoading"
    :movies="this.$parent.movies">
  </list>
</template>

<script>
  import List from './Modules/List';

  export default {
    name: 'watchlist-view',
    components: {
      List,
    },
    props: ['user'],
  };
</script>
