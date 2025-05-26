<template>
  <v-container class="mt-8">
    <!-- Greeting -->
    <h2 class="text-h5 font-weight-bold mb-4">👋 Welcome, {{ user?.fullName }}</h2>

    <!-- User Info Card -->
    <v-card class="pa-5 mb-4" elevation="2">
      <v-row dense>
        <v-col cols="12" md="6">
          <strong>Role:</strong> {{ user?.role }}
        </v-col>
        <v-col cols="12" md="6">
          <strong>Company:</strong> {{ user?.company }}
        </v-col>
      </v-row>
    </v-card>

    <!-- Info Alert -->
    <v-alert
      type="info"
      border="start"
      variant="tonal"
      dense
      class="mb-4"
    >
      You are logged in as <strong>{{ user?.role }}</strong> under <strong>{{ user?.company }}</strong>.
    </v-alert>

    <!-- (Optional future dashboard stats here) -->
    <!-- You can add charts, KPI boxes, vacancy overview, etc. -->
  </v-container>
</template>

<script setup>
import useAuth from '@/composables/useAuth'

const { user } = useAuth()
</script>
