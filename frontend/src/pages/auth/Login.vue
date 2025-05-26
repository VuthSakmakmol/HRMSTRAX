<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card width="400" class="pa-6" elevation="10">
      <h2 class="text-center mb-4">HRMS Login</h2>

      <v-form @submit.prevent="handleLogin" ref="form">
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          required
          density="compact"
          variant="outlined"
          class="mb-3"
        />
        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          required
          density="compact"
          variant="outlined"
          class="mb-4"
        />

        <v-btn :loading="loading" color="primary" block type="submit">
          Login
        </v-btn>

        <v-alert
          v-if="error"
          type="error"
          class="mt-4"
          border="start"
          variant="tonal"
          dense
        >
          {{ error }}
        </v-alert>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import useAuth from '@/composables/useAuth'

const { login } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    await login(email.value, password.value)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
