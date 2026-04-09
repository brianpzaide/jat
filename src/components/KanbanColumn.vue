<template>
  <div class="kanban-column">
    <div class="column-header">
      <h3>{{ label }}</h3>
      <span class="column-count">{{ applications.length }}</span>
    </div>

    <draggable
      v-model="localApplications"
      class="column-body"
      group="jat"
      item-key="id"
      @change="handleDragChange"
    >
      <template #item="{ element }">
        <KanbanCard
          :application="element"
          :active="element.id === activeApplicationId"
          @select="emit('application-selected', element.id)"
          @update-short-note="emit('update-short-note', $event)"
          @update-application-notes="emit('update-application-notes', $event)"
        />
      </template>
    </draggable>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'
import KanbanCard from './KanbanCard.vue'

import draggable from 'vuedraggable'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  statusKey: {
    type: String,
    required: true
  },
  applications: {
    type: Array,
    required: true
  },
  activeApplicationId: {
    type: [String, Number],
    default: null
  }
})

const localApplications = ref([])
watch(
  () => props.applications,
  value => {
    localApplications.value = [...value]
  },
  {immediate: true}
)


const emit = defineEmits([
  'application-selected',
  'update-short-note',
  'update-application-notes',
  'application-moved'
])

function handleDragChange(event){
  if (!event.added) return
  const application = event.added.element
  emit('application-moved', {
    applicationId: application.id,
    newStatus: props.statusKey
  })
}


</script>

<style scoped>
.kanban-column {
  width: 320px;
  /* min-width: 320px; */
  height: 100%;
  /* max-height: 100%; */
  display: flex;
  flex-direction: column;
  background: #f4f5f7;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}


.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  flex-shrink: 0;
}

.column-header h3 {
  margin: 0;
  font-size: 0.95rem;
}

.column-count {
  background: #e5e7eb;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 0.8rem;
}

.column-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>