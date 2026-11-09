<template>
  <div
    class="flex h-48 w-72 shrink-0 cursor-pointer flex-col gap-3 overflow-hidden rounded-lg border-2 bg-white p-3 transition"
    :class="
      props.active
        ? 'border-indigo-500 bg-indigo-50'
        : 'border-gray-200 hover:border-gray-300'
    "
    @click="emit('application-selected', props.application.id)"
  >
    <div class="flex items-center justify-between gap-2">
      <span class="truncate text-sm font-semibold text-gray-900">
        {{ props.application.company }}
      </span>

      <span
        class="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
        :class="statusClass(props.application.status)"
      >
        {{ props.application.status }}
      </span>
    </div>

    <p class="truncate text-sm text-gray-600">
      {{ props.application.position }}
    </p>

    <p class="min-h-0 flex-1 overflow-hidden text-sm leading-5 text-gray-500">
      {{ truncatedShortNote }}
    </p>

    <div class="flex justify-end">
      <button
        type="button"
        class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        @click.stop="openNotesDialog"
      >
        View Notes
      </button>
    </div>

    <Teleport to="body">
      <dialog
        ref="notesDialog"
        class="w-[calc(100%-2rem)] max-w-4xl max-h-[calc(100%-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white p-0 shadow-xl backdrop:bg-black/40"
        @click.stop
        @close="showNotesDialog = false"
      >
        <div class="flex flex-col">
          <div class="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ props.application.company }} — {{ props.application.position }}
            </h3>

            <button
              type="button"
              aria-label="Close dialog"
              class="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
              @click="notesDialog.close()"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div class="flex h-[80vh] min-h-0 flex-col gap-2 p-2">
            <div class="shrink-0">
              <div class="mb-1 flex items-center justify-between">
                <label
                  for="kanban-short-note"
                  class="block text-sm font-medium text-gray-700"
                >
                  Short note
                </label>

                <button
                  type="button"
                  class="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  @click="updateShortNote"
                >
                  Update
                </button>
              </div>

              <textarea
                id="kanban-short-note"
                v-model="editableShortNote"
                rows="2"
                placeholder="Add next step or reminder"
                class="w-full resize-y rounded-md border border-gray-200 bg-white px-3 py-1 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div class="min-h-0 min-w-0 flex-1">
              <ApplicationNotes
                :application="props.application"
                @update-application-notes="forwardUpdateApplicationNotes"
              />
            </div>
          </div>
        </div>
      </dialog>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import ApplicationNotes from './ApplicationNotes.vue'

const props = defineProps({
  application: {
    type: Object,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'application-selected',
  'update-short-note',
  'update-application-notes',
])

const showNotesDialog = ref(false)
const editableShortNote = ref('')
const notesDialog = ref(null)

watch(
  () => props.application.short_note,
  (value) => {
    editableShortNote.value = value || ''
  },
  { immediate: true }
)

watch(showNotesDialog, async (visible) => {
  await nextTick()
  const element = notesDialog.value
  if (!element) return
  if (visible && !element.open) {
    element.showModal()
  } else if (!visible && element.open) {
    element.close()
  }
})

const truncatedShortNote = computed(() => {
  const note = props.application.short_note || ''

  if (note.length > 70) {
    return `${note.slice(0, 70)}...`
  }

  return note || 'No short note'
})

function openNotesDialog() {
  editableShortNote.value = props.application.short_note || ''
  showNotesDialog.value = true
}

function updateShortNote() {
  emit('update-short-note', {
    applicationId: props.application.id,
    shortNote: editableShortNote.value,
  })
  showNotesDialog.value = false
}

function statusClass(status) {
  const classes = {
    'ready-to-apply': 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-amber-100 text-amber-700',
    'offer': 'bg-green-100 text-green-700',
    'reject': 'bg-red-100 text-red-700',
    'archive': 'bg-gray-100 text-gray-600'
  }
  const key = status.toLowerCase().replaceAll(' ', '-')
  return classes[key] || 'bg-gray-100 text-gray-600'
}

function forwardUpdateApplicationNotes(payload) {
  emit('update-application-notes', payload)
}
</script>