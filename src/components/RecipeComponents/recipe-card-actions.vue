<template>
    <v-flex xs12 sm6 >
        <div class="recipe-card">
            <div class="avatarContainer">
               <img :src="recipe.avatar" alt="Chai Oatmeal">
                <div class="middle">
                  <span icon  class="update"  @click="editRecipeDialog = true">
                      <v-icon dark>edit</v-icon>
                  </span>
                  <span class="delete" @click="deleteRecipe">
                      <v-icon dark>delete</v-icon>
                  </span>
                </div>
            </div>
            <div class="recipe-content">
                <h2 class="title">{{ recipe.title }}</h2>
                <h3 class="category">{{ recipe.category }}</h3>
                <ul class="infoList">
                    <li>
                        <span class="fa fa-user-o"></span>
                        <span class="value">{{ recipe.persons }}</span>
                    </li>
                    <li>
                        <span class="fa fa-clock-o"></span>
                        <span class="value">{{ recipe.timeNeeded }}</span>
                    </li>
                    <li>
                        <span class="fa fa-fire"></span>
                        <span class="value">{{ recipe.ingredients.length }}</span>
                    </li>
                </ul>
                <p class="desc">
                   {{ recipe.description }}
                </p>
                <p class="ingredients"><span>Ingredients:&nbsp;</span>{{ recipe.ingredients.join(', ') }}.</p>
            </div>
        </div>
        <v-dialog lazy v-model="editRecipeDialog" fullscreen hide-overlay transition="dialog-bottom-transition" scrollable>
          <v-card tile>
            <v-toolbar card dark color="cyan">
              <v-btn icon dark @click="close">
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Edit Recipe</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark flat @click="saveRecipe">Save</v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-card-text>
              <EditRecipeCard :recipe=recipe ref="foo"></EditRecipeCard>
            </v-card-text>
            <div style="flex: 1 1 auto;"></div>
          </v-card>
        </v-dialog>
    </v-flex>
</template>
<style>
        .recipe-card{
            margin-top: 15px;
            padding: 0px 12px;
        }
        .recipe-card>img {
            width: 100%;
            height: 250px;
            vertical-align: bottom;
        }
        .recipe-card .title {
            font-size: 1.75em!important;
            color: #222222;
        }
        .recipe-card .category {
            font-size: 0.9375em;
            color: #838689;
        }
        .recipe-card .button {
            background: #57abf2;
            display: inline-block;
            position: absolute;
            top: 80%;
            right: 3%;
            width: 4.0625em;
            height: 4.0625em;
            border-radius: 4.0625em;
            line-height: 4.0625em;
            text-align: center;
        }
        .recipe-card .title,
        .recipe-card .category {
            margin: 0;
            font-weight: 300;
        }
        .recipe-card .recipe-content {
            padding: 1.25em 1.5em;
            background-color: white;
            border-radius: 0 0 20px 20px;
        }
        .recipe-card .recipe-content p {
            margin: 1.25em 0;
            font-size: 0.8125em;
            font-weight: 400;
            color: #222222;
        }
        .recipe-card .recipe-content .infoList {
            list-style: none;
            margin: 0.5em 0 0;
            padding: 0;
        }
        .recipe-card .recipe-content .infoList ul {
            list-style: none;
            margin: 0.5em 0 0;
            padding: 0;
        }
        .recipe-card .recipe-content ul.infoList li {
            display: inline-block;
            margin-left: 2em;
            line-height: 1em;
        }
        .recipe-card .recipe-content ul.infoList li .fa {
            font-size: 21px;
            color: cornflowerblue;
        }
        .recipe-card .recipe-content ul.infoList li span:nth-of-type(2) {
            margin-left: 12px;
            font-size: 1em;
            font-weight: 300;
            vertical-align: middle;
            color: #838689;
        }
        .recipe-card .recipe-content ul.infoList li:first-child {
            margin-left: 0;
        }
        .recipe-card .recipe-content .ingredients {
            margin: 2em 0 0.5em;
        }
        .recipe-card .recipe-content p.ingredients  span {
            font-weight: 700;
            color: #000000;
        }
        .avatarContainer {
          position: relative;
            width: 100%;
        }

        .avatarContainer img {
            opacity: 1;
            display: block;
            width: 100%;
            height: auto;
            transition: .5s ease;
            backface-visibility: hidden;
        }

          .middle {
            transition: .5s ease;
            opacity: 0;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            -ms-transform: translate(-50%, -50%);
            text-align: center;
            }

            .avatarContainer:hover .image {
            opacity: 0.3;
            }

            .avatarContainer:hover .middle {
            opacity: 1;
            }

            .update {
            background-color: #00bcd4;
            color: white;
            font-size: 16px;
            padding: 10px 15px;
            cursor: pointer;
            }
            .delete {
            background-color: orangered;
            color: white;
            font-size: 16px;
            padding: 10px 15px;
            cursor: pointer;
            }
</style>
<script>
import RecipeService from '../../services/RecipeService'
import EditRecipeCard from './edit-recipe.vue'

export default {
  name: 'RecipeCardActions',
  data () {
    return {
      editRecipeDialog: false
    }
  },
  props: {
    recipe: {}
  },
  methods: {
    deleteRecipe () {
      try {
        RecipeService.delete(this.recipe.id)
        this.$store.dispatch('requestRecipes')
      } catch (error) {
        this.error = error.response.data.error
      }
    },
    saveRecipe () {
      try {
        this.$refs.foo.updateRecipe()
        this.close()
        this.$store.dispatch('requestRecipes')
      } catch (error) {
        console.error(error)
      }
    },
    close () {
      this.editRecipeDialog = false
    }
  },
  components: {
    EditRecipeCard
  }
}
</script>
