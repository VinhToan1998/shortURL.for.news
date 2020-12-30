<template lang="pug">
  v-container.fill-height
    v-row(justify='center')
      v-col(cols='12' sm='4')
        v-card
          v-card-title Report  
          v-form(ref='form' @submit.prevent='submit')
            v-text-field(v-model='name', :counter='10', :rules='nameRules', label='Name', required='' outlined dense)
            v-text-field(v-model='email', :rules='emailRules', label='E-mail', required='' outlined dense)
            v-textarea(v-model='description', :rules='descriptionRules', label='Description', required='' outlined dense)   
            v-select(v-model='select', :items='items', :rules="[v => !!v || 'Report Type is required']", label='Report Type', required='' outlined dense)
            v-checkbox(v-model='checkbox', :rules="[v => !!v || 'You must agree to continue!']", label='Do you agree?', required='' outlined dense)
            v-btn.mr-4(color='error', @click='reset')
              | Reset
            v-btn(color='primary', @click='submit' type="submit" )
              | Submit
</template>
<script>
export default {
  data () {
    return {
      valid: false,
      name: '',
      nameRules: [
        v => !!v || "Name is required",
        v => (v && v.length <= 10) || "Name must be less than 10 characters"
      ],
      email: '',
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      description: '',
      descriptionRules: [v => !!v || "Description is required"],
      select: null,
      items: ["Mocking", "Violence", "Stimulant", "Other"],
      checkbox: false
    }
  },

  methods: {
    submit() {
      const { name, email, description } = this
      this.$axios.post('/api/report/report', { name, email, description }).then(res => {
      this.$snackbar.requestSuccess(res)
      this.$router.push('/')
    }).catch(this.$snackbar.requestError)
    },
    reset() {
      this.$refs.form.reset();
    }
  }
};
</script>