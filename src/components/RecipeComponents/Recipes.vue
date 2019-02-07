<template>
     <v-layout row wrap>
        <Recipe v-for="recipe in userRecipes" :key="recipe.id" :recipe="recipe"></Recipe>
     </v-layout>
 </template>
 <style>
</style>
<script>
import Recipe from './recipe-card.vue'

import { mapState } from 'vuex'

export default {
  name: 'Recipes',
  computed: {
    ...mapState([
      'userRecipes'
    ])
  },
  components: {
    Recipe
  }
}
</script>
