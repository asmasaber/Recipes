<template>
     <v-layout row wrap>
        <Recipe v-for="recipe in recipes" :key="recipe.id" :recipe="recipe"></Recipe>
     </v-layout>
 </template>
 <style>
</style>
<script>
import Recipe from './recipe-card-actions.vue'

export default {
  name: 'Recipes',
  computed: {
    recipes: {
      get () {
        return this.$store.state.userRecipes
      }
    }
  },
  components: {
    Recipe
  }
}
</script>
