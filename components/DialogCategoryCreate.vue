<template lang="pug">
  v-dialog(v-model='isShow' max-width='480')
    template( v-slot:activator='{ on }' )
      v-btn(v-on='on') Create   
    v-card
      v-card-title Create Category
      v-card-text
        v-form(@submit.prevent='submit')
          v-text-field(label='Name' outlined dense v-model='name')
          .text-right
            v-btn(type='submit' color='success') Create
</template>

<script>
export default {
  name: 'CategoryCreate',
  data: () => ({
    name: '',
    isShow: false
  }),
  methods: {
    submit () {
      this.$axios.post('/api/category/create', { name: this.name }).then(res => {
        this.$snackbar.requestSuccess(res)
        this.isShow = false
        this.$emit('update')
      }).catch(this.$snackbar.requestError)
    }
  }
}
</script>