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
                    <v-text-field label="Title" :rules="validationRules.titleRules" v-model="title" required></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-combobox v-model="category" :items="categories" :rules="validationRules.categoryRules" label="Select a Recipe Category"></v-combobox>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field label="Persons Number" :rules="validationRules.personsRules" v-model="persons" required></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field label="Time Needed" :rules="validationRules.timeNeededRules" v-model="timeNeeded" required></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-textarea label="Description" :rules="validationRules.descriptionRules" v-model="description" required></v-textarea>
                  </v-flex>
                  <v-flex xs12  style="position: relative;">
                    <v-btn absolute dark fab right color="pink" @click="addNewIngredient">
                      <v-icon>add</v-icon>
                    </v-btn>
                    <v-text-field id="ingredient" label="Enter Ingredient" :rules="validationRules.ingredientsRules" v-model="ingredient" required></v-text-field>
                    <p class="ingredients"><span>Ingredients:&nbsp;</span>{{ ingredients.join(', ') }}.</p>
                  </v-flex>
                </v-layout>
              </v-flex>
              <div class="error" v-html="error"></div>
              <v-flex xs12  v-if="showSaveProp">
                <v-btn dark class="cyan" @click="addNewRecipe" :disabled="!valid" style="float: right;">Save</v-btn>
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

export default {
  data () {
    return {
      valid: false,
      title: '',
      persons: '',
      timeNeeded: '',
      description: '',
      pic: '',
      picShow: '',
      picType: '',
      ingredient: '',
      ingredients: [],
      category: '',
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
          v => !!this.ingredients.length > 0 || 'one ingredient at least required'
        ],
        categoryRules: [
          v => !!v || 'Category is required'
        ]
      },
      error: null
    }
  },
  methods: {
    async addNewRecipe () {
      if (this.$refs.form.validate()) {
        try {
          this.error = null
          let formData = new FormData()
          formData.append('title', this.title)
          formData.append('description', this.description)
          formData.append('persons', this.persons)
          formData.append('timeNeeded', this.timeNeeded)
          formData.append('category', this.category)
          formData.append('ingredients', JSON.stringify(this.ingredients))
          if (this.pic) {
            formData.append('avatar', new Blob([this.pic], {type: this.picType}))
          }
          return await RecipeService.create(formData)
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
