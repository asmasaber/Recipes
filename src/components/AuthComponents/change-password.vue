<template>
    <v-layout row wrap>
    <v-flex xs10 offset-xs1>
      <div class="pl-4 pr-4 pt-2 pb-2">
        <v-form name="reg-form" autocomplete="off" ref="form" v-model="valid" lazy-validation>
          <v-container grid-list-xl fluid>
            <v-layout wrap>
               <v-flex xs12>
                  <v-text-field label="New Password" :rules="validationRules.passwordRules" :type="showNewPassword ? 'text' : 'password'" v-model="newPassword" :append-icon="showNewPassword ? 'visibility_off' : 'visibility'" @click:append="showNewPassword = !showNewPassword" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="Confirm Password" :rules="validationRules.confirmPasswordRules" :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword" :append-icon="showConfirmPassword ? 'visibility_off' : 'visibility'" @click:append="showConfirmPassword = !showConfirmPassword" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="Old Password" :type="showOldPassword ? 'text' : 'password'" v-model="oldPassword" :append-icon="showOldPassword ? 'visibility_off' : 'visibility'" @click:append="showOldPassword = !showOldPassword" required></v-text-field>
                </v-flex>
              <div class="error" v-html="error"></div>
              <v-flex xs12 style="text-align: right;">
                <v-btn dark  class="cyan"  :disabled="!valid" @click="save">Save</v-btn>
                <v-btn dark  class="cyan"  :disabled="!valid" @click="cancle">Cancle</v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import AuthService from '../../services/AuthService'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      valid: true,
      showNewPassword: false,
      showConfirmPassword: false,
      showOldPassword: false,
      validationRules: {
        passwordRules: [
          v => !!v || 'Password is required',
          v =>
            (v && v.length >= 8 && v.length <= 32) ||
            'Password must be at least 8 characters in length and not greater than 32 characters in length'
        ],
        confirmPasswordRules: [
          v => !!v || 'Confirm Password is required',
          v =>
            (v && v.length >= 8 && v.length <= 32) ||
            'Password must be at least 8 characters in length and not greater than 32 characters in length',
          v =>
            (v && v.length === this.newPassword.length && v === this.newPassword) ||
            'Password Not Matched'
        ]
      },
      error: null,
      newPassword: '',
      confirmPassword: '',
      oldPassword: ''
    }
  },
  computed: {
    ...mapState([
      'user'
    ])
  },
  methods: {
    async save () {
      if (this.$refs.form.validate()) {
        try {
          this.error = null
          const response = await AuthService.changePassword({
            id: this.user.id,
            newPassword: this.newPassword,
            oldPassword: this.oldPassword
          })
          this.$store.dispatch('setToken', response.data.token)
          this.$store.dispatch('setUser', response.data.user)
          this.resetControls()
        } catch (error) {
          this.error = error.response.data.error
        }
      }
    },
    cancle: function () {
      this.resetControls()
    },
    resetControls: function () {
      this.newPassword = ''
      this.confirmPassword = ''
      this.oldPassword = ''
    }
  }
}
</script>

<style>

</style>
