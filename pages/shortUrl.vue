<template lang="pug">
  v-container
    h1 URL ShortUrl
    v-row
      v-col(cols='12' sm='4')
        v-form.d-flex.form-inline(ref='addUrlForm' @submit.prevent='addUrl')
          v-text-field(equired placeholder='Url' type='url' name='fullUrl' label='Full Url' color='red' :rules='[ $rules.required ]' v-model='fullUrl' outlined dense)
          v-select(label='Category' :items='categories' item-text='name' item-value='_id' :rules='[ $rules.required ]' v-model='category' outlined dense).ml-1
          v-btn(type='submit' color='primary').ml-1 Short
    v-data-table.elevation-1(v-model='selected' :headers='tableHeaders' :items='links'  item-key='name' )
      template(v-slot:item.user='{ value }') {{ value.name || value.username }}
      template(v-slot:item.action='{ item }').d-flex
        v-btn(icon @click='doCopy(item.linkId)')
          v-icon mdi-clipboard-text    
        v-btn(icon @click='showStats(item.linkId)')
          v-icon mdi-chart-line
        v-btn(icon :href='`/${item.linkId}`' target='_blank')
          v-icon mdi-open-in-new       
        v-btn(icon @click='remove(item._id)')
          v-icon mdi-delete
    StatisticsDialog(v-model='statisticLink')   
</template>

<script>
import { mapState } from 'vuex'
import StatisticsDialog from '@/components/StatisticsDialog'

export default {
  components: { StatisticsDialog },
  mounted () {
    if(!this.isLoggedIn)
      this.$router.replace('/')
  },
  data() {
    return {
      statisticLink: '',
      selected: [],
      users: [],
      links: [],
      fullUrl: '',
      category: '',
      categories: []
    }
  },
  computed: {
    ...mapState({ isAdmin: state => state.user && state.user.isAdmin, isLoggedIn: state => !!state.user.username }),
    tableHeaders () {
      const adminHeaders = !this.isAdmin ? [] : [
      ]
      return [
        { text: "Full Url", align: "start", sortable: false, value: "src" },
        { text: "Short Url", value: "linkId", sortable: false },
        ...adminHeaders,
        { text: "Category", value: "category.name", sortable: false },
        { text: "Clicks", value: "impression" },
        { text: "Actions", value: "action", sortable: false }
      ]
    }
  },
  methods: {
    showStats (linkId) {
      this.statisticLink = linkId
    },
    doCopy (linkId) {
      const { origin } = window.location
      navigator.clipboard.writeText(origin + '/' + linkId).then(() => {
        this.$snackbar.success('Copied!')
      })
    },
    getLinks () {
      this.$axios.get('/api/shortlink/list').then(res => {
        this.links = res.data.links || []
      }).catch(err => {})
    },
    addUrl () {
      if (!this.$refs.addUrlForm.validate()) return
      const src = this.fullUrl
      const category = this.category
      this.$axios.post('/api/shortlink/create', { src, category }).then(res => {
        this.$refs.addUrlForm.reset()
        this.$snackbar.requestSuccess(res)
        this.getLinks()
      }).catch(this.$snackbar.requestError)
    },
    remove (id) {
      const index = this.links.findIndex(item => item._id === id)
      this.$axios.delete('/api/shortlink/' + id).then(res => {
        this.$snackbar.requestSuccess(res)
        this.links.splice(index, 1)
      }).catch(this.$snackbar.requestError)
    }
  },
  async asyncData({ $axios, redirect }) {
    try {
      const { data } = await $axios.get('/api/shortlink/init')
      return { ...data }
    } catch(err) {

    }
  }
};
</script>