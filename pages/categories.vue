<template lang="pug">
  v-container
    h1 Category
    DialogCategoryCreate(@update='list')  
    //- v-toolbar
      v-toolbar-title Test      
    v-data-table(:headers='headers' :items='items')
      template(v-slot:item.action='{ item }')
        v-btn(icon @click='remove(item._id)')
          v-icon mdi-delete          
</template>

<script>
import DialogCategoryCreate from '~/components/DialogCategoryCreate'

export default {
  name: 'Categories',
  components: { DialogCategoryCreate },
  data: () => ({
    headers: [
      { text: 'Name', value: 'name'},
      { text: 'Slug', value: 'slug'},
      { text: 'Action', value: 'action'},
    ],
    items: []
  }),
  methods: {
    async list () {
      const { data } = await this.$axios.get('/api/category/list')
      this.items = data.items
    },
    remove(id) {
      this.$axios.delete('/api/category/' + id).then(res => {
        this.$snackbar.requestSuccess(res)
        this.list()
      })
      .catch(this.$snackbar.requestError)
    }
  },
  async asyncData({ $axios }) {
    const { data } = await $axios.get('/api/category/list')
    return { ...data }
  }
}
</script>