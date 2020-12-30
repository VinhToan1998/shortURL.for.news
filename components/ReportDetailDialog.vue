<template lang="pug">
  v-dialog(v-model='isShow' max-width='1024' @input='doClose')
    v-card
      v-card-title Reports
      v-card-text
        v-data-table(v-model='selected' :items='processedItems' :headers='headers' :single-select='singleSelect' show-select)
          template(v-slot:top)
              .d-flex.align-center
          v-btn(icon @click='')
              v-icon mdi-delete
          template(v-slot:item.action='{ item }')
      v-card-actions
        v-spacer
        v-btn(color='error' text @click='doClose(false)') Close                      
</template>

<script>
export default {
  name: 'ReportDetailDialog',
  props: ['value'],
  data: () => ({
    isShow: false,
    singleSelect: false,
    selected: [],
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Email', value: 'email' },
      { text: 'Reason', value: 'reason' },

    ],
  }),
  computed: {
    processedItems () {
        return this.value.map(item => {
          item.name = item.name || ( item.user.name || item.user.username)
          item.email = item.email || item.user.email
          item.reason = item.reason === 'other' ? item.otherReason : item.reason
          return item
        })
    }
  },
  methods: {
    doClose (isShow) {
      if (!isShow) {
        this.$emit('input', [])
      }
    }
  },
  watch: {
    value (v) {
      if (v && v.length) {
        this.isShow = true
      } else {
        this.isShow = false
      }
    }
  }
}
</script>