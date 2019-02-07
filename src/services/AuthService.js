import api from '@/services/Api'
// const stringify = require('json-stringify-safe')

export default {
  user: {
    authenticated: false
  },
  register (formData) {
    return api().post('register', formData)
  },
  login (credentials) {
    return api().post('login', credentials)
  },
  updateProfile (formData) {
    return api().put('profile', formData)
  },
  changePassword (formData) {
    return api().put('password', formData)
  }
}
