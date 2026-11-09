<template>
  <div
    class="flex h-full w-80 shrink-0 flex-col overflow-hidden rounded-xl bg-gray-100"
  >
    <div
      class="flex shrink-0 items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3"
    >
      <h3 class="text-sm font-semibold text-gray-800">
        {{ getLabel(statusKey) }}
      </h3>

      <span
        class="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600"
      >
        {{ applications.length }}
      </span>
    </div>

    <draggable
      v-model="localApplications"
      class="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3"
      group="jat"
      item-key="id"
      @change="handleDragChange"
    >
      <template #item="{ element }">
        <KanbanCard
          :application="element"
          :active="element.id === props.activeApplicationId"
          @application-selected="forwardApplicationSelected"
          @update-short-note="forwardUpdateShortNote"
          @update-application-notes="forwardUpdateApplicationNotes"
        />
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
import KanbanCard from './KanbanCard.vue'

const props = defineProps({
  statusKey: {
    type: String,
    required: true,
  },
  applications: {
    type: Array,
    required: true,
  },
  activeApplicationId: {
    type: [String, Number],
    default: null,
  },
})

const emit = defineEmits([
  'application-selected',
  'update-short-note',
  'update-application-notes',
  'application-moved'
])

const localApplications = ref([])
watch(
  () => props.applications,
  value => {
    localApplications.value = [...value]
  },
  {immediate: true}
)

function getLabel(str) {
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function forwardApplicationSelected(payload) {
  emit('application-selected', payload)
}

function forwardUpdateShortNote(payload) {
  emit('update-short-note', payload)
}

function forwardUpdateApplicationNotes(payload) {
  emit('update-application-notes', payload)
}

function handleDragChange(event){
  if (!event.added) return
  const application = event.added.element
  emit('application-moved', {
    applicationId: application.id,
    status: props.statusKey
  })
}
</script>