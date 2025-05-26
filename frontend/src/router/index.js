// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import useAuth from '@/composables/useAuth'

// Layout
import DefaultLayout from '@/layouts/DefaultLayout.vue'

// Pages
import Login from '@/pages/auth/Login.vue'
import Dashboard from '@/pages/dashboard/Dashboard.vue'
import UserList from '@/pages/users/UserList.vue'
import CandidateList from '@/pages/candidates/CandidateList.vue'
import JobList from '@/pages/requisitions/JobList.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'users',
        component: UserList,
        meta: { roles: ['GeneralManager'] }
      },
      {
        path: 'candidates',
        component: CandidateList,
        meta: { roles: ['GeneralManager', 'Manager', 'HR', 'HROfficer'] }
      },
      {
        path: 'requisitions',
        component: JobList,
        meta: { roles: ['GeneralManager', 'Manager', 'HR'] }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const { token, user, loadUser } = useAuth()

  if (to.meta.requiresAuth || to.matched.some(r => r.meta.requiresAuth)) {
    if (!token.value) {
      return next('/login')
    }

    if (!user.value) {
      await loadUser()
    }

    const allowedRoles = to.meta.roles
    if (allowedRoles && !allowedRoles.includes(user.value.role)) {
      return next('/dashboard')
    }
  }

  next()
})

export default router
