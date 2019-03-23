<template>
  <div class="container">
    <p>Please wait while we sync your library... {{this.$parent.seenCounter}} / {{this.$parent.totalSeen}} and {{this.$parent.watchlistCounter}} / {{this.$parent.totalWatchlist}}</p>
  </div>
</template>

<script>
  export default {
    created() {
      this.$parent.bootstrap({ type: 'watchlist' });
      this.$parent.bootstrap({ type: 'seen' });
    },
  };
</script>

<style lang="scss" scoped rel="stylesheet/scss">
  .container {
    display: flex;
    height: 100vh;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: $white;
    font-weight: 400;
  }
</style>
