<template>
  <list
    type="seen"
    :user="user"
    :isLoading="this.$parent.isLoading"
    :movies="this.$parent.movies">
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
