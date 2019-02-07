<template>
  <v-layout row wrap>
    <v-flex xs10 offset-xs1>
      <div class="pl-4 pr-4 pt-2 pb-2">
        <v-form name="reg-form" autocomplete="off" ref="form" v-model="valid" lazy-validation>
          <v-container grid-list-xl fluid>
            <v-layout wrap>
              <v-flex xs12>
                <v-flex xs6 offset-xs3>
                  <div class="dropbox">
                    <input ref="avatar" type="file" multiple  @change="previewImage"
                      accept="image/*" class="input-file">
                      <p v-if="!avatarShow">
                        Drag your file(s) here to begin<br> or click to browse
                      </p>
                      <div class="image-preview" v-if="avatarShow">
                          <img class="preview" style="width:100%;height:200px" :src="avatarShow">
                      </div>
                  </div>
                </v-flex>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field label="First Name" :rules="validationRules.nameRules" v-model="user.fname" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field label="Last Name" :rules="validationRules.nameRules" v-model="user.lname" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-textarea label="Bio" v-model="user.bio"></v-textarea>
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

export default {
  data () {
    return {
      showIcon: true,
      valid: true,
      showPassword: false,
      showConfirmPassword: false,
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
  computed: {
    user: {
      get () {
        return Object.assign({}, this.$store.state.user)
      }
    }
  },
  created () {
    this.avatarShow = this.user.avatar
  },
  methods: {
    previewImage: function (event) {
      var input = event.target
      if (input.files && input.files[0]) {
        var reader = new FileReader()
        reader.onload = (e) => {
          this.user.avatar = input.files[0]
          this.avatarShow = e.target.result
          this.avatarType = input.files[0].type
        }
        reader.readAsDataURL(input.files[0])
      }
    },
    async save () {
      if (this.$refs.form.validate()) {
        try {
          this.error = null
          let formData = new FormData()
          formData.append('id', this.user.id)
          formData.append('fname', this.user.fname)
          formData.append('lname', this.user.lname)
          formData.append('bio', this.user.bio)
          if (this.$store.state.user.avatar !== this.user.avatar) {
            formData.append('avatar', new Blob([this.user.avatar], {type: this.avatarType}))
          }

          const response = await AuthService.updateProfile(formData)
          this.$store.dispatch('setToken', response.data.token)
          this.$store.dispatch('setUser', response.data.user)
        } catch (error) {
          this.error = error.response.data.error
        }
      }
    },
    cancle: function () {
      this.user.avatar = this.$store.state.user.avatar
      this.user.fname = this.$store.state.user.fname
      this.user.lname = this.$store.state.user.lname
      this.user.bio = this.$store.state.user.bio
      console.log(this.user.bio)
    }
  }
}
</script>

<style>
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
