<template lang="pug">
  v-dialog(max-width='480' :value='value' @input='doClose')
    v-card(v-if='value')
      v-img(:src='value.image' v-if='value.image')
        v-row.fill-height(align='end' justify='end')
          v-chip.my-2.mx-4 {{ value.category }}
      v-card-title {{ value.title }}
        template(v-if='!value.image')
          v-spacer
          v-chip {{ value.category }}
      v-card-text(v-if='value.description') {{ value.description }}
      v-card-actions
        v-spacer
        .stats.d-flex.align-center.mr-2(v-if='value.impression')
          v-icon(left) mdi-eye
          .text-subtitle-2 {{ value.impression }}
        v-btn(color='red' text @click='doClose(false)') Close
</template>

<script>
export default {
  name: 'SnippetDialog',
  props: ['value'],
  methods: {
    doClose (isShow) {
      if (!isShow)
      this.$emit('input', null)
    }
  }
}
</script>