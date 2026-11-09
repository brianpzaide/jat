<template>
  <div class="h-full min-h-0 w-full min-w-0 overflow-x-auto overflow-y-hidden">
    <div class="flex h-full min-w-max gap-3 p-2">
      <KanbanColumn
        v-for="option in applicationStatusOptions"
        :key="option"
        :statusKey="option"
        :applications="getApplicationsForColumn(option)"
        :activeApplicationId="activeApplicationId"
        @application-selected="forwardApplicationSelected"
        @update-short-note="forwardUpdateShortNote"
        @update-application-notes="forwardUpdateApplicationNotes"
        @application-moved="forwardApplicationStatus"
      />
    </div>
  </div>
</template>

<script setup>
import KanbanColumn from './KanbanColumn.vue'

const props = defineProps({
  applications: {
    type: Array,
    required: true
  },
  activeApplicationId: {
    type: [String, Number],
    default: null
  },
  applicationStatusOptions: {
    type: Array,
  },
})

const emit = defineEmits([
  'application-selected',
  'update-short-note',
  'update-application-notes',
  'update-application-status'
])

function getApplicationsForColumn(columnKey) {
  return props.applications.filter(
    application => application.status === columnKey
  )
}

function forwardApplicationSelected(payload){
  emit('application-selected', payload)
}

function forwardUpdateShortNote(payload){
  emit('update-short-note', payload)
}

function forwardUpdateApplicationNotes(payload){
  emit('update-application-notes', payload)
}

function forwardApplicationStatus(payload){
  emit('update-application-status', payload)
}


</script>