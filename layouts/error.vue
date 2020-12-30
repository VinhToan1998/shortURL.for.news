<template lang="pug">
  v-container.fill-height
    v-row(justify='center')
      v-icon(x-large).mr-3 mdi-alert-circle
      div
        h1 {{ error.message }}
        .d-flex
          .text-subtitle-2 Please return to
          nuxt-link.text-subtitle-2.ml-1(to='/') Home page
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>