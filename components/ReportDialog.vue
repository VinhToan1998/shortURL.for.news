<template lang="pug">
  v-dialog(v-model='isShow' max-width='480')
    template(v-slot:activator='{ on }')
    v-card
      v-card-title Report
      v-card-text
        v-form(@submit.prevent='submit' ref='form')
          template(v-if='!isLoggedIn')
            v-text-field(v-model='name' label='Name' :rules='[ $rules.required ]' dense outlined)
            v-text-field(v-model='email' type='email' label='Email' :rules='[ $rules.required ]' dense outlined)
          v-select(:items='reasonItems' label='Reason' :rules='[ $rules.required ]' dense outlined v-model='reason')
          v-textarea(v-if='reason === "other"' label='Describe your reason' :rules='[ $rules.required ]' v-model='otherReason' dense outlined)
          .text-right
            v-btn(color='error' @click='isShow = false' text) Close
            v-btn(type='submit' text) Report
            
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState({
    isLoggedIn: state => !!state.user.username,
    linkId: state => state.report.linkId
  }),
  data: () => ({
    isShow: false,
    reasonItems: [
      { text: 'Mocking', value: 'mocking'},
      { text: 'Violence', value: 'violence'},
      { text: 'Stimulant', value: 'stimulant'},
      { text: 'SPAM', value: 'spam'},
      { text: 'Missing information', value: 'missing_info'},
      { text: 'Other', value: 'other'}
    ],
    name: '',
    email: '',
    otherReason: '',
    reason: ''
  }),
  methods: {
    submit () {
      if (!this.$refs.form.validate()) return

      const { name, email, linkId: id, reason, otherReason } = this
      this.$axios.post('/api/report', { name, email, id, reason, otherReason }).then(res => {
        this.isShow = false
        this.$snackbar.requestSuccess(res)
      }).catch(this.$snackbar.requestError)
    }
  },
  watch: {
    isShow (v) {
      if (!v) {
        this.$store.commit('report/unsetLinkId')
        this.$refs.form.reset()
      }
    },
    linkId (v) {
      if(v) this.isShow = true
    }
  }
}
</script>