<template lang="pug">
  
</template>

<script>
export default {
  async asyncData({ params, $axios, redirect, error }) {
    const { linkId } = params || {}
    const { data } = await $axios.get('/api/shortlink/' + linkId, { params: { visit: true }})
    if (data.link && data.link.src)
      return redirect(data.link.src)
    error({ statusCode: 404, message: 'Link not exists' })
  }
}
</script>