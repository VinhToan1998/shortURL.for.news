<template lang="pug">
  v-card(:to='`/${item.linkId}`' target='_blank')
    v-img(:src='item.image' v-if='item.image' :aspect-ratio='2/1' )
      v-row.fill-height(align='end' justify='end')
        v-chip.my-2.mx-4(:to='`/category/${item.category.slug}`') {{ item.category.name }}
    v-card-title {{ item.title }}
      template(v-if='!item.image')
        v-spacer
        v-chip(:to='`/category/${item.category.slug}`') {{ item.category.name }}
    v-card-text(v-if='item.description') {{ item.description }}
    v-card-actions
      v-spacer
      .stats.d-flex.align-center.mr-1(v-if='item.impression')
        v-icon(left) mdi-eye
        .text-subtitle-2 {{ item.impression }}
      v-btn(icon @click.prevent='doReport(item._id)')
        v-icon mdi-flag
</template>

<script>
export default {
  name: 'LinkSnippet',
  props: ['item'],
  methods: {
    doReport(id) {
      this.$store.commit('report/setLinkId', id)
    }
  }
}
</script>