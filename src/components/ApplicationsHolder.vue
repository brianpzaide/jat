<!--<template>
  <div class="holder">

    <ApplicationsSidebar
      :companies="companies"
      :activeApplicationId="selectedApplicationId"
      @application-selected="application_selected"
    />

    <ApplicationMainPanel
      :application="selectedApplication"
      @update-application-details="forwardDetailsUpdate"
      @update-application-notes="forwardNotesUpdate"
    />

  </div>
</template> -->



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
      />

      <ApplicationMainPanel
        v-if="viewMode === 'list'"
        :application="selectedApplication"
        :applicationStatusOptions="applicationStatusOptions"
        @update-application-details="forwardDetailsUpdate"
        @update-application-notes="forwardNotesUpdate"
      />

      <ApplicationsKanban
        v-else
        :applications="applications"
        :activeApplicationId="selectedApplicationId"
        @application-selected="application_selected"
        @update-short-note="emit('update-short-note', $event)"
        @update-application-notes="forwardNotesUpdate"
        @application-moved="forwardApplicationMoved"
      />
    </div>
  </div>
</template>








<script setup>

import ApplicationsSidebar from "./ApplicationsSidebar.vue"
import ApplicationMainPanel from "./ApplicationMainPanel.vue"
import ApplicationsKanban from './ApplicationsKanban.vue'

import { ref, computed } from "vue"


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




const emit = defineEmits(["update-application-details", "update-application-notes"])

const selectedApplicationId = ref(null)

// const companies = ref(
//   [
//     {name: "1", applications:[
//       {id:"11", position: "backend engineer", status: "ready to apply", next_event: "2026-03-18 12:30:00" },
//       {id:"12", position: "frontend engineer", status: "applied", next_event: "2026-03-19 13:30:00" },
//       {id:"13", position: "fullstack engineer", status: "interview scheduled", next_event: "2026-03-20 14:30:00" },
//     ]}, 
//     {name: "2", applications:[
//       {id:"21", position: "swe", status: "applied", next_event: "2026-03-11 11:30:00" },
//       {id:"22", position: "forward deployed engineer", status: "rejected", next_event: "2026-03-11 18:30:00" },
//     ]}, 
//     {name: "3", applications:[
//       {id:"31", position: "dev rel", status: "interview scheduled", next_event: "2026-03-15 11:30:00" },
//     ]}
//   ]
// )

const selectedApplication = computed(() =>
  props.companies
    .flatMap(c => c.applications)
    .find(a => a.id === selectedApplicationId.value)
)

function forwardDetailsUpdate(payload) {
  emit("update-application-status", payload)
}

function forwardNotesUpdate(payload) {
  emit("update-application-notes", payload)
}

function forwardApplicationMoved({applicationId, newStatus}) {
  const application = applications.value.find(app => app.id === applicationId)
  if (!application) return

  emit("update-application-notes", {applicationId, newStatus})
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