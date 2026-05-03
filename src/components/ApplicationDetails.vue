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
          <select v-model="editedStatus">
            <option 
              v-for="status in applicationStatusOptions"
              :key="status"
              :value="status">{{status}}</option>
          </select>
        </div>
      </div>

      <div class="actions">
        <button v-if="!editing" @click="startEdit">
          Edit
        </button>

        <button v-else @click="updateApplicationStatus">
          Update
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  application: {
    type: Object
  },
  applicationStatusOptions: {
    type: Array,
  },  
})

const emit = defineEmits(["update-application-status"])

const editing = ref(false)
const editedStatus = ref("")

watch(
  () => props.application,
  (application) => {
    if (application) {
      editedStatus.value = application.status
    }
  },
  { immediate: true }
)

function startEdit() {
  editing.value = true
}

function updateApplicationStatus() {
  emit("update-application-status", {
    applicationId: props.application.id,
    status: editedStatus.value,
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