<template>
  <v-navigation-drawer permanent width="220">
    <v-list nav dense>

      <!-- DASHBOARD -->
      <v-list-item :to="{ path: '/dashboard' }" prepend-icon="mdi-view-dashboard">
        Dashboard
      </v-list-item>

      <!-- USERS: Only GM -->
      <v-list-item
        v-if="user?.role === 'GeneralManager'"
        :to="{ path: '/users' }"
        prepend-icon="mdi-account-group"
      >
        User Management
      </v-list-item>

      <!-- CANDIDATES: All roles -->
      <v-list-item
        v-if="hasAccess(['GeneralManager', 'Manager', 'HR', 'HROfficer'])"
        :to="{ path: '/candidates' }"
        prepend-icon="mdi-account-tie"
      >
        Candidates
      </v-list-item>

      <!-- JOB REQUISITIONS: GM, Manager, HR -->
      <v-list-item
        v-if="hasAccess(['GeneralManager', 'Manager', 'HR'])"
        :to="{ path: '/requisitions' }"
        prepend-icon="mdi-briefcase"
      >
        Job Requisitions
      </v-list-item>

    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import useAuth from '@/composables/useAuth'

const { user } = useAuth()

// 🔐 Role check utility
const hasAccess = (roles) => {
  return roles.includes(user?.value?.role)
}
</script>
