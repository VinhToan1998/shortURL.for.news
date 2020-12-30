<template lang="pug">
  v-container.fill-height
    v-row(justify='center' align='center')
      v-col(cols='12' sm='4')
        v-card
          v-card-title Register
          v-card-text
            v-form(ref='form' @submit.prevent='submit')
              v-text-field(name='user' label='Username' prepend-icon='mdi-account-circle' v-model='username' outlined dense)
              v-text-field(name='email' label='Email' type='email' prepend-icon='mdi-email' v-model='email' outlined dense)
              v-text-field(
                name='password'
                :type="showPassword ? 'text' : 'password'"
                label='Password' v-model='password'
                prepend-icon='mdi-lock'
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append='showPassword = !showPassword'
                outlined
                dense)
              v-text-field(name='password2' :type="showPassword ? 'text' : 'password'" label='Confirm Password' prepend-icon='mdi-lock' outlined dense)
              v-divider
          v-card-actions.px-5
            span Have An Account?
            nuxt-link(to='/login').ml-1.font-weight-bold Login
            v-spacer
            v-btn(color='info' type='submit' @click='submit') Submit
            v-btn(color='error' type='reset') Reset
</template>

<script>
export default {
  name: "App",
  data () {
    return {
      username: '',
      email: '',
      password: '',
      showPassword: false
    };
  },
  methods: {
    submit () {
      const { username, email, password } = this
      this.$axios.post('/api/user/register', { username, email, password }).then(res => {
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
