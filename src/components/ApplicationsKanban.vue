<template>
  <div class="kanban-board">
    <KanbanColumn
      v-for="column in columns"
      :key="column.key"
      :label="column.label"
      :applications="getApplicationsForColumn(column.key)"
      :activeApplicationId="activeApplicationId"
      @application-selected="emit('application-selected', $event)"
      @update-short-note="emit('update-short-note', $event)"
      @update-application-notes="emit('update-application-notes', $event)"
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
  }
})

const emit = defineEmits([
  'application-selected',
  'update-short-note',
  'update-application-notes'
])

const columns = [
  { key: 'ready to apply', label: 'Ready to Apply' },
  { key: 'in progress', label: 'In Progress' },
  { key: 'reject', label: 'Reject' },
  { key: 'offer', label: 'Offer' },
  { key: 'archive', label: 'Archive' }
]

function getApplicationsForColumn(columnKey) {
  return props.applications.filter(
    application => application.status === columnKey
  )
}
</script>

<style scoped>
.kanban-board {
  display: flex;
  gap: 16px;
  height: 100%;
  min-height: 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 8px 4px 8px 0;
}
</style>