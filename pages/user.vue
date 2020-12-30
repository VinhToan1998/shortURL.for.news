<template lang="pug">
  v-container
    h1 Manage Users
    v-data-table.elevation-1(v-model='selected' :headers='headers' :items='users' :single-select='singleSelect' item-key='name' show-select)
      template(v-slot:top)
        .d-flex.align-center
      template(v-slot:item.user='{ value }') {{ value.name || value.username }}
      template(v-slot:item.action='{ item }')
        v-btn(icon @click='deleteUser(item._id)')
          v-icon mdi-delete
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'User',
  

  data() {
    return {
      singleSelect: false,
      selected: [],
      headers: [
        { text: 'Username', value: 'username', sortable: false },
        { text: 'Email', value: 'email', sortable: false },
        { text: 'Name', value: 'name', sortable: false },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      users: [],
      fullUrl: ''
    }
  },
  computed: {
    ...mapState({}),
  },
  methods: {
    deleteUser (userId) {
      this.$axios.delete('/api/user/' + userId).then(res => {
        this.$snackbar.requestSuccess(res)
        this.getUsers()
      }).catch(this.$snackbar.requestError)
    },
    getUsers () {
      this.$axios.get('/api/user/list').then(res => {
        this.users = res.data.users || []
      }).catch(err => {})
    }
  },
  async asyncData({ $axios }) {
    try {
      const { data } = await $axios.get('/api/user/list')
      return { ...data }
    } catch(err) {

    }
  }
};
</script>