<template>
  <v-app-bar flat color="primary" dark>
    <v-app-bar-title class="font-weight-bold text-uppercase">
      HRMS - {{ company }}
    </v-app-bar-title>

    <v-spacer />

    <div class="d-flex align-center gap-4 mr-4">
      <span>{{ user?.fullName }}</span>
      <v-btn icon @click="logout" title="Logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script setup>
import useAuth from '@/composables/useAuth'

const { user, logout } = useAuth()
const company = user?.value?.company || ''
</script>
