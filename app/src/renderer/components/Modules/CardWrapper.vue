<template>
  <div>
    <template v-if="filteredMovies.length > 0">
      <div class="card-container">
        <template v-if="this.$root.groupBy && this.$root.groupBy !== 'none'">
          <template v-if="group" v-for="(group, index) in filteredMovies">
            <div class="card-group">
              <div class="card-group-label">{{group[0]}}</div>
              <card v-if="movie && movie.title" v-for="movie in group" :movie="movie"></card>
            </div>
          </template>
        </template>
        <template v-else v-for="movie in filteredMovies">
          <card :movie="movie"></card>
        </template>
      </div>
    </template>

    <template v-else>
      <empty :type="type"></empty>
    </template>
  </div>
</template>

<script>
  import Empty from './Empty';
  import Card from './Card';

  export default {
    components: {
      Empty,
      Card,
    },
    props: ['movies', 'type'],
    data() {
      return {
        movieCollection: this.movies,
        filterWhere: '', // pass this down from it's parent (DiscoverView etc.), make a prop
      };
    },
    methods: {
      uniq(a) {
        return a.sort().filter((item, pos, ary) => !pos || item !== ary[pos - 1]);
      },
    },
    computed: {
      filteredMovies() {
        let moviesCache = [];

        // Type
        switch (this.type) {
          case 'seen':
            this.filterWhere = 'watched';
            break;
          case 'watchlist':
            this.filterWhere = 'watchlist';
            break;
          default:
            break;
        }

        // Select
        for (const movie of this.movieCollection) {
          if ((this.type === 'seen' || this.type === 'watchlist') && movie[this.filterWhere]) {
            moviesCache.push(movie);
          } else if (this.type === 'discover' || this.type === 'search') {
            moviesCache.push(movie);
          }
        }

        // Sort
        moviesCache.sort((a, b) => {
          const keyA = a[this.$root.sortBy];
          const keyB = b[this.$root.sortBy];
          let order;

          // Order
          if (this.$root.orderAsc) {
            order = (keyA < keyB) ? - 1 : 1;
          } else {
            order = (keyA < keyB) ? 1 : - 1;
          }

          return order;
        });

        // Group
        if (this.$root.groupBy !== 'none') {
          // REFACTOR: allow grouping by release date (year/month), seen, watched
          let years = [];
          const moviesGroupedCache = [];

          // Group values
          for (const movie of moviesCache) {
            years.push(movie.year);
          }

          years.filter((item, pos) => years.indexOf(item) === pos);
          years = this.uniq(years);

          let i = 0;
          for (const year of years) {
            ++i;
            moviesGroupedCache[i] = [];

            for (const movie of moviesCache) {
              if (movie.year === year) {
                moviesGroupedCache[i][0] = year;
                moviesGroupedCache[i].push(movie);
              }
            }
          }

          if (!this.$root.orderAsc) {
            moviesGroupedCache.reverse();
          }

          moviesCache = moviesGroupedCache;
        }

        return moviesCache;
      },
    },
  };
</script>

<style lang="scss" scoped rel="stylesheet/scss">
  .card-container {
    display: flex;
    flex-wrap: wrap;
    position: absolute;
    z-index: 0;
    width: 100%;
    padding-bottom: 25px;
    height: calc(100% - 44px);
    overflow: hidden;
    overflow-y: auto;
    align-items: flex-start;
  }

  .card-group {
    flex-wrap: wrap;
    display: flex;
    width: 100%;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba($white, .1);

    &:last-of-type {
      padding-bottom: 0;
      margin-bottom: -10px;
      border-bottom: 0;
    }

    .card {
      margin: 10px 0;
    }
  }

  .card-group-label {
    width: 100%;
    margin: 20px 0 10px 25px;
    font-size: 38px;
    font-weight: 300;
    color: $white;
  }
</style>
