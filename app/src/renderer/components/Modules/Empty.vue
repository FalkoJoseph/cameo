<template>
  <div class="empty">
    No movies of {{type}}.
  </div>
</template>

<script>
  export default {
    props: ['type'],
  };
</script>

<style lang="scss" scoped rel="stylesheet/scss">
  .empty {
    display: flex;
    flex-wrap: wrap;
    position: absolute;
    z-index: 0;
    width: 100%;
    height: calc(100% - 55px);
  }
</style>
