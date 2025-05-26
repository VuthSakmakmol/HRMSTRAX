<template>
  <v-container fluid>
    <h2 class="text-h5 font-weight-bold mb-4">📄 Candidate Tracking</h2>

    <!-- Top Controls -->
    <v-row class="mb-4" align="center" justify="space-between">
      <v-btn color="primary" @click="openForm">+ Add Candidate</v-btn>
      <v-btn color="success" @click="exportToExcel">Export Excel</v-btn>
      <v-col cols="3">
        <v-text-field v-model="search" label="Search by name or job title" dense clearable />
      </v-col>
      <v-col cols="3">
        <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y>
          <template #activator="{ on, attrs }">
            <v-text-field v-model="dateRange" label="Date Range" readonly v-bind="attrs" v-on="on" dense />
          </template>
          <v-date-picker v-model="dates" range scrollable @change="applyDateFilter" />
        </v-menu>
      </v-col>
    </v-row>

    <!-- Candidate Table -->
    <v-table dense class="scrollable-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Job</th>
          <th>Status</th>
          <th v-for="stage in stages" :key="stage.key">{{ stage.label }}</th>
          <th>Files</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(c, i) in filteredCandidates" :key="c._id">
          <td>{{ i + 1 }}</td>
          <td>{{ c.fullName }}</td>
          <td>{{ c.jobTitle }}</td>
          <td>{{ c.hireStatus }}</td>
          <td v-for="stage in stages" :key="stage.key">
            <v-btn size="x-small" @click="openStageDate(c, stage.key)">
              {{ format(c.progressDates?.[stage.key]) || stage.label }}
            </v-btn>
          </td>
          <td>
            <div v-if="c.documents?.length">
              <v-btn v-for="doc in c.documents" :key="doc" icon size="x-small" :href="doc" target="_blank">
                <v-icon>mdi-file</v-icon>
              </v-btn>
            </div>
            <v-file-input dense @change="f => uploadDocument(c._id, f)" hide-details prepend-icon="mdi-upload" />
          </td>
          <td>
            <v-btn icon size="x-small" @click="editCandidate(c)"><v-icon>mdi-pencil</v-icon></v-btn>
            <v-btn icon size="x-small" color="error" @click="deleteCandidate(c._id)"><v-icon>mdi-delete</v-icon></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Dialogs -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>{{ isEdit ? 'Edit' : 'Add' }} Candidate</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveCandidate">
            <v-text-field v-model="form.fullName" label="Full Name" required dense />
            <v-text-field v-model="form.jobTitle" label="Job Title" required dense />
            <v-select v-model="form.hireStatus" :items="statuses" label="Hire Status" dense />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveCandidate">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="stageDialog" max-width="400">
      <v-card>
        <v-card-title>Select Date</v-card-title>
        <v-card-text>
          <v-date-picker v-model="stageDate" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="stageDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveStageDate">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import axios from '@/plugins/axios'
import useAuth from '@/composables/useAuth'
import * as XLSX from 'xlsx'

const { user } = useAuth()
const candidates = ref([])
const dialog = ref(false)
const stageDialog = ref(false)
const isEdit = ref(false)
const currentId = ref(null)
const stageKey = ref('')
const stageDate = ref('')
const menu = ref(false)
const dates = ref([])
const dateRange = ref('')
const search = ref('')

const stages = [
  { key: 'application', label: 'Application' },
  { key: 'review', label: 'Review' },
  { key: 'interview', label: 'Interview' },
  { key: 'offer', label: 'Offer' },
  { key: 'hired', label: 'Hired' }
]

const statuses = ['Candidate in Process', 'Hired', 'Not Hired', 'Candidate Refusal']

const form = ref({ fullName: '', jobTitle: '', hireStatus: 'Candidate in Process', progressDates: {} })

const filteredCandidates = computed(() => {
  return candidates.value.filter(c => {
    const keyword = search.value.toLowerCase()
    const matchSearch =
      c.fullName.toLowerCase().includes(keyword) ||
      c.jobTitle.toLowerCase().includes(keyword)

    const matchDate = dates.value.length === 2
      ? dayjs(c.progressDates?.application).isAfter(dates.value[0]) &&
        dayjs(c.progressDates?.application).isBefore(dates.value[1])
      : true

    return c.company === user.value.company && matchSearch && matchDate
  })
})

const loadCandidates = async () => {
  const res = await axios.get('/api/candidates')
  candidates.value = res.data
}

const openForm = () => {
  resetForm()
  dialog.value = true
  isEdit.value = false
}

const editCandidate = (c) => {
  form.value = { ...c }
  currentId.value = c._id
  isEdit.value = true
  dialog.value = true
}

const saveCandidate = async () => {
  if (isEdit.value) {
    await axios.put(`/api/candidates/${currentId.value}`, form.value)
  } else {
    await axios.post('/api/candidates', {
      ...form.value,
      company: user.value.company,
      progressDates: { application: new Date() }
    })
  }
  dialog.value = false
  loadCandidates()
}

const deleteCandidate = async (id) => {
  if (confirm('Delete this candidate?')) {
    await axios.delete(`/api/candidates/${id}`)
    loadCandidates()
  }
}

const openStageDate = (c, key) => {
  currentId.value = c._id
  stageKey.value = key
  stageDate.value = c.progressDates?.[key] || dayjs().format('YYYY-MM-DD')
  stageDialog.value = true
}

const saveStageDate = async () => {
  await axios.put(`/api/candidates/${currentId.value}/progress`, {
    stage: stageKey.value,
    date: stageDate.value
  })
  stageDialog.value = false
  loadCandidates()
}

const uploadDocument = async (id, files) => {
  const formData = new FormData()
  formData.append('file', files)
  await axios.post(`/api/candidates/${id}/upload`, formData)
  loadCandidates()
}

const exportToExcel = () => {
  const rows = filteredCandidates.value.map(c => ({
    Name: c.fullName,
    Job: c.jobTitle,
    Status: c.hireStatus,
    Application: format(c.progressDates?.application),
    Review: format(c.progressDates?.review),
    Interview: format(c.progressDates?.interview),
    Offer: format(c.progressDates?.offer),
    Hired: format(c.progressDates?.hired)
  }))
  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidates')
  XLSX.writeFile(workbook, 'candidates.xlsx')
}

const applyDateFilter = () => {
  dateRange.value = dates.value.map(d => dayjs(d).format('YYYY-MM-DD')).join(' to ')
  menu.value = false
}

const format = (d) => (d ? dayjs(d).format('YYYY-MM-DD') : '-')
const resetForm = () => {
  form.value = { fullName: '', jobTitle: '', hireStatus: 'Candidate in Process', progressDates: {} }
  currentId.value = null
}

onMounted(loadCandidates)
</script>

<style scoped>
.scrollable-table {
  overflow-x: auto;
}
</style>
