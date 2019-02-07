<template>
  <v-toolbar fixed class="cyan" dark>
    <v-toolbar-title class="mr-4">
      <span class="home" @click="navigateTo({name: 'root'})">
        Title
      </span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items v-if="!$store.state.isUserLoggedIn" class="hidden-sm-and-down">
      <v-btn flat @click="navigateTo({name: 'register'})">
        Sign Up
      </v-btn>
      <v-btn flat @click="navigateTo({name: 'login'})">
        Login
      </v-btn>
    </v-toolbar-items>
    <v-toolbar-items v-if="$store.state.isUserLoggedIn" class="hidden-sm-and-down">
      <v-btn flat @click="newRecipeDialog = true">
        Add Recipe
      </v-btn>
      <v-menu offset-y>
      <v-btn slot="activator" flat icon>
        <v-icon>account_circle</v-icon>
      </v-btn>
      <v-list>
        <v-list-tile>
          <v-list-tile-title>
            <v-btn flat @click="navigateTo({name: 'profile'})">
              Profile
            </v-btn>
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-title>
            <v-btn flat @click="logout">
              Log out
            </v-btn>
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
      <!-- <v-btn flat @click="profile">
        Profile
      </v-btn>
      <v-btn flat @click="logout">
        Log out
      </v-btn> -->
    </v-toolbar-items>
    <v-dialog v-model="newRecipeDialog" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
      <v-card tile>
        <v-toolbar card dark color="cyan">
          <v-btn icon dark @click="close">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Add New Recipe</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="saveRecipe">Save</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <add-recipe ref="foo"></add-recipe>
        </v-card-text>
        <div style="flex: 1 1 auto;"></div>
      </v-card>
    </v-dialog>
  </v-toolbar>
</template>

<script>
import AddRecipe from '../RecipeComponents/add-recipe.vue'
export default {
  data () {
    return {
      newRecipeDialog: false
    }
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    },
    logout () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$router.push({
        name: 'root'
      })
    },
    async saveRecipe () {
      try {
        await this.$refs.foo.addNewRecipe()
        this.close()
        console.log('add new recipe')
        this.$store.dispatch('requestRecipes')
      } catch (error) {
        console.error(error)
      }
    },
    close () {
      this.newRecipeDialog = false
      this.$refs.foo.resetForm()
    }
  },
  components: {
    'add-recipe': AddRecipe
  }
}
</script>

<style>
.home{
  cursor: pointer;
}
.v-list__tile__title {
    height: auto;
}
</style>
