<template>
  <div class="application-details" v-if="application">
    <div class="header">

      <div class="company-name">
        {{ application.company }}
      </div>

      <div class="position-name">
        {{ application.position }}
      </div>

      <div class="application-status">
        <template v-if="!editing">
          <span
              class="status-pill"
              :class="statusClass(application.status)"
            >{{ application.status }}
          </span>
        </template>

        <div v-else>
          <select class="status-pill" v-model="editedStatus">
            <option value="ready to apply">
              ready to apply
            </option>
            <option value="in progress">
              in progress
            </option>
            <option value="reject">
              reject
            </option>
            <option value="offer">
              offer
            </option>
            <option value="archive">
              archive
            </option>
          </select>
        </div>
      </div>

      <div class="actions">
        <button v-if="!editing" @click="startEdit">
          Edit
        </button>

        <button v-else @click="updateApplication">
          Update
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  application: Object
})

const emit = defineEmits(["update-application-details"])

const editing = ref(false)
const editedStatus = ref("")
const editedNextEvent = ref("")

watch(
  () => props.application,
  (application) => {
    if (application) {
      editedStatus.value = application.status
      editedNextEvent.value = application.next_event
    }
  },
  { immediate: true }
)

function startEdit() {
  editing.value = true
}

function updateApplication() {
  emit("update-application-details", {
    applicationId: props.application.id,
    status: editedStatus.value,
    next_event: editedNextEvent.value
  })

  editing.value = false
}


function statusClass(status) {
  return status.toLowerCase().replaceAll(" ", "-")
}

</script>

<style scoped>

.application-details {
  border-bottom: 1px solid #ddd;
  padding: 12px;
}

.header {
  display: flex;
  justify-content:space-around;
}

.company-name {
  font-weight: 600;
  font-size: .95rem;
}

.position-name {
  font-weight: 600;
  font-size: .95rem;
}

.actions button {
  padding: 4px 10px;
}

.status-pill {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 12px;
  /* color: white; */
  background-color: white;
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
  color: white;
}

</style>