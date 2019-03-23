<template>
  <div class="container">
    <div v-if="user && user.username">
      <button class="button button-default" v-on:click="logout">Logout</button>
      <button class="button button-default" v-on:click="wipe">Wipe cache</button>

      <hr>
      Welcome, {{this.$parent.user.username}}
    </div>
    <div v-else>
      <br>
      PIN: {{pincode}}
      <br>
      <button v-on:click="showLogin">Connect to Trakt.tv</button>
    </div>
  </div>
</template>

<script>
  const BrowserWindow = require('electron').remote.BrowserWindow;
  import { traktApi } from './Modules/Trakt';
  import lspi from 'lspi';

  export default {
    name: 'settings-view',
    props: ['user'],
    data() {
      return {
        authWindow: null,
        pincode: '',
      };
    },
    methods: {
      // add profile
      // add option to wipe cache, show cache size
      // force re-sync
      // easter egg?

      login() {
        const token = traktApi.export_token();
        if (token.access_token) {
          traktApi.import_token(token).then((newTokens) => {
            console.log('newTokens');
            window.localStorage.setItem('token', JSON.stringify(newTokens));
            traktApi.users.settings().then((response) => {
              this.$parent.account = response.account;
              this.$parent.user = response.user;
            });
            if (this.authWindow) {
              this.authWindow.close();
            }
          });
        }
      },

      pollLogin() {
        const interval = setInterval(() => {
          const token = traktApi.export_token();
          if (token.access_token) {
            this.login();
            clearInterval(interval);
          }
        }, 300);
      },

      showLogin() {
        traktApi.get_codes().then(poll => {
          this.pincode = poll.user_code;
          this.authWindow = new BrowserWindow({
            width: 370,
            height: 530,
            resizable: false,
            title: 'Trakt.tv',
            'node-integration': false,
          });
          this.authWindow.loadURL(poll.verification_url);
          this.pollLogin();
          return traktApi.poll_access(poll);
        }).catch(error => {
          console.log('error', error);
        });
      },

      wipe() {
        this.$parent.isCached = false;
        lspi.drop('movies');
        location.reload();
      },

      logout() {
        this.$parent.account = {};
        this.$parent.user = {};
        lspi.drop('token');
        this.$forceUpdate();
      },
    },
    mounted() {
      this.$parent.lastPage = 'settings-view';
      this.login();
    },
  };
</script>

<style lang="scss" scoped>
  .button {
    margin: 10px;
  }
</style>
