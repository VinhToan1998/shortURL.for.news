<template lang="pug">
  v-container
    h2 Categories
      Categories(:items='categories')
    template(v-if='popular.length')
    h2 Popular Links
      v-row
        v-col(cols='12' md='4' v-for='item in popular' :key='item.linkId')
          LinkSnippet(:item='item')
    h2 Newest Links
    v-row
      v-col(cols='12' md='4' v-for='item in links' :key='item.linkId')
        LinkSnippet(:item='item')
    ReportDialog 
</template>

<script>
import ReportDialog from '~/components/ReportDialog'
import Categories from '~/components/Categories'
import LinkSnippet from '~/components/LinkSnippet'

export default {
  name: 'Welcome',
  components: { LinkSnippet, Categories, ReportDialog },
  asyncData({ $axios }) {
    return $axios.get('/api/shortlink/home').then(res => {
      return res.data
    })
  },
  methods: {
    doReport(id) {
      this.$store.commit('report/setLinkId', id)
    }
  }
}
</script>
