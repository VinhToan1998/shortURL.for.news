<template lang="pug">
v-container
   h1 View Report
      SnippetDialog(v-model='previewLink')
      ReportDetailDialog(v-model='reports')
      v-data-table.elevation-1(v-model='selected' :items='processedItems' :headers='headers' :single-select='singleSelect' show-select )
         template(v-slot:top)
            .d-flex.align-center
         template(v-slot:item.action='{ item }')
            v-btn(x-small color='red' @click='removeShortLink(item.link._id)' v-if='item.link').mr-1 Delete
            v-btn(x-small color='success' @click='previewLink = item.link' v-if='item.link').mr-1 Preview
            v-btn(x-small color='primary' @click='getReportDetails(item.link._id)' v-if='item.link') Reports
</template>

<script>
import SnippetDialog from '@/components/SnippetDialog'
import ReportDetailDialog from '@/components/ReportDetailDialog'

export default {
   components: { SnippetDialog, ReportDetailDialog },
   data() {
      return {
         singleSelect: false,
         selected: [],
         previewLink: null,
         headers: [
            { text: 'ID', value: 'link.linkId', sortable: false },
            { text: 'Source', value: 'link.src', sortable: false },
            { text: 'Category', value: 'link.category', sortable: false },
            { text: 'Report Count', value: 'reportCount' },
            { text: 'Action', value: 'action', sortable: false },
         ],
         reports: [],
      }
   },
   computed: {
      processedItems () {
         return this.items.map(item => {
            if(item.link && item.link.category) {
               const { name } = this.categories.find(obj => obj._id === item.link.category)
               if (name)
               item.link.category = name
            }
            return item
         })
      }
   },
   methods: {
      list () {
         this.$axios.get('/api/report/list').then(({ data }) => {
            this.items = data.items
         })
      },
      getReportDetails (linkId) {
         this.$axios.get('/api/report/list/' + linkId).then(res => {
            this.reports = res.data.items
         })
      },
      removeShortLink (id) {
         this.$axios.delete('/api/shortlink/' + id).then(res => {
            this.$snackbar.requestSuccess(res)
            this.list()
         }).catch(this.$snackbar.requestError)
      }
   },
   asyncData({ $axios, error }) {
      return $axios.get('/api/report/list').then(({ data }) => {
         return data
      }).catch(err => {
         error(err.response.data.message)
      })
   }
}
</script>