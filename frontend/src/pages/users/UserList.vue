<template>
  <v-container>
    <h2 class="text-h5 font-weight-bold mb-4">👥 User Management</h2>

    <!-- Top bar -->
    <div class="d-flex justify-space-between align-center mb-4">
      <v-btn color="primary" @click="openCreate">+ Create User</v-btn>
      <v-alert
        v-if="message"
        type="success"
        variant="tonal"
        density="compact"
        class="ml-4"
      >
        {{ message }}
      </v-alert>
    </div>

    <!-- User Table -->
    <v-table dense>
      <thead>
        <tr>
          <th>#</th>
          <th>Full Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Company</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(u, i) in users" :key="u._id">
          <td>{{ i + 1 }}</td>
          <td>{{ u.fullName }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.role }}</td>
          <td>{{ u.company }}</td>
          <td>
            <v-btn icon size="small" @click="openEdit(u)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon size="small" color="error" @click="deleteUser(u._id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Dialog: Create/Edit -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>{{ editMode ? 'Edit User' : 'Create User' }}</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitUser">
            <v-text-field
              v-model="form.fullName"
              label="Full Name"
              required
              dense
            />
            <v-text-field
              v-model="form.email"
              label="Email"
              type="email"
              required
              dense
            />
            <v-select
              v-model="form.role"
              :items="roles"
              label="Role"
              required
              dense
            />
            <v-select
              v-model="form.company"
              :items="companies"
              label="Company"
              required
              dense
            />
            <v-text-field
              v-if="!editMode"
              v-model="form.password"
              label="Password"
              type="password"
              required
              dense
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="submitUser">
            {{ editMode ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'

const users = ref([])
const message = ref('')
const dialog = ref(false)
const editMode = ref(false)
const currentId = ref(null)

const roles = ['GeneralManager', 'Manager', 'HR', 'HROfficer']
const companies = ['CAM-TAC', 'TH-ROI', 'TH-CYP', 'VN-A1A', 'VN-TRANS']

const form = ref({
  fullName: '',
  email: '',
  password: '',
  role: '',
  company: ''
})

// Load users
const loadUsers = async () => {
  const res = await axios.get('/api/users')
  users.value = res.data
}

// Open create dialog
const openCreate = () => {
  resetForm()
  editMode.value = false
  dialog.value = true
}

// Open edit dialog
const openEdit = (user) => {
  form.value = { ...user, password: '' }
  currentId.value = user._id
  editMode.value = true
  dialog.value = true
}

// Submit create/update
const submitUser = async () => {
  try {
    if (editMode.value) {
      await axios.put(`/api/users/${currentId.value}`, form.value)
      message.value = 'User updated'
    } else {
      await axios.post('/api/users', form.value)
      message.value = 'User created'
    }
    dialog.value = false
    loadUsers()
  } catch (err) {
    alert(err.response?.data?.message || 'Action failed')
  }
}

// Delete user
const deleteUser = async (id) => {
  if (confirm('Are you sure?')) {
    await axios.delete(`/api/users/${id}`)
    loadUsers()
    message.value = 'User deleted'
  }
}

// Reset form
const resetForm = () => {
  form.value = {
    fullName: '',
    email: '',
    password: '',
    role: '',
    company: ''
  }
  currentId.value = null
}

onMounted(() => {
  loadUsers()
})
</script>
