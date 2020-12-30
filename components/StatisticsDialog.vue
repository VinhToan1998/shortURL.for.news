<template lang="pug">
  v-dialog(v-model='isShow' max-width='768' @input='doClose')
    v-card
      v-card-title Statistics
      v-card-text
        v-alert(type='warning' v-if='items.length < 2') Not enough data to show        
        v-progress-circular(indeterminate v-if='isLoading')
        v-sparkline(:labels='labels' :value='values' line-width='2' padding='16')
      v-card-actions
        v-spacer
        v-btn(@click='doClose(false)' color='red' text) Close
</template>

<script>
export default {
  props: ['value'],
  data: () => ({
    isLoading: false,
    isShow: false,
    items: []
  }),
  computed: {
    values () {
      return this.items.map(item => item.count)
    },
    labels () {
      return this.items.map(item => item._id.date)
    }
  },
  methods: {
    reset () {
      this.items = []
    },
    doClose (isShow) {
      if(!isShow)
        this.$emit('input', '')
    }
  },
  watch: {
    value (v) {
      if (v && v.length) {
        this.isShow = true
      } else {
        this.isShow = false
      }
    },
    isShow (v) {
      if (!v) {
        this.reset()
        this.isShow = false
      } else {
        this.isLoading = true
        this.$axios.get('/api/statistics/' + this.value).then(res => {
          this.items = res.data.items
        }).catch(this.$snackbar.requestError)
        .finally(() => {
          this.isLoading = false
        })
      }
    }
  }
}
</script>