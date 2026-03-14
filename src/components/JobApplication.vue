<template>
    <div class="company-header" @click="toggle()">
        <span class="arrow">
          {{ expanded ? "▼" : "▶" }}
        </span>

        <span class="company-name">
          {{ company.name }}
        </span>
    </div>

    <div v-if="expanded" class="position-container">
        <div
          v-for="application in company.applications"
          :key="application.id"
          class="position-card"
          :class="{ active: application.id === activeApplicationId }"
          @click="emit('application-selected', application.id)"
        >
            <div class="position-row">
                <span class="position-title">
                    {{ application.position }}
                </span>

                <span
                  class="status-pill"
                  :class="statusClass(application.status)"
                >
                    {{ application.status }}
                </span>
            </div>

            <div class="nextevent">
              {{ formatNextevent(application.next_event) }}
            </div>
        </div>
    </div>
</template>


<script setup>
import { computed, reactive, ref } from "vue"

const props = defineProps({
  /*
  applications format example:

  {
    name: "company_name",
    applications: [
        {id:"<application_id>", position: "<application_position>", status: "<application_status>", next_event: "<next_event>" },
        {id:"<application_id>", position: "<application_position>", status: "<application_status>", next_event: "<next_event>" }
    ]
  }
  */
  company: {
    type: Object,
    default: () => ({})
  },
  activeApplicationId: [String, Number]
})

const expanded = ref(false)
const emit = defineEmits(['application-selected'])

function toggle(id) {
  expanded.value = !expanded.value
}

function formatNextevent(date) {
  if (!date) return ""
  const d = new Date(date)
  return d.toLocaleDateString()
}

function statusClass(status) {
  return status.toLowerCase().replace(" ", "-")
}

</script>

<style scoped>
.company-header {
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 4px;
}

.company-header:hover {
  background: #f5f5f5;
}

.arrow {
  font-size: 12px;
}

.position-container {
  margin-left: 18px;
}

.position-card {
  border: 1px solid #e2e2e2;
  border-radius: 6px;
  padding: 6px 8px;
  margin: 6px 0;
  font-size: 0.85rem;
}

.position-card.active {
  border-color: #4f46e5;
  background: #eef2ff;
}

.position-row {
  display: flex;
  justify-content: space-between;
}

.position-title {
  font-weight: 500;
}


.nextevent {
  font-size: 0.75rem;
  color: #777;
}

.status-pill {
  font-size: 0.65rem;
  padding: 2px 8px;
  border-radius: 12px;
  color: white;
}

.status-pill.done {
  background: #4caf50;
}

.status-pill.in-progress {
  background: #ff9800;
}

.status-pill.todo {
  background: #9e9e9e;
}
</style>