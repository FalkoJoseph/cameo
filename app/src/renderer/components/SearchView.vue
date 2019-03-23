<template>
  <list
    type="search"
    :user="user"
    :isLoading="this.$parent.isLoading"
    :movies="this.$parent.moviesSearch">
  </list>
</template>

<script>
  import List from './Modules/List';

  export default {
    name: 'seen-view',
    components: {
      List,
    },
    props: ['user'],
  };
</script>
