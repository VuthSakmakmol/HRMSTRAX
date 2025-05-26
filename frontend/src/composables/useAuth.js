import { reactive, readonly, computed } from 'vue'
import axios from '@/plugins/axios'
import router from '@/router'

const state = reactive({
  token: localStorage.getItem('token'),
  user: null
})

const login = async (email, password) => {
  const res = await axios.post('/api/auth/login', { email, password })
  state.token = res.data.token
  state.user = res.data
  localStorage.setItem('token', state.token)
  router.push('/dashboard')
}

const logout = () => {
  state.token = null
  state.user = null
  localStorage.removeItem('token')
  router.push('/login')
}

const loadUser = async () => {
  if (!state.token) return
  try {
    const res = await axios.get('/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${state.token}`
      }
    })
    state.user = res.data
  } catch (err) {
    logout()
  }
}

const useAuth = () => ({
  user: computed(() => state.user),
  token: computed(() => state.token),
  login,
  logout,
  loadUser
})

export default useAuth
