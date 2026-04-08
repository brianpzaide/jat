<template>
<div class="new-application">

    <!-- Collapsible Header -->
    <div class="header" @click="toggle">
      <span>Add new application</span>
      <span class="arrow">{{ open ? "▲" : "▼" }}</span>
    </div>

    <!-- Form -->
    <div v-if="open" class="form">

      <div class="field">
        <label>Company name</label>
        <input
          type="text"
          v-model="companyName"
          placeholder="Enter company name"
        />
      </div>

      <div class="field">
        <label>Position</label>
        <input
          type="text"
          v-model="position"
          placeholder="Enter position"
        />
      </div>

      <div class="field">
        <label>Status</label>
          <select v-model="editedStatus">
            <option value="ready to apply">ready to apply</option>
            <option value="in progress">in progress</option>
            <option value="reject">reject</option>
            <option value="offer">offer</option>
            <option value="archive">archive</option>
          </select>
      </div>

      <div class="actions">
        <button @click="addNewApplication">Add</button>
      </div>

    </div>

  </div>
  
</template>

<script setup>
import { ref } from "vue"

const emit = defineEmits(["add-new-application"])

const open = ref(false)

const companyName = ref("")
const position = ref("")
const status = ref("")
const nextEvent = ref("")

function toggle() {
  open.value = !open.value
}

function addNewApplication() {
  emit("add-new-application", {
    companyName: companyName.value.trim(),
    position: position.value.trim(),
    status: status.value,
    nextEvent: nextEvent.value
  })

  companyName.value = ""
  position.value = ""
  status.value = ""
  nextEvent.value = ""

  open.value = false
}

function statusClass(status) {
  return status.toLowerCase().replaceAll(" ", "-")
}
</script>

<style scoped>

.new-application {
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  overflow: hidden;
  width: 50%;
  align-self: center;
  margin: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  font-weight: 600;
  cursor: pointer;
  background: #ffff;
}

.header:hover {
  background: #eef2ff;
}

.arrow {
  font-size: 0.9rem;
}

.form {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field label {
  font-size: 0.85rem;
  color: #555;
}

.field input,
.field select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.actions button {
  padding: 6px 14px;
  border: 1px solid #2c7be5;
  background: #2c7be5;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.actions button:hover {
  background: #1a68d1;
}

</style>