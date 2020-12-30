<template lang="pug">
  v-container
    h2 {{ category.name }}
    v-row
      v-col(cols='12' md='4' v-for='item in links' :key='item.linkId')
        v-card(:to='`/${item.linkId}`' target='_blank')
          v-img(:src='item.image')
            v-row.fill-height(align='end' justify='end')
              v-chip.my-2.mx-4 {{ item.category.name }}
          v-card-title {{ item.title }}
          v-card-text {{ item.description }}  
</template>

<script>
export default {
  name: 'Category',
  asyncData({ $axios, params }) {
    const { slug } = params || {}
    return $axios.get('/api/category/' + slug).then(res => {
      return res.data
    })
  }
}
</script>
