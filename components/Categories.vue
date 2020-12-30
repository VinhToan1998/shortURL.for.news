<template lang="pug">
  .category-list
    v-chip(v-for='item in items' :key='item.slug' :to='`/category/${item.slug}`' label).mx-1 {{ item.name }}
</template>

<script>
export default {
  props: ['items']
}
</script>