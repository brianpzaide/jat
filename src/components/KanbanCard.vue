<template>
  <div
    class="kanban-card"
    :class="{ active }"
    @click="emit('select', {
      applicationId: application.id
    })"
  >
    <div class="card-company">
      <span>{{ application.company }}</span>
      <span
        class="status-pill"
        :class="statusClass(application.status)"
      >
          {{ application.status }}
      </span>
    </div>
    <div class="card-position">
      {{ application.position }}
    </div>
    <div class="short-note-row">
      <div class="short-note-content">
        <template v-if="editingShortNote">
          <textarea
            v-model="editableShortNote"
            class="short-note-input"
            type="textbox"
            placeholder="Add next step or reminder"
            @click.stop
          />
        </template>
        <template v-else>
          <div class="short-note-text">
            {{ editableShortNote || 'Add next step or reminder' }}
          </div>
        </template>
      </div>
      <button
        class="short-note-action"
        @click.stop="toggleShortNoteEdit"
      >
        {{ editingShortNote ? '💾' : '✏️' }}
      </button>
    </div>
    <button
      class="view-notes-button"
      @click.stop="showNotesDialog = true"
    >
      View Notes
    </button>
    <teleport to="body">
      <div
        v-if="showNotesDialog"
        class="dialog-overlay"
        @click.self="showNotesDialog = false"
      >
        <div class="dialog-panel">
          <div class="dialog-header">
            <div>
              <div class="dialog-company">{{ application.companyName }}</div>
              <div class="dialog-position">{{ application.position }}</div>
            </div>
            <button
              class="dialog-close"
              @click="showNotesDialog = false"
            >
              ✕
            </button>
          </div>
          <div class="dialog-body">
            <ApplicationNotes
              :application="application"
              @update-application-notes="emit('update-application-notes', $event)"
            />
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>


<script setup>
    import { ref, watch } from 'vue'
    import ApplicationNotes from './ApplicationNotes.vue'

    const props = defineProps({
      application: {
        type: Object,
        required: true
      },
      active: {
        type: Boolean,
        default: false
      }
    })

    const emit = defineEmits([
      'select', 
      'update-short-note',
      'update-application-notes'
    ])

    const showNotesDialog = ref(false)
    const editingShortNote = ref(false)
    const editableShortNote = ref(props.application.short_note || '')

    watch(
      () => props.application.short_note,
      (value) => {
        editableShortNote.value = value || ''
      },
      {immediate: true}
    )

    function toggleShortNoteEdit(){
      if (editingShortNote.value){
        emit('update-short-note',{
          applicationId: props.application.id,
          shortNote: editableShortNote.value
        })
      }
      editingShortNote.value = !editingShortNote.value
    }

  function statusClass(status) {
    return status.toLowerCase().replaceAll(" ", "-")
  }


</script>

<style scoped>
  .kanban-card {
    background: white;
    border: 3px solid #e5e7eb;
    border-radius: 8px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    cursor: pointer;
    height: 25vh;
    width: 40vh;
    overflow: hidden;
    flex-shrink: 0;
  }


  .kanban-card.active {
    border-color: #4f46e5;
    background: #eef2ff;
  }

  .card-company {
    font-weight: 700;
    font-size: 0.90rem;
    align-items: center;
    gap: 10px;
    padding: 6px 4px;
    display: flex;
  }

  .card-position {
    color: #374151;
    font-size: 0.95rem;
  }

  .short-note-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    height: 40%;
  }

  .short-note-content {
    flex: 1;
  }

  .short-note-text {
    font-size: 0.85rem;
    color: #6b7280;
    line-height: 1.3;
    overflow-x: auto;
    overflow-y: auto;
    height: 65px;
    width: 200px;
    word-break: break-word;
  }

  .short-note-input {
    font-size: 0.85rem;
    color: #6b7280;
    line-height: 1.3;
    height: 60px;
    width: 200px;
    overflow-x: auto;
    overflow-y: auto;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.85rem;
  }

  .short-note-action {
    flex-shrink: 0;
    border: 1px solid #d1d5db;
    background: white;
    border-radius: 6px;
    padding: 6px 10px;
    cursor: pointer;
  }

  .view-notes-button {
    align-self: flex-start;
    border: 1px solid #d1d5db;
    background: white;
    border-radius: 6px;
    padding: 6px 10px;
    cursor: pointer;
  }

  .dialog-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .dialog-panel {
    width: min(1000px, 92vw);
    height: min(800px, 90vh);
    background: white;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #e5e7eb;
  }

  .dialog-company {
    font-weight: 700;
  }

  .dialog-position {
    color: #6b7280;
    font-size: 0.9rem;
  }

  .dialog-close {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 1rem;
  }

  .dialog-body {
    flex: 1;
    min-height: 0;
    padding: 16px;
  }

  .status-pill {
    font-size: 0.65rem;
    padding: 2px 8px;
    border-radius: 12px;
    color: white;
  }

  .status-pill.offer {
    background: #4caf50;
  }

  .status-pill.in-progress {
    background: #ff9800;
  }

  .status-pill.reject {
    background: #f7160e;
  }

  .status-pill.ready-to-apply {
    background: #4b5dd0;
  }

  .status-pill.archive {
    background: #5a5b63;
  }
</style>