<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-stepper vertical>
        <v-layout row wrap>
          <v-flex xs2>
            <v-stepper-step editable step="1">Profile Info</v-stepper-step>
            <v-stepper-step editable step="2">Change Password</v-stepper-step>
            <v-stepper-step editable step="3">Your Recipes</v-stepper-step>
          </v-flex>
          <v-flex xs10>
            <v-stepper-content step="1">
              <EditProfile></EditProfile>
            </v-stepper-content>
             <v-stepper-content step="2">
              <div class="mb-5" height="200px">
                <ChangePassword></ChangePassword>
              </div>
            </v-stepper-content>
            <v-stepper-content step="3">
              <div class="mb-5" height="200px">
                <UserRecipes></UserRecipes>
              </div>
            </v-stepper-content>
          </v-flex>
        </v-layout>
      </v-stepper>
    </v-flex>
  </v-layout>
</template>

<script>
import UserRecipes from '../RecipeComponents/user-Recipes.vue'
import EditProfile from '../AuthComponents/edit-profile.vue'
import ChangePassword from '../AuthComponents/change-password.vue'

export default {
  data () {
    return {
      e13: 2
    }
  },
  components: {
    UserRecipes,
    EditProfile,
    ChangePassword
  }
}
</script>

<style>
.theme--light.v-stepper--vertical .v-stepper__content:not(:last-child) {
    border-left: 0;
}

</style>
