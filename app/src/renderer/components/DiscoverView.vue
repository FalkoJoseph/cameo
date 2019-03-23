<template>
  <list
    type="discover"
    :user="user"
    :isLoading="this.$parent.isLoading"
    :movies="this.$parent.moviesDiscover">
  </list>
</template>

<script>
  import List from './Modules/List';

  export default {
    name: 'discover-view',
    components: {
      List,
    },
    props: ['user'],
  };
</script>
