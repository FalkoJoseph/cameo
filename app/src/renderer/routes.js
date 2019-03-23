export default [
  {
    path: '/seen',
    name: 'seen-view',
    component: require('components/SeenView'),
  },
  {
    path: '/watchlist',
    name: 'watchlist-view',
    component: require('components/WatchlistView'),
  },
  {
    path: '/',
    name: 'discover-view',
    component: require('components/DiscoverView'),
  },
  {
    path: '/settings',
    name: 'settings-view',
    component: require('components/SettingsView'),
  },
  {
    path: '/movie/:id',
    name: 'movie-view',
    component: require('components/MovieView'),
  },
  {
    path: '/search/:query',
    name: 'search-view',
    component: require('components/SearchView'),
  },
  {
    path: '*',
    redirect: '/',
  },
];
