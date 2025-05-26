<template>
  <v-container>
    <h2 class="text-h5 font-weight-bold mb-4">📌 Job Requisitions</h2>

    <!-- Top bar -->
    <div class="d-flex justify-space-between align-center mb-4">
      <v-btn color="primary" @click="openForm">+ Add Job</v-btn>
      <v-text-field v-model="search" label="Search job title" dense clearable class="w-25" />
    </div>

    <!-- Job Table -->
    <v-table dense>
      <thead>
        <tr>
          <th>#</th>
          <th>Job Title</th>
          <th>Department</th>
          <th>Status</th>
          <th>Target</th>
          <th>Filled</th>
          <th>Opening Date</th>
          <th>Start Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(job, i) in filteredJobs" :key="job._id">
          <td>{{ i + 1 }}</td>
          <td>{{ job.jobTitle }}</td>
          <td>{{ job.department }}</td>
          <td>{{ job.status }}</td>
          <td>{{ job.target }}</td>
          <td>{{ job.filled }}</td>
          <td>{{ formatDate(job.openingDate) }}</td>
          <td>{{ formatDate(job.startDate) }}</td>
          <td>
            <v-btn icon size="x-small" @click="editJob(job)"><v-icon>mdi-pencil</v-icon></v-btn>
            <v-btn icon size="x-small" color="error" @click="deleteJob(job._id)"><v-icon>mdi-delete</v-icon></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Form Dialog -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>{{ isEdit ? 'Edit' : 'Create' }} Job Requisition</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveJob">
            <v-text-field v-model="form.jobTitle" label="Job Title" required dense />
            <v-text-field v-model="form.department" label="Department" required dense />
            <v-text-field v-model="form.target" label="Target" type="number" required dense />
            <v-select v-model="form.status" :items="statuses" label="Status" dense required />
            <v-text-field v-model="form.filled" label="Filled" type="number" dense disabled />
            <v-menu v-model="openingMenu" :close-on-content-click="false" transition="scale-transition" offset-y>
              <template #activator="{ on, attrs }">
                <v-text-field v-model="form.openingDate" label="Opening Date" readonly v-bind="attrs" v-on="on" dense />
              </template>
              <v-date-picker v-model="form.openingDate" />
            </v-menu>
            <v-menu v-model="startMenu" :close-on-content-click="false" transition="scale-transition" offset-y>
              <template #activator="{ on, attrs }">
                <v-text-field v-model="form.startDate" label="Start Date" readonly v-bind="attrs" v-on="on" dense />
              </template>
              <v-date-picker v-model="form.startDate" />
            </v-menu>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveJob">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from '@/plugins/axios'
import dayjs from 'dayjs'
import useAuth from '@/composables/useAuth'

const { user } = useAuth()
const jobs = ref([])
const dialog = ref(false)
const isEdit = ref(false)
const currentId = ref(null)
const search = ref('')
const openingMenu = ref(false)
const startMenu = ref(false)

const statuses = ['Vacant', 'Filled', 'Suspended', 'Cancelled']

const form = ref({
  jobTitle: '',
  department: '',
  target: 1,
  filled: 0,
  openingDate: '',
  startDate: '',
  status: 'Vacant'
})

const filteredJobs = computed(() => {
  return jobs.value.filter(j =>
    j.company === user.value.company &&
    (j.jobTitle.toLowerCase().includes(search.value.toLowerCase()) ||
     j.department.toLowerCase().includes(search.value.toLowerCase()))
  )
})

const loadJobs = async () => {
  const res = await axios.get('/api/job-requisitions')
  jobs.value = res.data
}

const openForm = () => {
  resetForm()
  dialog.value = true
  isEdit.value = false
}

const editJob = (job) => {
  form.value = { ...job }
  currentId.value = job._id
  isEdit.value = true
  dialog.value = true
}

const saveJob = async () => {
  if (isEdit.value) {
    await axios.put(`/api/job-requisitions/${currentId.value}`, form.value)
  } else {
    await axios.post('/api/job-requisitions', {
      ...form.value,
      company: user.value.company
    })
  }
  dialog.value = false
  loadJobs()
}

const deleteJob = async (id) => {
  if (confirm('Delete this job requisition?')) {
    await axios.delete(`/api/job-requisitions/${id}`)
    loadJobs()
  }
}

const resetForm = () => {
  form.value = {
    jobTitle: '',
    department: '',
    target: 1,
    filled: 0,
    openingDate: '',
    startDate: '',
    status: 'Vacant'
  }
  currentId.value = null
}

const formatDate = (d) => d ? dayjs(d).format('YYYY-MM-DD') : '-'

onMounted(loadJobs)
</script>
