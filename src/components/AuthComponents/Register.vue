<template>
  <v-layout row wrap>
    <v-flex xs6 offset-xs3>
      <div class="white elevation-2">
        <v-toolbar flat dense class="cyan" dark>
          <v-toolbar-title>Register</v-toolbar-title>
        </v-toolbar>
        <div class="pl-4 pr-4 pt-2 pb-2">
          <v-form name="reg-form" autocomplete="off" ref="form" v-model="valid" lazy-validation>
            <v-container grid-list-xl fluid>
              <v-layout wrap>
                <v-flex xs12>
                 <div class="dropbox">
                    <input type="file" multiple  @change="previewImage"
                      accept="image/*" class="input-file">
                      <p v-if="!avatarShow">
                        Drag your file(s) here to begin<br> or click to browse
                      </p>
                      <div class="image-preview" v-if="avatarShow.length > 0">
                          <img class="preview" style="width:100%;height:200px" :src="avatarShow">
                      </div>
                  </div>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field label="First Name" :rules="validationRules.nameRules" v-model="fname" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-text-field label="Last Name" :rules="validationRules.nameRules" v-model="lname" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="Email" :rules="validationRules.emailRules" v-model="email" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="Password" :rules="validationRules.passwordRules" :type="showPassword ? 'text' : 'password'" v-model="password" :append-icon="showPassword ? 'visibility_off' : 'visibility'" @click:append="showPassword = !showPassword" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="Confirm Password" :rules="validationRules.confirmPasswordRules" :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword" :append-icon="showConfirmPassword ? 'visibility_off' : 'visibility'" @click:append="showConfirmPassword = !showConfirmPassword" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea label="Bio" v-model="bio"></v-textarea>
                </v-flex>
                <div class="error" v-html="error"></div>
                <v-flex xs12>
                  <v-btn dark class="cyan" @click="register" :disabled="!valid">Registar</v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>
<script>
import AuthService from '../../services/AuthService'
export default {
  data () {
    return {
      valid: true,
      showPassword: false,
      showConfirmPassword: false,
      fname: '',
      lname: '',
      confirmPassword: '',
      email: '',
      password: '',
      bio: '',
      avatar: '',
      avatarShow: '',
      avatarType: '',
      validationRules: {
        nameRules: [
          v => !!v || 'Name is required',
          v => (v && v.length <= 10) || 'Name must be less than 10 characters'
        ],
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+/.test(v) || 'E-mail must be valid'
        ],
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
            (v && v.length === this.password.length && v === this.password) ||
            'Password Not Matched'
        ]
      },
      error: null
    }
  },
  methods: {
    async register () {
      if (this.$refs.form.validate()) {
        try {
          this.error = null
          let formData = new FormData()
          formData.append('fname', this.fname)
          formData.append('lname', this.lname)
          formData.append('email', this.email)
          formData.append('password', this.password)
          formData.append('bio', this.bio)
          if (this.avatar) {
            formData.append('avatar', new Blob([this.avatar], {type: this.avatarType}))
          }
          const response = await AuthService.register(formData)
          this.$store.dispatch('setToken', response.data.token)
          this.$store.dispatch('setUser', response.data.user)
          this.$router.push('recipes')
        } catch (error) {
          this.error = error.response.data.error
        }
      }
    },
    previewImage: function (event) {
      var input = event.target
      if (input.files && input.files[0]) {
        var reader = new FileReader()
        reader.onload = (e) => {
          this.avatar = input.files[0]
          console.log(input.files[0])
          console.log(e.target.result)
          this.avatarShow = e.target.result
          this.avatarType = input.files[0].type
        }
        reader.readAsDataURL(input.files[0])
      }
    }
  }
}
</script>

<style scoped>
.error {
  color: red
}

.dropbox {
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    background: lightcyan;
    color: dimgray;
    padding: 10px 10px;
    min-height: 200px; /* minimum height */
    position: relative;
    cursor: pointer;
  }

  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }

  .dropbox:hover {
    background: lightblue; /* when mouse over to the drop zone, change color */
  }

  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }
</style>
