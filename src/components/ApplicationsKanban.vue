<template>
  <div class="kanban-board">
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
  'application-moved'
])

// const columns = [
//   { key: 'ready to apply', label: 'Ready to Apply' },
//   { key: 'in progress', label: 'In Progress' },
//   { key: 'offer', label: 'Offer' },
//   { key: 'reject', label: 'Reject' },
//   { key: 'archive', label: 'Archive' }
// ]

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

<style scoped>
.kanban-board {
  display: flex;
  gap: 8px;
  height: 100vh;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 8px;
}

</style>