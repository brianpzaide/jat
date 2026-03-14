<template>
  <div class="application-details" v-if="application">
    <div class="header">

      <div class="position-name">
        {{ application.position }}
      </div>

      <div class="next-event">
        <template v-if="!editing">
          {{ application.next_event }}
        </template>

        <template v-else>
          <input
            type="datetime-local"
            v-model="editedNextEvent"
          />
        </template>
      </div>

      <div class="application-status">
        <template v-if="!editing">
          {{ application.status }}
        </template>

        <template v-else>
          <select v-model="editedStatus">
            <option value="ready to apply">ready to apply</option>
            <option value="applied">applied</option>
            <option value="interview scheduled">interview scheduled</option>
            <option value="rejected">rejected</option>
            <option value="ghosted">ghosted</option>
            <option value="offered">offered</option>
            <option value="signed">signed</option>
            <option value="archived">archived</option>
          </select>
        </template>
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
</script>

<style scoped>

.application-details {
  border-bottom: 1px solid #ddd;
  padding: 12px;
}

.header {
  display: flex;
  justify-content: space-between;
}

.position-name {
  font-weight: 600;
}

.next-event {
  font-size: 0.85rem;
  color: #666;
}

.actions button {
  padding: 4px 10px;
}

</style>