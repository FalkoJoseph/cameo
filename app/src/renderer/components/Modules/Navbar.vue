<template>
  <div class="navbar" style="-webkit-app-region: drag">
    <div class="navbar-center">
      <div class="navbar-tab" title="Discover movies and manage your movie collection">
        <router-link tag="div" to="/" class="navbar-item" activeClass="active" v-bind:exact="true">
          Discover
        </router-link>
        <router-link tag="div" to="/watchlist" class="navbar-item" activeClass="active">
          Watchlist
        </router-link>
        <router-link tag="div" to="/seen" class="navbar-item" activeClass="active">
          Seen
        </router-link>
        <router-link tag="div" to="/settings" class="navbar-item" activeClass="active">
          Profile
        </router-link>
      </div>

      <div class="navbar-tab navbar-filter" title="Filter movies">
        <button class="navbar-item is-single" v-on:click="toggleSort()" v-click-outside="hideSort" v-show="this.$parent.groupBy === 'none'">
          Sort by <strong>{{this.$parent.sortBy}}</strong>

          <div class="navbar-dropdown" v-if="sortVisible">
            <div class="navbar-dropdown-item" :class="activeSort('title')" v-on:click="setSort('title')">
              <span class="ion ion-checkmark"></span> Title
            </div>
            <div class="navbar-dropdown-item" :class="activeSort('year')" v-on:click="setSort('year')">
              <span class="ion ion-checkmark"></span> Year
            </div>
          </div>
        </button>
        <button class="navbar-item is-single" v-on:click="toggleGroup()" v-click-outside="hideGroup">
          Group by <strong>{{this.$parent.groupBy}}</strong>

          <div class="navbar-dropdown" v-if="groupVisible">
            <div class="navbar-dropdown-item" :class="activeGroup('none')" v-on:click="setGroup('none')">
              <span class="ion ion-checkmark"></span> None
            </div>
            <div class="navbar-dropdown-item" :class="activeGroup('year')" v-on:click="setGroup('year')">
              <span class="ion ion-checkmark"></span> Year
            </div>
          </div>
        </button>
      </div>

      <div class="navbar-tab navbar-filter" title="Sort by ascending or descending order">
        <button class="navbar-item is-single is-icon" v-on:click="orderBy()">
          <span v-if="this.$parent.orderAsc" class="ion ion-android-funnel is-asc"></span>
          <span v-if="!this.$parent.orderAsc" class="ion ion-android-funnel"></span>
        </button>
      </div>
    </div>
    <div class="navbar-search" title="To search, start typing a word or phrase">
      <span class="ion ion-ios-search-strong"></span>
      <input class="navbar-search-input" v-model="query" @keyup.enter="search" ref="search" type="text" placeholder="Search for a movie">
    </div>
  </div>
</template>

<script>
  import ClickOutside from 'vue-click-outside';
  import keyboardJS from 'keyboardJS';
  const LSDB = require('lsdb');
  const Settings = new LSDB.Table('settings');

  export default {
    data() {
      return {
        query: '',
        sortVisible: false,
        groupVisible: false,
      };
    },
    methods: {
      activeSort(param) {
        return (this.$parent.sortBy === param) ? 'is-active' : '';
      },
      activeGroup(param) {
        return (this.$parent.groupBy === param) ? 'is-active' : '';
      },
      orderBy() {
        this.$parent.orderAsc = !this.$parent.orderAsc;
        const setting = Settings.findWhere({ id: 0 });
        setting.orderAsc = this.$parent.orderAsc;
        Settings.update(setting);
      },
      toggleSort() {
        this.sortVisible = !this.sortVisible;
      },
      toggleGroup() {
        this.groupVisible = !this.groupVisible;
      },
      hideSort() {
        this.sortVisible = false;
      },
      hideGroup() {
        this.groupVisible = false;
      },
      setGroup(param) {
        this.$parent.groupBy = param;
        const setting = Settings.findWhere({ id: 0 });
        setting.groupBy = this.$parent.groupBy;
        Settings.update(setting);
        this.groupVisible = false;
      },
      setSort(param) {
        this.$parent.sortBy = param;
        const setting = Settings.findWhere({ id: 0 });
        setting.sortBy = this.$parent.sortBy;
        Settings.update(setting);
        this.sortVisible = false;
      },
      search() {
        if (this.query.length > 0) {
          this.$parent.query = this.query;
          this.$parent.lastPage = 'search-view';
          this.$router.push({ name: 'search-view', params: { query: this.query } });
          this.query = '';
        }
      },
    },
    directives: {
      ClickOutside,
    },
    mounted() {
      keyboardJS.bind('command + f', () => {
        this.$refs.search.focus();
      });
    },
  };
</script>

<style lang="scss" scoped>
  .navbar {
    position: relative;
    z-index: 2;
    height: 44px;
    display: flex;
    padding: 5px;
    justify-content: center;
    align-items: center;
    background-color: rgba($gray-dark, .9);
    border-bottom: 1px solid rgba($black, .5);
    box-shadow: 0 1px 5px rgba($black, .2);
  }

  .navbar-center {
    display: flex;
    width: 100%;
    justify-content: center;
  }

  .navbar-tab {
    display: flex;
    font-size: 0;
  }

  .navbar-item {
    position: relative;
    line-height: 1;
    display: flex;
    padding: 7px 15px 5px;
    color: rgba($white, .3);
    background-color: $gray-light;
    box-shadow: inset 0 1px 0 rgba($white, .05);
    margin-right: 1px;
    -webkit-app-region: no-drag;
    appearance: none;
    border: 0;
    outline: 0;
    font-size: $font-size;
    font-size: 14px;
    text-align: center;

    &.is-single {
      padding: 6px 15px;
      margin-left: 2px;
      border-radius: $ui-radius;
    }

    &.is-icon {
      span {
        margin-left: 0;
      }
    }

    strong {
      margin-left: 3px;
      font-weight: 500;
      color: $white;
      text-transform: capitalize;
    }

    span {
      font-size: 16px;
      margin-left: 5px;

      &.is-asc {
        transform: rotate(180deg);
      }
    }

    &:active {
      background-color: darken($gray-light, 2);
    }

    &.active {
      color: $white;
      background-color: $gray-lighter;

      &:active {
        background-color: darken($gray-lighter, 2);
      }
    }

    &:first-child:not(.is-single) {
      border-top-left-radius: $ui-radius;
      border-bottom-left-radius: $ui-radius;
    }

    &:last-child:not(.is-single) {
      margin-right: 0;
      border-radius: 0;
      border-top-right-radius: $ui-radius;
      border-bottom-right-radius: $ui-radius;
    }
  }

  .navbar-filter {
    display: flex;
    margin-left: 40px;
  }

  .navbar-dropdown {
    position: absolute;
    left: 0;
    color: $white;
    border-radius: $border-radius;
    padding: 4px 0;
    margin-top: 22px;
    width: 150px;
    text-align: left;
    background-color: $gray;
    border: 1px solid rgba($gray-dark, .8);
    box-shadow: 0 2px 10px rgba($black, .2);
  }

  .navbar-dropdown-item {
    padding: 8px 15px;

    &:hover {
      background-color: $primary;
    }

    span {
      position: relative;
      top: -1px;
      margin-right: 5px;
      font-size: 12px;
      opacity: 0;
    }

    &.is-active {
      span {
        opacity: 1;
      }
    }
  }

  .navbar-search {
    position: relative;
    -webkit-app-region: no-drag;
    margin-right: 3px;

    span {
      position: absolute;
      margin: 6px 0 0 10px;
      color: rgba($white, .5);
      font-size: 20px;
    }
  }

  .navbar-search-input {
    padding: 5px 12px 5px 30px;
    width: 250px;
    line-height: 0;
    font-size: 14px;
    color: $white;
    border-radius: $border-radius;
    background-color: rgba($gray-lighter, .5);
    border: 2px solid transparent;
    outline: none;

    &:focus {
      background-color: $gray-light;
      border-color: rgba($white, .1);
    }
  }
</style>
