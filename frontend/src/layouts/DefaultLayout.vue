<template>
  <v-app>
    <Topbar />

    <v-main class="bg-grey-lighten-4">
      <v-container fluid class="d-flex pa-0">
        <Sidebar />
        <router-view class="flex-grow-1 pa-6" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import Topbar from '@/components/layout/Topbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
</script>
