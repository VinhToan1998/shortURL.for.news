<template lang="pug">
  v-app
    v-navigation-drawer(v-model='drawer' :mini-variant='miniVariant' :clipped='clipped' fixed app)
      v-list
        v-list-item(v-for='(item, i) in navItems' :key='i' :to='item.to' router exact)
          v-list-item-action
            v-icon {{ item.icon }}
          v-list-item-content
            v-list-item-title(v-text='item.title')
      template(v-slot:append)
        v-list-item(@click.stop='miniVariant = !miniVariant')
          v-list-item-action
            v-icon {{ miniVariant ? 'mdi-chevron-right' : 'mdi-chevron-left'}}
          v-list-item-content
            v-list-item-title {{ miniVariant ? 'Maximize' : 'Minimize' }}
    v-app-bar(:clipped-left='clipped' app)
      v-app-bar-nav-icon(@click.stop='drawer = !drawer')
      v-toolbar-title(v-text='title')
      v-spacer
      template(v-if='!isLoggedIn')
        v-btn(color='primary', text, to='/login') Login
        v-btn(color='green', text, to='/register') Register
      template(v-else)
        .mr-2 Hi {{ userName }}!
        v-menu(offset-y v-if='userImage')
          template(v-slot:activator='{ on }')
            v-btn(icon v-on='on')
              v-avatar(size='32')
                v-img(:src='getUserImage' v-if='userImage')
          v-list
            v-list-item(to='/profile')
              v-list-item-title Profile              
            v-list-item(@click='doLogOut')
              v-list-item-title Logout    
        template(v-else)        
          v-btn(color='primary' text to='/profile' v-if='!isAdmin').ml-1 Profile
          v-btn(color='primary' text to='/viewReport' v-if='isAdmin').ml-1 View Report
          v-btn(color='primary' text to='/categories' v-if='isAdmin').ml-1 Categories
          v-btn(color='primary' text to='/user' v-if='isAdmin').ml-1 Users
          v-btn(color='primary' text @click='doLogOut').ml-1 Logout
    v-content
      nuxt
      AppNotification
    v-navigation-drawer(v-model='rightDrawer' :right='right' temporary fixed)
    v-footer(:fixed='fixed' app)
      span © {{ new Date().getFullYear() }} Copyright by Toan
</template>

<script>
import AppNotification from '~/components/AppNotification'
import { mapState } from 'vuex'

export default {
  components: { AppNotification },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        { icon: "mdi-apps", title: "Welcome", to: "/" },
        { icon: "mdi-link", title: "Short URL", to: "/shortUrl" },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "TopURL"
    }
  },
  computed: {
    ...mapState({
      userData: state => state.user,
      isLoggedIn: state => !!state.user.username,
      isAdmin: state => state.user.isAdmin,
      userImage: state => state.user.image
    }),
    navItems () {
      const loggedInNavs = ['/shortUrl']
      const protectedNavs = ['/user']
      let items = this.items
      items = !this.isLoggedIn ? items.filter(item => !loggedInNavs.includes(item.to)) : items
      return !this.isAdmin ? items.filter(item => !protectedNavs.includes(item.to)) : items
    },
    getUserImage () {
      if (this.userImage) {
        return '/user/' + this.userImage
      }
      return null
    },
    userName () {
      return this.userData.name || this.userData.username
    },
    isLoggedIn () {
      return this.userData && this.userData.username
    }
  },
  methods: {
    async doLogOut () {
      try {
        const { data } = await this.$axios.delete('/api/user/session')
        this.$snackbar.success(data.message)
        this.$store.commit('user/clearUserData')
        this.$router.replace('/')
      } catch(err) {
        this.$snackbar.requestError(err)
      }
    }
  }
};
</script>
