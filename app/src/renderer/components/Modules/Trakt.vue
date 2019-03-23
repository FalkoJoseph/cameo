<script>
  import Trakt from 'trakt.tv';
  import TraktImages from 'trakt.tv-images';

  export const traktApi = new Trakt({
    client_id: '26af20112ec09c9acd876f79f5c85b96decd6a5f86b0ccac2dcf40dad086e0bc',
    client_secret: '6837f1d39eaf991d48502639d0a36315c68c579e74bd3fb8f14a332e5e231638',
    redirect_uri: null,
    api_url: null,
    plugins: {
      images: TraktImages,
    },
    options: {
      images: {
        fanartApiKey: 'cc5a6664876af08bf9e1d7bdee2dd065',
      },
    },
  });
</script>
