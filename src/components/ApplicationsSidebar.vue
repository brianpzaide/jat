<template>
  <div class="sidebar">
    <div class="filter-card">
      <div class="search-wrapper">
        <input
          v-model="companyQuery"
          type="text"
          placeholder="Search company..."
          class="search-input"
        />
        <button class="search-btn" @click="applyNameFilter">
          🔍
        </button>
      </div>

      <select placeholder="filter by status" v-model="statusFilter" class="status-filter">
        <option disabled value="">Filter by status</option>
        <option value="ready to apply">ready to apply</option>
        <option value="applied">applied</option>
        <option value="interview scheduled">interview scheduled</option>
        <option value="rejected">rejected</option>
        <option value="ghosted">ghosted</option>
        <option value="offered">offered</option>
        <option value="signed">signed</option>
        <option value="archived">archived</option> 
      </select>
    </div>

    <div class="company-list"
      v-for="company in companies"
      :key="company.name"
    >

    <JobApplication :company="company" 
                    :activeApplicationId="activeApplicationId"
                    @application-selected="forwardApplicationSelected"/>
    </div>

  </div>
</template>

<script setup>
import { ref, watch } from "vue"

import JobApplication from './JobApplication.vue'

const props = defineProps({
  companies: {
    type: Array,
    required: true
  },
  activeApplicationId: {
    type: Number,
    required: true
  }
})

const nameFilter = ref("")
const statusFilter = ref("")

const emit = defineEmits(['application-selected', 'filter-company-by-name', 'filter-company-by-status'])

function forwardApplicationSelected(application_id){
    emit("application-selected", application_id)
}

function applyNameFilter() {
  const companyName = nameFilter.value.trim().toLowerCase()
  emit("filter-company-by-name", companyName)
}

watch(statusFilter, (status) => {
    emit("filter-company-by-status", status)
})

</script>

<style scoped>

.sidebar {
  width: 300px;
  height: 600px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-right: 1px solid #ddd;
  overflow-y: scroll;
  flex-shrink: 0;
}

.filter-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 12px;

  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 8px 32px 8px 10px;

  border: 1px solid #ddd;
  border-radius: 6px;

  box-sizing: border-box;
}

.search-btn {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);

  border: none;
  background: transparent;
  cursor: pointer;
}

.status-filter {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>