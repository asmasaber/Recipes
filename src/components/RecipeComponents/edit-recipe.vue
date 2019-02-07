<template>
  <v-layout row wrap>
    <v-flex xs10 offset-xs1>
      <div class="pl-4 pr-4 pt-2 pb-2">
        <v-form name="reg-form" autocomplete="off" ref="form" v-model="valid" lazy-validation>
          <v-container grid-list-xl fluid>
            <v-layout row wrap>
              <v-flex xs5>
                <v-layout row wrap>
                  <v-flex xs12>
                    <!-- <v-text-field label="Pic URL" :rules="validationRules.picRules" v-model="pic" required></v-text-field> -->
                      <div class="dropbox">
                        <input type="file" multiple  @change="previewImage"
                          accept="image/*" class="input-file">
                          <p v-if="!picShow">
                            Drag your file(s) here to begin<br> or click to browse
                          </p>
                          <div class="image-preview" v-if="picShow.length > 0">
                              <img class="preview" style="width:100%;height:400px" :src="picShow">
                          </div>
                      </div>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs7>
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-text-field label="Title" :rules="validationRules.titleRules" v-model="recipe.title" required></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-combobox v-model="recipe.category" :items="categories" :rules="validationRules.categoryRules" label="Select a Recipe Category"></v-combobox>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field label="Persons Number" :rules="validationRules.personsRules" v-model="recipe.persons" required></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field label="Time Needed" :rules="validationRules.timeNeededRules" v-model="recipe.timeNeeded" required></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-textarea label="Description" :rules="validationRules.descriptionRules" v-model="recipe.description" required></v-textarea>
                  </v-flex>
                  <v-flex xs12  style="position: relative;">
                    <p class="ingredients"><span>Ingredients:&nbsp;</span></p>
                    <vue-tags-input
                          v-model="ingredient"
                          :tags="ingredients"
                          @tags-changed="newIngredients => ingredients = newIngredients"
                          placeholder="Enter Ingredient"
                          allow-edit-tags
                        />
                  </v-flex>
                </v-layout>
              </v-flex>
              <div class="error" v-html="error"></div>
              <v-flex xs12  v-if="showSaveProp">
                <v-btn dark class="cyan" @click="updateRecipe" :disabled="!valid" style="float: right;">Save</v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </div>
    </v-flex>
  </v-layout>
</template>
<script>
import RecipeService from '../../services/RecipeService'
import VueTagsInput from '@johmun/vue-tags-input'

export default {
  name: 'EditRecipeCard',
  props: {
    recipe: null
  },
  data () {
    return {
      valid: false,
      picShow: this.recipe.avatar,
      pic: '',
      picType: '',
      ingredient: '',
      ingredients: this.recipe.ingredients,
      categories: ['Breakfast', 'Appetizer', 'salad', 'MainDish', 'Side Dish', 'Dessert'],
      showSaveProp: false,
      validationRules: {
        titleRules: [
          v => !!v || 'Title is required',
          v => (v && v.length <= 100) || 'Title must be less than 100 characters'
        ],
        descriptionRules: [
          v => !!v || 'Description is required',
          v => (v && v.length <= 500) || 'Description must be less than 500 characters'
        ],
        personsRules: [
          v => !!v || 'Number of Persons is required',
          v =>
            (v && !isNaN(v)) ||
            'Number of Persons must be a Number'
        ],
        timeNeededRules: [
          v => !!v || 'Time Needed is required',
          v =>
            (v && !isNaN(v)) ||
            'Time Needed must be at Number of Min.s'
        ],
        picRules: [
          v => !!v || 'Pic. is required'
        ],
        ingredientsRules: [
          v => !!this.recipe.ingredients.length > 0 || 'one ingredient at least required'
        ],
        categoryRules: [
          v => !!v || 'Category is required'
        ]
      },
      error: null
    }
  },
  watch: {
    ingredients: function (val) {
      this.recipe.ingredients = val.map(function (obj) {
        return obj.text
      })
    }
  },
  methods: {
    async updateRecipe () {
      if (this.$refs.form.validate()) {
        try {
          this.error = null
          let formData = new FormData()
          formData.append('title', this.recipe.title)
          formData.append('description', this.recipe.description)
          formData.append('persons', this.recipe.persons)
          formData.append('timeNeeded', this.recipe.timeNeeded)
          formData.append('category', this.recipe.category)
          formData.append('ingredients', JSON.stringify(this.recipe.ingredients))
          if (this.pic) {
            formData.append('avatar', new Blob([this.pic], {type: this.picType}))
          } else {
            formData.append('avatar', this.recipe.avatar)
          }
          const response = await RecipeService.update(this.recipe.id, formData)
          return response
        } catch (error) {
          this.error = error.response.data.error
        }
      }
    },
    addNewIngredient () {
      if (this.ingredient !== '') {
        this.ingredients.push(this.ingredient)
        this.ingredient = ''
      }
    },
    previewImage: function (event) {
      var input = event.target
      if (input.files && input.files[0]) {
        var reader = new FileReader()
        reader.onload = (e) => {
          this.pic = input.files[0]
          this.picShow = e.target.result
          this.picType = input.files[0].type
        }
        reader.readAsDataURL(input.files[0])
      }
    },
    resetForm () {
      this.ingredients = []
      this.pic = ''
      this.picShow = ''
      this.picType = ''
      this.$refs.form.reset()
    }
  },
  components: {
    VueTagsInput
  }
}
</script>

<style scoped>
.error {
  color: red;
}
.dropbox {
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    background: lightcyan;
    color: dimgray;
    padding: 10px 10px;
    min-height: 400px; /* minimum height */
    position: relative;
    cursor: pointer;
  }

  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 400px;
    position: absolute;
    cursor: pointer;
  }

  .dropbox:hover {
    background: lightblue; /* when mouse over to the drop zone, change color */
  }

  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 200px 0;
  }

  .ingredients {
      margin: 2em 0 0.5em;
  }
   p.ingredients  span {
      font-weight: 700;
      color: #000000;
  }
  .v-btn--floating {
    height: 38px;
    min-width: 0;
    padding: 0;
    width: 38px;
}

</style>
