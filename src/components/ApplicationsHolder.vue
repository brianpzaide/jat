<template>
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
</template>

<script setup>

import ApplicationsSidebar from "./ApplicationsSidebar.vue"
import ApplicationMainPanel from "./ApplicationMainPanel.vue"

import { ref, computed } from "vue"

const props = defineProps({
  companies: Array
})

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

function application_selected(application_id){
    selectedApplicationId.value = application_id
}

</script>

<style scoped>
.holder {
  display: flex;
  flex-direction: row;
  height: 100vh;

  padding: 16px;
  gap: 16px;

  background: #fafafa;
  margin: 20px;
}
</style>