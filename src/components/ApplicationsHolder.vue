<template>
  <div class="holder">
    <div class="view-toolbar">
      <button
        class="view-toggle"
        :class="{ active: viewMode === 'list' }"
        @click="viewMode = 'list'"
      >
        List
      </button>

      <button
        class="view-toggle"
        :class="{ active: viewMode === 'kanban' }"
        @click="viewMode = 'kanban'"
      >
        Kanban
      </button>
    </div>

    <div class="content-area">
      <ApplicationsSidebar
        v-if="viewMode === 'list'"
        :companies="companies"
        :applicationStatusOptions="applicationStatusOptions"
        :activeApplicationId="selectedApplicationId"
        @application-selected="application_selected"
        @filter-by-company="forwardFilterByCompany"
        @filter-by-status="forwardFilterByStatus"
      />

      <ApplicationMainPanel
        v-if="viewMode === 'list'"
        :application="selectedApplication"
        :applicationStatusOptions="applicationStatusOptions"
        @update-application-status="forwardStatusUpdate"
        @update-application-notes="forwardNotesUpdate"
      />

      <ApplicationsKanban
        v-else
        :applications="applications"
        :applicationStatusOptions="applicationStatusOptions"
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

import ApplicationsSidebar from "./ApplicationsSidebar.vue"
import ApplicationMainPanel from "./ApplicationMainPanel.vue"
import ApplicationsKanban from './ApplicationsKanban.vue'

import { ref, computed, watch } from "vue"


const props = defineProps({
  companies: {
    type: Array
  },
  applicationStatusOptions: {
    type: Array,
  },
})


const viewMode = ref('list')

const applications = ref([])
for (const company of props.companies){
  (applications.value).push(...company.applications)
}

watch(
  () => props.companies,
  value => {
    applications.value = []
    for (const company of value){
      (applications.value).push(...company.applications)
    }
  },
  {immediate: true}
)


const emit = defineEmits([
  "filter-by-company",
  "filter-by-status",
  "update-application-status",
  "update-application-notes",
  ])

const selectedApplicationId = ref(null)

const selectedApplication = computed(() =>
  props.companies
    .flatMap(c => c.applications)
    .find(a => a.id === selectedApplicationId.value)
)

function forwardFilterByCompany(payload) {
  emit("filter-by-company", payload)
}

function forwardFilterByStatus(payload) {
  emit("filter-by-status", payload)
}

function forwardStatusUpdate(payload) {
  console.log("from ApplicationsHolder", payload)
  emit("update-application-status", payload)
}

function forwardUpdateShortNote(payload) {
  console.log("from ApplicationsHolder", payload)
  emit("update-short-note", payload)
}

function forwardUpdateNotes(payload) {
  console.log("from ApplicationsHolder", payload)
  emit("update-application-notes", payload)
}

function forwardUpdateApplicationStatus(payload) {

  emit("update-application-status", payload)
}

function application_selected(application_id){
    selectedApplicationId.value = application_id
}

</script>

<style scoped>
/* .holder {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  gap: 12px;
  background: #fafafa;
  margin: 20px;
} */
.holder {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}


.view-toolbar {
  display: flex;
  gap: 8px;
  margin-left: 12px;
}

.view-toggle {
  border: 1px solid #d1d5db;
  background: white;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.view-toggle.active {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}



.content-area {
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  display: flex;
}
</style>