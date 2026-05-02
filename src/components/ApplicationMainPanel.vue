<template>
  <div class="main-panel">
    <div class="details-container">
      <ApplicationDetails
        :application="application"
        :applicationStatusOptions="applicationStatusOptions"
        @update-application-details="emit('update-application-details', $event)"
      />
    </div>
    <div class="notes-container">
      <ApplicationNotes
        :application="application"
        @update-application-notes="emit('update-application-notes', $event)"
      />
    </div>

  </div>
</template>

<script setup>

import ApplicationDetails from "./ApplicationDetails.vue"
import ApplicationNotes from "./ApplicationNotes.vue"

const props = defineProps({
  application: {
    type: Object
  },
  applicationStatusOptions: {
    type: Array,
  },
})


const emit = defineEmits(["update-application-details", "update-application-notes"])

</script>

<style scoped>
.main-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 16px;
  flex: 1;
  min-width: 0;
  gap: 16px;
}

.details-container {
  flex: none;
  width: 100%;
}

.notes-container {
    width: min(1000px, 92vw);
    height: min(800px, 90vh);
}
</style>