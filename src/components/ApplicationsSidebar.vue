<template>
  <aside
    class="flex h-[600px] w-[300px] shrink-0 flex-col border-r border-gray-200 bg-gray-50"
  >
    <div class="space-y-3 border-b border-gray-200 p-4">
      <h2 class="text-sm font-semibold text-gray-800">
        Applications
      </h2>

      <div class="relative">
        <input
          v-model="nameFilter"
          type="text"
          placeholder="Search company..."
          aria-label="Search company"
          class="w-full rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-10
                 text-sm text-gray-700 placeholder:text-gray-400
                 outline-none transition
                 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />

        <button
          aria-label="Search companies"
          class="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1
                 text-gray-400 transition-colors hover:bg-gray-100
                 hover:text-gray-700 focus:outline-none
                 focus-visible:ring-2 focus-visible:ring-indigo-500"
          @click="applyNameFilter"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </div>

      <select
        v-model="statusFilter"
        aria-label="Filter applications by status"
        class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      >
        <option value="">All statuses</option>
      
        <option
          v-for="status in props.applicationStatusOptions"
          :key="status"
          :value="status"
        >
          {{ status }}
        </option>
      </select>
    </div>

    <div class="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
      <div
        v-for="company in companies"
        :key="company.name"
        class="w-full"
      >
        <JobApplication
          :company="company"
          :activeApplicationId="activeApplicationId"
          @application-selected="forwardApplicationSelected"
        />
      </div>

      <div
        v-if="companies.length === 0"
        class="px-3 py-8 text-center text-sm text-gray-400"
      >
        No companies found
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import JobApplication from './JobApplication.vue'

const props = defineProps({
  companies: {
    type: Array,
    required: true
  },
  activeApplicationId: {
    type: Number,
    required: true
  },
  applicationStatusOptions: {
    type: Array,
  },
})

const nameFilter = ref('')
const statusFilter = ref('')

const emit = defineEmits([
  'application-selected',
  'filter-by-company',
  'filter-by-status'
])

function forwardApplicationSelected(application_id) {
  emit('application-selected', application_id)
}

function applyNameFilter() {
  emit('filter-by-company', nameFilter.value.trim().toLowerCase())
}

watch(statusFilter, (status) => {
  emit('filter-by-status', status)
})

const statusOptions = computed(() => [
  { label: 'All statuses', value: '' },
  ...props.applicationStatusOptions.map(status => ({
    label: status,
    value: status
  }))
])
</script>