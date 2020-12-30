<template lang="pug">
  v-snackbar(:value='isShow' :color='type')
    v-icon(v-if='icon').mr-3 {{ icon }}
    | {{ msg }}
    template(v-slot:action)
      v-btn(icon @click='doClose')
        v-icon mdi-close
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      isShow: state => state.snackbar.isShow,
      msg: state => state.snackbar.msg,
      type: state => state.snackbar.type
    }),
    icon () {
      const icons = {
        success: 'mdi-check-circle',
        warning: 'mdi-alert-circle',
        error: 'mdi-alert-circle'
      }
      return icons[this.type] || null
    }
  },
  methods: {
    doClose () {
      this.$store.dispatch('snackbar/hide')
    }
  }
}
</script>
