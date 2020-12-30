<template lang="pug">
  v-container.fill-height
    v-row(justify='center' align='center')
      v-col(cols='12' sm='4')
        v-card
          v-card-title Login
          v-card-text
            v-form(ref='form' @submit.prevent='submit')
              v-text-field(name='user' label='Username' prepend-icon='mdi-account-circle' v-model='username' @keydown.enter='submit' outlined dense)
              v-text-field(
                name='password'
                :type="showPassword ? 'text' : 'password'"
                label='Password' v-model='password'
                prepend-icon='mdi-lock'
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append='showPassword = !showPassword'
                @keydown.enter='submit'
                outlined
                dense)
              v-divider
          v-card-actions.px-5
            span Don't Have An Account?
            nuxt-link(to='/register').ml-1.font-weight-bold Register
            v-spacer
            v-btn(color='info' type='submit' @click='submit') Submit
</template>

<script>
export default {
  name: 'Login',
  data: () => ({
    username: '',
    password: '',
    showPassword: false
  }),
  methods: {
    submit () {
      const { username, email, password } = this
      this.$axios.post('/api/user/login', { username, email, password }).then(async (res) => {
        await this.$store.dispatch('checkAuth')
        this.$snackbar.requestSuccess(res)
        this.$router.push('/')
      }).catch(this.$snackbar.requestError)
    },
    reset () {
      this.$refs.form.reset()
    }
  }
  
};
</script>
