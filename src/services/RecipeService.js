import api from '@/services/Api'

export default {
  create (obj) {
    return api().post('/recipe', obj)
  },
  get (id) {
    return api().get(`/recipe/${id}`)
  },
  getAll () {
    return api().get('/recipes')
  },
  getUserRecips () {
    return api().get('/user/recipes')
  },
  update (id, obj) {
    return api().put(`/recipe/${id}`, obj)
  },
  delete (id) {
    return api().delete(`/recipe/${id}`)
  }
}
