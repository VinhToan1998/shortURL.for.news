<template lang="pug">
  v-container.fill-height
    UploadImage(v-model='selectImageDialog')
    v-row(justify='center' align='center')
      v-col(cols='12' md='4' xl='3')
        v-card
          v-card-title Profile
          v-card-text
            .d-flex.flex-column.justify-center.align-center.mb-3
              v-avatar(size='256' color='grey darken-3' v-if='!getUserImage')
                v-icon(size='240' @click='selectImageDialog = true') mdi-account
              v-avatar(size='256' color='grey darken-3' v-else)
                v-img.hoverable(:src='getUserImage' @click='selectImageDialog = true')
            v-form(ref='profileForm' @submit.prevent='doUpdate')
              v-text-field(label='Name' outlined dense v-model='name')
              v-text-field(label='Username' outlined dense readonly :value='username')
              v-text-field(label='Email' :value='email' readonly outlined dense)
              v-text-field(label='Phone Number' v-model='phone' outlined dense)
              v-text-field(label='Change Password' type='password' :rules='[$rules.password]' v-model='changePassword' outlined dense)
              .text-right
                v-btn(type='submit' color='primary') Submit
</template>

<script>
import { mapState } from 'vuex'
import UploadImage from '~/components/UploadImage'

export default {
  name: 'Profile',
  components: { UploadImage },
  data: () => ({
    name: '',
    phone: '',
    changePassword: '',
    selectImageDialog: false
  }),
  computed: {
    ...mapState({
      userNiceName: state => state.user.name,
      username: state => state.user.username,
      phoneNumber: state => state.user.phone,
      userImage: state => state.user.image,
      email: state => state.user.email
    }),
    getUserImage () {
      if (this.userImage) {
        return '/user/' + this.userImage
      }
      return null
    }
  },
  methods: {
    selectImage () {
    },
    doUpdate () {
      if (this.$refs.profileForm.validate()) {
        const { name, phone, changePassword } = this
        this.$axios.patch('/api/profile', { name, phone, changePassword }).then(this.$snackbar.requestSuccess).catch(this.$snackbar.requestError)
      }
    }
  },
  mounted () {
    this.name = this.userNiceName
    this.phone = this.phoneNumber
  }
}
</script>
