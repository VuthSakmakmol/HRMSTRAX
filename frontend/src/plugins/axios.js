// plugins/axios.js
import axios from 'axios'

// Create custom Axios instance
const api = axios.create({
  baseURL: 'http://localhost:4700', // 🔁 change if needed
  headers: {
    'Content-Type': 'application/json'
  }
})

// Automatically attach token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api
