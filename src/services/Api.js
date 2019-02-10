import axios from 'axios'
import store from '@/store/store'

export default () => {
  return axios.create({
    // baseURL: 'http://localhost:8081',
    baseURL: 'https://foodrecipesapp.herokuapp.com/',
    headers: {
      Authorization: `Bearer ${store.state.token}`
    }
  })
}
