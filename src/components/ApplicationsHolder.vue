<template>
  <div class="flex h-full min-h-0 flex-col">
    <div class="flex shrink-0 items-center px-3 pb-3">
      <div class="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition"
          :class="viewMode === 'list'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
          :aria-pressed="viewMode === 'list'"
          @click="viewMode = 'list'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          List
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition"
          :class="viewMode === 'kanban'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
          :aria-pressed="viewMode === 'kanban'"
          @click="viewMode = 'kanban'"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="7" height="18" rx="1" />
            <rect x="14" y="3" width="7" height="10" rx="1" />
            <rect x="14" y="17" width="7" height="4" rx="1" />
          </svg>
          Kanban
        </button>
      </div>
    </div>

    <div class="flex min-h-0 min-w-0 flex-1 overflow-hidden">
      <ApplicationsSidebar
        v-if="viewMode === 'list'"
        :companies="props.companies"
        :applicationStatusOptions="props.applicationStatusOptions"
        :activeApplicationId="selectedApplicationId"
        @application-selected="application_selected"
        @filter-by-company="forwardFilterByCompany"
        @filter-by-status="forwardFilterByStatus"
      />

      <ApplicationMainPanel
        v-if="viewMode === 'list'"
        class="h-full min-h-0 min-w-0 flex-1 overflow-hidden"
        :application="selectedApplication"
        :applicationStatusOptions="props.applicationStatusOptions"
        @update-application-status="forwardStatusUpdate"
        @update-application-notes="forwardUpdateNotes"
      />

      <ApplicationsKanban
        v-else
        :applications="applications"
        :applicationStatusOptions="props.applicationStatusOptions"
        :activeApplicationId="selectedApplicationId"
        @application-selected="application_selected"
        @update-short-note="forwardUpdateShortNote"
        @update-application-notes="forwardUpdateNotes"
        @update-application-status="forwardUpdateApplicationStatus"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

import ApplicationsSidebar from './ApplicationsSidebar.vue'
import ApplicationMainPanel from './ApplicationMainPanel.vue'
import ApplicationsKanban from './ApplicationsKanban.vue'

const props = defineProps({
  companies: {
    type: Array,
  },
  applicationStatusOptions: {
    type: Array,
  },
})

const emit = defineEmits([
  'filter-by-company',
  'filter-by-status',
  'update-application-status',
  'update-application-notes',
  'update-short-note',
])

const viewMode = ref('list')

const applications = ref([])

for (const company of props.companies) {
  applications.value.push(...company.applications)
}

watch(
  () => props.companies,
  value => {
    applications.value = []

    for (const company of value) {
      applications.value.push(...company.applications)
    }
  },
  { immediate: true }
)

const selectedApplicationId = ref(null)

const selectedApplication = computed(() =>
  props.companies
    .flatMap(company => company.applications)
    .find(application => application.id === selectedApplicationId.value)
)

function forwardFilterByCompany(payload) {
  emit('filter-by-company', payload)
}

function forwardFilterByStatus(payload) {
  emit('filter-by-status', payload)
}

function forwardStatusUpdate(payload) {
  console.log('from ApplicationsHolder', payload)
  emit('update-application-status', payload)
}

function forwardUpdateShortNote(payload) {
  console.log('from ApplicationsHolder', payload)
  emit('update-short-note', payload)
}

function forwardUpdateNotes(payload) {
  console.log('from ApplicationsHolder', payload)
  emit('update-application-notes', payload)
}

function forwardUpdateApplicationStatus(payload) {
  emit('update-application-status', payload)
}

function application_selected(application_id) {
  selectedApplicationId.value = application_id
}
</script>